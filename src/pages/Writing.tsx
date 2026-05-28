import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchWritingDrafts, createWritingDraft, updateWritingDraft, deleteWritingDraft } from '../lib/db.ts'
import type { WritingDraft } from '../lib/db.ts'

export default function Writing() {
  const [drafts, setDrafts] = useState<WritingDraft[]>([])
  const [active, setActive] = useState<WritingDraft | null>(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { loadDrafts() }, [])

  async function loadDrafts() {
    setLoading(true)
    const data = await fetchWritingDrafts()
    setDrafts(data)
    setLoading(false)
  }

  async function handleNew() {
    const draft = await createWritingDraft('未命名草稿', '')
    if (draft) { setActive(draft); setTitle(draft.title); setContent(draft.content); loadDrafts() }
  }

  function selectDraft(d: WritingDraft) {
    setActive(d); setTitle(d.title); setContent(d.content); setPreview(false)
  }

  async function handleSave() {
    if (!active) return
    await updateWritingDraft(active.id, { title: title || '未命名草稿', content })
    showMsg('已保存')
    loadDrafts()
  }

  async function handleDelete(id: number) {
    if (!confirm('删除这个草稿？')) return
    await deleteWritingDraft(id)
    if (active?.id === id) { setActive(null); setTitle(''); setContent('') }
    showMsg('已删除')
    loadDrafts()
  }

  const handleExport = useCallback(() => { window.print() }, [])
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }, [content])

  function showMsg(m: string) { setMsg(m); setTimeout(() => setMsg(''), 2000) }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-forest-800">📄 论文写作</h1>
          <p className="text-sm text-forest-500">Markdown 写作 · 云端保存 · 导出 PDF</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleNew} className="text-sm bg-forest-500 text-white px-4 py-2 rounded-full hover:bg-forest-600 transition-colors shadow-md">+ 新草稿</button>
        </div>
      </div>
      {msg && <p className="text-sm text-forest-500 bg-forest-50 inline-block px-4 py-1 rounded-full mb-4">{msg}</p>}

      {/* Draft list */}
      {loading ? <p className="text-forest-400 text-sm">加载中...</p> : drafts.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {drafts.map(d => (
            <button key={d.id} onClick={() => selectDraft(d)} className={`px-4 py-2 rounded-full text-sm transition-all ${active?.id === d.id ? 'bg-forest-500 text-white shadow-md' : 'bg-white text-forest-600 hover:bg-forest-50 border border-forest-100'}`}>
              {d.title}
              <span onClick={(e) => { e.stopPropagation(); handleDelete(d.id) }} className="ml-1 text-red-400 hover:text-red-600">×</span>
            </button>
          ))}
        </div>
      )}

      {active ? (
        <div className="flex items-center gap-2 mb-4">
          <input value={title} onChange={e => setTitle(e.target.value)} className="text-xl font-bold text-forest-800 bg-transparent border-none outline-none flex-1" />
          <button onClick={handleSave} className="px-4 py-2 rounded-full text-sm bg-forest-500 text-white hover:bg-forest-600 transition-colors shadow-md">保存</button>
          <button onClick={handleCopy} className="px-4 py-2 rounded-full text-sm bg-white border border-forest-200 text-forest-600 hover:bg-forest-50">{copied ? '已复制!' : '复制'}</button>
          <button onClick={handleExport} className="px-4 py-2 rounded-full text-sm bg-sun-400 text-white hover:bg-sun-500 transition-colors shadow-md">导出 PDF</button>
          <button onClick={() => setPreview(!preview)} className={`px-4 py-2 rounded-full text-sm ${preview ? 'bg-forest-100 text-forest-700' : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'}`}>{preview ? '编辑' : '预览'}</button>
        </div>
      ) : (
        <p className="text-forest-400 text-sm">点击"+ 新草稿"开始写作。</p>
      )}

      {active && (
        <div className={preview ? '' : 'grid grid-cols-2 gap-6'}>
          {!preview && (
            <div className="glass-card p-2">
              <textarea value={content} onChange={e => setContent(e.target.value)} className="editor-textarea min-h-[600px]" placeholder="写 Markdown..." />
              <div className="px-6 pb-4 flex gap-4 text-xs text-forest-400">
                <span>**加粗**</span><span>*斜体*</span><span># 标题</span><span>`代码`</span><span>[链接](url)</span>
              </div>
            </div>
          )}
          <div className={`glass-card p-8 ${preview ? 'max-w-3xl mx-auto' : ''}`}>
            <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></div>
          </div>
        </div>
      )}
    </div>
  )
}
