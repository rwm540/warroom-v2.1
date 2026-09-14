/**
 * انتخاب لایه ذخیره‌سازی (Storage Selection)
 * ---------------------------------------------------------------
 * ۱) اگر Supabase با کلید service_role پیکربندی شده باشد → ذخیره‌ساز ابری
 * ۲) در غیر این صورت (یا در صورت خطا) → ذخیره‌ساز فایلی محلی
 *
 * در هر دو حالت، «بک‌اند واقعی» روی سرور اجرا می‌شود و داده‌های حساس
 * (هش رمز، نشست‌ها، درخواست‌های تغییر رمز) هرگز در مرورگر ذخیره نمی‌شوند.
 */
import config, { isSupabaseConfigured } from '../config.js';
import logger from '../security/logger.js';
import createFileStore from './fileStore.js';
import createSupabaseStore from './supabaseStore.js';

export async function createStore() {
  if (isSupabaseConfigured) {
    try {
      const store = createSupabaseStore({
        url: config.supabase.url,
        serviceKey: config.supabase.serviceKey,
      });
      await store.init();
      logger.info('Storage backend: Supabase (PostgREST)', { project: config.supabase.url });
      return store;
    } catch (err) {
      logger.error(
        'اتصال به Supabase ناموفق بود؛ به ذخیره‌ساز فایلی سوئیچ می‌شود: ' + String(err?.message || err)
      );
    }
  } else {
    logger.info(
      'Supabase پیکربندی نشده است (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — ذخیره‌ساز فایلی فعال است.'
    );
  }

  const store = createFileStore({ dataDir: config.dataDir });
  await store.init();
  return store;
}

export default createStore;
