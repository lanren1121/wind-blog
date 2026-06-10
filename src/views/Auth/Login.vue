<template>
  <div class="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
    <section class="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-google lg:grid-cols-[0.9fr_1.1fr]">
      <div class="hidden bg-slate-50 p-10 lg:block">
        <p class="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-google-blue">Login</p>
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900">欢迎回到风的博客</h1>
        <p class="mt-4 leading-8 text-slate-600">登录后可以保留你的会员身份，后续可扩展评论、收藏、个人中心等功能。</p>
        <div class="mt-10 rounded-3xl bg-white p-6 text-sm leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200">
          当前文章发布仍使用管理员密码保护；邮箱登录是独立的用户账号系统。
        </div>
      </div>

      <form class="p-6 sm:p-10" @submit.prevent="submit">
        <div class="mb-8 lg:hidden">
          <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-blue">Login</p>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900">登录账号</h1>
        </div>

        <div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <div class="grid gap-5">
          <label class="field-label">
            邮箱
            <input v-model="form.email" type="email" autocomplete="email" class="field-input" placeholder="you@example.com" />
          </label>

          <label class="field-label">
            密码
            <input v-model="form.password" type="password" autocomplete="current-password" class="field-input" placeholder="至少 8 位" />
          </label>
        </div>

        <button class="mt-8 w-full rounded-full bg-google-blue px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-google disabled:cursor-not-allowed disabled:opacity-60" :disabled="authLoading">
          {{ authLoading ? '登录中...' : '登录' }}
        </button>

        <p class="mt-6 text-center text-sm text-slate-500">
          还没有账号？
          <router-link to="/register" class="font-medium text-google-blue hover:underline">去注册</router-link>
        </p>
      </form>
    </section>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'LoginView',
  setup() {
    return {
      ...useAuth()
    };
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async submit() {
      this.errorMessage = '';
      if (!this.form.email.trim() || !this.form.password) {
        this.errorMessage = '请填写邮箱和密码。';
        return;
      }

      try {
        await this.loginUser(this.form);
        this.$router.push('/profile');
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style scoped>
.field-label {
  display: grid;
  gap: 0.5rem;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
}

.field-input {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 0.875rem 1rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input:focus {
  border-color: #4285f4;
  background: #fff;
  box-shadow: 0 8px 30px rgba(66, 133, 244, 0.14);
}
</style>
