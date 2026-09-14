/**
 * ذخیره‌ساز Supabase (PostgREST) — فقط برای استفاده سمت سرور
 * ---------------------------------------------------------------
 * 🔐 نکته امنیتی مهم:
 *   - این لایه با کلید «service_role» کار می‌کند که فقط در متغیرهای محیطی
 *     سرور قرار دارد و هرگز به مرورگر ارسال نمی‌شود.
 *   - هیچ عبارتی از SQL به‌صورت رشته‌ای ساخته نمی‌شود؛ PostgREST فیلترها را
 *     پارامترمحور به کوئری آماده (Prepared Statement) تبدیل می‌کند؛ بنابراین
 *     مسیر SQL Injection بسته است. مقادیر ورودی علاوه بر آن در لایه
 *     اعتبارسنجی (validate.js) پالایش می‌شوند و در URL به‌صورت
 *     encodeURIComponent درج می‌شوند.
 *   - جدول‌های حساس (credentials/sessions/password_resets/audit) در
 *     اسکیمای SQL با RLS فعال و «بدون هیچ سیاستی» ساخته می‌شوند؛ یعنی
 *     کلاینت عمومی (anon) هیچ دسترسی به آن‌ها ندارد.
 */
import logger from '../security/logger.js';

const TABLES = {
  users: 'warroom_users',
  credentials: 'warroom_credentials',
  sessions: 'warroom_sessions',
  passwordResets: 'warroom_password_resets',
  audit: 'warroom_audit_log',
  securityKv: 'warroom_security_kv',
};

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_AUDIT_EVENTS = 3000;

