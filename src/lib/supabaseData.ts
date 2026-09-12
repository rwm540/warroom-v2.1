/**
 * لایه همگام‌سازی داده با Supabase — پلتفرم اتاق جنگ
 * ---------------------------------------------------------------
 * دو هوک عمومی:
 *   1) useSyncedCollection : برای آرایه‌های موجودیت‌دار (کاربران، مأموریت‌ها، ...)
 *   2) useSyncedSetting    : برای تنظیمات تکی (siteSettings، homeStats)
 *
 * رفتار:
 *  - حالت محلی (بدون Supabase): داده‌ها در localStorage ذخیره می‌شوند (مثل قبل).
 *  - حالت Supabase: پس از بارگذاری اولیه از دیتابیس، هر تغییر State به‌صورت
 *    خودکار (Diff بر اساس id) در جدول متناظر Upsert/Delete می‌شود.
 *
 * ساختار جداول در Supabase به صورت «سند JSONB» است:
 *    CREATE TABLE warroom_<entity> ( id text primary key, data jsonb, updated_at timestamptz )
 * مزیت: هر فیلدی که کامپوننت‌ها به موجودیت‌ها اضافه کنند، بدون تغییر نگاشت، همگام می‌شود.
 */
import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { supabase, isSupabaseEnabled } from './supabaseClient';

// بازانتشار برای راحتی مصرف‌کنندگان
export { isSupabaseEnabled };

/* ------------------------------------------------------------------ */
/* ابزار هش رمز عبور (SHA-256 با Web Crypto)                           */
/* ------------------------------------------------------------------ */
export async function sha256Hex(input: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    // محیط بدون Web Crypto (فقط حالت بسیار قدیمی) — مقدار خام برمی‌گردد
    return input;
  }
}

const HASH_PATTERN = /^[0-9a-f]{64}$/i;

/** نرمال‌سازی ردیف قبل از ارسال به Supabase (هش کردن رمزهای متنی کاربران) */
async function normalizeRowForDb(table: string, row: Record<string, any>): Promise<Record<string, any>> {
  if (table === 'warroom_users' && typeof row?.data?.password === 'string' && row.data.password && !HASH_PATTERN.test(row.data.password)) {
    return { ...row, data: { ...row.data, password: await sha256Hex(row.data.password) } };
  }
  return row;
}

/* ------------------------------------------------------------------ */
/* هوک ۱: مجموعه‌های موجودیت‌دار                                       */
/* ------------------------------------------------------------------ */
export function useSyncedCollection<T extends { id: string }>(options: {
  storageKey: string;
  table: string;
  initial: T[];
}): [T[], Dispatch<SetStateAction<T[]>>] {
  const { storageKey, table, initial } = options;

  const [value, setValue] = useState<T[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return initial;
  });

  const dbLoadedRef = useRef(false);
  const pendingSkipRef = useRef(true); // اولین اجرا و اجرای پس از بارگذاری دیتابیس، سینک نشود
  const prevRef = useRef<T[]>(value);

  // بارگذاری اولیه از Supabase
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase!.from(table).select('data');
        if (error) throw error;
        if (cancelled) return;
        const rows = ((data || []) as any[])
          .map(r => (r && typeof r === 'object' && 'data' in r ? (r.data as T) : null))
          .filter((r): r is T => Boolean(r && typeof r === 'object'));
        if (rows.length > 0) {
          pendingSkipRef.current = true;
          setValue(rows);
        }
        dbLoadedRef.current = true;
      } catch (err) {
        console.warn(`[WarRoom] بارگذاری ${table} از Supabase ناموفق بود؛ حالت محلی فعال ماند.`, err);
        dbLoadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [table]);

  // ذخیره محلی + همگام‌سازی Diff با Supabase
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {}

    const prev = prevRef.current;
    prevRef.current = value;

    if (!isSupabaseEnabled || !supabase) return;
    if (pendingSkipRef.current) {
      pendingSkipRef.current = false;
      return;
    }
    if (!dbLoadedRef.current) return;

    const prevMap = new Map(prev.map(r => [r.id, r]));
    const nextIds = new Set(value.map(r => r.id));

    const changed = value.filter(r => {
      const p = prevMap.get(r.id);
      return !p || JSON.stringify(p) !== JSON.stringify(r);
    });
    const removedIds = prev.filter(r => !nextIds.has(r.id)).map(r => r.id);

    (async () => {
      try {
        if (changed.length > 0) {
          const rows = await Promise.all(
            changed.map(r => normalizeRowForDb(table, { id: r.id, data: r }))
          );
          const { error } = await supabase!.from(table).upsert(rows);
          if (error) console.warn(`[WarRoom] Upsert ${table} ناموفق:`, error.message);
        }
        if (removedIds.length > 0) {
          const { error } = await supabase!.from(table).delete().in('id', removedIds);
          if (error) console.warn(`[WarRoom] Delete ${table} ناموفق:`, error.message);
        }
      } catch (err) {
        console.warn(`[WarRoom] همگام‌سازی ${table} با خطا مواجه شد:`, err);
      }
    })();
  }, [value, storageKey, table]);

  return [value, setValue];
}

/* ------------------------------------------------------------------ */
/* هوک ۲: تنظیمات تکی (ذخیره در جدول warroom_kv)                       */
/* ------------------------------------------------------------------ */
export function useSyncedSetting<T extends Record<string, any>>(options: {
  storageKey: string;
  settingKey: string;
  initial: T | (() => T);
}): [T, Dispatch<SetStateAction<T>>] {
  const { storageKey, settingKey, initial } = options;

  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });

  const dbLoadedRef = useRef(false);
  const pendingSkipRef = useRef(true);
  const firstRunRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // بارگذاری اولیه از Supabase (جدول KV)
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase!
          .from('warroom_kv')
          .select('value')
          .eq('id', settingKey)
          .maybeSingle();
        if (error) throw error;
        if (cancelled) return;
        if (data?.value && typeof data.value === 'object') {
          pendingSkipRef.current = true;
          setValue(prev => ({ ...prev, ...data.value }));
        }
        dbLoadedRef.current = true;
      } catch (err) {
        console.warn(`[WarRoom] بارگذاری تنظیم «${settingKey}» از Supabase ناموفق بود.`, err);
        dbLoadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [settingKey]);

  // ذخیره محلی فوری + ذخیره در Supabase با تاخیر (Debounce)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {}

    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    if (pendingSkipRef.current) {
      pendingSkipRef.current = false;
      return;
    }
    if (!isSupabaseEnabled || !supabase) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      supabase!
        .from('warroom_kv')
        .upsert({ id: settingKey, value })
        .then(({ error }) => {
          if (error) console.warn(`[WarRoom] ذخیره تنظیم «${settingKey}» در Supabase ناموفق:`, error.message);
        });
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [value, storageKey, settingKey]);

  return [value, setValue];
}
