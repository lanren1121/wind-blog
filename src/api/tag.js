// 标签相关接口
import axios from 'axios';

// 获取标签列表
export const getTags = () => {
  return axios.get('/api/tags');
};

// 根据标签获取文章
export const getArticlesByTag = (tagId) => {
  return axios.get(`/api/tags/${tagId}/articles`);
};