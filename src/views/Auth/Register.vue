<template>
  <div class="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
    <section class="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-google lg:grid-cols-[0.9fr_1.1fr]">
      <div class="hidden bg-slate-50 p-10 lg:block">
        <p class="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-google-green">Register</p>
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900">创建邮箱账号</h1>
        <p class="mt-4 leading-8 text-slate-600">账号数据会保存在 Cloudflare KV，不需要传统服务器，也不会影响现有 GitHub JSON 文章存储。</p>
        <div class="mt-10 grid gap-3 text-sm text-slate-600">
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">密码会加盐哈希保存，不保存明文。</div>
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">登录状态使用 HttpOnly Cookie，更安全。</div>
        </div>
      </div>

      <form class="p-6 sm:p-10" @submit.prevent="submit">
        <div class="mb-8 lg:hidden">
          <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-green">Register</p>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900">注册账号</h1>
        </div>

        <div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <div class="grid gap-5">
          <label class="field-label">
            昵称
            <input v-model="form.nickname" maxlength="24" class="field-input" placeholder="风的朋友" />
          </label>

          <label class="field-label">
            邮箱
            <input v-model="form.email" type="email" autocomplete="email" class="field-input" placeholder="you@example.com" />
          </label>

          <label class="field-label">
            密码
            <input v-model="form.password" type="password" autocomplete="new-password" class="field-input" placeholder="至少 8 位" />
          </label>

          <label class="field-label">
            确认密码
            <input v-model="confirmPassword" type="password" autocomplete="new-password" class="field-input" placeholder="再次输入密码" />
          </label>
        </div>

        <button class="mt-8 w-full rounded-full bg-google-blue px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-google disabled:cursor-not-allowed disabled:opacity-60" :disabled="authLoading">
          {{ authLoading ? '注册中...' : '注册' }}
        </button>

        <p class="mt-6 text-center text-sm text-slate-500">
          已经有账号？
          <router-link to="/login" class="font-medium text-google-blue hover:underline">去登录</router-link>
        </p>
      </form>
    </section>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'RegisterView',
  setup() {
    return {
      ...useAuth()
    };
  },
  data() {
    return {
      form: {
        nickname: '',
        email: '',
        password: ''
      },
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    validate() {
      if (!this.form.email.trim()) return '请填写邮箱。';
      if (this.form.password.length < 8) return '密码至少需要 8 位。';
      if (this.form.password !== this.confirmPassword) return '两次输入的密码不一致。';
      return '';
    },
    async submit() {
      this.errorMessage = this.validate();
      if (this.errorMessage) return;

      try {
        await this.registerUser(this.form);
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
