/**
 * مسیرهای مدیریتی (فقط مدیر کل — نیازمند نشست معتبر + عبور از CSRF)
 * --------------------------------------------------------------------
 * شامل:
 *   • «درخواست‌های تغییر رمز کاربران»: مشاهده، ثبت تماس، تعیین رمز جدید، رد
 *   • مدیریت کاربران: ایجاد کاربر، ویرایش پروفایل، تعیین/بازنشانی رمز
 *   • پایش امنیتی: آمار محدودسازی نرخ، IPهای مسدود، رخدادهای امنیتی
 *
 * ⚠️ رمز جدید فقط «یک‌بار» در پاسخ API برگردانده می‌شود تا مدیر آن را
 *    تلفنی به کاربر اعلام کند؛ در دیتابیس فقط هش scrypt ذخیره می‌شود.
 */
import express from 'express';
import config from '../config.js';
import { AUDIT_EVENTS } from '../security/audit.js';
import { hashPassword, generateStrongPassword, checkPasswordStrength } from '../security/passwords.js';
import {
  sanitizeText,
  safeId,
  normalizePhone,
  validatePhone,
  validateNationalCode,
  validateJalaliDate,
  toDialablePhone,
  looksMalicious,
} from '../security/validate.js';
import { ok, fail, asyncHandler, ERROR_MESSAGES } from '../lib/http.js';
import { getRateLimitSnapshot } from '../security/rateLimit.js';

const GENDERS = new Set(['پسر', 'دختر']);
const ROLES = new Set(['admin', 'leader', 'user', 'member']);
const VALID_STATUSES = new Set(['pending', 'contacted', 'resolved', 'rejected']);

/** افزودن شماره تلفن قابل تماس (tel:) به رکورد درخواست */
function decorateReset(reset) {
  return {
    ...reset,
    contact_phone_dial: reset.contact_phone ? toDialablePhone(reset.contact_phone) : '',
    account_phone_dial: reset.account_phone ? toDialablePhone(reset.account_phone) : '',
    // توجه: هیچ رمزی در رکورد درخواست ذخیره نمی‌شود
  };
}

