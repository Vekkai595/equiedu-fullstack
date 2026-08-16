const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const SESSION_KEY = 'equiedu.auth.v1';

const isBrowser = typeof window !== 'undefined';

const readSession = () => {
  if (!isBrowser) return null;
  try {
    return JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  if (!isBrowser) return;
  if (!session) {
    window.sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const parseError = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Ignore invalid/non-JSON response bodies.
  }

  const message = data?.message || data?.detail || 'Não foi possível concluir a solicitação.';
  const error = new Error(typeof message === 'string' ? message : 'Não foi possível concluir a solicitação.');
  error.status = response.status;
  error.code = data?.error;
  throw error;
};

const rawRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) return parseError(response);
  if (response.status === 204) return null;
  return response.json();
};

const refreshAccessToken = async () => {
  const session = readSession();
  if (!session?.refresh_token) throw new Error('Sessão expirada.');

  const tokens = await rawRequest('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: session.refresh_token }),
    headers: {
      'X-Device-ID': session.device_id || getDeviceId(),
    },
  });

  const next = { ...session, ...tokens };
  writeSession(next);
  return next.access_token;
};

const authenticatedRequest = async (path, options = {}, retry = true) => {
  const session = readSession();
  if (!session?.access_token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      'X-Device-ID': session.device_id || getDeviceId(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && retry && session.refresh_token) {
    try {
      const newAccessToken = await refreshAccessToken();
      const secondResponse = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`,
          'X-Device-ID': session.device_id || getDeviceId(),
          ...(options.headers || {}),
        },
      });
      if (!secondResponse.ok) return parseError(secondResponse);
      if (secondResponse.status === 204) return null;
      return secondResponse.json();
    } catch (error) {
      writeSession(null);
      throw error;
    }
  }

  if (!response.ok) return parseError(response);
  if (response.status === 204) return null;
  return response.json();
};

const getDeviceId = () => {
  if (!isBrowser) return 'equiedu-web';
  const key = 'equiedu.device-id';
  let value = window.localStorage.getItem(key);
  if (!value) {
    value = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, value);
  }
  return value.slice(0, 128);
};

const usernameFromEmail = (email) => {
  const base = String(email || '')
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 22) || 'equiedu';
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}_${suffix}`.slice(0, 30);
};

export const authClient = {
  async me() {
    return authenticatedRequest('/api/v1/users/me');
  },

  async loginViaEmailPassword(identifier, password) {
    const deviceId = getDeviceId();
    const tokens = await rawRequest('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'X-Device-ID': deviceId },
      body: JSON.stringify({ identifier, password }),
    });
    writeSession({ ...tokens, device_id: deviceId });
    return tokens;
  },

  async register({ email, password, username }) {
    await rawRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username: username || usernameFromEmail(email),
      }),
    });
    return { ok: true };
  },

  async registerAndLogin({ email, password, username }) {
    await this.register({ email, password, username });
    return this.loginViaEmailPassword(email, password);
  },

  async resetPasswordRequest(email) {
    return rawRequest('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword({ resetToken, newPassword }) {
    return rawRequest('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
    });
  },

  async listSessions() {
    return authenticatedRequest('/api/v1/sessions');
  },

  async revokeSession(sessionId) {
    return authenticatedRequest(`/api/v1/sessions/${sessionId}`, { method: 'DELETE' });
  },

  async logout(redirectTo) {
    const session = readSession();
    try {
      if (session?.access_token && session?.refresh_token) {
        await authenticatedRequest('/api/v1/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        }, false);
      }
    } catch {
      // Local sign-out must still complete if the network/API is unavailable.
    } finally {
      writeSession(null);
      if (redirectTo && isBrowser) window.location.href = redirectTo;
    }
  },

  async logoutAll() {
    try {
      return await authenticatedRequest('/api/v1/auth/logout-all', { method: 'POST' });
    } finally {
      writeSession(null);
    }
  },

  setToken(accessToken) {
    const session = readSession() || {};
    writeSession({ ...session, access_token: accessToken });
  },

  loginWithProvider(_provider = 'visitor', redirectTo = '/') {
    // The application is public; this is intentionally not a fake authenticated session.
    if (isBrowser) window.location.href = redirectTo;
  },

  redirectToLogin(fromUrl = '/') {
    if (isBrowser) window.location.href = `/login?from=${encodeURIComponent(fromUrl)}`;
  },

  getSession: readSession,
  apiUrl: API_URL,
};
