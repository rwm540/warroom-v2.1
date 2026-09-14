/**
 * 🛡️ بررسی اتصال و یکپارچگی Supabase
 * -----------------------------------------------------------------
 * این اسکریپت روی ماشینی اجرا می‌شود که دسترسی اینترنت دارد (مثل سیستم خودتان)
 * و سه چیز را بررسی می‌کند:
 *   ۱) در دسترس بودن پروژه Supabase با آدرس تنظیم‌شده
 *   ۲) وجود و دسترس‌پذیری جدول‌های موردنیاز برنامه (با کلید عمومی/anon)
 *   ۳) اینکه کلید service_role سرور تنظیم شده است یا نه (برای ذخیره‌سازی بک‌اند)
 *
 * اجرا:  npm run supabase:check
 */
import 'dotenv/config';

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const publishable = (process.env.VITE_SUPABASE_PUBLIC_KEY || '').trim();
const anon = (process.env.VITE_SUPABASE_ANON_KEY || '').trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim();

const browserKey = /^sb_(publishable|secret)_[A-Za-z0-9_-]{10,}$/.test(publishable)
  ? publishable
  : (anon.length > 40 ? anon : '');

/** جدول‌های عمومی (دسترسی از مرورگر با کلید عمومی) */
const PUBLIC_TABLES = [
  'warroom_users', 'warroom_groups', 'warroom_missions', 'warroom_submissions',
  'warroom_trainings', 'warroom_medals', 'warroom_user_medals',
  'warroom_support_tickets', 'warroom_support_replies', 'warroom_announcements',
  'warroom_news', 'warroom_notifications', 'warroom_home_announcements',
  'warroom_faqs', 'warroom_vitrin_posts', 'warroom_vitrin_comments',
  'warroom_game_portals', 'warroom_kv',
];

/** جدول‌های حساس سرور (نباید با کلید عمومی در دسترس باشند) */
const SERVER_TABLES = [
  'warroom_credentials', 'warroom_sessions', 'warroom_password_resets',
  'warroom_audit_log', 'warroom_security_kv',
];

const mask = (v) => (v ? `${v.slice(0, 10)}…${v.slice(-4)} (${v.length} کاراکتر)` : '— تنظیم نشده —');
let problems = 0;

console.log('\n🛡️  بررسی Supabase\n' + '─'.repeat(48));
console.log('آدرس پروژه            :', url || '— تنظیم نشده —');
console.log('کلید عمومی مرورگر     :', mask(publishable || anon));
console.log('کلید service_role سرور :', mask(serviceKey));
console.log('منبع کلید مرورگر      :', browserKey ? (browserKey === publishable ? 'VITE_SUPABASE_PUBLIC_KEY' : 'VITE_SUPABASE_ANON_KEY') : '—');

if (!url || !/^https?:\/\//.test(url)) {
  console.log('\n❌ آدرس Supabase تنظیم نشده است. مقدار VITE_SUPABASE_URL و SUPABASE_URL را در فایل .env بگذارید.');
  process.exit(1);
}

