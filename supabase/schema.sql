-- ============================================================================
-- پلتفرم «اتاق جنگ» — اسکیمای کامل دیتابیس Supabase
-- ============================================================================
-- راهنمای اجرا:
--   ۱) وارد پروژه خود در https://supabase.com شوید (یا خودتان پروژه جدید بسازید)
--   ۲) از منوی کنار: SQL Editor → New query
--   ۳) کل این فایل را Paste کرده و Run کنید
--   ۴) در بخش Project Settings → API، مقادیر Project URL و anon public key را
--      برداشته و در فایل .env برنامه قرار دهید:
--         VITE_SUPABASE_URL=...
--         VITE_SUPABASE_ANON_KEY=...
--
-- ساختار جداول از الگوی «سند JSONB» استفاده می‌کند (id متنی + ستون data از نوع jsonb)
-- تا با مدل داده TypeScript برنامه (src/types.ts) یک‌به‌یک و بدون نگاشت اضافه هماهنگ باشد.
--
-- ⚠️  نکته امنیتی: سیاست‌های RLS این فایل برای «حالت دمو و توسعه» باز (permissive) هستند
--     و بخش پایین فایل، نسخه سخت‌گیرانه تولیدی (Production) را به صورت کامنت ارائه می‌کند.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ۰) اکستنشن‌ها
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- ۱) ساخت جداول (الگوی سند JSONB)
-- ----------------------------------------------------------------------------
create table if not exists public.warroom_users (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_groups (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_missions (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_submissions (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_trainings (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_medals (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_user_medals (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_support_tickets (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_support_replies (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_announcements (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_news (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_notifications (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_home_announcements (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.warroom_faqs (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- جدول کلید/مقدار برای تنظیمات سراسری سایت (site_settings و home_stats)
create table if not exists public.warroom_kv (
  id         text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ۲) تریگر به‌روزرسانی خودکار updated_at
-- ----------------------------------------------------------------------------
create or replace function public.warroom_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'warroom_users','warroom_groups','warroom_missions','warroom_submissions',
    'warroom_trainings','warroom_medals','warroom_user_medals',
    'warroom_support_tickets','warroom_support_replies','warroom_announcements',
    'warroom_news','warroom_notifications','warroom_home_announcements',
    'warroom_faqs','warroom_kv'
  ]
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I', t, t);
    execute format(
      'create trigger trg_%s_updated_at before update on public.%I
       for each row execute function public.warroom_set_updated_at()', t, t);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- ۳) ایندکس‌های کمکی برای جستجوهای رایج روی ستون jsonb
-- ----------------------------------------------------------------------------
create index if not exists idx_warroom_users_national_code on public.warroom_users ((data->>'national_code'));
create index if not exists idx_warroom_users_personal_code on public.warroom_users ((data->>'personal_code'));
create index if not exists idx_warroom_users_role          on public.warroom_users ((data->>'role'));
create index if not exists idx_warroom_submissions_user    on public.warroom_submissions ((data->>'personal_code'));
create index if not exists idx_warroom_submissions_mission on public.warroom_submissions ((data->>'mission_id'));
create index if not exists idx_warroom_tickets_status      on public.warroom_support_tickets ((data->>'status'));
create index if not exists idx_warroom_notifications_target on public.warroom_notifications ((data->>'target'));

-- ----------------------------------------------------------------------------
-- ۴) فعال‌سازی RLS و سیاست‌های دسترسی (حالت دمو/توسعه: باز)
-- ----------------------------------------------------------------------------
-- در این حالت کلاینت با کلید anon اجازه خواندن/نوشتن کامل دارد تا برنامه
-- بدون احراز هویت Supabase Auth نیز سراسری کار کند.
-- ⚠️ قبل از انتشار عمومی، بخش «سیاست‌های سخت‌گیرانه تولیدی» در انتهای فایل را اعمال کنید.

alter table public.warroom_users              enable row level security;
alter table public.warroom_groups             enable row level security;
alter table public.warroom_missions           enable row level security;
alter table public.warroom_submissions        enable row level security;
alter table public.warroom_trainings          enable row level security;
alter table public.warroom_medals             enable row level security;
alter table public.warroom_user_medals        enable row level security;
alter table public.warroom_support_tickets    enable row level security;
alter table public.warroom_support_replies    enable row level security;
alter table public.warroom_announcements      enable row level security;
alter table public.warroom_news               enable row level security;
alter table public.warroom_notifications      enable row level security;
alter table public.warroom_home_announcements enable row level security;
alter table public.warroom_faqs               enable row level security;
alter table public.warroom_kv                 enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'warroom_users','warroom_groups','warroom_missions','warroom_submissions',
    'warroom_trainings','warroom_medals','warroom_user_medals',
    'warroom_support_tickets','warroom_support_replies','warroom_announcements',
    'warroom_news','warroom_notifications','warroom_home_announcements',
    'warroom_faqs','warroom_kv'
  ]
  loop
    execute format('drop policy if exists "warroom_public_access" on public.%I', t);
    execute format(
      'create policy "warroom_public_access" on public.%I
       for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- ۵) مجوزهای اجرا (Grants)
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all tables in schema public to service_role;

-- ----------------------------------------------------------------------------
-- ۶) داده اولیه: فقط «مدیر ارشد عملیات» (Admin) به‌صورت پیش‌فرض ثبت می‌شود
-- ----------------------------------------------------------------------------
-- ورود پیش‌فرض پنل مدیریت:
--     کد ملی : 0012345678
--     رمز     : admin
-- (رمز به صورت SHA-256 هش شده ذخیره می‌شود: 8c6976e5...448a918)
insert into public.warroom_users (id, data) values (
  'u-admin',
  $${"id":"u-admin","first_name":"امیرحسین","last_name":"فرماندهی کل","national_code":"0012345678","phone":"09120000000","password":"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918","role":"admin","education_level":"متوسطه دوم","grade":"دوازدهم","gender":"پسر","province":"تهران","city":"تهران","birth_date":"1384/01/15","school_name":"دبیرستان ماندگار البرز","personal_code":"900000001","address":"ستاد مرکزی اتاق جنگ"}$$::jsonb
)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- ۷) باکت Storage برای رسانه‌ها (آواتار، فایل‌های مأموریت، آثار ویترین)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('warroom-media', 'warroom-media', true)
on conflict (id) do nothing;

drop policy if exists "warroom_media_public_read" on storage.objects;
create policy "warroom_media_public_read" on storage.objects
  for select using (bucket_id = 'warroom-media');

drop policy if exists "warroom_media_public_write" on storage.objects;
create policy "warroom_media_public_write" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'warroom-media');

-- ============================================================================
-- ۸) سیاست‌های سخت‌گیرانه «حالت تولیدی» (اختیاری — برای انتشار عمومی)
-- ============================================================================
-- اگر می‌خواهید امنیت واقعی داشته باشید:
--   الف) ثبت‌نام/ورود کاربران را به Supabase Auth منتقل کنید (supabase.auth.signUp)
--        و ستون auth_user_id uuid را به warroom_users اضافه نمایید.
--   ب) سیاست‌های زیر را جایگزین سیاست باز بالا کنید:
--
-- revoke all on all tables in schema public from anon;
--
-- -- خواندن محتوای عمومی برای همه:
-- create policy "public_read" on public.warroom_missions      for select using (true);
-- create policy "public_read" on public.warroom_trainings     for select using (true);
-- create policy "public_read" on public.warroom_announcements for select using (true);
-- create policy "public_read" on public.warroom_news          for select using (true);
-- create policy "public_read" on public.warroom_faqs          for select using (true);
-- create policy "public_read" on public.warroom_kv            for select using (true);
-- -- ... و برای سایر جداول: فقط کاربران واردشده (authenticated) و ادمین اجازه دارند.
-- -- نمونه سیاست ادمین:
-- create policy "admin_all" on public.warroom_users for all to authenticated
--   using ( exists (select 1 from public.warroom_users u
--                   where u.id = auth.uid()::text and u.data->>'role' = 'admin') );
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ۹) پرس‌وجوهای صحت‌سنجی (اختیاری)
-- ----------------------------------------------------------------------------
-- select count(*) from public.warroom_users;                       -- باید ۱ باشد (ادمین)
-- select id from public.warroom_users where data->>'role' = 'admin';
-- select id from storage.buckets where id = 'warroom-media';
