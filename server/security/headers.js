/**
 * سرصفحه‌های امنیتی، کنترل مبدأ (CORS/Origin) و محافظت CSRF
 */
import crypto from 'node:crypto';
import config from '../config.js';

/**
 * سرصفحه‌های امنیتی روی همه پاسخ‌ها (مقاوم‌سازی مرورگر در برابر XSS/Clickjacking/Sniffing)
 * برای مسیرهای `/api` سیاست سخت‌گیرانه (default-src 'none') و برای اسناد HTML
 * سیاست کامل برنامه اعمال می‌شود.
 */
export function securityHeaders(isApiRequest = true) {
  return function securityHeadersMiddleware(req, res, next) {
    const apiRequest = typeof req.path === 'string' ? req.path.startsWith('/api') : isApiRequest;
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
    );
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader(
      'Content-Security-Policy',
      apiRequest
        ? "default-src 'none'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'"
        : config.security.csp
    );
    if (config.security.hsts) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    // هرگز نباید پاسخ‌های API کش شوند (حاوی داده کاربر و توکن CSRF هستند)
    if (apiRequest) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
    }
    res.removeHeader('X-Powered-By');
    next();
  };
}

/** استخراج هاست درخواست (با پشتیبانی پروکسی) */
function requestHost(req) {
  const forwardedHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
  return forwardedHost || req.headers.host || '';
}

/**
 * بررسی مبدأ درخواست: درخواست‌های تغییردهنده (POST/PUT/PATCH/DELETE)
 * فقط از همان دامنه پذیرفته می‌شوند (محافظت CSRF لایه اول).
 */
export function originGuard(req, res, next) {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();

  const host = requestHost(req);
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const source = origin || referer || '';

  // اگر هیچ مبدأ‌ای ارسال نشده (کلاینت‌های غیرمرورگری)، به CSRF Token تکیه می‌کنیم
  if (!source) return next();

  let sourceHost = '';
  try {
    sourceHost = new URL(source).host;
  } catch {
    sourceHost = '';
  }

  const allowed = new Set([host, ...config.security.allowedOrigins.map((o) => {
    try { return new URL(o).host; } catch { return o; }
  })]);

  if (sourceHost && allowed.has(sourceHost)) return next();

  // پیش‌نمایش‌های موقت (Arena/e2b) با دامنه‌های متفاوت روی یک سرویس اجرا می‌شوند
  return res.status(403).json({
    ok: false,
    code: 'ORIGIN_NOT_ALLOWED',
    message: 'مبدأ درخواست مجاز نیست.',
  });
}

/** کوکی امن CSRF (double-submit cookie) */
export function ensureCsrfCookie(req, res) {
  const existing = req.cookies?.[config.session.csrfCookieName];
  if (existing && /^[a-f0-9]{32,128}$/i.test(existing)) return existing;
  const token = crypto.randomBytes(24).toString('hex');
  res.cookie(config.session.csrfCookieName, token, {
    httpOnly: false, // کلاینت باید آن را در هدر بفرستد
    sameSite: 'lax',
    secure: config.session.secure,
    path: '/',
    maxAge: 12 * 60 * 60 * 1000,
  });
  return token;
}

/** بررسی CSRF برای متدهای تغییردهنده */
export function csrfGuard(req, res, next) {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();

  const cookieToken = req.cookies?.[config.session.csrfCookieName];
  const headerToken = req.headers['x-csrf-token'];
  const legacyHeader = req.headers['x-warroom-client'];

  // ۱) اگر کوکی CSRF وجود دارد، هدر ارسالی باید دقیقاً با آن مطابق باشد.
  //    (کوکی HttpOnly نیست تا کلاینت بتواند آن را بخواند و در هدر بفرستد)
  if (typeof cookieToken === 'string' && cookieToken.length > 20) {
    if (typeof headerToken === 'string' && headerToken.length === cookieToken.length) {
      const a = Buffer.from(cookieToken);
      const b = Buffer.from(headerToken);
      if (crypto.timingSafeEqual(a, b)) return next();
    }
    return res.status(403).json({
      ok: false,
      code: 'CSRF_TOKEN_INVALID',
      message: 'اعتبار درخواست تأیید نشد. صفحه را دوباره بارگذاری کنید.',
    });
  }

  // ۲) کلاینت‌های غیرمرورگری (بدون کوکی): هدر اختصاصی + بررسی مبدأ در originGuard
  //    کافی است؛ مرورگرها نمی‌توانند هدر سفارشی را در درخواست Cross-Site بفرستند
  //    مگر با تأیید CORS که فقط برای مبدأهای مجاز فعال است.
  if (legacyHeader === 'web' && (req.path.endsWith('/auth/login') || req.path.endsWith('/auth/register') ||
      req.path.endsWith('/auth/csrf') || req.path.endsWith('/password-reset/request') ||
      req.path.endsWith('/password-reset/status') || req.path.endsWith('/auth/logout'))) {
    return next();
  }

  return res.status(403).json({
    ok: false,
    code: 'CSRF_TOKEN_INVALID',
    message: 'اعتبار درخواست تأیید نشد. صفحه را دوباره بارگذاری کنید.',
  });
}

/** کنترل CORS — به‌صورت پیش‌فرض فقط همان مبدأ (same-origin) مجاز است */
export function corsGuard(req, res, next) {
  const origin = req.headers.origin;
  if (origin) {
    const host = requestHost(req);
    let originHost = '';
    try { originHost = new URL(origin).host; } catch { originHost = ''; }
    const allowed = originHost === host || config.security.allowedOrigins.includes(origin);
    if (allowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-WarRoom-Client');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    }
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  return next();
}

export default { securityHeaders, originGuard, csrfGuard, corsGuard, ensureCsrfCookie };
