/**
 * پیکربندی سرور «اتاق جنگ» (WarRoom Backend)
 * ---------------------------------------------------------------
 * تمام مقادیر از متغیرهای محیطی (.env) خوانده می‌شوند و مقادیر پیش‌فرض
 * امن دارند. هیچ رمز یا کلید حساسی در کد قرار نمی‌گیرد.
 */
import 'dotenv/config';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const bool = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const int = (value, fallback) => {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
};

const list = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** میزبان‌های مجاز پشت پروکسی (برای خواندن صحیح IP واقعی کاربر) */
const trustProxyRaw = process.env.WARROOM_TRUST_PROXY;
const trustProxy = (() => {
  if (trustProxyRaw === undefined || trustProxyRaw === '') return 1; // پیش‌فرض: یک لایه پروکسی (Arena / Nginx / Cloudflare)
  if (trustProxyRaw === 'false' || trustProxyRaw === '0') return false;
  if (trustProxyRaw === 'true') return true;
  const n = Number.parseInt(trustProxyRaw, 10);
  return Number.isFinite(n) ? n : trustProxyRaw;
})();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

export const config = {
  nodeEnv,
  isProduction,
  host: process.env.HOST || '0.0.0.0',
  port: int(process.env.PORT || process.env.API_PORT, 8787),

  trustProxy,
  rootDir,
  staticDir: process.env.WARROOM_STATIC_DIR || path.join(rootDir, 'dist'),
  dataDir: process.env.WARROOM_DATA_DIR || path.join(__dirname, 'data'),

  /* ---------------- Supabase (اختیاری — لایه ذخیره‌سازی ابری) ---------------- */
  supabase: {
    url: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim(),
    // کلید service_role فقط روی سرور استفاده می‌شود و هرگز به مرورگر ارسال نمی‌شود
    serviceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim(),
  },

  /* ---------------- نشست‌ها (Sessions) ---------------- */
  session: {
    cookieName: 'wr_session',
    csrfCookieName: 'wr_csrf',
    ttlHours: int(process.env.WARROOM_SESSION_TTL_HOURS, 12),
    adminTtlHours: int(process.env.WARROOM_ADMIN_SESSION_TTL_HOURS, 4),
    // در محیط تولید به‌صورت پیش‌فرض روی HTTPS کوکی Secure فعال می‌شود
    secure: bool(process.env.WARROOM_COOKIE_SECURE, isProduction),
    secret: process.env.WARROOM_SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  },

  /* ---------------- محدودسازی نرخ (ضد DDoS / Brute-force) ---------------- */
  limits: {
    windowMs: int(process.env.WARROOM_RATE_WINDOW_MS, 60_000),
    global: int(process.env.WARROOM_RATE_GLOBAL, 600), // درخواست در دقیقه به ازای هر IP
    static: int(process.env.WARROOM_RATE_STATIC, 900),
    // ⚠️ در شبکه‌های اشتراکی (مدرسه/خانواده) چند کاربر یک IP دارند؛ بنابراین سقف
    //    مسیرهای ورود سخاوتمندانه‌تر است و محافظت اصلی «قفل حساب» پس از تلاش‌های
    //    ناموفق پیاپی است (loginMaxAttempts).
    auth: int(process.env.WARROOM_RATE_AUTH, 30),
    passwordReset: int(process.env.WARROOM_RATE_RESET, 8),
    admin: int(process.env.WARROOM_RATE_ADMIN, 180),
    burst: int(process.env.WARROOM_RATE_BURST, 80), // ظرفیت انفجاری (token bucket)
    maxInFlightPerIp: int(process.env.WARROOM_MAX_INFLIGHT_IP, 24),
    maxInFlightGlobal: int(process.env.WARROOM_MAX_INFLIGHT_GLOBAL, 800),
    maxSocketsPerIp: int(process.env.WARROOM_MAX_SOCKETS_IP, 64),
    violationThreshold: int(process.env.WARROOM_VIOLATION_THRESHOLD, 150),
    banMinutes: int(process.env.WARROOM_BAN_MINUTES, 15),
    bodyLimit: process.env.WARROOM_BODY_LIMIT || '192kb',
    loginMaxAttempts: int(process.env.WARROOM_LOGIN_MAX_ATTEMPTS, 6),
    loginLockMinutes: int(process.env.WARROOM_LOGIN_LOCK_MINUTES, 15),
  },

  /* ---------------- سرصفحه‌های امنیتی ---------------- */
  security: {
    hsts: bool(process.env.WARROOM_HSTS, isProduction),
    csp:
      process.env.WARROOM_CSP ||
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
        "img-src 'self' data: blob: https:",
        "media-src 'self' data: blob: https:",
        "font-src 'self' data: https:",
        "style-src 'self' 'unsafe-inline' https:",
        "script-src 'self' 'unsafe-inline' https:",
        "connect-src 'self' https: wss:",
        "form-action 'self'",
        "manifest-src 'self'",
      ].join('; '),
    allowedOrigins: list(process.env.WARROOM_CORS_ORIGINS),
  },

  /* ---------------- کنترل دسترسی سطح شبکه ---------------- */
  allowList: list(process.env.WARROOM_ALLOWED_IPS),
  denyList: list(process.env.WARROOM_BLOCKED_IPS),
  maintenance: bool(process.env.WARROOM_MAINTENANCE, false),

  /* ---------------- Bootstrap ادمین اولیه ---------------- */
  bootstrapAdmin: {
    nationalCode: process.env.WARROOM_ADMIN_NATIONAL_CODE || '0012345678',
    // اگر تنظیم نشود، یک رمز تصادفی قوی ساخته و فقط «یک‌بار» در کنسول سرور
    // چاپ می‌شود (هیچ رمز پیش‌فرض ثابتی در کد وجود ندارد) و تغییر آن اجباری است.
    initialPassword: (process.env.WARROOM_ADMIN_INITIAL_PASSWORD || '').trim(),
    forceChange: bool(process.env.WARROOM_ADMIN_FORCE_CHANGE, true),
  },

  logLevel: process.env.WARROOM_LOG_LEVEL || (isProduction ? 'info' : 'debug'),
};

export const isSupabaseConfigured = Boolean(
  config.supabase.url.startsWith('http') && config.supabase.serviceKey.length > 20
);

export default config;
