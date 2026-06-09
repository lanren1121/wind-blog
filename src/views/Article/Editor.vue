<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div class="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-google-green">Write</p>
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">发布一篇新文章</h1>
        <p class="mt-3 max-w-2xl text-slate-600">文章会保存为 GitHub 仓库里的 JSON 数据；本地图片会自动上传到 blog-img 图床。</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button class="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-google" @click="resetDraft">
          清空草稿
        </button>
        <button class="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-google" @click="saveLocalPreview" :disabled="loading">
          本地预览
        </button>
        <button class="rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-google" @click="publishRemote" :disabled="loading || imageUploading">
          {{ loading ? '发布中...' : '保存到 GitHub JSON' }}
        </button>
      </div>
    </div>

    <div v-if="notice" class="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {{ notice }}
    </div>
    <div v-if="errorMessage" class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-google sm:p-6">
        <div class="grid gap-4">
          <label class="field-label">
            管理员密码
            <input v-model="adminPassword" type="password" class="field-input" placeholder="Cloudflare 环境变量 ADMIN_PASSWORD" />
            <span class="text-xs font-normal text-slate-500">只在调用 Cloudflare Function 时作为请求头发送，不会写入文章 JSON。</span>
          </label>

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
            <input v-model="form.coverImage" class="field-input" placeholder="https://cdn.jsdelivr.net/gh/lanren1121/blog-img@main/images/..." />
          </label>

          <label class="field-label rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            本地图片上传到 blog-img 图床
            <input type="file" accept="image/*" class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-google-blue file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" @change="uploadImage" />
            <span class="text-xs font-normal text-slate-500">上传成功后会自动把 Markdown 图片语法插入正文，并记录关联图片；删除文章时只删除这些关联图片。</span>
            <span v-if="imageUploading" class="text-sm font-normal text-google-blue">图片上传中...</span>
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
          <div v-if="form.imagePaths.length" class="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
            已关联 {{ form.imagePaths.length }} 张图床图片
          </div>
        </div>
        <MarkdownView :content="form.content || emptyPreview" />
      </aside>
    </div>
  </div>
</template>

<script>
import MarkdownView from '@/components/article/MarkdownView.vue';
import { publishArticleToGitHub, uploadImageToGitHub } from '@/api/article';
import { useArticle } from '@/composables/useArticle';
import { clearDraft, getDraft, saveDraft } from '@/utils/articleStorage';

const slugify = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9一-龥]+/g, '-')
  .replace(/^-+|-+$/g, '') || `article-${Date.now().toString(36)}`;

const defaultForm = () => ({
  id: '',
  title: '',
  summary: '',
  category: '技术',
  tags: 'Vue, 个人博客',
  coverImage: '',
  content: '# 新文章\n\n在这里写下你的想法。\n\n## 小标题\n\n- 支持 Markdown\n- 图片会上传到 GitHub 图床\n- 文章会保存到 GitHub JSON\n',
  imagePaths: []
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
      adminPassword: '',
      errorMessage: '',
      notice: '',
      imageUploading: false,
      emptyPreview: '开始输入 Markdown 后，这里会显示实时预览。'
    };
  },
  computed: {
    articleId() {
      return this.form.id || slugify(this.form.title);
    },
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
      this.form = { ...defaultForm(), ...draft, imagePaths: draft.imagePaths || [] };
    }
  },
  methods: {
    buildArticle() {
      const now = new Date().toISOString();
      return {
        ...this.form,
        id: this.articleId,
        tags: this.previewTags,
        likes: 0,
        createdAt: this.form.createdAt || now,
        updatedAt: now,
        readingTime: this.readingTime
      };
    },
    validateArticle(requirePassword = false) {
      this.errorMessage = '';
      this.notice = '';
      if (!this.form.title.trim()) {
        this.errorMessage = '请先填写文章标题。';
        return false;
      }
      if (!this.form.content.trim()) {
        this.errorMessage = '请先填写文章正文。';
        return false;
      }
      if (requirePassword && !this.adminPassword) {
        this.errorMessage = '请填写管理员密码。';
        return false;
      }
      return true;
    },
    async uploadImage(event) {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      this.errorMessage = '';
      this.notice = '';
      if (!this.adminPassword) {
        this.errorMessage = '上传图片前请先填写管理员密码。';
        return;
      }

      this.imageUploading = true;
      try {
        const result = await uploadImageToGitHub({ file, articleId: this.articleId, password: this.adminPassword });
        this.form.content = `${this.form.content.trim()}\n\n${result.markdown}\n`;
        this.form.imagePaths = Array.from(new Set([...(this.form.imagePaths || []), result.path]));
        if (!this.form.coverImage) this.form.coverImage = result.url;
        this.notice = `图片已上传：${result.path}`;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.imageUploading = false;
      }
    },
    async saveLocalPreview() {
      if (!this.validateArticle(false)) return;
      const article = await this.publishArticle({ ...this.buildArticle(), localOnly: true });
      this.$router.push(`/article/${article.id}`);
    },
    async publishRemote() {
      if (!this.validateArticle(true)) return;
      try {
        const article = await publishArticleToGitHub(this.buildArticle(), this.adminPassword);
        await this.publishArticle({ ...article, localOnly: false });
        this.notice = '文章已保存到 GitHub JSON。Cloudflare Pages 会自动重新部署，稍等片刻线上可见。';
        this.$router.push(`/article/${article.id}`);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    resetDraft() {
      clearDraft();
      this.form = defaultForm();
      this.errorMessage = '';
      this.notice = '';
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
