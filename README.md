# 风的博客

一个 Google 风格的个人博客，使用 Vue 3 + Vite + TailwindCSS 构建。

## 数据方案

本项目不使用 SQL 数据库：

- 文章：`src/content/articles/*.md`
- 草稿：浏览器 `localStorage`
- 图片：GitHub 图床仓库 `lanren1121/blog-img`
- 视频：B站嵌入
- 评论：暂不启用

## 写文章

在 `src/content/articles/` 下新增 Markdown 文件：

```markdown
---
title: 文章标题
summary: 文章摘要
category: 技术
tags: Vue, 博客
createdAt: 2026-06-09T10:00:00.000Z
likes: 0
coverImage: https://cdn.jsdelivr.net/gh/lanren1121/blog-img@main/images/2026/example.png
---

# 文章标题

正文内容。
```

## 图片图床

图片放到公开仓库：

```text
https://github.com/lanren1121/blog-img
```

建议目录：

```text
images/
  2026/
    cover.png
```

文章中引用：

```markdown
![图片说明](https://cdn.jsdelivr.net/gh/lanren1121/blog-img@main/images/2026/cover.png)
```

## B站视频嵌入

文章中可以直接写 iframe：

```html
<iframe src="https://player.bilibili.com/player.html?bvid=BVxxxxxx&page=1" allowfullscreen></iframe>
```

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

推送到 GitHub 仓库 `lanren1121/wind-blog` 的 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

网站地址通常是：

```text
https://lanren1121.github.io/wind-blog/
```
