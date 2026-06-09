const STORAGE_KEY = 'wind_blog_articles';
const DRAFT_KEY = 'wind_blog_draft';

const normalizeTags = (tags = []) => {
  if (Array.isArray(tags)) {
    return tags.map((tag, index) => {
      const name = typeof tag === 'string' ? tag : tag?.name;
      return name ? { id: String(name).trim() || String(index), name: String(name).trim() } : null;
    }).filter(Boolean);
  }

  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((name) => ({ id: name, name }));
};

const calculateReadingTime = (content = '') => {
  const chineseChars = (content.match(/[一-龥]/g) || []).length;
  const words = (content.replace(/[一-龥]/g, ' ').match(/\b\w+\b/g) || []).length;
  return Math.max(1, Math.ceil((chineseChars / 350) + (words / 220)));
};

const normalizeArticle = (article) => ({
  ...article,
  tags: normalizeTags(article.tags),
  imagePaths: Array.isArray(article.imagePaths) ? article.imagePaths : [],
  readingTime: article.readingTime || calculateReadingTime(article.content || '')
});

const canUseStorage = () => typeof window !== 'undefined' && window.localStorage;

const fetchJsonArticles = async () => {
  const response = await fetch(`/data/articles.json?t=${Date.now()}`);
  if (!response.ok) throw new Error('文章 JSON 加载失败');
  const data = await response.json();
  return (data.articles || []).map(normalizeArticle);
};

export const getDraft = () => {
  if (!canUseStorage()) return null;
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
};

export const saveDraft = (draft) => {
  if (!canUseStorage()) return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }));
};

export const clearDraft = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(DRAFT_KEY);
};

export const getStoredArticles = async () => {
  try {
    const remoteArticles = await fetchJsonArticles();
    if (!canUseStorage()) return remoteArticles;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteArticles));
      return remoteArticles;
    }

    const localArticles = JSON.parse(raw);
    const localOnlyArticles = (Array.isArray(localArticles) ? localArticles : []).filter((article) => article.localOnly);
    const merged = [...localOnlyArticles, ...remoteArticles].map(normalizeArticle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    if (!canUseStorage()) return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(normalizeArticle);
    } catch {
      return [];
    }
  }
};

export const saveArticles = (articles) => {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.map(normalizeArticle)));
};

export const listArticles = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const keyword = String(search || '').trim().toLowerCase();
  const articles = (await getStoredArticles())
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filtered = keyword
    ? articles.filter((article) => {
        const haystack = [
          article.title,
          article.summary,
          article.category,
          article.content,
          ...(article.tags || []).map((tag) => tag.name)
        ].join(' ').toLowerCase();
        return haystack.includes(keyword);
      })
    : articles;

  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const start = (currentPage - 1) * pageSize;

  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page: currentPage,
    limit: pageSize
  };
};

export const findArticleById = async (id) => {
  return (await getStoredArticles()).find((article) => String(article.id) === String(id));
};

export const listHotArticles = async () => {
  return (await getStoredArticles())
    .slice()
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5);
};

export const createStoredArticle = async (payload) => {
  const article = normalizeArticle({ ...payload, localOnly: true });
  const articles = await getStoredArticles();
  saveArticles([article, ...articles.filter((item) => item.id !== article.id)]);
  clearDraft();
  return article;
};

export const deleteStoredArticle = async (id) => {
  const articles = await getStoredArticles();
  saveArticles(articles.filter((article) => article.id !== id));
};