export function createSupabaseStore({ url, serviceKey }) {
  const baseUrl = url.replace(/\/+$/, '');
  const restUrl = `${baseUrl}/rest/v1`;

  async function rest(table, { method = 'GET', query = '', body, prefer = 'return=representation', headers = {} } = {}) {
    const target = `${restUrl}/${table}${query ? `?${query}` : ''}`;
    const res = await fetch(target, {
      method,
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: prefer,
        Accept: 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const text = await res.text();
    let payload = null;
    if (text) {
      try { payload = JSON.parse(text); } catch { payload = text; }
    }

    if (!res.ok) {
      const code = payload?.code || res.status;
      const message = payload?.message || payload?.error || res.statusText;
      const missingTable = code === '42P01' || code === 'PGRST205' || /does not exist|schema cache/i.test(String(message));
      const error = new Error(String(message));
      error.code = code;
      error.missingTable = missingTable;
      error.status = res.status;
      throw error;
    }
    return payload;
  }

  const eqFilter = (column, value) => `${column}=eq.${encodeURIComponent(String(value))}`;
  const jsonbFilter = (key, value) => `data->>${key}=eq.${encodeURIComponent(String(value))}`;

  async function selectRows(table, { query = '', single = false } = {}) {
    const rows = await rest(table, { query });
    if (single) return Array.isArray(rows) ? rows[0] : rows;
    return Array.isArray(rows) ? rows : [];
  }

  async function upsertRow(table, id, payload, { valueColumn = 'data' } = {}) {
    const rows = await rest(table, {
      method: 'POST',
      query: 'on_conflict=id',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: [{ id, [valueColumn]: payload, updated_at: new Date().toISOString() }],
    });
    return rows?.[0] || { id };
  }

  async function updateRow(table, id, payload, { valueColumn = 'data' } = {}) {
    const rows = await rest(table, {
      method: 'PATCH',
      query: eqFilter('id', id),
      body: { [valueColumn]: payload, updated_at: new Date().toISOString() },
    });
    return rows?.[0] || null;
  }

  async function deleteRow(table, id) {
    await rest(table, { method: 'DELETE', query: eqFilter('id', id), prefer: 'return=minimal' });
  }

  const store = {
    mode: 'supabase',
    tables: TABLES,

    async init() {
      // بررسی دسترس‌پذیری و وجود جدول‌های امنیتی
      const missing = [];
      try {
        await rest(TABLES.users, { query: 'select=id&limit=1' });
      } catch (err) {
        if (err.missingTable) {
          throw new Error(
            'جدول‌های WarRoom در Supabase ساخته نشده‌اند. فایل Query.sql را در SQL Editor پروژه اجرا کنید.'
          );
        }
        throw err;
      }

      for (const [key, table] of Object.entries(TABLES)) {
        if (key === 'users') continue;
        try {
          await rest(table, { query: 'select=id&limit=1' });
        } catch (err) {
          if (err.missingTable) missing.push(table);
          else logger.warn('Supabase store table check failed', { table, error: String(err.message) });
        }
      }

      if (missing.length) {
        logger.warn(
          `Supabase: ${missing.length} جدول امنیتی وجود ندارد → ${missing.join(', ')}. ` +
            'برای فعال‌سازی کامل لایه امنیتی، بخش «جداول امنیتی» در Query.sql را اجرا کنید.'
        );
      } else {
        logger.info('Supabase store ready', { project: baseUrl });
      }
      return store;
    },

    async describe() {
      const users = await store.listUsers();
      const resets = await store.listPasswordResets();
      return {
        mode: 'supabase',
        location: baseUrl,
        users: users.length,
        pendingPasswordResets: resets.filter((r) => r.status === 'pending').length,
      };
    },

    /* ----------------------------- کاربران ----------------------------- */
    async listUsers() {
      const rows = await selectRows(TABLES.users, { query: 'select=data' });
      return rows.map((r) => r.data).filter(Boolean);
    },

    async getUserById(id) {
      const row = await selectRows(TABLES.users, { query: `${eqFilter('id', id)}&select=data`, single: true });
      return row?.data || null;
    },

    async getUserByNationalCode(code) {
      const row = await selectRows(TABLES.users, {
        query: `${jsonbFilter('national_code', code)}&select=data&limit=1`,
        single: true,
      });
      return row?.data || null;
    },

    async getUserByPersonalCode(code) {
      const row = await selectRows(TABLES.users, {
        query: `${jsonbFilter('personal_code', code)}&select=data&limit=1`,
        single: true,
      });
      return row?.data || null;
    },

    async createUser(user) {
      const duplicate = await store.getUserByNationalCode(user.national_code);
      if (duplicate) return { ok: false, code: 'DUPLICATE_NATIONAL_CODE' };
      const { password: _ignored, ...profile } = user;
      const saved = await upsertRow(TABLES.users, user.id, {
        ...profile,
        created_at: profile.created_at || new Date().toISOString(),
      });
      return { ok: true, user: saved?.data || profile };
    },

    async updateUserProfile(id, patch) {
      const current = await store.getUserById(id);
      if (!current) return null;
      const { password: _ignored, ...safePatch } = patch || {};
      const merged = { ...current, ...safePatch, id };
      const saved = await upsertRow(TABLES.users, id, merged);
      return saved?.data || merged;
    },

    async countAdmins() {
      const rows = await selectRows(TABLES.users, { query: `${jsonbFilter('role', 'admin')}&select=id` });
      return rows.length;
    },

    /* --------------------------- اعتبارنامه‌ها --------------------------- */
    async getCredential(userId) {
      const row = await selectRows(TABLES.credentials, { query: `${eqFilter('id', userId)}&select=data`, single: true });
      return row?.data || null;
    },

    async setCredential(userId, credential) {
      await upsertRow(TABLES.credentials, userId, {
        ...credential,
        user_id: userId,
        updated_at: new Date().toISOString(),
      });
      return true;
    },

    async deleteCredential(userId) {
      await deleteRow(TABLES.credentials, userId);
    },

    /* ------------------------------- نشست‌ها ------------------------------- */
    async createSession(session) {
      await upsertRow(TABLES.sessions, session.id, session);
      return session;
    },

    async getSession(id) {
      const row = await selectRows(TABLES.sessions, { query: `${eqFilter('id', id)}&select=data`, single: true });
      const session = row?.data || null;
      if (!session) return null;
      if (session.expires_at && new Date(session.expires_at).getTime() < Date.now()) {
        await deleteRow(TABLES.sessions, id).catch(() => {});
        return null;
      }
      return session;
    },

    async deleteSession(id) {
      await deleteRow(TABLES.sessions, id).catch(() => {});
    },

    async deleteUserSessions(userId) {
      const rows = await selectRows(TABLES.sessions, { query: `${jsonbFilter('user_id', userId)}&select=id` });
      await Promise.all(rows.map((r) => deleteRow(TABLES.sessions, r.id).catch(() => {})));
      return rows.length;
    },

    async pruneSessions() {
      const rows = await selectRows(TABLES.sessions, { query: 'select=id,data' });
      const expired = rows.filter((r) => !r.data?.expires_at || new Date(r.data.expires_at).getTime() < Date.now());
      await Promise.all(expired.map((r) => deleteRow(TABLES.sessions, r.id).catch(() => {})));
      return expired.length;
    },

    /* --------------------- درخواست‌های تغییر رمز عبور --------------------- */
    async createPasswordReset(reset) {
      const saved = await upsertRow(TABLES.passwordResets, reset.id, reset);
      return saved?.data || reset;
    },

    async listPasswordResets() {
      const rows = await selectRows(TABLES.passwordResets, { query: 'select=data&order=updated_at.desc&limit=500' });
      return rows.map((r) => r.data).filter(Boolean)
        .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    },

    async getPasswordReset(id) {
      const row = await selectRows(TABLES.passwordResets, { query: `${eqFilter('id', id)}&select=data`, single: true });
      return row?.data || null;
    },

    async updatePasswordReset(id, patch) {
      const current = await store.getPasswordReset(id);
      if (!current) return null;
      const merged = { ...current, ...patch, id };
      const saved = await upsertRow(TABLES.passwordResets, id, merged);
      return saved?.data || merged;
    },

    /* ------------------------------ رخدادها ------------------------------ */
    async appendAudit(event) {
      await upsertRow(TABLES.audit, event.id, event);
      // هرچند صد رخداد، قدیمی‌ها پاک می‌شوند تا حجم کنترل شود
      if (Math.random() < 0.05) {
        try {
          const rows = await selectRows(TABLES.audit, { query: 'select=id&order=updated_at.desc&offset=3000' });
          await Promise.all(rows.map((r) => deleteRow(TABLES.audit, r.id).catch(() => {})));
        } catch { /* ignore */ }
      }
      return true;
    },

    async listAudit(limit = 100) {
      const rows = await selectRows(TABLES.audit, {
        query: `select=data&order=updated_at.desc&limit=${Math.max(1, Math.min(limit, 1000))}`,
      });
      return rows.map((r) => r.data).filter(Boolean);
    },

    /* ------------------------------ کلید/مقدار ------------------------------ */
    async kvGet(key) {
      const row = await selectRows(TABLES.securityKv, { query: `${eqFilter('id', key)}&select=value`, single: true });
      return row?.value ?? null;
    },

    async kvSet(key, value) {
      await upsertRow(TABLES.securityKv, key, value, { valueColumn: 'value' });
      return true;
    },

    async close() {
      return true;
    },
  };

  return store;
}

export default createSupabaseStore;
