import { createPinia } from 'pinia';

// 创建 Pinia 实例
const store = createPinia();

export default store;

// 分类树、全局加载状态等全局状态
export const useGlobalStore = () => {
  const globalState = {
    // 分类树数据
    categoryTree: [],
    
    // 全局加载状态
    isLoading: false,
    
    // 当前用户信息
    userInfo: null,
    
    // 主题模式
    theme: 'light', // 'light' | 'dark'
    
    // 搜索关键词
    searchKeyword: '',
    
    // 设置分类树
    setCategoryTree(tree) {
      this.categoryTree = tree;
    },
    
    // 显示加载状态
    showLoading() {
      this.isLoading = true;
    },
    
    // 隐藏加载状态
    hideLoading() {
      this.isLoading = false;
    },
    
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    },
    
    // 设置搜索关键词
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword;
    }
  };
  
  return globalState;
};