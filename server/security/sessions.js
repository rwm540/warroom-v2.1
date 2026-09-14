/**
 * مدیریت نشست‌ها (Session Management)
 * --------------------------------------------------------------------
 * - توکن نشست ۲۵۶ بیتی تصادفی (crypto.randomBytes) و «هش‌شده» در دیتابیس
 *   ذخیره می‌شود؛ حتی در صورت نشت دیتابیس، توکن قابل استفاده نیست.
 * - کوکی HttpOnly + SameSite=Lax + Secure (در تولید) → مقاوم در برابر XSS/CSRF.
 * - انقضای کوتاه برای مدیر (پیش‌فرض ۴ ساعت) و ابطال خودکار پس از تغییر رمز.
 */
import crypto from 'node:crypto';
import config from '../config.js';
import logger from './logger.js';

const { cookieName } = config.session;

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function cookieOptions(maxAgeMs, httpOnly = true) {
  return {
    httpOnly,
    sameSite: 'lax',
    secure: config.session.secure,
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function makeSessionsService(store, audit) {
  async function createSession(user, req, res, { isAdmin = false } = {}) {
    const token = crypto.randomBytes(32).toString('base64url');
    const ttlHours = isAdmin ? config.session.adminTtlHours : config.session.ttlHours;
    const expiresAt = new Date(Date.now() + ttlHours * 3600_000);
    const session = {
      id: hashToken(token),
      user_id: user.id,
      role: user.role,
      is_admin: user.role === 'admin',
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      ip_hash: audit ? audit.ipFingerprint(req?.clientIp || '') : null,
      ua_hash: req?.headers?.['user-agent']
        ? crypto.createHash('sha256').update(String(req.headers['user-agent'])).digest('hex').slice(0, 16)
        : null,
    };
    await store.createSession(session);
    res.cookie(cookieName, token, cookieOptions(ttlHours * 3600_000));
    return session;
  }

  async function readSession(req) {
    const token = req.cookies?.[cookieName];
    if (!token || typeof token !== 'string' || token.length < 20) return null;
    const session = await store.getSession(hashToken(token));
    if (!session) return null;
    const user = await store.getUserById(session.user_id);
    if (!user) {
      await store.deleteSession(session.id);
      return null;
    }
    const credential = (await store.getCredential(user.id)) || null;
    return {
      session,
      user,
      mustChangePassword: Boolean(credential?.must_change_password),
    };
  }

  async function destroySession(req, res) {
    const token = req.cookies?.[cookieName];
    if (token) await store.deleteSession(hashToken(token));
    res.clearCookie(cookieName, { path: '/' });
  }

  /** میان‌افزار: بارگذاری نشست روی req.auth */
  function attachSession() {
    return async function attachSessionMiddleware(req, res, next) {
      try {
        req.auth = await readSession(req);
      } catch (err) {
        logger.debug('Session read failed', { err: String(err?.message || err) });
        req.auth = null;
      }
      next();
    };
  }

  /** میان‌افزار: الزام ورود */
  function requireAuth(req, res, next) {
    if (!req.auth) {
      return res.status(401).json({ ok: false, code: 'UNAUTHENTICATED', message: 'برای این عملیات باید وارد شوید.' });
    }
    return next();
  }

  /** میان‌افزار: الزام نقش مدیر */
  function requireAdmin(req, res, next) {
    if (!req.auth) {
      return res.status(401).json({ ok: false, code: 'UNAUTHENTICATED', message: 'ابتدا با حساب مدیر وارد شوید.' });
    }
    if (req.auth.user?.role !== 'admin') {
      audit?.record('admin_action', {
        userId: req.auth.user?.id,
        message: 'تلاش دسترسی غیرمجاز به مسیر مدیریتی',
        ip: req.clientIp,
      }, req);
      return res.status(403).json({ ok: false, code: 'FORBIDDEN', message: 'دسترسی فقط برای مدیر کل مجاز است.' });
    }
    return next();
  }

  /**
   * میان‌افزار: تا زمانی که مدیر رمز پیش‌فرض خود را تغییر نداده،
   * عملیات حساس مدیریتی مسدود است (جلوگیری از باقی‌ماندن رمز اولیه).
   */
  function requirePasswordRotation(req, res, next) {
    if (req.auth?.mustChangePassword) {
      return res.status(428).json({
        ok: false,
        code: 'PASSWORD_CHANGE_REQUIRED',
        message: 'برای ادامه، ابتدا رمز عبور پیش‌فرض خود را از بخش «تغییر رمز عبور» تغییر دهید.',
      });
    }
    return next();
  }

  return { createSession, readSession, destroySession, attachSession, requireAuth, requireAdmin, requirePasswordRotation };
}

export default makeSessionsService;
