/**
 * مسیرهای احراز هویت (ورود / ثبت‌نام / خروج / تغییر رمز)
 * --------------------------------------------------------------------
 * لایه‌های امنیتی روی این مسیرها:
 *   • محدودسازی نرخ سخت‌گیرانه (ضد Brute-force و DDoS)
 *   • اعتبارسنجی کامل ورودی + پاک‌سازی (ضد SQLi / XSS / ورودی مخرب)
 *   • هش scrypt برای رمز عبور (هرگز متن ساده ذخیره/برگردانده نمی‌شود)
 *   • قفل موقت حساب پس از تلاش‌های ناموفق
 *   • پیام خطای یکنواخت و تأخیر تصادفی (ضد User Enumeration و زمان‌سنجی)
 */
import express from 'express';
import config from '../config.js';
import logger from '../security/logger.js';
import { AUDIT_EVENTS } from '../security/audit.js';
import {
  checkPasswordStrength,
  hashPassword,
  verifyPassword,
} from '../security/passwords.js';
import {
  validateNationalCode,
  validatePhone,
  normalizePhone,
  validateJalaliDate,
  sanitizeText,
  looksMalicious,
} from '../security/validate.js';
import { ok, fail, asyncHandler, ERROR_MESSAGES } from '../lib/http.js';

const GENDERS = new Set(['پسر', 'دختر']);
const EDUCATION_LEVELS = new Set(['ابتدایی', 'متوسطه اول', 'متوسطه دوم']);

function publicUser(user) {
  // فقط داده‌های غیرحساس به کلاینت برمی‌گردد (رمز/اعتبارنامه هرگز)
  const { password: _password, ...rest } = user || {};
  return rest;
}

