// 文章相关接口：读取 JSON 文章源，并保留本地草稿/预览能力
import {
  createStoredArticle,
  deleteStoredArticle,
  findArticleById,
  listArticles,
  listHotArticles
} from '@/utils/articleStorage';

const response = async (data) => ({ data: await data });

// 获取文章列表
export const getArticles = (params = {}) => {
  return response(listArticles(params));
};

// 获取文章详情
export const getArticleById = (id) => {
  return response(findArticleById(id));
};

// 获取热门文章
export const getHotArticles = () => {
  return response(listHotArticles());
};

// 本地预览文章
export const createArticle = (payload) => {
  return response(createStoredArticle(payload));
};

export const deleteArticle = (id) => {
  return response(deleteStoredArticle(id));
};

export const publishArticleToGitHub = async (article, password) => {
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-password': password
    },
    body: JSON.stringify({ article })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '发布失败');
  return data.article;
};

export const deleteArticleFromGitHub = async (id, password) => {
  const res = await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'x-admin-password': password
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '删除失败');
  return data;
};

export const uploadImageToGitHub = async ({ file, articleId, password }) => {
  const form = new FormData();
  form.append('file', file);
  form.append('articleId', articleId);

  const res = await fetch('/api/images', {
    method: 'POST',
    headers: {
      'x-admin-password': password
    },
    body: form
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '图片上传失败');
  return data;
};
