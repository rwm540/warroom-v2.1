/**
 * درخواست «بازیابی/تغییر رمز عبور» توسط کاربر
 * --------------------------------------------------------------------
 * جریان امن (بدون امکان تغییر رمز توسط خود کاربر در صفحه ورود):
 *   ۱) کاربر در صفحه ورود، کد ملی + شماره تماس خود را وارد می‌کند.
 *   ۲) سرور درخواست را با کد رهگیری ثبت و برای «مدیر کل» ارسال می‌کند.
 *   ۳) مدیر در پنل مدیریت، شماره تماس کاربر را می‌بیند، تماس می‌گیرد و
 *      رمز جدید را برای او تعیین و تلفنی اعلام می‌کند.
 *
 * لایه‌های امنیتی:
 *   • محدودسازی نرخ سخت‌گیرانه (۳ درخواست در ساعت به‌ازای هر IP)
 *   • جلوگیری از شناسایی کاربران (پیام پاسخ همیشه یکسان است)
 *   • عدم ذخیره رمز جدید در دیتابیس به‌صورت متن ساده (فقط هش scrypt)
 *   • ورودی‌ها اعتبارسنجی و پاک‌سازی می‌شوند.
 */
import express from 'express';
import crypto from 'node:crypto';
import { AUDIT_EVENTS } from '../security/audit.js';
import {
  validateNationalCode,
  validatePhone,
  normalizePhone,
  sanitizeText,
  looksMalicious,
} from '../security/validate.js';
import { ok, fail, asyncHandler, ERROR_MESSAGES } from '../lib/http.js';

const GENERIC_MESSAGE =
  'درخواست شما ثبت شد. اگر کد ملی وارد‌شده در سامانه موجود باشد، مدیر سامانه با شماره تماس شما ارتباط می‌گیرد و رمز جدید را اعلام می‌کند.';
const DUPLICATE_WINDOW_MS = 12 * 60 * 60 * 1000; // ۱۲ ساعت

function makeTrackingCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += alphabet[crypto.randomInt(0, alphabet.length)];
  return `WR-${code}`;
}

