<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <section class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-google">
      <div class="bg-slate-50 px-6 py-10 sm:px-10">
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-google-blue">Profile</p>
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">个人中心</h1>
        <p class="mt-3 max-w-2xl text-slate-600">这里会显示当前登录账号信息，后续可以继续扩展收藏、评论、文章管理等功能。</p>
      </div>

      <div class="p-6 sm:p-10">
        <div v-if="authLoading" class="rounded-2xl bg-slate-50 p-6 text-slate-500">
          正在读取登录状态...
        </div>

        <div v-else-if="currentUser" class="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div class="flex flex-col items-center rounded-3xl bg-slate-50 p-6 text-center">
            <div class="grid h-24 w-24 place-items-center rounded-full bg-white text-3xl font-semibold text-google-blue shadow-sm ring-1 ring-slate-200">
              {{ avatarText }}
            </div>
            <h2 class="mt-4 text-xl font-semibold text-slate-900">{{ currentUser.nickname }}</h2>
            <p class="mt-1 break-all text-sm text-slate-500">{{ currentUser.email }}</p>
          </div>

          <div class="grid gap-4">
            <div class="rounded-3xl border border-slate-200 p-5">
              <p class="text-sm text-slate-500">用户 ID</p>
              <p class="mt-2 break-all font-mono text-sm text-slate-700">{{ currentUser.id }}</p>
            </div>
            <div class="rounded-3xl border border-slate-200 p-5">
              <p class="text-sm text-slate-500">注册时间</p>
              <p class="mt-2 text-slate-700">{{ formatDate(currentUser.createdAt) }}</p>
            </div>
            <div class="rounded-3xl border border-slate-200 p-5">
              <p class="text-sm text-slate-500">账号能力</p>
              <p class="mt-2 text-slate-700">已支持邮箱登录。文章发布仍由管理员密码保护，避免普通账号直接写入 GitHub 仓库。</p>
            </div>

            <div class="flex flex-wrap gap-3 pt-2">
              <router-link to="/write" class="rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-google">
                去写文章
              </router-link>
              <button class="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:shadow-google" @click="handleLogout">
                退出登录
              </button>
            </div>
          </div>
        </div>

        <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p class="text-slate-600">你还没有登录。</p>
          <div class="mt-5 flex justify-center gap-3">
            <router-link to="/login" class="rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white">登录</router-link>
            <router-link to="/register" class="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-google-blue">注册</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';
import { format } from '@/utils/format.js';

export default {
  name: 'ProfileView',
  setup() {
    return {
      ...useAuth()
    };
  },
  computed: {
    avatarText() {
      const source = this.currentUser?.nickname || this.currentUser?.email || '风';
      return source.slice(0, 1).toUpperCase();
    }
  },
  async created() {
    try {
      await this.loadCurrentUser({ force: true });
    } catch {
      // Keep profile page usable even when Cloudflare auth is not configured locally.
    }
  },
  methods: {
    formatDate(date) {
      return date ? format.formatDate(date) : '未知';
    },
    async handleLogout() {
      await this.logoutUser();
      this.$router.push('/login');
    }
  }
};
</script>
