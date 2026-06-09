const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' }
});

const ARTICLE_REPO = 'lanren1121/wind-blog';
const ARTICLE_PATH = 'public/data/articles.json';
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

const decodeBase64Utf8 = (content) => decodeURIComponent(escape(atob(content.replace(/\n/g, ''))));
const encodeBase64Utf8 = (content) => btoa(unescape(encodeURIComponent(content)));

const getArticlesFile = async (env) => {
  const file = await github(env, `/repos/${ARTICLE_REPO}/contents/${ARTICLE_PATH}`);
  const parsed = JSON.parse(decodeBase64Utf8(file.content));
  return { sha: file.sha, articles: parsed.articles || [] };
};

const saveArticlesFile = async (env, articles, sha, message) => {
  return github(env, `/repos/${ARTICLE_REPO}/contents/${ARTICLE_PATH}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: encodeBase64Utf8(JSON.stringify({ articles }, null, 2) + '\n'),
      sha,
      branch: 'main'
    })
  });
};

const deleteImagePath = async (env, imagePath) => {
  const safePath = String(imagePath || '').replace(/^\/+/, '');
  if (!safePath.startsWith('images/')) return;

  try {
    const file = await github(env, `/repos/${IMG_REPO}/contents/${safePath}`);
    await github(env, `/repos/${IMG_REPO}/contents/${safePath}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete image ${safePath}`,
        sha: file.sha,
        branch: 'main'
      })
    });
  } catch (error) {
    // Ignore missing images so article deletion is not blocked by stale image refs.
    if (!String(error.message || '').includes('Not Found')) throw error;
  }
};

const normalizeArticle = (article) => {
  const now = new Date().toISOString();
  return {
    id: article.id,
    title: article.title,
    summary: article.summary || '这篇文章还没有摘要。',
    category: article.category || '未分类',
    tags: Array.isArray(article.tags) ? article.tags : String(article.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
    coverImage: article.coverImage || '',
    content: article.content || '',
    imagePaths: Array.isArray(article.imagePaths) ? article.imagePaths : [],
    likes: Number(article.likes || 0),
    createdAt: article.createdAt || now,
    updatedAt: now
  };
};

export async function onRequestGet({ env }) {
  try {
    const { articles } = await getArticlesFile(env);
    return json({ articles });
  } catch (error) {
    return json({ error: error.message }, error.status || 500);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    assertAuth(request, env);
    const payload = await request.json();
    const article = normalizeArticle(payload.article || payload);
    if (!article.id || !article.title || !article.content) return json({ error: '文章 id、标题和正文不能为空' }, 400);

    const { sha, articles } = await getArticlesFile(env);
    const next = [article, ...articles.filter((item) => item.id !== article.id)];
    await saveArticlesFile(env, next, sha, `Publish article ${article.title}`);
    return json({ article });
  } catch (error) {
    return json({ error: error.message }, error.status || 500);
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    assertAuth(request, env);
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return json({ error: '缺少文章 id' }, 400);

    const { sha, articles } = await getArticlesFile(env);
    const article = articles.find((item) => item.id === id);
    if (!article) return json({ error: '文章不存在' }, 404);

    for (const imagePath of article.imagePaths || []) {
      await deleteImagePath(env, imagePath);
    }

    await saveArticlesFile(env, articles.filter((item) => item.id !== id), sha, `Delete article ${article.title}`);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message }, error.status || 500);
  }
}
