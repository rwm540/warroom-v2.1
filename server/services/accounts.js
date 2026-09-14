/**
 * سرویس حساب‌های کاربری (Accounts Service)
 * --------------------------------------------------------------------
 * - ساخت/یافتن کاربر، مدیریت اعتبارنامه (credential) هش‌شده با scrypt
 * - مهاجرت خودکار از رمزهای قدیمی (متن ساده یا SHA-256) به scrypt
 * - قفل‌شدن حساب پس از تلاش‌های ناموفق پیاپی (ضد Brute-force)
 * - هیچ رمزی در لاگ یا خروجی API قرار نمی‌گیرد (مگر یک‌بار برای مدیر، آن هم
 *   فقط از طریق «درخواست تغییر رمز» و به‌صورت هش در دیتابیس).
 */
import crypto from 'node:crypto';
import config from '../config.js';
import logger from '../security/logger.js';
import {
  hashPassword,
  verifyPassword,
  verifyLegacyPassword,
  isScryptCredential,
  checkPasswordStrength,
  generateStrongPassword,
  constantTimeDelay,
} from '../security/passwords.js';

const LOCKOUT_PREFIX = 'login_lock_';

function newUserId() {
  return `u_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

export function makeAccountsService(store, audit) {
  /** قفل حساب (ضد Brute-force) */
  async function getLock(userId) {
    const record = await store.kvGet(`${LOCKOUT_PREFIX}${userId}`);
    if (!record) return { failed: 0, lockedUntil: 0 };
    if (record.lockedUntil && record.lockedUntil < Date.now()) {
      return { failed: 0, lockedUntil: 0 };
    }
    return record;
  }

  async function registerFailure(userId) {
    const state = await getLock(userId);
    const failed = (state.failed || 0) + 1;
    const lockedUntil =
      failed >= config.limits.loginMaxAttempts
        ? Date.now() + config.limits.loginLockMinutes * 60_000
        : 0;
    await store.kvSet(`${LOCKOUT_PREFIX}${userId}`, { failed, lockedUntil, at: new Date().toISOString() });
    return { failed, lockedUntil };
  }

  async function clearFailures(userId) {
    await store.kvSet(`${LOCKOUT_PREFIX}${userId}`, { failed: 0, lockedUntil: 0 });
  }

  return {
    getLock,
    registerFailure,
    clearFailures,

    /** جست‌وجوی کاربر با کد ملی یا کد اختصاصی */
    async findByIdentifier(identifier) {
      const value = String(identifier || '').trim();
      if (!value) return null;
      if (/^\d{10}$/.test(value)) return store.getUserByNationalCode(value);
      if (/^\d{8,10}$/.test(value)) {
        return (await store.getUserByPersonalCode(value)) || (await store.getUserByNationalCode(value));
      }
      return store.getUserByPersonalCode(value);
    },

    /**
     * بررسی رمز عبور کاربر با پشتیبانی از مهاجرت تدریجی.
     * @returns {{ ok:boolean, reason?:string, migrated?:boolean, user?:object }}
     */
    async verifyUserPassword(user, password) {
      const credential = await store.getCredential(user.id);

      if (isScryptCredential(credential)) {
        const ok = await verifyPassword(password, credential);
        return { ok, reason: ok ? undefined : 'INVALID_CREDENTIALS' };
      }

      // مسیر مهاجرت: رمز قدیمی در رکورد کاربر (متن ساده یا SHA-256)
      const legacy = typeof user.password === 'string' ? user.password : '';
      if (legacy) {
        const legacyOk = verifyLegacyPassword(password, legacy);
        if (!legacyOk) return { ok: false, reason: 'INVALID_CREDENTIALS' };
        await store.setCredential(user.id, await hashPassword(password, { migrated_from_legacy: true }));
        // حذف رمز قدیمی از پروفایل عمومی کاربر (پاک‌سازی داده‌های حساس)
        await store.updateUserProfile(user.id, { password: '', password_migrated_at: new Date().toISOString() });
        logger.info('Legacy password migrated to scrypt', { userId: user.id });
        return { ok: true, migrated: true };
      }

      // اعتبارنامه کلید اولیه (bootstrap) در صورت نبود رکورد
      if (!credential && !legacy) {
        return { ok: false, reason: 'NO_CREDENTIAL' };
      }

      return { ok: false, reason: 'INVALID_CREDENTIALS' };
    },

    /** ساخت کاربر جدید با رمز هش‌شده */
    async createUser(profile, password, { mustChangePassword = false, skipStrengthCheck = false } = {}) {
      const context = {
        nationalCode: profile.national_code,
        phone: profile.phone,
        personalCode: profile.personal_code,
        isAdmin: profile.role === 'admin',
      };
      if (!skipStrengthCheck) {
        const strength = checkPasswordStrength(password, context);
        if (!strength.ok) return { ok: false, code: 'WEAK_PASSWORD', message: strength.message };
      }

      const user = {
        ...profile,
        id: profile.id || newUserId(),
        password: '',
        created_at: profile.created_at || new Date().toISOString(),
      };
      if (profile.role === 'admin') {
        const admins = await store.countAdmins();
        if (admins >= 1) return { ok: false, code: 'ADMIN_LIMIT', message: 'در سامانه فقط یک مدیر کل مجاز است.' };
      }

      const created = await store.createUser(user);
      if (!created.ok) return { ok: false, code: created.code, message: 'کاربری با این کد ملی قبلاً ثبت شده است.' };

      await store.setCredential(user.id, await hashPassword(password, {
        must_change_password: mustChangePassword,
        created_at: new Date().toISOString(),
      }));
      return { ok: true, user: created.user };
    },

    /** تغییر/تعیین رمز عبور (هش‌شده) */
    async setPassword(userId, password, { mustChangePassword = false, reason = 'manual' } = {}) {
      const credential = await store.getCredential(userId);
      if (!credential) {
        await store.setCredential(userId, await hashPassword(password, { must_change_password: mustChangePassword }));
      } else {
        const updated = await hashPassword(password);
        await store.setCredential(userId, {
          ...updated,
          must_change_password: mustChangePassword,
          history: Array.isArray(credential.history) ? credential.history.slice(-4) : [],
          last_change_reason: reason,
          last_changed_at: new Date().toISOString(),
        });
      }
      // ابطال نشست‌های قبلی کاربر پس از تغییر رمز
      await store.deleteUserSessions(userId);
      return true;
    },

    /** ساخت تضمینی ادمین نخست (Bootstrap) — تنها یک مدیر کل در سامانه */
    async ensureBootstrapAdmin() {
      const { nationalCode, forceChange } = config.bootstrapAdmin;
      // 🛡️ هیچ رمز پیش‌فرض ثابتی وجود ندارد: اگر متغیر محیطی تنظیم نشده باشد،
      //    رمز تصادفی ساخته و تنها یک‌بار در کنسول سرور نمایش داده می‌شود.
      let initialPassword = config.bootstrapAdmin.initialPassword;
      let generated = false;
      if (!initialPassword) {
        initialPassword = generateStrongPassword(14);
        generated = true;
      }
      const existing = await store.getUserByNationalCode(nationalCode);
      const admins = await store.countAdmins();

      if (!existing && admins === 0) {
        const profile = {
          id: 'u-admin',
          first_name: 'امیرحسین',
          last_name: 'فرماندهی کل',
          national_code: nationalCode,
          phone: '09120000000',
          role: 'admin',
          education_level: 'متوسطه دوم',
          grade: 'دوازدهم',
          gender: 'پسر',
          province: 'تهران',
          city: 'تهران',
          birth_date: '1384/01/15',
          school_name: 'دبیرستان ماندگار البرز',
          personal_code: '900000001',
          address: 'ستاد مرکزی اتاق جنگ',
          password: '',
        };
        await store.createUser(profile);
        await store.setCredential(profile.id, await hashPassword(initialPassword, {
          must_change_password: forceChange,
          bootstrap: true,
        }));
        logger.warn('حساب مدیر کل (یک مدیر کل در سامانه) ساخته شد.');
        if (generated) {
          // فقط یک‌بار و فقط روی کنسول سرور؛ در دیتابیس تنها هش scrypt ذخیره می‌شود
          logger.warn(`🔑 رمز یک‌بارمصرف مدیر: ${initialPassword}  —  در نخستین ورود باید تغییر کند.`);
        } else {
          logger.warn('رمز اولیه از متغیر محیطی WARROOM_ADMIN_INITIAL_PASSWORD خوانده شد (تغییر اجباری در ورود نخست).');
        }
        return { created: true, generatedPassword: generated ? initialPassword : null };
      }

      if (existing && !(await store.getCredential(existing.id))) {
        const legacy = typeof existing.password === 'string' ? existing.password : '';
        if (legacy) {
          // مهاجرت: رمز قدیمی ذخیره‌شده به scrypt
          await store.setCredential(existing.id, await hashPassword(initialPassword, {
            must_change_password: forceChange,
            migrated_legacy: true,
          }));
          await store.updateUserProfile(existing.id, { password: '' });
          logger.warn('اعتبارنامه مدیر از نسخه قدیمی به scrypt مهاجرت کرد.');
        } else {
          await store.setCredential(existing.id, await hashPassword(initialPassword, {
            must_change_password: forceChange,
            bootstrap: true,
          }));
        }
        if (generated) {
          logger.warn(`🔑 رمز یک‌بارمصرف مدیر: ${initialPassword}  —  در نخستین ورود باید تغییر کند.`);
        }
        return { created: false, credentialCreated: true, generatedPassword: generated ? initialPassword : null };
      }

      return { created: false, credentialCreated: false };
    },

    /** مهاجرت همه کاربران دارای رمز قدیمی به اعتبارنامه scrypt */
    async migrateLegacyCredentials() {
      const users = await store.listUsers();
      let migrated = 0;
      for (const user of users) {
        const legacy = typeof user.password === 'string' ? user.password : '';
        if (!legacy) continue;
        const credential = await store.getCredential(user.id);
        if (isScryptCredential(credential)) {
          await store.updateUserProfile(user.id, { password: '' });
          continue;
        }
        // رمز قدیمی نمی‌تواند بدون رمز خام به scrypt تبدیل شود؛ بنابراین:
        // - اگر هش SHA-256 باشد، در «نخستین ورود موفق» مهاجرت می‌کند (verifyUserPassword)
        // - اگر متن ساده باشد و کاربر «مدیر کل» باشد، رمز اولیه اعمال می‌شود
        if (/^[0-9a-f]{64}$/i.test(legacy)) {
          await store.kvSet(`legacy_sha256_${user.id}`, { note: 'در نخستین ورود به scrypt ارتقا می‌یابد' });
          continue;
        }
        if (user.role === 'admin') {
          await store.setCredential(user.id, await hashPassword(config.bootstrapAdmin.initialPassword, {
            must_change_password: true,
            migrated_legacy: true,
          }));
          await store.updateUserProfile(user.id, { password: '' });
          migrated += 1;
        }
        // برای سایر کاربران، مهاجرت به‌صورت خودکار در نخستین ورود انجام می‌شود
      }
      if (migrated) logger.info('Legacy credentials migrated', { count: migrated });
      return { migrated };
    },

    /** رمز موقت تازه + هش آن برای اعمال روی حساب */
    async applyNewPassword(userId, password, { mustChangePassword = true, reason = 'admin_phone_call' } = {}) {
      await this.setPassword(userId, password, { mustChangePassword, reason });
      return true;
    },

    async delayOnFailure() {
      return constantTimeDelay();
    },
  };
}

export default makeAccountsService;
