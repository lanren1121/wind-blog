const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' }
});

const IMG_REPO = 'lanren1121/blog-img';

const github = async (env, path, options = {}) => {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'content-type': 'application/json',
      'user-agent': 'wind-blog-pages-function',
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `GitHub API ${res.status}`);
  return data;
};

const assertAuth = (request, env) => {
  if (!env.GITHUB_TOKEN) throw new Error('Cloudflare 环境变量 GITHUB_TOKEN 未配置');
  if (!env.ADMIN_PASSWORD) throw new Error('Cloudflare 环境变量 ADMIN_PASSWORD 未配置');
  const password = request.headers.get('x-admin-password');
  if (password !== env.ADMIN_PASSWORD) {
    const error = new Error('管理员密码错误');
    error.status = 401;
    throw error;
  }
};

const extensionFromMime = (mime = '') => {
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
  return 'bin';
};

const toBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export async function onRequestPost({ request, env }) {
  try {
    assertAuth(request, env);
    const form = await request.formData();
    const file = form.get('file');
    const articleId = String(form.get('articleId') || 'draft').replace(/[^a-z0-9一-龥-]/gi, '-');
    if (!file || typeof file === 'string') return json({ error: '请选择图片文件' }, 400);
    if (!file.type.startsWith('image/')) return json({ error: '只支持图片文件' }, 400);

    const ext = extensionFromMime(file.type);
    const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9一-龥-]/gi, '-').replace(/^-+|-+$/g, '') || 'image';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
    const path = `images/${date}/${articleId}-${Date.now()}-${safeName}.${ext}`;
    const content = toBase64(await file.arrayBuffer());

    await github(env, `/repos/${IMG_REPO}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Upload image ${path}`,
        content,
        branch: 'main'
      })
    });

    const url = `https://cdn.jsdelivr.net/gh/${IMG_REPO}@main/${path}`;
    return json({ path, url, markdown: `![${safeName}](${url})` });
  } catch (error) {
    return json({ error: error.message }, error.status || 500);
  }
}
