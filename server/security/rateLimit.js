/**
 * لایه محدودسازی نرخ و مقاوم‌سازی در برابر حملات حجمی (DDoS / DoS)
 * --------------------------------------------------------------------
 * ۱) Token Bucket  : کنترل نرخ پایدار + ظرفیت انفجاری هر IP
 * ۲) Sliding Window: سقف درخواست هر IP در بازه‌های زمانی مختلف (کلاس‌های مسیر)
 * ۳) Concurrency   : سقف درخواست‌های هم‌زمان (هر IP و به‌صورت سراسری)
 * ۴) Auto-Ban      : پس از عبور از آستانه تخلف، IP به‌صورت موقت مسدود می‌شود
 * ۵) Slow-down     : پس از نزدیک شدن به سقف، پاسخ با تأخیر فزاینده ارسال می‌شود
 * ۶) Black/White   : فهرست سفید/سیاه IP از متغیرهای محیطی
 *
 * نکته: هیچ داده‌ای از درخواست‌ها (بدنه/رمز) در این لایه ذخیره نمی‌شود.
 */
import config from '../config.js';
import logger from './logger.js';

const WINDOW = config.limits.windowMs;
const BURST_CAPACITY = config.limits.burst;
const BURST_REFILL_PER_MS = config.limits.global / WINDOW;

/** نرمال‌سازی IP (پشتیبانی از IPv6-mapped) */
export function clientIp(req) {
  const raw =
    (typeof req.ip === 'string' && req.ip) ||
    (req.socket && req.socket.remoteAddress) ||
    'unknown';
  return raw.replace(/^::ffff:/, '');
}

const buckets = new Map(); // ip -> { tokens, updatedAt, counters: {class: {count, resetAt}}, violations, bannedUntil, inFlight }
const stats = {
  startedAt: new Date().toISOString(),
  totalRequests: 0,
  blockedRequests: 0,
  rateLimited: 0,
  bannedIps: 0,
  concurrencyRejected: 0,
  byClass: {},
};

function now() {
  return Date.now();
}

function getState(ip) {
  let state = buckets.get(ip);
  if (!state) {
    state = {
      tokens: BURST_CAPACITY,
      tokenUpdatedAt: now(), // 🛡️ مهر زمانی مستقل سوخت‌گیری Token Bucket
      updatedAt: now(),
      counters: {},
      violations: 0,
      firstSeenAt: now(),
      bannedUntil: 0,
      inFlight: 0,
    };
    buckets.set(ip, state);
  }
  return state;
}

/** پاک‌سازی دوره‌ای حافظه (جلوگیری از رشد نامحدود در حملات حجمی) */
const GC_INTERVAL = Math.max(WINDOW, 60_000);
const gcTimer = setInterval(() => {
  const cutoff = now() - GC_INTERVAL * 3;
  for (const [ip, state] of buckets) {
    const idle = state.updatedAt < cutoff && state.inFlight === 0;
    if (idle && state.bannedUntil < now()) buckets.delete(ip);
  }
}, GC_INTERVAL);
gcTimer.unref?.();

/** محدودیت تعداد کلیدها برای پیشگیری از حمله‌ای که حافظه را پر می‌کند */
const MAX_TRACKED_IPS = 50_000;
function evictOldestIfNeeded() {
  if (buckets.size <= MAX_TRACKED_IPS) return;
  const entries = [...buckets.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt);
  const removeCount = Math.ceil(entries.length * 0.1);
  for (let i = 0; i < removeCount; i++) buckets.delete(entries[i][0]);
  logger.warn('Rate-limiter cache eviction performed', { removed: removeCount, size: buckets.size });
}

