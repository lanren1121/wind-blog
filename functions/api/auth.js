const SESSION_COOKIE = 'wind_blog_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

const json = (data, status = 200, extraHeaders = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    ...extraHeaders
  }
});

const badRequest = (message, status = 400) => json({ error: message }, status);

const toBase64Url = (input) => {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const fromBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const userKey = (email) => `user:${normalizeEmail(email)}`;

const safeUser = (user) => ({
  id: user.id,
  email: user.email,
  nickname: user.nickname || user.email.split('@')[0],
  createdAt: user.createdAt
});

const requireBindings = (env) => {
  if (!env.BLOG_AUTH) throw new Error('Cloudflare KV 绑定 BLOG_AUTH 未配置');
  if (!env.AUTH_SECRET) throw new Error('Cloudflare 环境变量 AUTH_SECRET 未配置');
};

const hashPassword = async (password, saltBase64Url = '') => {
  const salt = saltBase64Url ? fromBase64Url(saltBase64Url) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  return {
    salt: toBase64Url(salt),
    hash: toBase64Url(hash)
  };
};

const timingSafeEqual = (a, b) => {
  const left = encoder.encode(String(a || ''));
  const right = encoder.encode(String(b || ''));
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
};

const hmacKey = async (secret) => crypto.subtle.importKey(
  'raw',
  encoder.encode(secret),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify']
);

const signSession = async (payload, secret) => {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return `${body}.${toBase64Url(signature)}`;
};

const verifySession = async (token, secret) => {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(body));
  if (!ok) return null;

  const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
  if (!payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
};

const getCookie = (request, name) => {
  const cookie = request.headers.get('cookie') || '';
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) || '';
};

const cookieHeader = (token) => [
  `${SESSION_COOKIE}=${token}`,
  'Path=/',
  'HttpOnly',
  'SameSite=Lax',
  'Secure',
  `Max-Age=${SESSION_MAX_AGE}`
].join('; ');

const clearCookieHeader = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;

const currentUserFromRequest = async (request, env) => {
  const token = getCookie(request, SESSION_COOKIE);
  const session = await verifySession(token, env.AUTH_SECRET);
  if (!session) return null;

  const user = await env.BLOG_AUTH.get(userKey(session.email), 'json');
  return user ? safeUser(user) : null;
};

export const getCurrentUserFromRequest = currentUserFromRequest;

const handleRegister = async (request, env) => {
  const payload = await request.json();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');
  const nickname = String(payload.nickname || '').trim();

  if (!isEmail(email)) return badRequest('请输入有效邮箱地址');
  if (password.length < 8) return badRequest('密码至少需要 8 位');
  if (nickname.length > 24) return badRequest('昵称不能超过 24 个字符');

  const key = userKey(email);
  const existed = await env.BLOG_AUTH.get(key, 'json');
  if (existed) return badRequest('这个邮箱已经注册过', 409);

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    email,
    nickname: nickname || email.split('@')[0],
    passwordHash,
    createdAt: now,
    updatedAt: now
  };

  await env.BLOG_AUTH.put(key, JSON.stringify(user));
  const nowSeconds = Math.floor(Date.now() / 1000);
  const token = await signSession({ email: user.email, sub: user.id, exp: nowSeconds + SESSION_MAX_AGE }, env.AUTH_SECRET);
  return json({ user: safeUser(user) }, 201, { 'set-cookie': cookieHeader(token) });
};

const handleLogin = async (request, env) => {
  const payload = await request.json();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!isEmail(email) || !password) return badRequest('邮箱或密码不正确', 401);

  const user = await env.BLOG_AUTH.get(userKey(email), 'json');
  if (!user?.passwordHash) return badRequest('邮箱或密码不正确', 401);

  const passwordHash = await hashPassword(password, user.passwordHash.salt);
  if (!timingSafeEqual(passwordHash.hash, user.passwordHash.hash)) return badRequest('邮箱或密码不正确', 401);

  const now = Math.floor(Date.now() / 1000);
  const token = await signSession({ email: user.email, sub: user.id, exp: now + SESSION_MAX_AGE }, env.AUTH_SECRET);
  return json({ user: safeUser(user) }, 200, { 'set-cookie': cookieHeader(token) });
};

export async function onRequestGet({ request, env }) {
  try {
    requireBindings(env);
    const url = new URL(request.url);
    if ((url.searchParams.get('action') || 'me') !== 'me') return badRequest('不支持的认证操作', 404);
    return json({ user: await currentUserFromRequest(request, env) });
  } catch (error) {
    return json({ error: error.message }, error.status || 500);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    requireBindings(env);
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'register') return handleRegister(request, env);
    if (action === 'login') return handleLogin(request, env);
    if (action === 'logout') return json({ ok: true }, 200, { 'set-cookie': clearCookieHeader() });

    return badRequest('不支持的认证操作', 404);
  } catch (error) {
    return json({ error: error.message }, error.status || 500);
  }
}
