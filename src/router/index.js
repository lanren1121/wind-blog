import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），则滚动到该位置
    if (savedPosition) {
      return savedPosition;
    }
    // 如果路由有 hash，则滚动到对应元素
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    // 默认滚动到顶部
    return { top: 0 };
  }
});

export default router;