export function consumeToken(ip, cost = 1) {
  const state = getState(ip);
  // ⚠️ از مهر زمانی مستقل استفاده می‌کنیم؛ در غیر این صورت به‌روزرسانی
  //    state.updatedAt در ابتدای هر درخواست، سوخت‌گیری باکت را متوقف می‌کند.
  const elapsed = Math.max(0, now() - state.tokenUpdatedAt);
  state.tokens = Math.min(BURST_CAPACITY, state.tokens + elapsed * BURST_REFILL_PER_MS);
  state.tokenUpdatedAt = now();
  if (state.tokens < cost) {
    const deficit = cost - state.tokens;
    return { allowed: false, retryAfter: Math.max(1, Math.ceil(deficit / BURST_REFILL_PER_MS / 1000)) };
  }
  state.tokens -= cost;
  return { allowed: true };
}

/** آیا IP در محدوده خصوصی/حلقه‌ای است؟ (محیط توسعه و شبکه داخلی) */
export function isPrivateOrLoopback(ip) {
  const value = String(ip || '').replace(/^::ffff:/, '');
  if (!value) return false;
  if (value === '::1' || value === 'localhost') return true;
  if (/^127\./.test(value) || /^10\./.test(value) || /^192\.168\./.test(value)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(value)) return true;
  if (/^f[cd][0-9a-f]{2}:/i.test(value)) return true; // IPv6 unique-local
  return false;
}

function registerViolation(state, ip = '') {
  state.violations += 1;
  if (state.violations >= config.limits.violationThreshold) {
    state.violations = 0;
    // 🔐 در محیط توسعه/شبکه داخلی، مسدودسازی موقت انجام نمی‌شود (تنها محدودسازی نرخ)
    if (isPrivateOrLoopback(ip)) {
      logger.debug('Violation threshold reached for private IP — ban skipped', { ip });
      return false;
    }
    state.bannedUntil = now() + config.limits.banMinutes * 60_000;
    stats.bannedIps += 1;
    return true;
  }
  return false;
}

export function rateLimit(options = {}) {
  const {
    name = 'global',
    max = config.limits.global,
    windowMs = WINDOW,
    cost = 1,
    slowDownAfter = 0.72,
  } = options;

  return function rateLimitMiddleware(req, res, next) {
    const ip = clientIp(req);
    const socketIp = String(req.socket?.remoteAddress || '').replace(/^::ffff:/, '');
    stats.totalRequests += 1;
    stats.byClass[name] = (stats.byClass[name] || 0) + 1;

    if (config.allowList.includes(ip)) return next();

    // 🔐 بررسی سقف برای «IP مؤثر» و «IP واقعی اتصال» به‌صورت هم‌زمان؛
    //    بنابراین جعل هدر X-Forwarded-For نمی‌تواند محدودسازی نرخ را دور بزند.
    const keys = [ip];
    if (socketIp && socketIp !== ip && !isPrivateOrLoopback(socketIp)) keys.push(socketIp);

    let worstRatio = 0;

    for (const key of keys) {
      const state = getState(key);
      state.updatedAt = now();

      if (config.denyList.includes(key)) {
        stats.blockedRequests += 1;
        return res.status(403).json({ ok: false, code: 'IP_BLOCKED', message: 'دسترسی این شبکه مسدود است.' });
      }

      if (state.bannedUntil > now()) {
        stats.blockedRequests += 1;
        const retryAfter = Math.ceil((state.bannedUntil - now()) / 1000);
        res.setHeader('Retry-After', String(retryAfter));
        return res.status(429).json({
          ok: false,
          code: 'IP_TEMPORARILY_BANNED',
          message: 'به دلیل درخواست‌های غیرعادی، دسترسی شما موقتاً محدود شده است.',
          retryAfter,
        });
      }

      // پنجره لغزان
      const counter = state.counters[name] || { count: 0, resetAt: now() + windowMs };
      if (counter.resetAt <= now()) {
        counter.count = 0;
        counter.resetAt = now() + windowMs;
      }
      counter.count += cost;
      state.counters[name] = counter;

      // Token bucket (کنترل نرخ پایدار)
      const tokenResult = consumeToken(key, cost);
      const overLimit = counter.count > max || !tokenResult.allowed;

      if (overLimit) {
        stats.rateLimited += 1;
        stats.blockedRequests += 1;
        const banned = registerViolation(state, key);
        const retryAfter = Math.max(1, tokenResult.retryAfter || Math.ceil((counter.resetAt - now()) / 1000));
        res.setHeader('Retry-After', String(retryAfter));
        res.setHeader('X-RateLimit-Limit', String(max));
        res.setHeader('X-RateLimit-Remaining', '0');
        logger.warn('Rate limit exceeded', { ip: key, class: name, banned });
        return res.status(429).json({
          ok: false,
          code: banned ? 'IP_TEMPORARILY_BANNED' : 'RATE_LIMITED',
          message: banned
            ? 'به دلیل درخواست‌های غیرعادی، دسترسی شما موقتاً محدود شده است.'
            : 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً چند لحظه بعد تلاش کنید.',
          retryAfter,
        });
      }

      const ratio = counter.count / max;
      worstRatio = Math.max(worstRatio, ratio);
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - counter.count)));
    }

    // Slow-down تدریجی نزدیک به سقف (کاهش فشار botها)
    if (slowDownAfter > 0 && worstRatio > slowDownAfter) {
      const delay = Math.min(1200, Math.floor((worstRatio - slowDownAfter) * 2500));
      setTimeout(() => next(), delay);
      return;
    }

    evictOldestIfNeeded();
    return next();
  };
}

