<template>
  <nav class="fixed top-0 w-full z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <router-link to="/" class="flex items-center gap-3" aria-label="返回首页">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-white shadow-google ring-1 ring-slate-200">
          <span class="google-dots-mini" aria-hidden="true"></span>
        </span>
        <span class="text-lg font-semibold tracking-tight text-slate-900">风的博客</span>
      </router-link>

      <div class="hidden items-center gap-1 md:flex">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </router-link>
      </div>

      <div class="flex items-center gap-3">
        <form class="hidden md:block" @submit.prevent="handleSearch">
          <label class="rainbow-search flex h-10 w-64 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm shadow-sm transition-all duration-200 focus-within:w-72 focus-within:border-transparent focus-within:bg-white focus-within:shadow-google">
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="搜索文章"
              class="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </form>

        <router-link to="/write" class="hidden rounded-full bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-google md:inline-flex">
          写文章
        </router-link>

        <div class="hidden items-center gap-2 md:flex">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="max-w-32 truncate rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-200">
              {{ currentUser.nickname || currentUser.email }}
            </router-link>
            <button class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:shadow-google" @click="handleLogout">
              退出
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              登录
            </router-link>
            <router-link to="/register" class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-google-blue transition hover:shadow-google">
              注册
            </router-link>
          </template>
        </div>

        <button class="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden" @click="mobileOpen = !mobileOpen" aria-label="打开菜单">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
      <form class="mb-3" @submit.prevent="handleSearch">
        <label class="rainbow-search flex w-full items-center rounded-full border border-slate-200 bg-white px-4 py-3">
          <input v-model="searchQuery" type="search" placeholder="搜索文章" class="w-full bg-transparent outline-none" />
        </label>
      </form>
      <div class="grid gap-1">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50" @click="mobileOpen = false">
          {{ item.label }}
        </router-link>
        <router-link to="/write" class="mt-2 rounded-full bg-google-blue px-4 py-2 text-center text-white" @click="mobileOpen = false">
          写文章
        </router-link>
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600" @click="mobileOpen = false">
            {{ currentUser.nickname || currentUser.email }}
          </router-link>
          <button class="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700" @click="handleLogout">
            退出登录
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50" @click="mobileOpen = false">
            登录
          </router-link>
          <router-link to="/register" class="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-google-blue" @click="mobileOpen = false">
            注册
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const mobileOpen = ref(false);
    const {
      currentUser,
      isLoggedIn,
      loadCurrentUser,
      logoutUser
    } = useAuth();
    const navItems = [
      { label: '首页', to: '/' },
      { label: '文章', to: '/articles' },
      { label: '分类', to: '/category' },
      { label: '标签', to: '/tag' },
      { label: '关于', to: '/about' }
    ];

    const handleSearch = () => {
      const keyword = searchQuery.value.trim();
      if (!keyword) return;
      mobileOpen.value = false;
      router.push({ path: '/articles', query: { search: keyword } });
    };

    const handleLogout = async () => {
      await logoutUser();
      mobileOpen.value = false;
      router.push('/');
    };

    onMounted(() => {
      loadCurrentUser().catch(() => {});
    });

    return {
      navItems,
      searchQuery,
      mobileOpen,
      currentUser,
      isLoggedIn,
      handleSearch,
      handleLogout
    };
  }
};
</script>
