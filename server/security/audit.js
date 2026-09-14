/**
 * ثبت رویدادهای امنیتی (Audit Trail)
 * ---------------------------------------------------------------
 * همه رویدادهای حساس (ورود، تلاش ناموفق، درخواست/تغییر رمز، مسدودسازی)
 * با اثر انگشت IP و شناسه کاربر ثبت می‌شوند تا در پنل مدیر قابل رهگیری باشد.
 * هیچ‌گاه «رمز عبور» یا «توکن» در رویدادها ثبت نمی‌شود.
 */
import crypto from 'node:crypto';
import config from '../config.js';
import logger from './logger.js';

export const AUDIT_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGIN_LOCKED: 'login_locked',
  LOGIN_BLOCKED: 'login_blocked',
  REGISTER: 'register',
  LOGOUT: 'logout',
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_CONTACTED: 'password_reset_contacted',
  PASSWORD_RESET_RESOLVED: 'password_reset_resolved',
  PASSWORD_RESET_REJECTED: 'password_reset_rejected',
  ADMIN_ACTION: 'admin_action',
  RATE_LIMITED: 'rate_limited',
  MALICIOUS_INPUT: 'malicious_input',
  CSRF_VIOLATION: 'csrf_violation',
  SERVER_ERROR: 'server_error',
};

const SEVERITY = {
  [AUDIT_EVENTS.LOGIN_FAILED]: 'warning',
  [AUDIT_EVENTS.LOGIN_LOCKED]: 'critical',
  [AUDIT_EVENTS.LOGIN_BLOCKED]: 'critical',
  [AUDIT_EVENTS.RATE_LIMITED]: 'warning',
  [AUDIT_EVENTS.MALICIOUS_INPUT]: 'critical',
  [AUDIT_EVENTS.CSRF_VIOLATION]: 'critical',
  [AUDIT_EVENTS.SERVER_ERROR]: 'warning',
  [AUDIT_EVENTS.PASSWORD_RESET_RESOLVED]: 'notice',
};

/** اثر انگشت IP — برای رهگیری بدون ذخیره‌سازی IP خام (حریم خصوصی) */
export function ipFingerprint(ip) {
  return crypto
    .createHash('sha256')
    .update(`${ip}|${config.session.secret}`)
    .digest('hex')
    .slice(0, 16);
}

export function createAuditLogger(store) {
  const listeners = new Set();

  /** ثبت رویداد (بدون انتظار — نباید مسیر بحرانی را کند کند) */
  function record(type, details = {}, req = null) {
    const ip = req ? details.ip || req.clientIp || '' : details.ip || '';
    const event = {
      id: `ev_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`,
      type,
      severity: SEVERITY[type] || 'info',
      at: new Date().toISOString(),
      ipHash: ip ? ipFingerprint(String(ip)) : null,
      userId: details.userId || null,
      nationalCode: details.nationalCode || null,
      actorRole: details.actorRole || null,
      path: req?.originalUrl || details.path || null,
      message: details.message || null,
      meta: details.meta || null,
    };

    if (SEVERITY[type] === 'critical' || SEVERITY[type] === 'warning') {
      logger.warn(`[audit] ${type}`, { userId: event.userId, ip: event.ipHash, message: event.message });
    } else {
      logger.debug(`[audit] ${type}`, { userId: event.userId, message: event.message });
    }

    for (const listener of listeners) {
      try { listener(event); } catch { /* ignore */ }
    }

    if (store?.appendAudit) {
      store.appendAudit(event).catch((err) => logger.debug('Audit persist failed', { err: String(err?.message || err) }));
    }
    return event;
  }

  return {
    record,
    ipFingerprint,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export default { AUDIT_EVENTS, createAuditLogger, ipFingerprint };
