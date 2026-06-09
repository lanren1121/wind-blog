const STORAGE_KEY = 'wind_blog_articles';
const DRAFT_KEY = 'wind_blog_draft';

const markdownModules = import.meta.glob('@/content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const now = () => new Date().toISOString();

const slugify = (value) => {
  const base = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || `article-${Date.now()}`;
};

const normalizeTags = (tags = []) => {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => (typeof tag === 'string' ? tag : tag?.name))
      .filter(Boolean)
      .map((name, index) => ({ id: slugify(name) || String(index), name }));
  }

  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((name, index) => ({ id: slugify(name) || String(index), name }));
};

const calculateReadingTime = (content = '') => {
  const chineseChars = (content.match(/[一-龥]/g) || []).length;
  const words = (content.replace(/[一-龥]/g, ' ').match(/\b\w+\b/g) || []).length;
  return Math.max(1, Math.ceil((chineseChars / 350) + (words / 220)));
};

const parseValue = (value = '') => {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
};

const parseMarkdownArticle = (raw, path) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const fileName = path.split('/').pop()?.replace(/\.md$/, '') || `article-${Date.now()}`;

  if (!match) {
    return {
      id: fileName,
      title: fileName,
      summary: '这篇文章还没有摘要。',
      category: '未分类',
      tags: [],
      content: raw,
      likes: 0,
      readingTime: calculateReadingTime(raw),
      createdAt: now(),
      updatedAt: now()
    };
  }

  const frontmatter = match[1].split('\n').reduce((data, line) => {
    const index = line.indexOf(':');
    if (index === -1) return data;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    data[key] = parseValue(value);
    return data;
  }, {});
  const content = match[2].trim();

  return {
    id: frontmatter.id || fileName,
    title: frontmatter.title || fileName,
    summary: frontmatter.summary || '这篇文章还没有摘要。',
    category: frontmatter.category || '未分类',
    tags: normalizeTags(frontmatter.tags || ''),
    coverImage: frontmatter.coverImage || '',
    content,
    likes: Number(frontmatter.likes || 0),
    readingTime: calculateReadingTime(content),
    createdAt: frontmatter.createdAt || now(),
    updatedAt: frontmatter.updatedAt || frontmatter.createdAt || now()
  };
};

const markdownArticles = Object.entries(markdownModules).map(([path, raw]) => parseMarkdownArticle(raw, path));

const canUseStorage = () => typeof window !== 'undefined' && window.localStorage;

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
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, updatedAt: now() }));
};

export const clearDraft = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(DRAFT_KEY);
};

export const getStoredArticles = () => {
  if (!canUseStorage()) return markdownArticles;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markdownArticles));
    return markdownArticles;
  }

  try {
    const localArticles = JSON.parse(raw);
    const localIds = new Set((Array.isArray(localArticles) ? localArticles : []).map((article) => article.id));
    const freshMarkdownArticles = markdownArticles.filter((article) => !localIds.has(article.id));
    const merged = [...freshMarkdownArticles, ...(Array.isArray(localArticles) ? localArticles : [])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markdownArticles));
    return markdownArticles;
  }
};

export const saveArticles = (articles) => {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

export const listArticles = ({ page = 1, limit = 10, search = '' } = {}) => {
  const keyword = String(search || '').trim().toLowerCase();
  const articles = getStoredArticles()
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

export const findArticleById = (id) => {
  return getStoredArticles().find((article) => String(article.id) === String(id));
};

export const listHotArticles = () => {
  return getStoredArticles()
    .slice()
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5);
};

export const createStoredArticle = (payload) => {
  const createdAt = now();
  const title = payload.title?.trim() || '未命名文章';
  const article = {
    id: `${slugify(title)}-${Date.now().toString(36)}`,
    title,
    summary: payload.summary?.trim() || '这篇文章还没有摘要。',
    category: payload.category?.trim() || '未分类',
    tags: normalizeTags(payload.tags),
    coverImage: payload.coverImage?.trim() || '',
    content: payload.content?.trim() || '',
    likes: 0,
    readingTime: calculateReadingTime(payload.content),
    createdAt,
    updatedAt: createdAt
  };

  const articles = getStoredArticles();
  saveArticles([article, ...articles]);
  clearDraft();
  return article;
};
