import { ref } from 'vue';
import { createArticle, getArticles, getArticleById, getHotArticles } from '@/api/article';

// 文章数据逻辑
export function useArticle() {
  const articles = ref([]);
  const articleDetail = ref(null);
  const hotArticles = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 获取文章列表
  const fetchArticles = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getArticles(params);
      const payload = response.data || {};
      articles.value = Array.isArray(payload) ? payload : payload.list || [];
      return Array.isArray(payload)
        ? { list: payload, total: payload.length, page: 1, limit: payload.length }
        : payload;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取文章详情
  const fetchArticleById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getArticleById(id);
      articleDetail.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取热门文章
  const fetchHotArticles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getHotArticles();
      hotArticles.value = response.data || [];
      return response.data || [];
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const publishArticle = async (payload) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await createArticle(payload);
      articleDetail.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 重置文章详情
  const resetArticleDetail = () => {
    articleDetail.value = null;
  };

  return {
    articles,
    articleDetail,
    hotArticles,
    loading,
    error,
    fetchArticles,
    fetchArticleById,
    fetchHotArticles,
    publishArticle,
    resetArticleDetail
  };
}
