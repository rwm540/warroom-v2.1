/**
 * ماژول مدیریت رمز عبور — ذخیره‌سازی «هش‌شده» (هرگز متن ساده)
 * ---------------------------------------------------------------
 * الگوریتم: scrypt (مقاوم در برابر حملات GPU/ASIC) با Salt تصادفی برای هر کاربر.
 * - هیچ رمزی در دیتابیس، لاگ یا پاسخ API به‌صورت متن ساده ذخیره نمی‌شود.
 * - مقایسه هش‌ها به‌صورت زمان-ثابت (timingSafeEqual) انجام می‌شود.
 * - سازگاری با نسخه قدیم: هش‌های SHA-256 باقی‌مانده از نسخه‌های پیشین
 *   هنگام نخستین ورود موفق، به scrypt ارتقا (rehash) می‌شوند.
 */
import crypto from 'node:crypto';

const SCRYPT = { N: 2 ** 15, r: 8, p: 1, keylen: 64, saltBytes: 16 };

/** فهرست رمزهای بسیار ضعیف/رایج که هرگز پذیرفته نمی‌شوند */
const WEAK_PASSWORDS = new Set([
  'admin', 'admin123', 'administrator', 'password', 'passw0rd', '123456', '1234567',
  '12345678', '123456789', '1234567890', '12345678910', '111111', '000000', '123123',
  'qwerty', 'qwerty123', 'abc123', 'iloveyou', 'welcome', 'letmein', 'root', 'toor',
  'warroom', 'warroom123', 'iran123', 'test', 'test1234', 'changeme', '1qaz2wsx',
]);

const digitsOnly = /^\d+$/;

function scryptAsync(password, salt, params = SCRYPT) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      Buffer.from(password, 'utf8'),
      salt,
      params.keylen,
      { N: params.N, r: params.r, p: params.p, maxmem: 256 * 1024 * 1024 },
      (err, derived) => (err ? reject(err) : resolve(derived))
    );
  });
}

/** ساخت رکورد اعتبارنامه (credential) از رمز خام — فقط هش ذخیره می‌شود */
export async function hashPassword(password, extra = {}) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('PASSWORD_REQUIRED');
  }
  const salt = crypto.randomBytes(SCRYPT.saltBytes);
  const derived = await scryptAsync(password, salt);
  return {
    algo: `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}`,
    salt: salt.toString('base64'),
    hash: derived.toString('base64'),
    updated_at: new Date().toISOString(),
    ...extra,
  };
}

/** بررسی رمز خام در برابر رکورد اعتبارنامه scrypt */
export async function verifyPassword(password, credential) {
  if (!credential || typeof credential.hash !== 'string' || typeof credential.salt !== 'string') {
    return false;
  }
  const [, n, r, p] = String(credential.algo || '').split('$');
  const params = {
    ...SCRYPT,
    N: Number.parseInt(n, 10) || SCRYPT.N,
    r: Number.parseInt(r, 10) || SCRYPT.r,
    p: Number.parseInt(p, 10) || SCRYPT.p,
  };
  try {
    const derived = await scryptAsync(password, Buffer.from(credential.salt, 'base64'), params);
    const expected = Buffer.from(credential.hash, 'base64');
    if (expected.length !== derived.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/**
 * بررسی «اعتبارنامه قدیمی» (مهاجرت از نسخه‌های پیشین):
 * پشتیبانی از متن سادهٔ قدیمی و هش SHA-256.
 */
export function verifyLegacyPassword(password, stored) {
  if (typeof stored !== 'string' || stored.length === 0) return false;
  const legacySha256 = /^[0-9a-f]{64}$/i.test(stored);
  const candidate = legacySha256
    ? crypto.createHash('sha256').update(password, 'utf8').digest('hex')
    : password;
  const a = Buffer.from(candidate, 'utf8');
  const b = Buffer.from(stored, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** آیا رکورد اعتبارنامه از نوع scrypt است؟ */
export function isScryptCredential(credential) {
  return Boolean(credential && typeof credential.algo === 'string' && credential.algo.startsWith('scrypt$'));
}

/**
 * اعتبارسنجی قدرت رمز عبور.
 * @returns {{ ok: boolean, message?: string, score: number }}
 */
export function checkPasswordStrength(password, context = {}) {
  const pwd = typeof password === 'string' ? password : '';
  const minLength = context.minLength ?? (context.isAdmin ? 10 : 8);
  const problems = [];

  if (pwd.length < minLength) problems.push(`رمز عبور باید حداقل ${minLength} کاراکتر باشد.`);
  if (pwd.length > 128) problems.push('رمز عبور نباید بیش از ۱۲۸ کاراکتر باشد.');
  if (!/[A-Za-z]/.test(pwd)) problems.push('رمز عبور باید حداقل یک حرف لاتین داشته باشد.');
  if (!/\d/.test(pwd)) problems.push('رمز عبور باید حداقل یک رقم داشته باشد.');
  if (/\s/.test(pwd)) problems.push('رمز عبور نباید فاصله داشته باشد.');
  if (WEAK_PASSWORDS.has(pwd.toLowerCase())) problems.push('این رمز عبور بسیار رایج و ناامن است.');
  if (digitsOnly.test(pwd)) problems.push('رمز عبور نباید فقط شامل ارقام باشد.');
  if (/(.)\1{3,}/.test(pwd)) problems.push('تکرار پشت‌سرهم یک کاراکتر مجاز نیست.');
  if (pwd === [...pwd].reverse().join('') && pwd.length > 3) problems.push('رمز عبور آینه‌ای (پالین‌دروم) مجاز نیست.');

  const contextValues = [context.nationalCode, context.phone, context.personalCode, context.birthDate]
    .filter((v) => typeof v === 'string' && v.replace(/\D/g, '').length >= 4)
    .map((v) => v.replace(/\D/g, ''));
  if (contextValues.some((v) => pwd.includes(v))) {
    problems.push('رمز عبور نباید شامل کد ملی، شماره همراه یا تاریخ تولد باشد.');
  }

  let score = 0;
  if (pwd.length >= minLength) score += 1;
  if (pwd.length >= 12) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;

  return { ok: problems.length === 0, message: problems[0], problems, score };
}

/**
 * تولید رمز عبور قوی و خوانا (برای اعلام تلفنی به کاربر).
 * کاراکترهای مشابه‌نما (O/0, l/1) حذف شده‌اند تا اشتباه تایپی رخ ندهد.
 */
export function generateStrongPassword(length = 12) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '@#%+=?';
  const all = upper + lower + digits + symbols;
  const pick = (set) => set[crypto.randomInt(0, set.length)];

  const chars = [pick(upper), pick(upper), pick(lower), pick(lower), pick(digits), pick(digits), pick(symbols)];
  while (chars.length < Math.max(length, 10)) chars.push(pick(all));

  // درهم‌آمیزی با الگوریتم امن (Fisher–Yates با منبع تصادفی رمزنگاری‌شده)
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** تأخیر تصادفی برای یکنواخت‌سازی زمان پاسخ در تلاش‌های ناموفق (ضد Brute-force/زمان‌سنجی) */
export function constantTimeDelay(minMs = 120, maxMs = 320) {
  const ms = crypto.randomInt(minMs, maxMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
