/**
 * ============================================================================
 *  🛡️  بک‌اند «اتاق جنگ» — سرور API امن (Node.js + Express)
 * ============================================================================
 *  این سرور، لایه‌های امنیتی زیر را روی همه درخواست‌ها اعمال می‌کند:
 *
 *   ۱) ضد DDoS / DoS   : محدودسازی نرخ (token bucket + پنجره لغزان)، سقف
 *                        درخواست هم‌زمان، سقف اتصال هر IP، مسدودسازی خودکار
 *                        IPهای متخلف، کندسازی تدریجی، سقف حجم بدنه/هدر و
 *                        زمان‌سنجی‌های ضد Slowloris، حالت تعمیر و لیست سیاه.
 *   ۲) ضد SQL Injection: هیچ کوئری SQL رشته‌ای ساخته نمی‌شود؛ PostgREST
 *                        (پارامترمحور) + اعتبارسنجی/پاک‌سازی همه ورودی‌ها.
 *   ۳) ضد رمز متن‌ساده : هش scrypt با Salt یکتا برای هر کاربر؛ رمز هرگز
 *                        در دیتابیس/لاگ/پاسخ‌ها ذخیره یا برگردانده نمی‌شود.
 *   ۴) ضد Brute-force  : قفل موقت حساب، تأخیر تصادفی، پیام یکنواخت خطا
 *                        (بدون افشای وجود کاربر).
 *   ۵) ضد XSS/CSRF     : CSP، nosniff، SameSite Cookie، توکن CSRF دوگانه،
 *                        بررسی مبدأ درخواست، خروجی صرفاً JSON.
 *   ۶) نشست امن        : توکن تصادفی ۲۵۶ بیتی، ذخیره هش‌شده، کوکی HttpOnly،
 *                        انقضای کوتاه مدیر و ابطال نشست‌ها پس از تغییر رمز.
 *   ۷) رهگیری          : ثبت رخدادهای امنیتی (Audit Log) برای پنل مدیر.
 *
 *  اجرا:  npm start            (سرور + سرو نسخه ساخته‌شده در dist)
 *         npm run dev          (همین سرور + Vite با پروکسی /api)
 * ============================================================================
 */
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';

import config from './config.js';
import logger from './security/logger.js';
import { securityHeaders, originGuard, csrfGuard, corsGuard, ensureCsrfCookie } from './security/headers.js';
import { rateLimit, concurrencyGuard, clientIp, getRateLimitSnapshot } from './security/rateLimit.js';
import { createAuditLogger, AUDIT_EVENTS } from './security/audit.js';
import { makeSessionsService } from './security/sessions.js';
import { cookieParser } from './lib/cookies.js';
import { createStore } from './store/index.js';
import { makeAccountsService } from './services/accounts.js';
import { createAuthRouter } from './routes/auth.js';
import { createPasswordResetRouter } from './routes/passwordReset.js';
import { createAdminRouter } from './routes/admin.js';

/* ------------------------------------------------------------------------- */
/* راه‌اندازی لایه داده و سرویس‌ها                                             */
/* ------------------------------------------------------------------------- */
const store = await createStore();
const audit = createAuditLogger(store);
const accounts = makeAccountsService(store, audit);
const sessions = makeSessionsService(store, audit);

await accounts.ensureBootstrapAdmin();
await accounts.migrateLegacyCredentials();
await store.pruneSessions().catch(() => {});

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);
app.set('etag', false);

