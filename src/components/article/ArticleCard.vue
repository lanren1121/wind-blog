<template>
  <SmoothCard class="group h-full overflow-hidden border border-slate-200/80 bg-white">
    <div class="flex h-full flex-col p-6">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-google-blue">{{ article.category || '未分类' }}</p>
          <h3 class="line-clamp-2 text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-google-blue">
            {{ article.title }}
          </h3>
        </div>
        <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title" class="h-16 w-16 flex-shrink-0 rounded-2xl object-cover ring-1 ring-slate-100">
      </div>

      <p class="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
        {{ article.summary || article.description }}
      </p>

      <div class="mb-5 flex flex-wrap gap-2">
        <span v-for="tag in article.tags" :key="tag.id || tag.name" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {{ tag.name }}
        </span>
      </div>

      <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{{ formatDate(article.createdAt) }}</span>
        <span>{{ article.readingTime || 3 }} 分钟</span>
      </div>

      <router-link :to="`/article/${article.id}`" class="mt-5 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-google-blue hover:bg-google-blue hover:text-white">
        阅读全文
        <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </router-link>
    </div>
  </SmoothCard>
</template>

<script>
import SmoothCard from '@/components/common/SmoothCard.vue';
import { format } from '@/utils/format.js';

export default {
  name: 'ArticleCard',
  components: {
    SmoothCard
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return format.formatDate(date);
    }
  }
};
</script>

<style scoped>
.line-clamp-2,
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  -webkit-line-clamp: 3;
}
</style>
