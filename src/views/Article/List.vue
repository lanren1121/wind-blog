<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-google sm:p-8">
      <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-blue">Articles</p>
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {{ searchKeyword ? `搜索 “${searchKeyword}” 的结果` : '所有文章' }}
          </h1>
          <p class="mt-3 max-w-2xl text-slate-600">
            {{ searchKeyword ? '从标题、标签、分类和正文中查找匹配内容。' : '浏览风的博客里的技术笔记、项目复盘和长期思考。' }}
          </p>
        </div>

        <form class="w-full lg:w-96" @submit.prevent="submitSearch">
          <label class="rainbow-search flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 transition-all focus-within:border-transparent focus-within:bg-white focus-within:shadow-google">
            <svg class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input v-model="localSearch" type="search" placeholder="搜索文章" class="w-full bg-transparent outline-none" />
          </label>
        </form>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton v-for="n in 6" :key="n" type="rect" height="220px" />
    </div>

    <div v-else-if="articles.length === 0" class="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-slate-50 text-2xl">🔎</div>
      <h2 class="mb-2 text-xl font-semibold text-slate-900">没有找到匹配文章</h2>
      <p class="mb-6 text-slate-500">换一个关键词试试，或者写一篇新的文章。</p>
      <router-link to="/write" class="rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-google">
        去写文章
      </router-link>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
      </div>

      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn disabled:cursor-not-allowed disabled:opacity-40">
            上一页
          </button>
          <button
            v-for="page in getPageNumbers()"
            :key="page"
            @click="changePage(page)"
            :class="['page-btn', currentPage === page ? 'bg-google-blue text-white' : 'text-slate-600 hover:bg-slate-100']"
          >
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn disabled:cursor-not-allowed disabled:opacity-40">
            下一页
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ArticleCard from '@/components/article/ArticleCard.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import { useArticle } from '@/composables/useArticle';

export default {
  name: 'ArticleList',
  components: {
    ArticleCard,
    Skeleton
  },
  setup() {
    const { articles, loading, fetchArticles } = useArticle();

    return {
      articles,
      loading,
      fetchArticles
    };
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 9,
      total: 0,
      localSearch: this.$route.query.search || ''
    };
  },
  computed: {
    searchKeyword() {
      return this.$route.query.search || '';
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    }
  },
  async created() {
    await this.loadArticles();
  },
  methods: {
    async loadArticles() {
      try {
        const response = await this.fetchArticles({
          page: this.currentPage,
          limit: this.pageSize,
          search: this.searchKeyword
        });
        this.total = response.total || 0;
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
    },
    submitSearch() {
      const keyword = this.localSearch.trim();
      this.currentPage = 1;
      this.$router.push({ path: '/articles', query: keyword ? { search: keyword } : {} });
    },
    async changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      await this.loadArticles();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    getPageNumbers() {
      const pages = [];
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, this.currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  watch: {
    '$route.query.search'(value) {
      this.localSearch = value || '';
      this.currentPage = 1;
      this.loadArticles();
    }
  }
};
</script>

<style scoped>
.page-btn {
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
