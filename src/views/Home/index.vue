<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <section class="mx-auto flex min-h-[620px] max-w-5xl flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6">
      <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
        <span class="h-2 w-2 rounded-full bg-google-green"></span>
        思考、技术与项目的个人索引
      </div>

      <h1 class="mb-6 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl" aria-label="风的博客">
        <span class="text-google-blue">风</span><span class="text-google-red">的</span><span class="text-google-yellow">博</span><span class="text-google-green">客</span>
      </h1>

      <p class="mx-auto mb-8 max-w-2xl text-lg leading-8 text-slate-600">
        像搜索一样简单地找到我的想法：技术笔记、项目复盘、效率工具和长期思考。
      </p>

      <form class="w-full max-w-2xl" @submit.prevent="handleSearch">
        <label class="rainbow-search group flex h-16 items-center gap-4 rounded-full border border-slate-200 bg-white px-6 shadow-google transition-all duration-300 hover:shadow-google-lg focus-within:border-transparent focus-within:shadow-google-lg">
          <svg class="h-6 w-6 text-slate-400 transition-colors group-focus-within:text-google-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="搜索文章、标签或关键词..."
            class="h-full flex-1 bg-transparent text-lg text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>
      </form>

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button v-for="chip in chips" :key="chip" class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-google-blue hover:text-google-blue" @click="quickSearch(chip)">
          {{ chip }}
        </button>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-blue">Latest</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">最新文章</h2>
        </div>
        <router-link to="/articles" class="inline-flex items-center text-sm font-medium text-google-blue hover:underline">
          查看全部文章
          <span class="ml-1">→</span>
        </router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton v-for="n in 6" :key="n" type="rect" height="220px" />
      </div>
      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="article in articles.slice(0, 6)" :key="article.id" :article="article" />
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-google sm:p-8">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-green">Popular</p>
            <h2 class="text-2xl font-semibold text-slate-900">热门文章</h2>
          </div>
          <router-link to="/write" class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-google">
            发布新文章
          </router-link>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <router-link
            v-for="(article, index) in hotArticles"
            :key="article.id"
            :to="`/article/${article.id}`"
            class="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-google"
          >
            <span class="grid h-10 w-10 place-items-center rounded-full bg-slate-50 text-sm font-semibold text-slate-500">#{{ index + 1 }}</span>
            <div class="min-w-0 text-left">
              <h3 class="truncate font-medium text-slate-900">{{ article.title }}</h3>
              <p class="text-sm text-slate-500">{{ formatDate(article.createdAt) }} · {{ article.readingTime || 3 }} 分钟阅读</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ArticleCard from '@/components/article/ArticleCard.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import { useArticle } from '@/composables/useArticle';
import { format } from '@/utils/format.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  components: {
    ArticleCard,
    Skeleton
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const chips = ['Vue', 'Java', '项目复盘', '效率工具'];
    const { articles, hotArticles, loading, fetchArticles, fetchHotArticles } = useArticle();

    const handleSearch = () => {
      const keyword = searchQuery.value.trim();
      if (!keyword) return;
      router.push({ path: '/articles', query: { search: keyword } });
    };

    const quickSearch = (keyword) => {
      router.push({ path: '/articles', query: { search: keyword } });
    };

    return {
      articles,
      hotArticles,
      loading,
      fetchArticles,
      fetchHotArticles,
      searchQuery,
      chips,
      handleSearch,
      quickSearch
    };
  },
  async created() {
    await this.fetchArticles({ limit: 6 });
    await this.fetchHotArticles();
  },
  methods: {
    formatDate(date) {
      return format.formatDate(date);
    }
  }
};
</script>