export function createAuthRouter({ store, accounts, sessions, audit, csrf }) {
  const router = express.Router();

  /* ------------------------- توکن CSRF برای کلاینت ------------------------- */
  router.get('/csrf', (req, res) => {
    const token = csrf.ensureCsrfCookie(req, res);
    return ok(res, { csrfToken: token });
  });

  /* --------------------------- بررسی نشست جاری --------------------------- */
  router.get('/session', asyncHandler(async (req, res) => {
    if (!req.auth) return ok(res, { authenticated: false });
    return ok(res, {
      authenticated: true,
      user: publicUser(req.auth.user),
      mustChangePassword: req.auth.mustChangePassword,
      expiresAt: req.auth.session.expires_at,
    });
  }));

  /* --------------------------------- ثبت‌نام --------------------------------- */
  router.post('/register', asyncHandler(async (req, res) => {
    const body = req.body || {};

    // لایه ضد ورودی مخرب (Defense-in-depth در کنار کوئری‌های پارامترمحور)
    const rawValues = Object.values(body).filter((v) => typeof v === 'string');
    if (rawValues.some((v) => looksMalicious(v))) {
      audit.record(AUDIT_EVENTS.MALICIOUS_INPUT, { message: 'ورودی مشکوک در ثبت‌نام', ip: req.clientIp }, req);
      return fail(res, 400, 'INVALID_INPUT', 'اطلاعات ارسالی شامل کاراکترهای غیرمجاز است.');
    }

    const nationalCode = sanitizeText(body.national_code, 10).replace(/\D/g, '');
    const firstName = sanitizeText(body.first_name, 40);
    const lastName = sanitizeText(body.last_name, 40);
    const phone = normalizePhone(sanitizeText(body.phone, 15));
    const birthDate = sanitizeText(body.birth_date, 12);
    const gender = sanitizeText(body.gender, 10);
    const educationLevel = sanitizeText(body.education_level, 20);
    const grade = sanitizeText(body.grade, 20);
    const province = sanitizeText(body.province, 40);
    const city = sanitizeText(body.city, 40);
    const schoolName = sanitizeText(body.school_name, 80);
    const address = sanitizeText(body.address, 200);
    const postalCode = sanitizeText(body.postal_code, 12).replace(/\D/g, '');
    const password = typeof body.password === 'string' ? body.password : '';

    if (firstName.length < 2 || lastName.length < 2) {
      return fail(res, 400, 'VALIDATION', 'نام و نام خانوادگی را کامل وارد کنید.');
    }
    if (!validateNationalCode(nationalCode)) {
      return fail(res, 400, 'VALIDATION', 'کد ملی ۱۰ رقمی وارد شده معتبر نیست.');
    }
    if (!validatePhone(phone)) {
      return fail(res, 400, 'VALIDATION', 'شماره همراه باید با ۰۹ شروع شده و ۱۱ رقم باشد.');
    }
    if (!validateJalaliDate(birthDate)) {
      return fail(res, 400, 'VALIDATION', 'تاریخ تولد معتبر نیست (نمونه: 1388/06/20).');
    }
    if (!GENDERS.has(gender)) return fail(res, 400, 'VALIDATION', 'جنسیت انتخاب‌شده معتبر نیست.');
    if (educationLevel && !EDUCATION_LEVELS.has(educationLevel)) {
      return fail(res, 400, 'VALIDATION', 'مقطع تحصیلی معتبر نیست.');
    }

    const strength = checkPasswordStrength(password, { nationalCode, phone, birthDate });
    if (!strength.ok) return fail(res, 400, 'WEAK_PASSWORD', strength.message);

    const personalCode = String(
      body.personal_code && /^\d{8,10}$/.test(String(body.personal_code))
        ? body.personal_code
        : Math.floor(100000000 + Math.random() * 900000000)
    );

    const created = await accounts.createUser(
      {
        first_name: firstName,
        last_name: lastName,
        national_code: nationalCode,
        phone,
        role: 'user',
        gender,
        education_level: educationLevel || 'متوسطه اول',
        grade: grade || 'هشتم',
        province: province || 'تهران',
        city: city || 'تهران',
        birth_date: birthDate,
        school_name: schoolName,
        personal_code: personalCode,
        postal_code: postalCode,
        address,
        points: 0,
        level: 1,
      },
      password,
      { skipStrengthCheck: true }
    );

    if (!created.ok) {
      const message =
        created.code === 'DUPLICATE_NATIONAL_CODE'
          ? 'این کد ملی قبلاً در سامانه ثبت شده است. لطفاً وارد شوید.'
          : created.message || ERROR_MESSAGES.VALIDATION;
      return fail(res, 409, created.code, message);
    }

    audit.record(AUDIT_EVENTS.REGISTER, {
      userId: created.user.id,
      nationalCode,
      message: 'ثبت‌نام کاربر جدید',
      ip: req.clientIp,
    }, req);

    const isAdmin = created.user.role === 'admin';
    await sessions.createSession(created.user, req, res, { isAdmin });

    return ok(res, { user: publicUser(created.user), mustChangePassword: false }, 201);
  }));

  /* ---------------------------------- ورود ---------------------------------- */
  router.post('/login', asyncHandler(async (req, res) => {
    const rawIdentifier = sanitizeText(req.body?.national_code ?? req.body?.identifier, 20);
    const identifier = rawIdentifier.replace(/\D/g, '') || rawIdentifier;
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!identifier || !password) {
      return fail(res, 400, 'VALIDATION', 'کد ملی و رمز عبور الزامی است.');
    }
    if (looksMalicious(identifier) || password.length > 200) {
      audit.record(AUDIT_EVENTS.MALICIOUS_INPUT, { message: 'ورودی مشکوک در ورود', ip: req.clientIp }, req);
      return fail(res, 400, 'INVALID_INPUT', ERROR_MESSAGES.BAD_REQUEST);
    }

    const user = await accounts.findByIdentifier(identifier);
    const genericError = 'کد ملی یا رمز عبور نادرست است.';

    if (!user) {
      // پیام یکنواخت + تأخیر تصادفی → جلوگیری از شناسایی کاربران موجود
      await accounts.delayOnFailure();
      audit.record(AUDIT_EVENTS.LOGIN_FAILED, {
        nationalCode: identifier,
        message: 'کاربر یافت نشد',
        ip: req.clientIp,
      }, req);
      return fail(res, 401, 'INVALID_CREDENTIALS', genericError);
    }

    const lock = await accounts.getLock(user.id);
    if (lock.lockedUntil && lock.lockedUntil > Date.now()) {
      const retryAfter = Math.ceil((lock.lockedUntil - Date.now()) / 1000);
      audit.record(AUDIT_EVENTS.LOGIN_LOCKED, {
        userId: user.id,
        nationalCode: identifier,
        message: 'حساب به‌دلیل تلاش‌های ناموفق قفل است',
        ip: req.clientIp,
      }, req);
      return fail(res, 423, 'ACCOUNT_LOCKED',
        `حساب شما به دلیل تلاش‌های ناموفق موقتاً قفل شده است. ${Math.ceil(retryAfter / 60)} دقیقه دیگر تلاش کنید.`,
        { retryAfter });
    }

    const result = await accounts.verifyUserPassword(user, password);
    if (!result.ok) {
      const failure = await accounts.registerFailure(user.id);
      await accounts.delayOnFailure();
      audit.record(AUDIT_EVENTS.LOGIN_FAILED, {
        userId: user.id,
        nationalCode: identifier,
        message: 'رمز عبور نادرست',
        ip: req.clientIp,
        meta: { failedAttempts: failure.failed },
      }, req);
      if (failure.lockedUntil) {
        audit.record(AUDIT_EVENTS.LOGIN_BLOCKED, {
          userId: user.id,
          nationalCode: identifier,
          message: 'حساب پس از تلاش‌های ناموفق قفل شد',
          ip: req.clientIp,
        }, req);
        return fail(res, 423, 'ACCOUNT_LOCKED', `به دلیل تلاش‌های ناموفق، حساب شما ${config.limits.loginLockMinutes} دقیقه قفل شد.`);
      }
      const remaining = Math.max(0, config.limits.loginMaxAttempts - failure.failed);
      return fail(res, 401, 'INVALID_CREDENTIALS', `${genericError} (${remaining} تلاش باقی مانده)`);
    }

    await accounts.clearFailures(user.id);

    const fresh = (await store.getUserById(user.id)) || user;
    const isAdmin = fresh.role === 'admin';
    await sessions.createSession(fresh, req, res, { isAdmin });

    const credential = await store.getCredential(fresh.id);
    const mustChangePassword = Boolean(credential?.must_change_password);

    audit.record(AUDIT_EVENTS.LOGIN_SUCCESS, {
      userId: fresh.id,
      nationalCode: fresh.national_code,
      actorRole: fresh.role,
      message: 'ورود موفق',
      ip: req.clientIp,
      meta: { migrated: Boolean(result.migrated) },
    }, req);

    return ok(res, { user: publicUser(fresh), mustChangePassword });
  }));

  /* --------------------------------- خروج --------------------------------- */
  router.post('/logout', asyncHandler(async (req, res) => {
    if (req.auth) {
      audit.record(AUDIT_EVENTS.LOGOUT, { userId: req.auth.user.id, ip: req.clientIp }, req);
    }
    await sessions.destroySession(req, res);
    return ok(res, { message: 'خروج انجام شد.' });
  }));

  /* ------------------------------ تغییر رمز ------------------------------ */
  router.post('/change-password', sessions.requireAuth, asyncHandler(async (req, res) => {
    const currentPassword = typeof req.body?.current_password === 'string' ? req.body.current_password : '';
    const newPassword = typeof req.body?.new_password === 'string' ? req.body.new_password : '';
    const user = req.auth.user;

    if (!currentPassword || !newPassword) {
      return fail(res, 400, 'VALIDATION', 'رمز فعلی و رمز جدید الزامی است.');
    }

    const verified = await accounts.verifyUserPassword(user, currentPassword);
    if (!verified.ok) {
      await accounts.registerFailure(user.id);
      await accounts.delayOnFailure();
      audit.record(AUDIT_EVENTS.LOGIN_FAILED, {
        userId: user.id,
        message: 'رمز فعلی نادرست در تغییر رمز',
        ip: req.clientIp,
      }, req);
      return fail(res, 401, 'INVALID_CREDENTIALS', 'رمز عبور فعلی نادرست است.');
    }

    const strength = checkPasswordStrength(newPassword, {
      nationalCode: user.national_code,
      phone: user.phone,
      personalCode: user.personal_code,
      birthDate: user.birth_date,
      isAdmin: user.role === 'admin',
    });
    if (!strength.ok) return fail(res, 400, 'WEAK_PASSWORD', strength.message);

    if (currentPassword === newPassword) {
      return fail(res, 400, 'SAME_PASSWORD', 'رمز جدید باید با رمز فعلی متفاوت باشد.');
    }

    await store.setCredential(user.id, await hashPassword(newPassword, {
      must_change_password: false,
      last_change_reason: 'self_service',
      last_changed_at: new Date().toISOString(),
    }));
    await store.deleteUserSessions(user.id);
    await sessions.destroySession(req, res);

    audit.record(AUDIT_EVENTS.PASSWORD_CHANGED, {
      userId: user.id,
      nationalCode: user.national_code,
      message: 'تغییر رمز توسط کاربر',
      ip: req.clientIp,
    }, req);

    return ok(res, { message: 'رمز عبور با موفقیت تغییر کرد. لطفاً دوباره وارد شوید.' });
  }));

  return router;
}

export default createAuthRouter;