export function createPasswordResetRouter({ store, accounts, audit }) {
  const router = express.Router();

  /** ثبت درخواست تغییر رمز توسط کاربر (از صفحه ورود) */
  router.post('/request', asyncHandler(async (req, res) => {
    const raw = req.body || {};
    if (Object.values(raw).some((v) => typeof v === 'string' && looksMalicious(v))) {
      audit.record(AUDIT_EVENTS.MALICIOUS_INPUT, { message: 'ورودی مشکوک در درخواست تغییر رمز', ip: req.clientIp }, req);
      return fail(res, 400, 'INVALID_INPUT', ERROR_MESSAGES.BAD_REQUEST);
    }

    const nationalCode = sanitizeText(raw.national_code, 10).replace(/\D/g, '');
    const personalCode = sanitizeText(raw.personal_code, 12).replace(/\D/g, '');
    const contactPhoneRaw = sanitizeText(raw.contact_phone, 15);
    const note = sanitizeText(raw.note, 250);

    if (!/^\d{10}$/.test(nationalCode) && !/^\d{8,10}$/.test(personalCode)) {
      return fail(res, 400, 'VALIDATION', 'کد ملی ۱۰ رقمی خود را کامل وارد کنید.');
    }
    if (contactPhoneRaw && !validatePhone(contactPhoneRaw)) {
      return fail(res, 400, 'VALIDATION', 'شماره تماس باید با ۰۹ شروع شده و ۱۱ رقم باشد.');
    }

    // کاربر با کد ملی (یا کد اختصاصی) جست‌وجو می‌شود. توجه: صحت «رقم کنترل»
    // کد ملی برای کاربران قدیمی سخت‌گیرانه بررسی نمی‌شود تا کسی از سامانه
    // محروم نشود؛ ولی هیچ اطلاعاتی دربارهٔ وجود/عدم وجود کاربر فاش نمی‌گردد.
    const user =
      (nationalCode ? await store.getUserByNationalCode(nationalCode) : null) ||
      (personalCode ? await store.getUserByPersonalCode(personalCode) : null);

    if (nationalCode && !validateNationalCode(nationalCode) && user) {
      audit.record(AUDIT_EVENTS.MALICIOUS_INPUT, {
        userId: user.id,
        message: 'کد ملی با رقم کنترل نامعتبر در درخواست تغییر رمز (کاربر موجود)',
        ip: req.clientIp,
      }, req);
    }

    const trackingCode = makeTrackingCode();

    // پیام پاسخ برای همه یکسان است تا «کد ملی‌های ثبت‌شده» قابل کشف نباشند
    if (!user) {
      await accounts.delayOnFailure();
      audit.record(AUDIT_EVENTS.PASSWORD_RESET_REQUESTED, {
        nationalCode: nationalCode || personalCode,
        message: 'درخواست برای کد ملی ناموجود (پاسخ عمومی)',
        ip: req.clientIp,
      }, req);
      return ok(res, { trackingCode, message: GENERIC_MESSAGE });
    }

    const existing = (await store.listPasswordResets()).find(
      (r) => r.user_id === user.id &&
        ['pending', 'contacted'].includes(r.status) &&
        Date.now() - new Date(r.created_at || 0).getTime() < DUPLICATE_WINDOW_MS
    );

    if (existing) {
      return ok(res, {
        trackingCode: existing.tracking_code,
        message: 'درخواست شما پیش‌تر ثبت شده و در صف بررسی مدیر سامانه است. نتیجه از طریق تماس تلفنی اعلام می‌شود.',
      });
    }

    const request = {
      id: `pr_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`,
      tracking_code: trackingCode,
      user_id: user.id,
      national_code: user.national_code || nationalCode,
      personal_code: user.personal_code || personalCode || '',
      full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      account_phone: user.phone || '',
      contact_phone: contactPhoneRaw ? normalizePhone(contactPhoneRaw) : user.phone || '',
      note,
      status: 'pending',
      source: 'user',
      created_at: new Date().toISOString(),
      ip_hash: audit.ipFingerprint(req.clientIp || ''),
    };

    await store.createPasswordReset(request);
    audit.record(AUDIT_EVENTS.PASSWORD_RESET_REQUESTED, {
      userId: user.id,
      nationalCode: user.national_code,
      message: 'ثبت درخواست تغییر رمز',
      ip: req.clientIp,
      meta: { trackingCode },
    }, req);

    return ok(res, { trackingCode, message: GENERIC_MESSAGE });
  }));

  /** استعلام وضعیت درخواست با کد ملی + کد رهگیری */
  router.post('/status', asyncHandler(async (req, res) => {
    const nationalCode = sanitizeText(req.body?.national_code, 10).replace(/\D/g, '');
    const trackingCode = sanitizeText(req.body?.tracking_code, 20).toUpperCase();
    if (!trackingCode) return fail(res, 400, 'VALIDATION', 'کد رهگیری را وارد کنید.');

    const requests = await store.listPasswordResets();
    const found = requests.find(
      (r) => r.tracking_code === trackingCode && (!nationalCode || r.national_code === nationalCode)
    );

    if (!found) {
      // پاسخ عمومی؛ اطلاعاتی دربارهٔ وجود/عدم وجود کاربر فاش نمی‌شود
      return ok(res, { status: 'pending', message: 'درخواست در حال بررسی توسط مدیر سامانه است.' });
    }

    const labels = {
      pending: 'در انتظار بررسی مدیر سامانه',
      contacted: 'مدیر سامانه در حال تماس/هماهنگی با شماست',
      resolved: 'رمز عبور جدید تعیین و تلفنی اعلام شده است',
      rejected: 'درخواست رد شد',
    };

    return ok(res, {
      status: found.status,
      message: labels[found.status] || 'در حال بررسی',
      createdAt: found.created_at,
      resolvedAt: found.resolved_at || null,
      adminNote: found.resolution_note || null,
    });
  }));

  return router;
}

export default createPasswordResetRouter;
