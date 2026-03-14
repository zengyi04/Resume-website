const BASE = '/api';

// Route map: section key → URL path segment
const ROUTES: Record<string, string> = {
  experience: 'experiences',
  committee:  'committees',
  achievement: 'achievements',
  education:  'educations',
};

async function request<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> | undefined),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  request<{ token: string; role: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// ── Home (singleton) ──────────────────────────────────────────────────────────
export const getHome = () => request<any>('/home');

export const updateHome = (data: unknown, token: string) =>
  request<any>('/home', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });

// ── Generic list endpoints ────────────────────────────────────────────────────
export const getAll = (section: string) =>
  request<any[]>(`/${ROUTES[section]}`);

export const createItem = (section: string, data: unknown, token: string) =>
  request<any>(`/${ROUTES[section]}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });

export const updateItem = (section: string, id: string, data: unknown, token: string) =>
  request<any>(`/${ROUTES[section]}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });

export const deleteItem = (section: string, id: string, token: string) =>
  request<any>(`/${ROUTES[section]}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
