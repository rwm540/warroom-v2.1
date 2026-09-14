/**
 * اعتبارسنجی و پاک‌سازی ورودی‌ها (Input Validation & Sanitization)
 * ---------------------------------------------------------------
 * اصل نخست دفاع در برابر SQL Injection: «هیچ کوئری SQL با رشته‌سازی ساخته
 * نمی‌شود»؛ همه دسترسی‌ها از طریق PostgREST (پارامترمحور) یا ذخیره‌ساز فایلی
 * انجام می‌شود. این ماژول به‌عنوان لایه دوم، ورودی‌های مخرب/بی‌اعتبار را
 * پیش از رسیدن به لایه داده رد می‌کند و داده را برای ذخیره‌سازی پاک می‌کند.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** تبدیل ارقام فارسی/عربی به لاتین و حذف نویسه‌های کنترلی */
export function normalizeDigits(input) {
  let out = String(input ?? '');
  for (let i = 0; i < 10; i++) {
    out = out.split(PERSIAN_DIGITS[i]).join(String(i)).split(ARABIC_DIGITS[i]).join(String(i));
  }
  return out.trim();
}

/** حذف نویسه‌های کنترلی، نیم‌فاصله‌های تکراری و فاصله‌های اضافی */
export function sanitizeText(input, maxLength = 400) {
  if (input === null || input === undefined) return '';
  let out = String(input).normalize('NFKC');
  // نویسه‌های کنترلی (به‌جز خط جدید و تب) و کاراکترهای نامرئی جهت‌دهی حذف می‌شوند
  out = out.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  out = out.replace(/[\u200B-\u200F\u202A-\u202E\u2028\u2029\uFEFF]/g, '');
  out = out.replace(/[ \t]{3,}/g, '  ');
  out = out.trim();
  return out.length > maxLength ? out.slice(0, maxLength) : out;
}

/** الگوهای حمله (Defense-in-depth) — برای فیلدهای ساختاریافته سخت‌گیرانه است */
const ATTACK_PATTERNS = [
  /(\bunion\b[\s\S]{0,12}\bselect\b)/i,
  /(\bselect\b[\s\S]{0,12}\bfrom\b)/i,
  /(\binsert\b[\s\S]{0,12}\binto\b)/i,
  /(\bdrop\b[\s\S]{0,12}\btable\b)/i,
  /(\bdelete\b[\s\S]{0,12}\bfrom\b)/i,
  /(\bupdate\b[\s\S]{0,12}\bset\b)/i,
  /(\bor\b\s+1\s*=\s*1)/i,
  /(\band\b\s+['"\d]\s*=\s*['"\d])/i,
  /(' *; *--)/,
  /(;\s*(shutdown|exec|xp_cmdshell)\b)/i,
  /(<script\b|javascript:|data:text\/html|onerror\s*=|onload\s*=)/i,
  /\.\.(\/|\\)/, // path traversal
  /(\$\{|\{\{)/, // template injection
];

/** آیا ورودی الگوهای شناخته‌شده حمله را دارد؟ */
export function looksMalicious(input) {
  if (input === null || input === undefined) return false;
  const value = String(input);
  if (value.length > 2000) return true;
  return ATTACK_PATTERNS.some((re) => re.test(value));
}

/** آیا رشته از نویسه‌های مجاز (برای فیلدهای حساس) تشکیل شده است؟ */
export function isPlainToken(input, { pattern = /^[A-Za-z0-9_\-.@:/+ ]*$/ } = {}) {
  return pattern.test(String(input ?? ''));
}

/* ------------------------------------------------------------------ */
/* اعتبارسنجی کد ملی ایران (۱۰ رقم + رقم کنترل)                        */
/* ------------------------------------------------------------------ */
export function validateNationalCode(input) {
  const code = normalizeDigits(input).replace(/\D/g, '');
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  if (['0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
       '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'].includes(code)) {
    return false;
  }
  const check = Number.parseInt(code[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number.parseInt(code[i], 10) * (10 - i);
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

/* ------------------------------------------------------------------ */
/* اعتبارسنجی شماره همراه ایران                                        */
/* ------------------------------------------------------------------ */
export function normalizePhone(input) {
  let phone = normalizeDigits(input).replace(/[\s\-()]/g, '');
  if (phone.startsWith('+98')) phone = '0' + phone.slice(3);
  else if (phone.startsWith('0098')) phone = '0' + phone.slice(4);
  else if (phone.startsWith('98') && phone.length === 12) phone = '0' + phone.slice(2);
  else if (phone.startsWith('9') && phone.length === 10) phone = '0' + phone;
  return phone;
}

export function validatePhone(input) {
  return /^09\d{9}$/.test(normalizePhone(input));
}

/** ساخت لینک تماس بین‌المللی برای تماس تلفنی مدیر با کاربر */
export function toDialablePhone(input) {
  const phone = normalizePhone(input);
  return /^09\d{9}$/.test(phone) ? `+98${phone.slice(1)}` : '';
}

export function validatePersonalCode(input) {
  return /^\d{8,10}$/.test(normalizeDigits(input).replace(/\D/g, ''));
}

export function validateJalaliDate(input) {
  const value = normalizeDigits(input).replace(/-/g, '/');
  const parts = value.split('/');
  if (parts.length !== 3) return false;
  const [y, m, d] = parts.map((p) => Number.parseInt(p, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;
  if (y < 1300 || y > 1420) return false;
  if (m < 1 || m > 12) return false;
  const maxDay = m <= 6 ? 31 : m <= 11 ? 30 : 29;
  return d >= 1 && d <= maxDay;
}

/* ------------------------------------------------------------------ */
/* کمکی‌های ساختاری                                                    */
/* ------------------------------------------------------------------ */

/** شناسه امن (فقط کاراکترهای مجاز؛ از تزریق در مسیر/کوئری جلوگیری می‌کند) */
export function safeId(input, { maxLength = 128 } = {}) {
  const value = String(input ?? '').trim();
  if (!value || value.length > maxLength) return null;
  if (!/^[A-Za-z0-9_:.\-]+$/.test(value)) return null;
  return value;
}

/** بدنه JSON را فقط با کلیدهای مجاز می‌پذیرد (جلوگیری از Mass Assignment) */
export function pickAllowed(body, allowed) {
  const out = {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return out;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key];
  }
  return out;
}

/** جلوگیری از HTTP Parameter Pollution (ارسال چندباره یک پارامتر) */
export function isPollutedQuery(query) {
  return Object.values(query || {}).some((v) => Array.isArray(v));
}

export const sanitize = {
  text: sanitizeText,
  digits: normalizeDigits,
  id: safeId,
};

export const validators = {
  nationalCode: validateNationalCode,
  phone: validatePhone,
  personalCode: validatePersonalCode,
  jalaliDate: validateJalaliDate,
};
