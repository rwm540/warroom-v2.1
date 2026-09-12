import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * نسخه ساختار داده (Storage Schema Version)
 * ---------------------------------------------------------------
 * در صورت تغییر مدل داده یا پاک‌سازی داده‌های نمونه، این نسخه باید
 * افزایش یابد تا داده‌های قدیمی و خراب localStorage به‌صورت یک‌باره
 * حذف شده و همه مرورگرها با داده تازه شروع کنند.
 */
const WARROOM_SCHEMA_VERSION = 'v3-supabase-ready';

(function migrateStorage() {
  try {
    if (localStorage.getItem('warroom_schema_version') !== WARROOM_SCHEMA_VERSION) {
      const keysToRemove = Object.keys(localStorage).filter(
        (k) => k.startsWith('warroom_') || k === 'hisstory_theme_mode'
      );
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('warroom_schema_version', WARROOM_SCHEMA_VERSION);
      console.info('[WarRoom] داده‌های محلی قدیمی پاک‌سازی شد (نسخه:', WARROOM_SCHEMA_VERSION + ')');
    }
  } catch (e) {
    console.warn('[WarRoom] Storage migration skipped:', e);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
