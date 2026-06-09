<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">标签</h1>
    
    <div class="mb-8">
      <div class="flex flex-wrap gap-3">
        <span 
          v-for="tag in tags" 
          :key="tag.id"
          class="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full cursor-pointer hover:from-blue-200 hover:to-purple-200 transition-all duration-300 hover:scale-105"
          @click="selectTag(tag)"
        >
          {{ tag.name }} ({{ tag.count }})
        </span>
      </div>
    </div>
    
    <div v-if="selectedTag">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">
        包含标签 "{{ selectedTag.name }}" 的文章 ({{ filteredArticles.length }})
      </h2>
      
      <div v-if="filteredArticles.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">该标签下暂无文章</p>
      </div>
      <div v-else class="space-y-6">
        <ArticleCard 
          v-for="article in filteredArticles" 
          :key="article.id" 
          :article="article" 
        />
      </div>
    </div>
    
    <div v-else>
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">热门标签</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SmoothCard v-for="tag in hotTags" :key="tag.id" class="p-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-800">{{ tag.name }}</h3>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {{ tag.count }} 篇文章
            </span>
          </div>
          <p class="text-gray-600 mt-2">{{ tag.description || '这个标签还没有描述' }}</p>
          <button 
            @click="selectTag(tag)"
            class="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            查看文章 →
          </button>
        </SmoothCard>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCard from '@/components/article/ArticleCard.vue';
import SmoothCard from '@/components/common/SmoothCard.vue';
import { getTags, getArticlesByTag } from '@/api/tag';

export default {
  name: 'Tag',
  components: {
    ArticleCard,
    SmoothCard
  },
  data() {
    return {
      tags: [],
      articles: [],
      selectedTag: null,
      filteredArticles: []
    };
  },
  computed: {
    hotTags() {
      // 返回前9个热门标签
      return this.tags.slice(0, 9);
    }
  },
  async created() {
    await this.fetchTags();
  },
  methods: {
    async fetchTags() {
      try {
        // 模拟获取标签数据
        this.tags = [
          { id: 1, name: 'JavaScript', count: 12, description: '关于 JavaScript 的文章' },
          { id: 2, name: 'Vue.js', count: 8, description: '关于 Vue.js 框架的文章' },
          { id: 3, name: '前端开发', count: 15, description: '前端开发相关的文章' },
          { id: 4, name: 'CSS', count: 7, description: '关于 CSS 样式的文章' },
          { id: 5, name: 'Node.js', count: 5, description: '关于 Node.js 的文章' },
          { id: 6, name: 'React', count: 6, description: '关于 React 框架的文章' },
          { id: 7, name: '算法', count: 4, description: '关于算法的文章' },
          { id: 8, name: 'Python', count: 3, description: '关于 Python 的文章' },
          { id: 9, name: 'Git', count: 6, description: '关于 Git 版本控制的文章' },
          { id: 10, name: 'TypeScript', count: 7, description: '关于 TypeScript 的文章' },
          { id: 11, name: 'Webpack', count: 4, description: '关于 Webpack 构建工具的文章' },
          { id: 12, name: '性能优化', count: 5, description: '关于性能优化的文章' }
        ];
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    },
    
    async selectTag(tag) {
      this.selectedTag = tag;
      try {
        // 模拟获取标签下的文章
        this.filteredArticles = [
          {
            id: 1,
            title: '深入理解 JavaScript 闭包',
            summary: '本文详细介绍了 JavaScript 中闭包的概念、原理以及实际应用场景。',
            tags: [{ id: 1, name: 'JavaScript' }],
            createdAt: '2023-05-15',
            likes: 24
          },
          {
            id: 2,
            title: 'ES6 新特性详解',
            summary: 'ES6 是 JavaScript 历史上最重要的更新之一，带来了许多实用的新特性。',
            tags: [{ id: 1, name: 'JavaScript' }],
            createdAt: '2023-06-20',
            likes: 32
          }
        ];
      } catch (error) {
        console.error('Failed to fetch articles by tag:', error);
      }
    },
    
    clearSelection() {
      this.selectedTag = null;
      this.filteredArticles = [];
    }
  }
};
</script>