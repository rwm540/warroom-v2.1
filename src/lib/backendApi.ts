/**
 * لایه ارتباط با بک‌اند امن «اتاق جنگ»
 * --------------------------------------------------------------------
 * همه درخواست‌های حساس (ورود، ثبت‌نام، تغییر رمز، درخواست بازیابی رمز و
 * عملیات مدیریتی) از این ماژول و با پروتکل امن سرور انجام می‌شوند:
 *
 *   • ارسال کوکی نشست HttpOnly (SameSite=Lax) — توکن در دسترس JS نیست
 *   • ارسال توکن CSRF در هدر X-CSRF-Token برای همه متدهای تغییردهنده
 *   • محدودیت زمانی درخواست (AbortController) و مدیریت خطای یکنواخت
 *   • هیچ رمزی در localStorage یا state حساس نگه‌داری نمی‌شود
 *
 * اگر بک‌اند در دسترس نباشد (استقرار فقط-استاتیک)، برنامه به «حالت محلی»
 * برمی‌گردد و هشدار امنیتی نمایش داده می‌شود.
 */
import type { User } from '../types';

const API_BASE = ((import.meta.env.VITE_API_BASE as string | undefined) || '/api').replace(/\/+$/, '');

export interface ApiError {
  code: string;
  message: string;
  retryAfter?: number;
  status?: number;
}

/**
 * نتیجه یکنواخت درخواست API
 * (ساختار ساده و سازگار با تنظیمات غیرstrict پروژه)
 */
export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: ApiError;
}

export interface BackendStatus {
  available: boolean;
  mode?: 'supabase' | 'file';
  checkedAt: number;
  message?: string;
}

let cachedStatus: BackendStatus | null = null;
let probePromise: Promise<BackendStatus> | null = null;
let csrfToken: string | null = null;
const statusListeners = new Set<(status: BackendStatus) => void>();

const STATUS_TTL_MS = 60_000;

/* ------------------------------------------------------------------ */
/* ابزارهای پایه                                                       */
/* ------------------------------------------------------------------ */

function readCookie(name: string): string | null {
  try {
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  } catch {
    return null;
  }
}

function notify(status: BackendStatus) {
  cachedStatus = status;
  statusListeners.forEach((listener) => {
    try { listener(status); } catch { /* ignore */ }
  });
}

export function subscribeBackendStatus(listener: (status: BackendStatus) => void): () => void {
  statusListeners.add(listener);
  if (cachedStatus) listener(cachedStatus);
  return () => statusListeners.delete(listener);
}

export function getBackendStatus(): BackendStatus | null {
  return cachedStatus;
}

export function isBackendAvailable(): boolean {
  return Boolean(cachedStatus?.available);
}

