import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const DEFAULT_TEMPLATE = `---
title: "论文标题"
author: "连锦东"
date: "${new Date().toISOString().slice(0, 10)}"
abstract: "本文研究了..."
keywords:
  - 关键词1
  - 关键词2
---

## 摘要

在这里写论文摘要...

## 引言

正文内容...

## 相关工作

## 方法

## 实验

## 结论

## 参考文献

1. 作者, "论文标题", 期刊/会议, 年份.
2. 作者, "论文标题", 期刊/会议, 年份.
`

export default function Writing() {
  const [content, setContent] = useState(DEFAULT_TEMPLATE)
  const [preview, setPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExport = useCallback(() => {
    window.print()
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [content])

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-forest-800 mb-1">📄 论文写作</h1>
          <p className="text-sm text-forest-500">Markdown 写作 · 学术排版 · 实时预览</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-full text-sm bg-white border border-forest-200 text-forest-600 hover:bg-forest-50 transition-all"
          >
            {copied ? '已复制!' : '📋 复制'}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-full text-sm bg-forest-500 text-white hover:bg-forest-600 transition-all shadow-md"
          >
            📥 导出 PDF
          </button>
          <button
            onClick={() => setPreview(!preview)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              preview
                ? 'bg-forest-100 text-forest-700'
                : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'
            }`}
          >
            {preview ? '✏️ 编辑' : '👁 预览'}
          </button>
        </div>
      </div>

      <div className={`${preview ? '' : 'grid grid-cols-2 gap-6'}`}>
        {!preview && (
          <div className="glass-card p-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="editor-textarea min-h-[600px]"
              placeholder="在这里写 Markdown..."
            />
            <div className="px-6 pb-4 flex gap-4 text-xs text-forest-400">
              <span>**加粗**</span>
              <span>*斜体*</span>
              <span># 标题</span>
              <span>`代码`</span>
              <span>[链接](url)</span>
              <span>![图片](url)</span>
            </div>
          </div>
        )}

        <div className={`glass-card p-8 ${preview ? 'max-w-3xl mx-auto' : ''}`}>
          <div className="prose print:max-w-none print:text-black print:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
