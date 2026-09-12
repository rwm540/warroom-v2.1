/**
 * اس‌یوپیابیس (Supabase) کلاینت — پلتفرم اتاق جنگ
 * ---------------------------------------------------------------
 * این ماژول کلاینت Supabase را به صورت Lazy از متغیرهای محیطی
 * (.env) می‌سازد. اگر متغیرها تنظیم نشده باشند، برنامه به صورت
 * کامل در «حالت محلی» (localStorage) اجرا می‌شود.
 *
 * برای فعال‌سازی، دو متغیر زیر را در فایل .env قرار دهید:
 *    VITE_SUPABASE_URL=https://<project-ref>.supabase.co
 *    VITE_SUPABASE_ANON_KEY=<anon-public-key>
 *
 * سپس اسکریپت supabase/schema.sql را در SQL Editor پروژه Supabase
 * خود اجرا کنید (راهنمای کامل: supabase/README.md)
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

/** آیا اتصال به Supabase پیکربندی شده است؟ */
export const isSupabaseEnabled = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 20
);

/** کلاینت سراسری Supabase (در حالت محلی null است) */
export const supabase: SupabaseClient | null = (() => {
  if (!isSupabaseEnabled) return null;
  try {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (err) {
    console.error('[WarRoom] خطا در ساخت کلاینت Supabase:', err);
    return null;
  }
})();

/** نام باکت Storage برای رسانه‌ها (آواتار، فایل مأموریت‌ها و ...) */
export const WARROOM_STORAGE_BUCKET = 'warroom-media';
