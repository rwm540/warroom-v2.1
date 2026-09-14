/**
 * 🛡️ آزمون خودکار لایه‌های امنیتی بک‌اند «اتاق جنگ»
 * ------------------------------------------------------------------
 * اجرا:  npm run security:check            (آدرس پیش‌فرض: http://127.0.0.1:8787)
 *        API_BASE=http://127.0.0.1:8787 npm run security:check
 *
 * این اسکریپت موارد زیر را می‌سنجد:
 *   ۱) سلامت سرویس و وضعیت لایه ذخیره‌سازی
 *   ۲) فعال بودن توکن CSRF و رد درخواست بدون توکن
 *   ۳) رد payloadهای تزریقی (SQL Injection / XSS)
 *   ۴) اعتبارسنجی رمز ضعیف و کد ملی نامعتبر
 *   ۵) فعال بودن محدودسازی نرخ (429 پس از درخواست‌های پیاپی)
 *   ۶) پاسخ یکنواخت خطای ورود (عدم افشای وجود کاربر)
 */
const BASE = (process.env.API_BASE || 'http://127.0.0.1:8787').replace(/\/+$/, '');
const API = `${BASE}/api`;

let passed = 0;
let failed = 0;
let csrfToken = null;
const cookies = new Map();

function cookieHeader() {
  return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

function storeCookies(response) {
  const raw = response.headers.getSetCookie?.() || [];
  for (const cookie of raw) {
    const [pair] = cookie.split(';');
    const idx = pair.indexOf('=');
    if (idx > 0) cookies.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
  }
}

async function call(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'X-WarRoom-Client': 'web',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookies.size ? { Cookie: cookieHeader() } : {}),
      ...(csrfToken && body ? { 'X-CSRF-Token': csrfToken } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  storeCookies(res);
  let payload = null;
  try { payload = await res.json(); } catch { /* ignore */ }
  return { status: res.status, payload };
}

let rateLimitSeen = false;

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    failed += 1;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/** اگر لایه محدودسازی نرخ فعال شد، آزمون‌های باقی‌مانده «رد شده» علامت می‌خورند */
function skipped(name, reason = 'محدودسازی نرخ فعال است') {
  console.log(`  ⏭️  ${name} — نادیده گرفته شد (${reason})`);
}

(async () => {
  console.log(`\n🛡️  آزمون لایه‌های امنیتی — ${API}\n`);

  /* ۱) سلامت سرویس */
  console.log('۱) سلامت سرویس و لایه ذخیره‌سازی');
  const health = await call('/health');
  check('سرویس پاسخ می‌دهد', health.status === 200 && health.payload?.ok === true);
  check('الگوریتم هش رمز روی سرور فعال است', health.payload?.security?.passwordHashing === 'scrypt');
  check('نشست‌های سروری (توکن هش‌شده) فعال است', /hashed/i.test(String(health.payload?.security?.sessions)));
  console.log(`     ↳ حالت ذخیره‌سازی: ${health.payload?.mode}`);

  /* ۲) توکن CSRF */
  console.log('\n۲) محافظت CSRF');
  const csrfResponse = await call('/auth/csrf');
  csrfToken = csrfResponse.payload?.csrfToken;
  check('توکن CSRF صادر می‌شود', Boolean(csrfToken && csrfToken.length > 20));

  const savedToken = csrfToken;
  csrfToken = null; // شبیه‌سازی درخواست بدون توکن
  const noCsrf = await call('/auth/login', {
    method: 'POST',
    body: { national_code: '0012345678', password: 'x' },
    headers: { 'X-WarRoom-Client': 'spoofed' },
  });
  csrfToken = savedToken;
  check('درخواست بدون توکن CSRF رد می‌شود', noCsrf.status === 403 && noCsrf.payload?.code === 'CSRF_TOKEN_INVALID');

  /* ۳) تزریق SQL/XSS */
  console.log('\n۳) مقاومت در برابر تزریق (SQL Injection / XSS)');
  const sqli = await call('/auth/login', {
    method: 'POST',
    body: { national_code: "0012345678' OR 1=1 --", password: 'x' },
  });
  if (sqli.status === 429) { rateLimitSeen = true; skipped('آزمون تزریق SQL'); }
  else check('payload تزریق SQL پذیرفته نمی‌شود', sqli.payload?.ok === false, `کد: ${sqli.payload?.code}`);

  const xss = await call('/password-reset/request', {
    method: 'POST',
    body: { national_code: '0012345678', contact_phone: '09120000000', note: '<script>alert(1)</script>' },
  });
  if (xss.status === 429) { rateLimitSeen = true; skipped('آزمون XSS'); }
  else check('payload اسکریپتی (XSS) رد می‌شود', xss.status === 400, `کد: ${xss.payload?.code}`);

  /* ۴) اعتبارسنجی ورودی و قدرت رمز */
  console.log('\n۴) اعتبارسنجی ورودی و قدرت رمز عبور');
  const weak = await call('/auth/register', {
    method: 'POST',
    body: {
      first_name: 'آزمون', last_name: 'امنیتی', national_code: '0012345679',
      phone: '09120000001', birth_date: '1388/01/01', gender: 'پسر', password: '123',
    },
  });
  if (weak.status === 429) { rateLimitSeen = true; skipped('آزمون رمز ضعیف'); }
  else check('رمز عبور ضعیف رد می‌شود', weak.status === 400 && weak.payload?.code === 'WEAK_PASSWORD');
  const badNational = await call('/auth/register', {
    method: 'POST',
    body: {
      first_name: 'آزمون', last_name: 'امنیتی', national_code: '12345',
      phone: '09120000001', birth_date: '1388/01/01', gender: 'پسر', password: 'StrongPass123',
    },
  });
  if (badNational.status === 429) { rateLimitSeen = true; skipped('آزمون کد ملی نامعتبر'); }
  else check('کد ملی نامعتبر رد می‌شود', badNational.status === 400 && badNational.payload?.code === 'VALIDATION');

  /* ۵) کاربر ناموجود → پاسخ یکنواخت (ضد User Enumeration) */
  console.log('\n۵) جلوگیری از شناسایی کاربران (User Enumeration)');
  const unknown = await call('/auth/login', {
    method: 'POST',
    body: { national_code: '9999999999', password: 'SomePass123' },
  });
  if (unknown.status === 429) { rateLimitSeen = true; skipped('آزمون User Enumeration'); }
  else check('پیام خطا برای کاربر ناموجود یکنواخت است',
    unknown.status === 401 && String(unknown.payload?.message).includes('کد ملی یا رمز عبور نادرست'));

  /* ۶) محدودسازی نرخ (ضد DDoS / Brute-force) */
  console.log('\n۶) محدودسازی نرخ درخواست (Rate Limit)');
  let rateLimited = false;
  // سقف پیش‌فرض مسیرهای احراز هویت ۳۰ درخواست در دقیقه است؛ کمی بیشتر می‌فرستیم
  for (let i = 0; i < 40; i++) {
    const res = await call('/auth/login', {
      method: 'POST',
      body: { national_code: '9999999999', password: `guess-${i}` },
    });
    if (res.status === 429) { rateLimited = true; break; }
  }
  check('پس از درخواست‌های پیاپی، محدودسازی نرخ فعال می‌شود', rateLimited || rateLimitSeen);

  console.log(`\n📊 نتیجه: ${passed} موفق، ${failed} ناموفق\n`);
  process.exit(failed === 0 ? 0 : 1);
})().catch((err) => {
  console.error('\n❌ اجرای آزمون با خطا مواجه شد:', err?.message || err);
  console.error('   آیا بک‌اند در حال اجراست؟  npm run dev:api\n');
  process.exit(2);
});
