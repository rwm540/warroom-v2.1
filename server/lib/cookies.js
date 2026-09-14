/**
 * تجزیه/ساخت کوکی بدون وابستگی بیرونی (کاهش سطح حمله زنجیره تأمین)
 * مقادیر نامعتبر و طول‌های غیرمتعارف نادیده گرفته می‌شوند.
 */

const MAX_COOKIE_HEADER = 8192;
const MAX_COOKIES = 30;

export function cookieParser() {
  return function cookieParserMiddleware(req, _res, next) {
    const header = req.headers.cookie;
    const jar = {};
    if (typeof header === 'string' && header.length <= MAX_COOKIE_HEADER) {
      const parts = header.split(';').slice(0, MAX_COOKIES);
      for (const part of parts) {
        const idx = part.indexOf('=');
        if (idx < 0) continue;
        const key = part.slice(0, idx).trim();
        const value = part.slice(idx + 1).trim();
        if (!key || key.length > 64) continue;
        if (value.length > 512) continue;
        try {
          jar[key] = decodeURIComponent(value);
        } catch {
          jar[key] = value;
        }
      }
    }
    req.cookies = jar;
    next();
  };
}

/** اعتبارسنجی مقدار کوکی (فقط کاراکترهای بی‌خطر) */
export function isSafeCookieValue(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 512 && /^[A-Za-z0-9._~+/=-]+$/.test(value);
}

export default cookieParser;
