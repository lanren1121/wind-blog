<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div v-if="loading" class="py-12">
      <div class="flex flex-col space-y-6">
        <Skeleton type="rect" size="xl" class="w-3/4 mx-auto" />
        <div class="flex justify-center">
          <Skeleton type="text" size="md" class="w-1/4" />
        </div>
        <div class="space-y-4">
          <Skeleton v-for="n in 8" :key="n" type="text" size="md" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-google">
      <div class="text-lg text-red-500">{{ error }}</div>
      <button @click="fetchArticle" class="mt-4 rounded-full bg-google-blue px-5 py-2.5 text-white hover:shadow-google">
        重新加载
      </button>
    </div>

    <article v-else-if="articleDetail" class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-google">
      <div class="p-6 sm:p-10">
        <router-link to="/articles" class="mb-8 inline-flex items-center text-sm font-medium text-google-blue hover:underline">← 返回文章列表</router-link>

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-google-green">{{ articleDetail.category || '未分类' }}</p>
        <h1 class="mb-5 text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">{{ articleDetail.title }}</h1>
        <p v-if="articleDetail.summary" class="mb-6 text-lg leading-8 text-slate-600">{{ articleDetail.summary }}</p>

        <div class="mb-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>{{ formatDate(articleDetail.createdAt) }}</span>
          <span>预计 {{ articleDetail.readingTime || '3' }} 分钟阅读</span>
          <span>{{ likesCount }} 个赞</span>
        </div>

        <div class="mb-8 flex flex-wrap gap-2">
          <span v-for="tag in articleDetail.tags" :key="tag.id || tag.name" class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            {{ tag.name }}
          </span>
        </div>

        <div class="prose prose-lg max-w-none">
          <MarkdownView :content="articleDetail.content" />
        </div>
      </div>

      <div class="border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button @click="likeArticle" class="inline-flex items-center justify-center rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-google">
            {{ liked ? '已点赞' : '点赞' }} {{ likesCount }}
          </button>
          <router-link to="/write" class="text-sm font-medium text-slate-600 hover:text-google-blue">写一篇自己的文章 →</router-link>
        </div>
      </div>
    </article>

    <div v-else class="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-google">
      <p class="mb-6 text-slate-600">未找到文章</p>
      <router-link to="/articles" class="rounded-full bg-google-blue px-5 py-2.5 text-white">返回文章列表</router-link>
    </div>
  </div>
</template>

<script>
import { useArticle } from '@/composables/useArticle';
import { format } from '@/utils/format.js';
import MarkdownView from '@/components/article/MarkdownView.vue';
import Skeleton from '@/components/common/Skeleton.vue';

export default {
  name: 'ArticleDetail',
  components: {
    MarkdownView,
    Skeleton
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      ...useArticle()
    };
  },
  data() {
    return {
      liked: false,
      likesCount: 0
    };
  },
  methods: {
    formatDate(date) {
      return format.formatDate(date);
    },
    async fetchArticle() {
      try {
        await this.fetchArticleById(this.$route.params.id);
        this.likesCount = this.articleDetail?.likes || 0;
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
    },
    likeArticle() {
      this.liked = !this.liked;
      this.likesCount = this.liked ? this.likesCount + 1 : this.likesCount - 1;
    }
  },
  async created() {
    await this.fetchArticle();
  },
  watch: {
    '$route.params.id'() {
      this.resetArticleDetail();
      this.fetchArticle();
    }
  }
};
</script>