/* ------------------------------------------------------------------------- */
/* ترتیب میان‌افزارهای امنیتی (لایه به لایه)                                   */
/* ------------------------------------------------------------------------- */
app.use((req, res, next) => {
  req.clientIp = clientIp(req);
  res.setHeader('X-Request-Id', `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
  next();
});

app.use(cookieParser());
app.use(corsGuard);
app.use(securityHeaders(true));
app.use(originGuard);

// حالت تعمیرات (فقط مدیر می‌تواند عبور کند — مسیرهای مدیریتی باز می‌ماند)
app.use((req, res, next) => {
  if (!config.maintenance) return next();
  if (req.path.startsWith('/api/admin')) return next();
  return res.status(503).json({
    ok: false,
    code: 'MAINTENANCE',
    message: 'سامانه در حال به‌روزرسانی است. لطفاً کمی بعد مراجعه کنید.',
  });
});

// محافظت CSRF (توکن دوگانه + بررسی مبدأ) و سقف حجم بدنه
app.use(csrfGuard);
app.use(express.json({ limit: config.limits.bodyLimit, strict: true, type: ['application/json'] }));

// اطمینان از وجود توکن CSRF برای همه پاسخ‌های API
app.use('/api', (req, res, next) => {
  ensureCsrfCookie(req, res);
  next();
});

app.use('/api', concurrencyGuard);
app.use('/api', rateLimit({ name: 'global', max: config.limits.global }));
// بارگذاری نشست کاربر روی همه مسیرهای API (توکن هش‌شده + بررسی انقضا)
app.use('/api', sessions.attachSession());

/* ------------------------------------------------------------------------- */
/* مسیرهای API                                                               */
/* ------------------------------------------------------------------------- */
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'warroom-backend',
    mode: store.mode,
    time: new Date().toISOString(),
    security: {
      passwordHashing: 'scrypt',
      sessions: 'server-side (hashed token)',
      csrf: true,
      rateLimit: true,
      inputValidation: true,
    },
  });
});

app.use('/api/auth', rateLimit({ name: 'auth', max: config.limits.auth }), createAuthRouter({
  store, accounts, sessions, audit, csrf: { ensureCsrfCookie },
}));

app.use('/api/password-reset', rateLimit({ name: 'password-reset', max: config.limits.passwordReset }),
  createPasswordResetRouter({ store, accounts, audit }));

app.use('/api/admin', rateLimit({ name: 'admin', max: config.limits.admin }),
  createAdminRouter({ store, accounts, audit, sessionsData: sessions }));

// مسیرهای API ناشناخته → 404 استاندارد JSON (بدون افشای اطلاعات)
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, code: 'NOT_FOUND', message: 'مسیر درخواستی یافت نشد.' });
});

/* ------------------------------------------------------------------------- */
/* سرو فایل‌های استاتیک (نسخه ساخته‌شده) در محیط تولید                        */
/* ------------------------------------------------------------------------- */
const indexHtml = path.join(config.staticDir, 'index.html');
const hasBuild = fs.existsSync(indexHtml);

if (hasBuild) {
  app.use(
    express.static(config.staticDir, {
      index: false,
      etag: true,
      maxAge: '1h',
      setHeaders(res, filePath) {
        // فایل‌های دارای هش در نام → کش طولانی؛ HTML → بدون کش
        if (/\.(js|css|woff2?|png|jpg|jpeg|svg|webp|mp3|mp4)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.setHeader('Content-Security-Policy', config.security.csp);
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(indexHtml);
  });
} else {
  app.get('/', (_req, res) => {
    res.status(200).json({
      ok: true,
      message: 'بک‌اند اتاق جنگ فعال است. برای ساخت رابط کاربری: npm run build سپس npm start',
      api: '/api/health',
    });
  });
}

/* ------------------------------------------------------------------------- */
/* مدیریت خطاها (بدون افشای جزئیات داخلی)                                     */
/* ------------------------------------------------------------------------- */
app.use((err, req, res, _next) => {
  // ⚠️ این هندلر باید «هرگز» خطا پرتاب نکند؛ در غیر این صورت Express
  //    با صفحه HTML پیش‌فرض، جزئیات داخلی (Stack Trace) را افشا می‌کند.
  try {
    const isParseError = err?.type === 'entity.parse.failed';
    const isTooLarge = err?.type === 'entity.too.large';

    if (res.headersSent) {
      try { res.end(); } catch { /* ignore */ }
      return;
    }
    if (isTooLarge) {
      return res.status(413).json({ ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'حجم درخواست بیش از حد مجاز است.' });
    }
    if (isParseError) {
      return res.status(400).json({ ok: false, code: 'INVALID_JSON', message: 'ساختار درخواست نامعتبر است.' });
    }

    logger.error('Unhandled server error', {
      path: req.originalUrl,
      err: String(err?.message || err),
    });
    return res.status(500).json({ ok: false, code: 'SERVER_ERROR', message: 'خطای غیرمنتظره در سرور رخ داد.' });
  } catch {
    try {
      return res.status(500).json({ ok: false, code: 'SERVER_ERROR', message: 'خطای غیرمنتظره در سرور رخ داد.' });
    } catch {
      return;
    }
  }
});

/* ------------------------------------------------------------------------- */
/* سرور HTTP با محافظت‌های سطح اتصال                                           */
/* ------------------------------------------------------------------------- */
const server = http.createServer(app);

// ضد Slowloris و اتصال‌های بی‌کار
server.headersTimeout = 15_000;
server.requestTimeout = 30_000;
server.keepAliveTimeout = 5_000;
server.maxHeadersCount = 80;
server.maxConnections = 4_000;

// سقف اتصال هم‌زمان برای هر IP (ضد سیل اتصال)
const socketsPerIp = new Map();
server.on('connection', (socket) => {
  const ip = String(socket.remoteAddress || 'unknown').replace(/^::ffff:/, '');
  const count = (socketsPerIp.get(ip) || 0) + 1;
  socketsPerIp.set(ip, count);
  socket.setTimeout(60_000);

  if (count > config.limits.maxSocketsPerIp) {
    logger.warn('Socket limit exceeded — connection destroyed', { ip });
    socket.destroy();
    return;
  }
  socket.on('close', () => {
    const current = (socketsPerIp.get(ip) || 1) - 1;
    if (current <= 0) socketsPerIp.delete(ip);
    else socketsPerIp.set(ip, current);
  });
});

// پاک‌سازی دوره‌ای نشست‌های منقضی (هر ۳۰ دقیقه)
const pruneTimer = setInterval(() => {
  store.pruneSessions().catch(() => {});
}, 30 * 60_000);
pruneTimer.unref?.();

server.listen(config.port, config.host, () => {
  logger.info('🛡️ WarRoom backend listening', {
    url: `http://${config.host}:${config.port}`,
    mode: store.mode,
    env: config.nodeEnv,
    staticBuild: hasBuild,
    rateLimitPerMinute: config.limits.global,
    trustedProxy: config.trustProxy,
  });
  logger.info('مسیرهای امنیتی فعال: محدودسازی نرخ، هش scrypt، CSRF، CSP، Audit Log، قفل حساب');
});

/* ------------------------------------------------------------------------- */
/* خاموشی نرم (Graceful Shutdown)                                             */
/* ------------------------------------------------------------------------- */
async function shutdown(signal) {
  logger.info(`دریافت سیگنال ${signal} — خاموشی نرم سرور...`);
  server.close(async () => {
    try { await store.close?.(); } catch { /* ignore */ }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: String(reason) });
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { err: String(err?.message || err) });
});

export { app, server, store, getRateLimitSnapshot };
export default app;