async function rest(path, key) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
      signal: controller.signal,
    });
    let body = null;
    try { body = await res.json(); } catch { /* بدون بدنه */ }
    return { status: res.status, body };
  } catch (err) {
    return { status: 0, error: err?.name === 'AbortError' ? 'timeout' : String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

/* ۱) دسترسی به پروژه */
console.log('\n۱) دسترسی به پروژه');
if (!browserKey) {
  console.log('   ❌ هیچ کلید عمومی معتبری تنظیم نشده (VITE_SUPABASE_PUBLIC_KEY یا VITE_SUPABASE_ANON_KEY).');
  problems += 1;
} else {
  const ping = await rest('', browserKey);
  if (ping.status === 0) {
    console.log(`   ❌ اتصال برقرار نشد (${ping.error}). اینترنت/فیلترشکن یا صحت آدرس را بررسی کنید.`);
    problems += 1;
  } else if (ping.status === 401 || ping.status === 403) {
    console.log(`   ❌ کلید عمومی پذیرفته نشد (HTTP ${ping.status}). کلید پروژه را دوباره از Supabase کپی کنید.`);
    problems += 1;
  } else {
    console.log(`   ✅ پروژه در دسترس است (HTTP ${ping.status}).`);
  }
}

/* ۲) جدول‌های عمومی */
if (browserKey) {
  console.log('\n۲) جدول‌های عمومی برنامه (دسترسی از مرورگر)');
  const missing = [];
  for (const table of PUBLIC_TABLES) {
    const r = await rest(`${table}?select=id&limit=1`, browserKey);
    if (r.status === 200) continue;
    missing.push(`${table} (HTTP ${r.status || r.error})`);
  }
  if (missing.length === 0) {
    console.log(`   ✅ همه ${PUBLIC_TABLES.length} جدول در دسترس‌اند.`);
  } else {
    console.log(`   ❌ ${missing.length} جدول در دسترس نیست:`);
    missing.forEach((m) => console.log(`      • ${m}`));
    console.log('   ↳ اگر خطای 404 است، فایل supabase/schema.sql را در SQL Editor پروژه اجرا کنید.');
    problems += 1;
  }

  /* ۳) جدول‌های حساس باید با کلید عمومی «بسته» باشند */
  console.log('\n۳) جدول‌های حساس سرور (باید با کلید عمومی بسته باشند)');
  const exposed = [];
  for (const table of SERVER_TABLES) {
    const r = await rest(`${table}?select=*&limit=1`, browserKey);
    if (r.status === 200) exposed.push(table);
  }
  if (exposed.length === 0) {
    console.log('   ✅ هیچ‌کدام از جدول‌های اعتبارنامه/نشست/ممیزی با کلید عمومی قابل خواندن نیست.');
  } else {
    console.log(`   ⚠️ این جدول‌ها با کلید عمومی قابل خواندن‌اند: ${exposed.join(', ')}`);
    console.log('   ↳ بخش «revoke all … from anon, authenticated» در supabase/schema.sql را اجرا کنید.');
    problems += 1;
  }
}

/* ۴) وضعیت ذخیره‌ساز بک‌اند */
console.log('\n۴) ذخیره‌ساز بک‌اند (سرور)');
if (serviceKey && serviceKey.length > 20) {
  console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY تنظیم است → بک‌اند روی Supabase ذخیره می‌کند.');
  const r = await rest('warroom_credentials?select=id&limit=1', serviceKey);
  if (r.status === 200) {
    console.log('   ✅ جدول‌های سروری با کلید service_role قابل دسترسی‌اند.');
  } else if (r.status === 404) {
    console.log('   ❌ جدول‌های سروری پیدا نشدند. فایل supabase/schema.sql را در SQL Editor اجرا کنید.');
    problems += 1;
  } else {
    console.log(`   ❌ دسترسی سرور برقرار نشد (HTTP ${r.status || r.error}).`);
    problems += 1;
  }
} else {
  console.log('   ℹ️ SUPABASE_SERVICE_ROLE_KEY تنظیم نشده است؛ بک‌اند فعلاً از ذخیره‌ساز فایلی محلی');
  console.log('      (server/data/warroom-db.json) استفاده می‌کند. برای انتقال کامل بک‌اند به Supabase،');
  console.log('      کلید service_role را از Supabase → Project Settings → API بردارید و');
  console.log('      آن را در فایل .env (فقط روی سرور، هرگز در مرورگر) قرار دهید.');
}

console.log('\n' + '─'.repeat(48));
if (problems === 0) {
  console.log('📊 نتیجه: همه بررسی‌ها موفق بود.\n');
} else {
  console.log(`📊 نتیجه: ${problems} مورد نیاز به رسیدگی دارد (بالا را ببینید).\n`);
}
process.exit(problems === 0 ? 0 : 1);
