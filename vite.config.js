import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), cloudflare()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  // 添加环境变量支持
  envDir: '.',
  // 服务器配置
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true, // 自动打开浏览器
  },
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) return 'vendor';
            if (id.includes('gsap') || id.includes('markdown-it') || id.includes('highlight.js')) return 'utils';
          }
        }
      }
    }
  }
})