/** محدودسازی درخواست‌های هم‌زمان هر IP (ضد سیل درخواست‌های سنگین) */
export function concurrencyGuard(req, res, next) {
  const ip = clientIp(req);
  if (config.allowList.includes(ip)) return next();
  const state = getState(ip);

  if (state.inFlight >= config.limits.maxInFlightPerIp) {
    stats.concurrencyRejected += 1;
    stats.blockedRequests += 1;
    registerViolation(state);
    res.setHeader('Retry-After', '5');
    return res.status(429).json({
      ok: false,
      code: 'TOO_MANY_CONCURRENT',
      message: 'تعداد درخواست‌های هم‌زمان شما زیاد است. کمی صبر کنید.',
    });
  }

  state.inFlight += 1;
  let finished = false;
  const release = () => {
    if (finished) return;
    finished = true;
    state.inFlight = Math.max(0, state.inFlight - 1);
  };
  res.on('finish', release);
  res.on('close', release);
  return next();
}

/** بررسی بیرونی: آیا این IP در حال حاضر مسدود است؟ */
export function isIpBanned(ip) {
  const state = buckets.get(ip);
  return Boolean(state && state.bannedUntil > now());
}

/** وضعیت امنیتی جاری برای نمایش در پنل مدیر */
export function getRateLimitSnapshot() {
  const activeBans = [...buckets.entries()]
    .filter(([, s]) => s.bannedUntil > now())
    .map(([ip, s]) => ({ ip, until: new Date(s.bannedUntil).toISOString(), violations: s.violations }));
  const topTalkers = [...buckets.entries()]
    .map(([ip, s]) => {
      const total = Object.values(s.counters).reduce((sum, c) => sum + (c?.count || 0), 0);
      return { ip, requests: total, inFlight: s.inFlight };
    })
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 8);

  return {
    ...stats,
    trackedIps: buckets.size,
    activeBans: activeBans.slice(0, 25),
    topTalkers,
    config: {
      windowMs: WINDOW,
      globalPerMinute: config.limits.global,
      authPerMinute: config.limits.auth,
      banMinutes: config.limits.banMinutes,
      maxInFlightPerIp: config.limits.maxInFlightPerIp,
    },
  };
}

export default { rateLimit, concurrencyGuard, clientIp, getRateLimitSnapshot, isIpBanned, consumeToken };
