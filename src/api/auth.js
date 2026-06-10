const request = async (action, options = {}) => {
  const res = await fetch(`/api/auth?action=${encodeURIComponent(action)}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '认证请求失败');
  return data;
};

export const register = ({ email, password, nickname }) => request('register', {
  method: 'POST',
  body: JSON.stringify({ email, password, nickname })
});

export const login = ({ email, password }) => request('login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

export const logout = () => request('logout', { method: 'POST' });

export const getCurrentUser = () => request('me');
