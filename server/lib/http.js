/**
 * کمک‌کارهای HTTP — پاسخ‌های یکنواخت، بدون افشای جزئیات داخلی
 */

export const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ ok: true, ...data });

export const fail = (res, status, code, message, extra = {}) =>
  res.status(status).json({ ok: false, code, message, ...extra });

/** پوشش هندلرهای async برای جلوگیری از UnhandledRejection */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** پیام‌های عمومی و یکنواخت خطا (بدون افشای جزئیات فنی) */
export const ERROR_MESSAGES = {
  BAD_REQUEST: 'درخواست نامعتبر است.',
  VALIDATION: 'اطلاعات ارسالی نامعتبر است.',
  SERVER: 'خطای غیرمنتظره در سرور رخ داد. لطفاً بعداً تلاش کنید.',
  NOT_FOUND: 'موردی یافت نشد.',
};

export default { ok, fail, asyncHandler, ERROR_MESSAGES };