/** دریافت/تازه‌سازی توکن CSRF از سرور */
export async function ensureCsrfToken(force = false): Promise<string | null> {
  if (!force && csrfToken) return csrfToken;
  const fromCookie = readCookie('wr_csrf');
  if (fromCookie && !force) {
    csrfToken = fromCookie;
    return csrfToken;
  }
  try {
    const res = await fetch(`${API_BASE}/auth/csrf`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json', 'X-WarRoom-Client': 'web' },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    csrfToken = data?.csrfToken || readCookie('wr_csrf');
    return csrfToken;
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; timeoutMs?: number } = {}
): Promise<ApiResult<T>> {
  const { method = 'GET', body, timeoutMs = 15_000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-WarRoom-Client': 'web',
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    if (method !== 'GET') {
      const token = await ensureCsrfToken();
      if (token) headers['X-CSRF-Token'] = token;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || payload?.ok === false) {
      const error: ApiError = {
        code: payload?.code || `HTTP_${response.status}`,
        message: payload?.message || 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.',
        retryAfter: payload?.retryAfter,
        status: response.status,
      };
      if (error.code === 'CSRF_TOKEN_INVALID') {
        csrfToken = null;
        ensureCsrfToken(true).catch(() => {});
      }
      return { ok: false, error };
    }

    return { ok: true, data: (payload ?? {}) as T };
  } catch (err: any) {
    const aborted = err?.name === 'AbortError';
    return {
      ok: false,
      error: {
        code: aborted ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: aborted
          ? 'پاسخی از سرور دریافت نشد (Timeout). دوباره تلاش کنید.'
          : 'ارتباط با سرور برقرار نشد. اتصال شبکه یا فعال بودن بک‌اند را بررسی کنید.',
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* بررسی سلامت بک‌اند (Health Probe)                                    */
/* ------------------------------------------------------------------ */

export async function probeBackend(force = false): Promise<BackendStatus> {
  if (!force && cachedStatus && Date.now() - cachedStatus.checkedAt < STATUS_TTL_MS) {
    return cachedStatus;
  }
  if (probePromise) return probePromise;

  probePromise = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5_000);
      const response = await fetch(`${API_BASE}/health`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timer);
      const payload = await response.json().catch(() => null);
      const status: BackendStatus = {
        available: response.ok && payload?.ok === true,
        mode: payload?.mode === 'supabase' ? 'supabase' : payload?.mode === 'file' ? 'file' : undefined,
        checkedAt: Date.now(),
        message: payload?.mode === 'supabase' ? 'دیتابیس ابری Supabase متصل است.' : 'ذخیره‌ساز امن سرور فعال است.',
      };
      notify(status);
      return status;
    } catch {
      const status: BackendStatus = {
        available: false,
        checkedAt: Date.now(),
        message: 'بک‌اند امن در دسترس نیست — برنامه در حالت محلی (کم‌امن) اجرا می‌شود.',
      };
      notify(status);
      return status;
    } finally {
      probePromise = null;
    }
  })();

  return probePromise;
}

/* ------------------------------------------------------------------ */
/* احراز هویت                                                          */
/* ------------------------------------------------------------------ */

export interface AuthPayload {
  user: User;
  mustChangePassword: boolean;
}

export async function apiLogin(nationalCode: string, password: string): Promise<ApiResult<AuthPayload>> {
  return apiFetch<AuthPayload>('/auth/login', {
    method: 'POST',
    body: { national_code: nationalCode, password },
  });
}

export async function apiRegister(payload: Record<string, unknown>): Promise<ApiResult<AuthPayload>> {
  return apiFetch<AuthPayload>('/auth/register', { method: 'POST', body: payload });
}

export async function apiLogout(): Promise<ApiResult<{ message: string }>> {
  return apiFetch('/auth/logout', { method: 'POST', body: {} });
}

export async function apiSession(): Promise<
  ApiResult<{ authenticated: boolean; user?: User; mustChangePassword?: boolean; expiresAt?: string }>
> {
  return apiFetch('/auth/session');
}

export async function apiChangePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResult<{ message: string }>> {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

/* ------------------------------------------------------------------ */
/* درخواست بازیابی/تغییر رمز (توسط کاربر)                             */
/* ------------------------------------------------------------------ */

export async function requestPasswordReset(input: {
  nationalCode: string;
  contactPhone?: string;
  note?: string;
  personalCode?: string;
}): Promise<ApiResult<{ trackingCode: string; message: string }>> {
  return apiFetch('/password-reset/request', {
    method: 'POST',
    body: {
      national_code: input.nationalCode,
      personal_code: input.personalCode,
      contact_phone: input.contactPhone,
      note: input.note,
    },
  });
}

export async function checkPasswordResetStatus(
  nationalCode: string,
  trackingCode: string
): Promise<ApiResult<{ status: string; message: string; createdAt?: string; resolvedAt?: string | null }>> {
  return apiFetch('/password-reset/status', {
    method: 'POST',
    body: { national_code: nationalCode, tracking_code: trackingCode },
  });
}

/* ------------------------------------------------------------------ */
/* عملیات مدیریتی (نیازمند نشست مدیر)                                  */
/* ------------------------------------------------------------------ */

export async function adminListPasswordResets(params: { status?: string; q?: string } = {}): Promise<
  ApiResult<{ requests: any[]; stats: Record<string, number> }>
> {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.q) query.set('q', params.q);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiFetch(`/admin/password-resets${suffix}`);
}

export async function adminGeneratePassword(id: string): Promise<ApiResult<{ password: string; message: string }>> {
  return apiFetch(`/admin/password-resets/${encodeURIComponent(id)}/generate`, { method: 'POST', body: {} });
}

export async function adminMarkContacted(id: string, note?: string): Promise<ApiResult<any>> {
  return apiFetch(`/admin/password-resets/${encodeURIComponent(id)}/mark-contacted`, {
    method: 'POST',
    body: { note },
  });
}

export async function adminResolvePasswordReset(
  id: string,
  password: string,
  note?: string
): Promise<ApiResult<{ password: string; message: string }>> {
  return apiFetch(`/admin/password-resets/${encodeURIComponent(id)}/resolve`, {
    method: 'POST',
    body: { password, note },
  });
}

export async function adminRejectPasswordReset(id: string, reason?: string): Promise<ApiResult<any>> {
  return apiFetch(`/admin/password-resets/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    body: { reason },
  });
}

export async function adminCreateUser(payload: Record<string, unknown>): Promise<
  ApiResult<{ user: User; oneTimePassword: string; message: string }>
> {
  return apiFetch('/admin/users', { method: 'POST', body: payload });
}

export async function adminUpdateUser(id: string, patch: Record<string, unknown>): Promise<ApiResult<{ user: User }>> {
  return apiFetch(`/admin/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch });
}

export async function adminResetUserPassword(id: string, password?: string): Promise<
  ApiResult<{ oneTimePassword: string; message: string }>
> {
  return apiFetch(`/admin/users/${encodeURIComponent(id)}/reset-password`, {
    method: 'POST',
    body: { password },
  });
}

export async function adminRevokeUserSessions(id: string): Promise<ApiResult<{ removed: number }>> {
  return apiFetch(`/admin/users/${encodeURIComponent(id)}/revoke-sessions`, { method: 'POST', body: {} });
}

export async function adminSecurityOverview(): Promise<ApiResult<any>> {
  return apiFetch('/admin/security/overview');
}

export async function adminAuditLog(limit = 100): Promise<ApiResult<{ events: any[] }>> {
  return apiFetch(`/admin/audit?limit=${encodeURIComponent(String(limit))}`);
}
