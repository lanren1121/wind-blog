<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div class="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-green">Write</p>
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">发布一篇新文章</h1>
        <p class="mt-3 max-w-2xl text-slate-600">使用 Markdown 写作，右侧实时预览。草稿会自动保存在当前浏览器。</p>
      </div>
      <div class="flex gap-3">
        <button class="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-google" @click="resetDraft">
          清空草稿
        </button>
        <button class="rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-google" @click="publish" :disabled="loading">
          {{ loading ? '发布中...' : '发布文章' }}
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-google sm:p-6">
        <div class="grid gap-4">
          <label class="field-label">
            标题
            <input v-model="form.title" class="field-input" placeholder="输入一个清晰、有搜索价值的标题" />
          </label>

          <label class="field-label">
            摘要
            <textarea v-model="form.summary" rows="3" class="field-input resize-none" placeholder="用一两句话说明这篇文章解决什么问题"></textarea>
          </label>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="field-label">
              分类
              <input v-model="form.category" class="field-input" placeholder="技术 / 随笔 / 项目" />
            </label>
            <label class="field-label">
              标签
              <input v-model="form.tags" class="field-input" placeholder="Vue, Java, 项目复盘" />
            </label>
          </div>

          <label class="field-label">
            封面图 URL（可选）
            <input v-model="form.coverImage" class="field-input" placeholder="https://..." />
          </label>

          <label class="field-label">
            Markdown 正文
            <textarea v-model="form.content" rows="18" class="field-input font-mono text-sm leading-7" placeholder="# 标题\n\n开始写作..."></textarea>
          </label>
        </div>
      </section>

      <aside class="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-google sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
        <div class="mb-5 border-b border-slate-100 pb-5">
          <p class="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-google-blue">Preview</p>
          <h2 class="text-2xl font-semibold text-slate-900">{{ form.title || '文章标题预览' }}</h2>
          <p class="mt-2 text-sm text-slate-500">{{ form.category || '未分类' }} · 预计 {{ readingTime }} 分钟阅读</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="tag in previewTags" :key="tag" class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{{ tag }}</span>
          </div>
        </div>
        <MarkdownView :content="form.content || emptyPreview" />
      </aside>
    </div>
  </div>
</template>

<script>
import MarkdownView from '@/components/article/MarkdownView.vue';
import { useArticle } from '@/composables/useArticle';
import { clearDraft, getDraft, saveDraft } from '@/utils/articleStorage';

const defaultForm = () => ({
  title: '',
  summary: '',
  category: '技术',
  tags: 'Vue, 个人博客',
  coverImage: '',
  content: '# 新文章\n\n在这里写下你的想法。\n\n## 小标题\n\n- 支持 Markdown\n- 支持实时预览\n- 发布后会保存到当前浏览器\n'
});

export default {
  name: 'ArticleEditor',
  components: {
    MarkdownView
  },
  setup() {
    return {
      ...useArticle()
    };
  },
  data() {
    return {
      form: defaultForm(),
      errorMessage: '',
      emptyPreview: '开始输入 Markdown 后，这里会显示实时预览。'
    };
  },
  computed: {
    previewTags() {
      return this.form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    },
    readingTime() {
      const content = this.form.content || '';
      const chineseChars = (content.match(/[一-龥]/g) || []).length;
      const words = (content.replace(/[一-龥]/g, ' ').match(/\b\w+\b/g) || []).length;
      return Math.max(1, Math.ceil(chineseChars / 350 + words / 220));
    }
  },
  created() {
    const draft = getDraft();
    if (draft) {
      this.form = { ...defaultForm(), ...draft };
    }
  },
  methods: {
    async publish() {
      this.errorMessage = '';
      if (!this.form.title.trim()) {
        this.errorMessage = '请先填写文章标题。';
        return;
      }
      if (!this.form.content.trim()) {
        this.errorMessage = '请先填写文章正文。';
        return;
      }

      const article = await this.publishArticle(this.form);
      this.$router.push(`/article/${article.id}`);
    },
    resetDraft() {
      clearDraft();
      this.form = defaultForm();
      this.errorMessage = '';
    }
  },
  watch: {
    form: {
      deep: true,
      handler(value) {
        saveDraft(value);
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
