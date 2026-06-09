<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">文章归档</h1>
    
    <div class="space-y-12">
      <div v-for="(monthData, month) in archiveData" :key="month">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ month }}</h2>
        <div class="border-l-2 border-gray-200 pl-6 ml-4 space-y-6">
          <div 
            v-for="article in monthData.articles" 
            :key="article.id"
            class="relative pb-6 last:pb-0"
          >
            <div class="absolute -left-11 top-1 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <router-link :to="`/article/${article.id}`" class="hover:text-blue-600 transition-colors">
                <h3 class="text-lg font-semibold text-gray-800">{{ article.title }}</h3>
              </router-link>
              <p class="text-gray-600 mt-2 line-clamp-2">{{ article.summary }}</p>
              <div class="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>{{ formatDate(article.createdAt) }}</span>
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ article.likes || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="Object.keys(archiveData).length === 0" class="text-center py-12">
      <p class="text-gray-600">暂无归档文章</p>
    </div>
  </div>
</template>

<script>
import { format } from '@/utils/format.js';

export default {
  name: 'Archive',
  data() {
    return {
      archiveData: {}
    };
  },
  async created() {
    // 模拟归档数据
    this.archiveData = {
      '2024年12月': {
        articles: [
          {
            id: 1,
            title: 'Vue 3 Composition API 最佳实践',
            summary: '探讨Vue 3中Composition API的优势以及在实际项目中的应用技巧...',
            createdAt: '2024-12-15',
            likes: 24
          },
          {
            id: 2,
            title: '现代CSS布局技术详解',
            summary: '深入了解Flexbox和Grid布局，掌握现代CSS布局的最佳实践...',
            createdAt: '2024-12-10',
            likes: 18
          }
        ]
      },
      '2024年11月': {
        articles: [
          {
            id: 3,
            title: 'JavaScript 异步编程完全指南',
            summary: '从回调函数到Promise再到async/await，全面解析JavaScript异步编程...',
            createdAt: '2024-11-28',
            likes: 42
          },
          {
            id: 4,
            title: 'Node.js 性能优化策略',
            summary: '介绍如何优化Node.js应用性能，包括内存管理、CPU优化等...',
            createdAt: '2024-11-22',
            likes: 31
          },
          {
            id: 5,
            title: 'React Server Components 解析',
            summary: '深入理解React Server Components的概念及其对现代React开发的影响...',
            createdAt: '2024-11-15',
            likes: 27
          }
        ]
      },
      '2024年10月': {
        articles: [
          {
            id: 6,
            title: 'TypeScript 高级类型技巧',
            summary: '探索TypeScript中高级类型的使用方法，提高代码质量和开发效率...',
            createdAt: '2024-10-30',
            likes: 35
          },
          {
            id: 7,
            title: '微前端架构设计与实现',
            summary: '分析微前端架构的优势和挑战，以及在大型项目中的实施策略...',
            createdAt: '2024-10-22',
            likes: 29
          }
        ]
      }
    };
  },
  methods: {
    formatDate(date) {
      return format.formatDate(date, 'MM月DD日');
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>