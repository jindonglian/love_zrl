# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人网站 / 博客，Vite + React 19 + TypeScript 构建，Tailwind CSS v4 样式，React Router v7 路由。Markdown 博客系统用 gray-matter 解析 front-matter，react-markdown + remark-gfm 渲染。构建产物部署到 GitHub Pages。

## 命令

```bash
npm run dev      # 开发服务器
npm run build    # tsc 类型检查 + vite 构建到 dist/
npm run preview  # 预览构建产物
npm run lint     # eslint 检查
```

## 目录结构

```
src/
├── components/   # Layout, Header, Footer
├── pages/        # Home, About, PostList, PostDetail
├── content/      # *.md 博客文章（自动被 import.meta.glob 扫描）
├── utils/        # loadPosts.ts — Markdown 加载 + front-matter 解析
├── App.tsx       # 路由定义
├── main.tsx      # 入口，BrowserRouter
└── index.css     # Tailwind import + prose 样式
```

## 博客文章

文章放在 `src/content/*.md`，文件名即 URL slug。需要 front-matter：

```markdown
---
title: "文章标题"
date: "2026-01-01"
description: "文章摘要（可选）"
tags:
  - tag1
  - tag2
---
```

`loadPosts.ts` 在模块顶层用 `import.meta.glob('/src/content/*.md', { query: '?raw' })` 预加载所有文章，导出同步函数 `getAllPosts()` 和 `getPostBySlug()`。

## TypeScript 约束

`tsconfig.app.json` 开启了：
- `verbatimModuleSyntax: true` — 类型 import 必须用 `import type`，不可省略
- `noUnusedLocals / noUnusedParameters: true` — 无用的变量/参数会报错
- `erasableSyntaxOnly: true` — 不能用 enum、namespace 等不可擦除语法

## Vite 配置

`vite.config.ts` 使用 `@vitejs/plugin-react` 和 `@tailwindcss/vite`。`tsconfig.app.json` 中 `"types": ["vite/client"]` 提供了 `import.meta.glob` 的类型。
