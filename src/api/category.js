import axios from 'axios';

// 分类相关API
const categoryApi = {
  // 获取分类列表
  getCategoryList: () => {
    return axios.get('/api/categories');
  },

  // 获取指定分类下的文章
  getArticlesByCategory: (categoryId) => {
    return axios.get(`/api/categories/${categoryId}/articles`);
  },

  // 获取分类树形结构
  getCategoryTree: () => {
    return axios.get('/api/categories/tree');
  }
};

export default categoryApi;