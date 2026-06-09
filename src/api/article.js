// 文章相关接口：当前使用 localStorage 作为个人博客的轻量发布后端
import {
  createStoredArticle,
  findArticleById,
  listArticles,
  listHotArticles
} from '@/utils/articleStorage';

const response = (data) => Promise.resolve({ data });

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

// 发布文章
export const createArticle = (payload) => {
  return response(createStoredArticle(payload));
};