export function createAdminRouter({ store, accounts, audit, sessionsData }) {
  const router = express.Router();

  router.use(sessionsData.requireAdmin);

  /* ==================== درخواست‌های تغییر رمز کاربران ==================== */

  router.get('/password-resets', asyncHandler(async (req, res) => {
    const status = sanitizeText(req.query?.status, 20) || 'all';
    const search = sanitizeText(req.query?.q, 40).replace(/\D/g, '');

    let requests = await store.listPasswordResets();
    if (VALID_STATUSES.has(status)) requests = requests.filter((r) => r.status === status);
    if (search) {
      requests = requests.filter(
        (r) => String(r.national_code || '').includes(search) ||
          String(r.personal_code || '').includes(search) ||
          String(r.contact_phone || '').includes(search) ||
          String(r.account_phone || '').includes(search)
      );
    }

    const all = await store.listPasswordResets();
    const stats = {
      total: all.length,
      pending: all.filter((r) => r.status === 'pending').length,
      contacted: all.filter((r) => r.status === 'contacted').length,
      resolved: all.filter((r) => r.status === 'resolved').length,
      rejected: all.filter((r) => r.status === 'rejected').length,
    };

    return ok(res, { requests: requests.slice(0, 200).map(decorateReset), stats });
  }));

  /** تولید رمز جدید پیشنهادی (بدون ذخیره‌سازی؛ فقط برای خواندن تلفنی) */
  router.post('/password-resets/:id/generate', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);

    const reset = await store.getPasswordReset(id);
    if (!reset) return fail(res, 404, 'NOT_FOUND', 'درخواست یافت نشد.');
    if (reset.status === 'resolved') return fail(res, 409, 'ALREADY_RESOLVED', 'این درخواست پیش‌تر انجام شده است.');

    const password = generateStrongPassword(12);
    audit.record(AUDIT_EVENTS.ADMIN_ACTION, {
      userId: req.auth.user.id,
      actorRole: 'admin',
      message: `تولید رمز پیشنهادی برای درخواست ${reset.tracking_code || id}`,
      ip: req.clientIp,
    }, req);

    // رمز فقط در پاسخ همین درخواست برمی‌گردد و در دیتابیس ذخیره نمی‌شود
    return ok(res, {
      password,
      expiresInSeconds: 300,
      message: 'این رمز ذخیره نمی‌شود؛ آن را یادداشت یا کپی کنید و تلفنی به کاربر اعلام نمایید.',
    });
  }));

  /** ثبت تماس تلفنی با کاربر */
  router.post('/password-resets/:id/mark-contacted', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);

    const reset = await store.getPasswordReset(id);
    if (!reset) return fail(res, 404, 'NOT_FOUND', 'درخواست یافت نشد.');

    const note = sanitizeText(req.body?.note, 250);
    const updated = await store.updatePasswordReset(id, {
      status: reset.status === 'resolved' ? 'resolved' : 'contacted',
      contacted_at: reset.contacted_at || new Date().toISOString(),
      contacted_by: req.auth.user.id,
      contact_note: note || reset.contact_note || '',
    });

    audit.record(AUDIT_EVENTS.PASSWORD_RESET_CONTACTED, {
      userId: reset.user_id,
      actorRole: 'admin',
      message: `ثبت تماس تلفنی برای درخواست ${reset.tracking_code}`,
      ip: req.clientIp,
    }, req);

    return ok(res, { request: decorateReset(updated) });
  }));

  /** تعیین رمز جدید برای کاربر و بستن درخواست (پس از تماس تلفنی) */
  router.post('/password-resets/:id/resolve', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);

    const reset = await store.getPasswordReset(id);
    if (!reset) return fail(res, 404, 'NOT_FOUND', 'درخواست یافت نشد.');
    if (reset.status === 'resolved') return fail(res, 409, 'ALREADY_RESOLVED', 'این درخواست پیش‌تر انجام شده است.');

    const supplied = typeof req.body?.password === 'string' ? req.body.password : '';
    const password = supplied || generateStrongPassword(12);

    const strength = checkPasswordStrength(password, {
      nationalCode: reset.national_code,
      phone: reset.contact_phone || reset.account_phone,
    });
    if (!strength.ok) return fail(res, 400, 'WEAK_PASSWORD', strength.message);

    const user = await store.getUserById(reset.user_id);
    if (!user) return fail(res, 404, 'USER_NOT_FOUND', 'حساب کاربری این درخواست یافت نشد.');

    await accounts.setPassword(user.id, password, { mustChangePassword: true, reason: 'admin_phone_call' });

    const updated = await store.updatePasswordReset(id, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: req.auth.user.id,
      resolution_note: sanitizeText(req.body?.note, 250) || 'رمز جدید تلفنی اعلام شد.',
      contacted_at: reset.contacted_at || new Date().toISOString(),
      password_reset_applied: true,
      must_change_password: true,
    });

    audit.record(AUDIT_EVENTS.PASSWORD_RESET_RESOLVED, {
      userId: user.id,
      nationalCode: user.national_code,
      actorRole: 'admin',
      message: `تعیین رمز جدید و بستن درخواست ${reset.tracking_code}`,
      ip: req.clientIp,
    }, req);

    return ok(res, {
      request: decorateReset(updated),
      // رمز فقط در همین پاسخ برمی‌گردد (برای اعلام تلفنی) و در دیتابیس هش می‌شود
      password,
      message: 'رمز جدید ثبت شد. آن را تلفنی به کاربر اعلام کنید؛ کاربر در نخستین ورود باید رمز خود را تغییر دهد.',
    });
  }));

  /** رد درخواست با ذکر دلیل */
  router.post('/password-resets/:id/reject', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);

    const reset = await store.getPasswordReset(id);
    if (!reset) return fail(res, 404, 'NOT_FOUND', 'درخواست یافت نشد.');

    const reason = sanitizeText(req.body?.reason, 250) || 'عدم تأیید هویت در تماس تلفنی';
    const updated = await store.updatePasswordReset(id, {
      status: 'rejected',
      resolved_at: new Date().toISOString(),
      resolved_by: req.auth.user.id,
      resolution_note: reason,
    });

    audit.record(AUDIT_EVENTS.PASSWORD_RESET_REJECTED, {
      userId: reset.user_id,
      actorRole: 'admin',
      message: `رد درخواست ${reset.tracking_code}: ${reason}`,
      ip: req.clientIp,
    }, req);

    return ok(res, { request: decorateReset(updated) });
  }));

  /* ============================ مدیریت کاربران ============================ */

  /** ایجاد کاربر توسط مدیر (بدون رمز پیش‌فرض ثابت؛ رمز تولید و هش می‌شود) */
  router.post('/users', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const body = req.body || {};
    if (Object.values(body).some((v) => typeof v === 'string' && looksMalicious(v))) {
      audit.record(AUDIT_EVENTS.MALICIOUS_INPUT, { message: 'ورودی مشکوک در ایجاد کاربر', ip: req.clientIp }, req);
      return fail(res, 400, 'INVALID_INPUT', ERROR_MESSAGES.BAD_REQUEST);
    }

    const nationalCode = sanitizeText(body.national_code, 10).replace(/\D/g, '');
    const firstName = sanitizeText(body.first_name, 40);
    const lastName = sanitizeText(body.last_name, 40);
    const phone = normalizePhone(sanitizeText(body.phone, 15));
    const role = sanitizeText(body.role, 10) || 'user';
    const gender = sanitizeText(body.gender, 10) || 'پسر';
    const birthDate = sanitizeText(body.birth_date, 12) || '1388/01/01';

    if (!validateNationalCode(nationalCode)) return fail(res, 400, 'VALIDATION', 'کد ملی ۱۰ رقمی معتبر نیست.');
    if (!validatePhone(phone)) return fail(res, 400, 'VALIDATION', 'شماره همراه معتبر نیست.');
    if (!ROLES.has(role)) return fail(res, 400, 'VALIDATION', 'نقش انتخاب‌شده معتبر نیست.');
    if (!GENDERS.has(gender)) return fail(res, 400, 'VALIDATION', 'جنسیت معتبر نیست.');
    if (!validateJalaliDate(birthDate)) return fail(res, 400, 'VALIDATION', 'تاریخ تولد معتبر نیست.');
    if (role === 'admin') {
      const admins = await store.countAdmins();
      if (admins >= 1) return fail(res, 409, 'ADMIN_LIMIT', 'در سامانه فقط یک مدیر کل مجاز است.');
    }

    const password = typeof body.password === 'string' && body.password.length >= 8
      ? body.password
      : generateStrongPassword(12);

    const created = await accounts.createUser(
      {
        first_name: firstName,
        last_name: lastName,
        national_code: nationalCode,
        phone,
        role,
        gender,
        education_level: sanitizeText(body.education_level, 20) || 'متوسطه اول',
        grade: sanitizeText(body.grade, 20) || 'هشتم',
        province: sanitizeText(body.province, 40) || 'تهران',
        city: sanitizeText(body.city, 40) || 'تهران',
        birth_date: birthDate,
        school_name: sanitizeText(body.school_name, 80),
        personal_code: /^\d{8,10}$/.test(sanitizeText(body.personal_code, 12))
          ? sanitizeText(body.personal_code, 12)
          : String(Math.floor(100000000 + Math.random() * 900000000)),
        postal_code: sanitizeText(body.postal_code, 12).replace(/\D/g, ''),
        address: sanitizeText(body.address, 200),
        points: Number.isFinite(Number(body.points)) ? Number(body.points) : 0,
        level: Number.isFinite(Number(body.level)) ? Number(body.level) : 1,
      },
      password,
      { mustChangePassword: true }
    );

    if (!created.ok) {
      const message = created.code === 'DUPLICATE_NATIONAL_CODE'
        ? 'کاربری با این کد ملی از قبل وجود دارد.'
        : created.message || ERROR_MESSAGES.VALIDATION;
      return fail(res, created.code === 'DUPLICATE_NATIONAL_CODE' ? 409 : 400, created.code, message);
    }

    audit.record(AUDIT_EVENTS.ADMIN_ACTION, {
      userId: req.auth.user.id,
      actorRole: 'admin',
      message: `ایجاد کاربر جدید توسط مدیر: ${created.user.national_code}`,
      ip: req.clientIp,
    }, req);

    return ok(res, {
      user: created.user,
      // رمز فقط یک‌بار نمایش داده می‌شود تا مدیر به کاربر اعلام کند
      oneTimePassword: password,
      message: 'کاربر ایجاد شد. رمز عبور فقط همین یک‌بار نمایش داده می‌شود؛ آن را به کاربر اعلام کنید.',
    }, 201);
  }));

  /** ویرایش پروفایل کاربر (بدون امکان تغییر رمز از این مسیر) */
  router.patch('/users/:id', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);
    const user = await store.getUserById(id);
    if (!user) return fail(res, 404, 'NOT_FOUND', 'کاربر یافت نشد.');

    const body = req.body || {};
    const patch = {};
    const text = (value, max) => sanitizeText(value, max);

    if (body.first_name !== undefined) patch.first_name = text(body.first_name, 40);
    if (body.last_name !== undefined) patch.last_name = text(body.last_name, 40);
    if (body.phone !== undefined) {
      const phone = normalizePhone(text(body.phone, 15));
      if (!validatePhone(phone)) return fail(res, 400, 'VALIDATION', 'شماره همراه معتبر نیست.');
      patch.phone = phone;
    }
    if (body.role !== undefined) {
      const role = text(body.role, 10);
      if (!ROLES.has(role)) return fail(res, 400, 'VALIDATION', 'نقش معتبر نیست.');
      if (role === 'admin' && user.role !== 'admin') {
        const admins = await store.countAdmins();
        if (admins >= 1) return fail(res, 409, 'ADMIN_LIMIT', 'در سامانه فقط یک مدیر کل مجاز است.');
      }
      patch.role = role;
    }
    if (body.gender !== undefined) {
      const gender = text(body.gender, 10);
      if (!GENDERS.has(gender)) return fail(res, 400, 'VALIDATION', 'جنسیت معتبر نیست.');
      patch.gender = gender;
    }
    if (body.grade !== undefined) patch.grade = text(body.grade, 20);
    if (body.education_level !== undefined) patch.education_level = text(body.education_level, 20);
    if (body.province !== undefined) patch.province = text(body.province, 40);
    if (body.city !== undefined) patch.city = text(body.city, 40);
    if (body.school_name !== undefined) patch.school_name = text(body.school_name, 80);
    if (body.address !== undefined) patch.address = text(body.address, 200);
    if (body.points !== undefined && Number.isFinite(Number(body.points))) patch.points = Number(body.points);
    if (body.level !== undefined && Number.isFinite(Number(body.level))) patch.level = Number(body.level);

    const updated = await store.updateUserProfile(id, patch);
    audit.record(AUDIT_EVENTS.ADMIN_ACTION, {
      userId: req.auth.user.id,
      actorRole: 'admin',
      message: `ویرایش اطلاعات کاربر ${user.national_code}`,
      ip: req.clientIp,
    }, req);

    return ok(res, { user: updated });
  }));

  /** بازنشانی رمز یک کاربر توسط مدیر (رمز تولید و فقط یک‌بار نمایش داده می‌شود) */
  router.post('/users/:id/reset-password', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);
    const user = await store.getUserById(id);
    if (!user) return fail(res, 404, 'NOT_FOUND', 'کاربر یافت نشد.');

    const supplied = typeof req.body?.password === 'string' ? req.body.password : '';
    const password = supplied || generateStrongPassword(12);
    const strength = checkPasswordStrength(password, {
      nationalCode: user.national_code,
      phone: user.phone,
      personalCode: user.personal_code,
    });
    if (!strength.ok) return fail(res, 400, 'WEAK_PASSWORD', strength.message);

    await accounts.setPassword(user.id, password, { mustChangePassword: true, reason: 'admin_reset' });

    audit.record(AUDIT_EVENTS.ADMIN_ACTION, {
      userId: req.auth.user.id,
      actorRole: 'admin',
      message: `بازنشانی رمز کاربر ${user.national_code}`,
      ip: req.clientIp,
    }, req);

    return ok(res, {
      oneTimePassword: password,
      message: 'رمز جدید تعیین شد. این رمز فقط همین یک‌بار نمایش داده می‌شود.',
    });
  }));

  /* ============================= پایش امنیتی ============================= */

  router.get('/security/overview', asyncHandler(async (req, res) => {
    const snapshot = getRateLimitSnapshot();
    const auditEvents = await store.listAudit(60);
    const stats = {
      failedLogins24h: auditEvents.filter(
        (e) => e.type === AUDIT_EVENTS.LOGIN_FAILED &&
          Date.now() - new Date(e.at).getTime() < 24 * 3600_000
      ).length,
      resetsPending: (await store.listPasswordResets()).filter((r) => r.status === 'pending').length,
      sessions: (await store.listUsers()).length,
    };
    const storeInfo = await store.describe().catch(() => ({ mode: store.mode }));

    return ok(res, {
      rateLimit: snapshot,
      stats,
      store: { mode: storeInfo.mode, location: storeInfo.location },
      securityFeatures: {
        passwordHashing: 'scrypt (N=32768) + salt یکتا',
        sessionStorage: 'توکن هش‌شده + کوکی HttpOnly/SameSite',
        csrf: 'double-submit cookie + بررسی مبدأ',
        rateLimit: `token bucket + ${config.limits.global} req/min/IP`,
        sqlInjection: 'بدون رشته‌سازی SQL (PostgREST پارامترمحور) + اعتبارسنجی ورودی',
        xss: 'CSP + پاک‌سازی ورودی + خروجی JSON',
        headers: 'CSP/HSTS/nosniff/frame-options/permissions-policy',
      },
    });
  }));

  router.get('/audit', asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query?.limit, 10) || 100, 1), 500);
    const events = await store.listAudit(limit);
    return ok(res, { events });
  }));

  /** ابطال نشست‌های یک کاربر (خروج اجباری) */
  router.post('/users/:id/revoke-sessions', sessionsData.requirePasswordRotation, asyncHandler(async (req, res) => {
    const id = safeId(req.params.id);
    if (!id) return fail(res, 400, 'VALIDATION', ERROR_MESSAGES.BAD_REQUEST);
    const removed = await store.deleteUserSessions(id);
    audit.record(AUDIT_EVENTS.ADMIN_ACTION, {
      userId: req.auth.user.id,
      actorRole: 'admin',
      message: `ابطال ${removed} نشست کاربر`,
      ip: req.clientIp,
    }, req);
    return ok(res, { removed });
  }));

  return router;
}

export default createAdminRouter;
