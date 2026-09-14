/**
 * لاگر ساختاریافته — بدون ثبت هیچ داده حساس (رمز، توکن، کد ملی کامل)
 */
import config from '../config.js';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const threshold = LEVELS[config.logLevel] ?? LEVELS.info;

/** پوشاندن داده‌های حساس پیش از ثبت در لاگ */
export function redact(value) {
  if (value === null || value === undefined) return value;
  const str = String(value);
  if (str.length <= 4) return '***';
  return `${str.slice(0, 2)}***${str.slice(-2)}`;
}

/** پوشاندن کد ملی: فقط ۳ رقم آخر */
export function maskNationalCode(code) {
  const c = String(code || '');
  if (c.length < 4) return '***';
  return `${'*'.repeat(c.length - 3)}${c.slice(-3)}`;
}

function emit(level, message, meta) {
  if (LEVELS[level] > threshold) return;
  const line = {
    t: new Date().toISOString(),
    level,
    msg: message,
    ...(meta && typeof meta === 'object' ? { meta } : {}),
  };
  const text = `[WarRoom:${level}] ${message}${meta ? ' ' + JSON.stringify(meta) : ''}`;
  if (level === 'error') console.error(text);
  else if (level === 'warn') console.warn(text);
  else console.log(text);
  return line;
}

export const logger = {
  error: (msg, meta) => emit('error', msg, meta),
  warn: (msg, meta) => emit('warn', msg, meta),
  info: (msg, meta) => emit('info', msg, meta),
  debug: (msg, meta) => emit('debug', msg, meta),
};

export default logger;
