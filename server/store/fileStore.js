/**
 * ذخیره‌ساز فایلی (File Store) — بک‌اند پیش‌فرض بدون نیاز به سرویس بیرونی
 * --------------------------------------------------------------------
 * داده‌ها در فایل JSON با مجوز 0600 (فقط کاربر سرور) و به‌صورت اتمیک
 * (نوشتن در فایل موقت + rename) ذخیره می‌شوند تا در قطع برق/کرش، داده خراب نشود.
 *
 * ⚠️ این لایه هیچ‌گاه رمز عبور متن‌ساده نگه نمی‌دارد؛ فقط رکورد هش‌شده
 * (scrypt) در بخش credentials ذخیره می‌شود.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import logger from '../security/logger.js';

const EMPTY_DB = {
  schema: 1,
  users: {},
  credentials: {},
  sessions: {},
  passwordResets: {},
  audit: [],
  kv: {},
};

const MAX_AUDIT_EVENTS = 3000;

export function createFileStore({ dataDir }) {
  const dbFile = path.join(dataDir, 'warroom-db.json');
  let db = structuredClone(EMPTY_DB);
  let writeChain = Promise.resolve();
  let dirty = false;

  async function ensureDir() {
    await fsp.mkdir(dataDir, { recursive: true, mode: 0o700 });
    try { await fsp.chmod(dataDir, 0o700); } catch { /* ignore */ }
  }

  async function flush() {
    if (!dirty) return;
    dirty = false;
    const payload = JSON.stringify(db, null, 2);
    const tmp = `${dbFile}.${process.pid}.tmp`;
    writeChain = writeChain.then(async () => {
      await fsp.writeFile(tmp, payload, { mode: 0o600 });
      await fsp.rename(tmp, dbFile);
      try { await fsp.chmod(dbFile, 0o600); } catch { /* ignore */ }
    }).catch((err) => {
      logger.error('File store write failed', { err: String(err?.message || err) });
    });
    return writeChain;
  }

  function touch() {
    dirty = true;
    // نوشتن با تأخیر کوتاه برای تجمیع تغییرات پیاپی
    if (!touch.timer) {
      touch.timer = setTimeout(() => {
        touch.timer = null;
        flush();
      }, 120);
      touch.timer.unref?.();
    }
  }

  function readAll(collection) {
    return Object.values(db[collection] || {});
  }

  const store = {
    mode: 'file',
    dbFile,

    async init() {
      await ensureDir();
      if (fs.existsSync(dbFile)) {
        try {
          const raw = await fsp.readFile(dbFile, 'utf8');
          const parsed = JSON.parse(raw);
          db = { ...structuredClone(EMPTY_DB), ...parsed };
          db.users ||= {};
          db.credentials ||= {};
          db.sessions ||= {};
          db.passwordResets ||= {};
          db.audit ||= [];
          db.kv ||= {};
          try { await fsp.chmod(dbFile, 0o600); } catch { /* ignore */ }
        } catch (err) {
          logger.error('File store corrupted — starting with empty database', { err: String(err?.message || err) });
          const backup = `${dbFile}.corrupt-${Date.now()}`;
          try { await fsp.rename(dbFile, backup); } catch { /* ignore */ }
          db = structuredClone(EMPTY_DB);
        }
      } else {
        dirty = true;
        await flush();
      }
      logger.info('File store ready', { file: dbFile, users: Object.keys(db.users).length });
      return store;
    },

    async describe() {
      return {
        mode: 'file',
        location: dbFile,
        users: Object.keys(db.users).length,
        pendingPasswordResets: Object.values(db.passwordResets).filter((r) => r.status === 'pending').length,
      };
    },

    /* ----------------------------- کاربران ----------------------------- */
    async listUsers() {
      return readAll('users').map((u) => structuredClone(u));
    },

    async getUserById(id) {
      const user = db.users[id];
      return user ? structuredClone(user) : null;
    },

    async getUserByNationalCode(code) {
      const normalized = String(code || '').trim();
      const user = readAll('users').find((u) => String(u.national_code || '').trim() === normalized);
      return user ? structuredClone(user) : null;
    },

    async getUserByPersonalCode(code) {
      const normalized = String(code || '').trim();
      const user = readAll('users').find((u) => String(u.personal_code || '').trim() === normalized);
      return user ? structuredClone(user) : null;
    },

    async createUser(user) {
      // محافظت: هر کاربر باید شناسه امن و یکتا داشته باشد
      if (typeof user?.id !== 'string' || !/^[A-Za-z0-9_:.\-]{3,128}$/.test(user.id)) {
        return { ok: false, code: 'INVALID_USER_ID' };
      }
      if (db.users[user.id]) return { ok: false, code: 'DUPLICATE_ID' };
      const duplicate = await store.getUserByNationalCode(user.national_code);
      if (duplicate) return { ok: false, code: 'DUPLICATE_NATIONAL_CODE' };
      db.users[user.id] = { ...user, created_at: user.created_at || new Date().toISOString() };
      touch();
      return { ok: true, user: structuredClone(db.users[user.id]) };
    },

    async updateUserProfile(id, patch) {
      if (!db.users[id]) return null;
      const { password: _ignoredPassword, ...safePatch } = patch || {};
      db.users[id] = { ...db.users[id], ...safePatch, id };
      touch();
      return structuredClone(db.users[id]);
    },

    async countAdmins() {
      return readAll('users').filter((u) => u.role === 'admin').length;
    },

    /* --------------------------- اعتبارنامه‌ها --------------------------- */
    async getCredential(userId) {
      const credential = db.credentials[userId];
      return credential ? structuredClone(credential) : null;
    },

    async setCredential(userId, credential) {
      db.credentials[userId] = { ...credential, user_id: userId, updated_at: new Date().toISOString() };
      touch();
      return true;
    },

    async deleteCredential(userId) {
      delete db.credentials[userId];
      touch();
    },

    /* ------------------------------- نشست‌ها ------------------------------- */
    async createSession(session) {
      db.sessions[session.id] = session;
      touch();
      return session;
    },

    async getSession(id) {
      const session = db.sessions[id];
      if (!session) return null;
      if (session.expires_at && new Date(session.expires_at).getTime() < Date.now()) {
        delete db.sessions[id];
        touch();
        return null;
      }
      return structuredClone(session);
    },

    async deleteSession(id) {
      if (db.sessions[id]) {
        delete db.sessions[id];
        touch();
      }
    },

    async deleteUserSessions(userId) {
      let removed = 0;
      for (const [id, session] of Object.entries(db.sessions)) {
        if (session.user_id === userId) {
          delete db.sessions[id];
          removed += 1;
        }
      }
      if (removed) touch();
      return removed;
    },

    async pruneSessions() {
      const now = Date.now();
      let removed = 0;
      for (const [id, session] of Object.entries(db.sessions)) {
        if (!session.expires_at || new Date(session.expires_at).getTime() < now) {
          delete db.sessions[id];
          removed += 1;
        }
      }
      if (removed) touch();
      return removed;
    },

    /* --------------------- درخواست‌های تغییر رمز عبور --------------------- */
    async createPasswordReset(reset) {
      db.passwordResets[reset.id] = reset;
      touch();
      return structuredClone(reset);
    },

    async listPasswordResets() {
      return readAll('passwordResets')
        .map((r) => structuredClone(r))
        .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    },

    async getPasswordReset(id) {
      const reset = db.passwordResets[id];
      return reset ? structuredClone(reset) : null;
    },

    async updatePasswordReset(id, patch) {
      if (!db.passwordResets[id]) return null;
      db.passwordResets[id] = { ...db.passwordResets[id], ...patch, id };
      touch();
      return structuredClone(db.passwordResets[id]);
    },

    /* ------------------------------ رخدادها ------------------------------ */
    async appendAudit(event) {
      db.audit.push(event);
      if (db.audit.length > MAX_AUDIT_EVENTS) db.audit.splice(0, db.audit.length - MAX_AUDIT_EVENTS);
      touch();
      return true;
    },

    async listAudit(limit = 100) {
      return db.audit.slice(-Math.max(1, Math.min(limit, 1000))).reverse().map((e) => structuredClone(e));
    },

    /* ------------------------------ کلید/مقدار ------------------------------ */
    async kvGet(key) {
      return db.kv[key] === undefined ? null : structuredClone(db.kv[key]);
    },

    async kvSet(key, value) {
      db.kv[key] = value;
      touch();
      return true;
    },

    async close() {
      await flush();
      return writeChain;
    },
  };

  return store;
}

export default createFileStore;
