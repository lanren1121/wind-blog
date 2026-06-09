<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">文章分类</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SmoothCard v-for="category in categories" :key="category.id" class="p-6 cursor-pointer hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ category.name }}</h2>
            <p class="text-gray-600">{{ category.description }}</p>
          </div>
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg w-12 h-12 flex items-center justify-center">
            {{ category.count }}
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in category.tags.slice(0, 3)" :key="tag.id" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {{ tag.name }}
          </span>
          <span v-if="category.tags.length > 3" class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
            +{{ category.tags.length - 3 }}
          </span>
        </div>
      </SmoothCard>
    </div>
    
    <div v-if="categories.length === 0" class="text-center py-12">
      <p class="text-gray-600">暂无分类</p>
    </div>
  </div>
</template>

<script>
import SmoothCard from '@/components/common/SmoothCard.vue';

export default {
  name: 'Category',
  components: {
    SmoothCard
  },
  data() {
    return {
      categories: []
    };
  },
  async created() {
    // 模拟获取分类数据
    this.categories = [
      {
        id: 1,
        name: '前端开发',
        description: '前端技术分享，包括Vue、React、JavaScript等相关内容',
        count: 24,
        tags: [
          { id: 1, name: 'Vue.js' },
          { id: 2, name: 'React' },
          { id: 3, name: 'JavaScript' },
          { id: 4, name: 'CSS' }
        ]
      },
      {
        id: 2,
        name: '后端开发',
        description: '后端技术分享，包括Node.js、Python、Java等相关内容',
        count: 18,
        tags: [
          { id: 5, name: 'Node.js' },
          { id: 6, name: 'Python' },
          { id: 7, name: 'Java' },
          { id: 8, name: '数据库' }
        ]
      },
      {
        id: 3,
        name: '移动开发',
        description: '移动端开发技术，包括Flutter、React Native等跨平台方案',
        count: 12,
        tags: [
          { id: 9, name: 'Flutter' },
          { id: 10, name: 'React Native' },
          { id: 11, name: 'iOS' },
          { id: 12, name: 'Android' }
        ]
      },
      {
        id: 4,
        name: '算法与数据结构',
        description: '算法解析、数据结构分析以及编程技巧分享',
        count: 15,
        tags: [
          { id: 13, name: '算法' },
          { id: 14, name: '数据结构' },
          { id: 15, name: 'LeetCode' }
        ]
      },
      {
        id: 5,
        name: '人工智能',
        description: 'AI、机器学习、深度学习等前沿技术探索',
        count: 8,
        tags: [
          { id: 16, name: '机器学习' },
          { id: 17, name: '深度学习' },
          { id: 18, name: 'NLP' }
        ]
      },
      {
        id: 6,
        name: '工具与效率',
        description: '开发工具推荐、效率提升技巧、最佳实践等',
        count: 20,
        tags: [
          { id: 19, name: 'Git' },
          { id: 20, name: 'VSCode' },
          { id: 21, name: 'Linux' },
          { id: 22, name: 'Docker' }
        ]
      }
    ];
  }
};
</script>