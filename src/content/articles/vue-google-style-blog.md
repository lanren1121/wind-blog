---
title: 用 Vue 打造 Google 风格个人博客
summary: 从视觉语言、搜索入口、卡片动效和内容发布四个角度重构博客体验。
category: 技术
tags: Vue, TailwindCSS, 设计系统
createdAt: 2026-06-08T16:20:00.000Z
likes: 42
---

# 用 Vue 打造 Google 风格个人博客

Google 风格不等于复制 Google 首页，而是学习它的产品原则：清晰、快速、克制、可靠。

## 关键点

1. 搜索优先：让用户先找到内容。
2. 留白充足：减少视觉噪声。
3. 动效轻盈：使用 `cubic-bezier(0.4, 0, 0.2, 1)`。
4. 内容可持续发布：编辑、预览、保存、发布形成闭环。

`Vue + Vite + TailwindCSS` 很适合快速实现这个方向。
