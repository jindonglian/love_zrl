import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchNotes, createNote, updateNote, deleteNote } from '../lib/db.ts'
import type { Note } from '../lib/db.ts'

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => { loadNotes() }, [])

  async function loadNotes() {
    setLoading(true)
    const data = await fetchNotes()
    setNotes(data)
    setLoading(false)
  }

  function startNew() {
    setEditing(null)
    setTitle('')
    setContent('')
    setTags('')
    setPreview(false)
  }

  function startEdit(note: Note) {
    setEditing(note)
    setTitle(note.title)
    setContent(note.content)
    setTags((note.tags || []).join(', '))
    setPreview(false)
  }

  async function handleSave() {
    if (!title) return
    const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    if (editing) {
      await updateNote(editing.id, { title, content, tags: tagList })
    } else {
      await createNote({ title, content, tags: tagList, parent_id: null })
    }
    startNew()
    loadNotes()
  }

  async function handleDelete(id: number) {
    if (!confirm('确认删除？')) return
    await deleteNote(id)
    if (editing?.id === id) startNew()
    loadNotes()
  }

  const isEditing = !!editing || (title || content)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-forest-800">📒 学习笔记</h1>
        <div className="flex gap-2">
          {isEditing && (
            <button onClick={() => { startNew(); setPreview(false) }} className="text-sm bg-forest-100 text-forest-600 px-4 py-2 rounded-full hover:bg-forest-200 transition-colors">
              取消
            </button>
          )}
          <button onClick={() => { if (!isEditing) startNew() }} className="text-sm bg-forest-500 text-white px-4 py-2 rounded-full hover:bg-forest-600 transition-colors shadow-md">
            {isEditing ? '' : '+ '}新笔记
          </button>
        </div>
      </div>
      <p className="text-forest-500 mb-8">记录知识的积累</p>

      {/* Editor */}
      {(isEditing) && (
        <div className="glass-card p-6 mb-8 space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="笔记标题" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 font-medium" />
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="标签，逗号分隔" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 text-sm" />
          <div className="flex gap-2 mb-1">
            <button onClick={() => setPreview(false)} className={`text-xs px-3 py-1 rounded-full ${!preview ? 'bg-forest-500 text-white' : 'bg-forest-50 text-forest-500'}`}>编辑</button>
            <button onClick={() => setPreview(true)} className={`text-xs px-3 py-1 rounded-full ${preview ? 'bg-forest-500 text-white' : 'bg-forest-50 text-forest-500'}`}>预览</button>
          </div>
          {preview ? (
            <div className="prose p-4 bg-forest-50 rounded-xl min-h-[200px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          ) : (
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="正文（支持 Markdown、代码块）..." rows={12} className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 resize-y" />
          )}
          <button onClick={handleSave} disabled={!title} className="bg-forest-500 text-white px-6 py-2 rounded-full hover:bg-forest-600 transition-colors disabled:opacity-50 shadow-md">
            {editing ? '保存修改' : '创建笔记'}
          </button>
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <p className="text-forest-400 text-sm">加载中...</p>
      ) : notes.length === 0 ? (
        <p className="text-forest-400 text-sm">还没有笔记，开始记录吧。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note.id} className="glass-card p-5 group hover:shadow-md transition-all cursor-pointer" onClick={() => startEdit(note)}>
              <h3 className="font-bold text-forest-800 group-hover:text-forest-600 transition-colors">{note.title}</h3>
              <p className="text-xs text-forest-400 mt-1">{new Date(note.created_at).toLocaleDateString('zh-CN')}</p>
              <p className="text-sm text-forest-500 mt-2 line-clamp-3">{note.content.slice(0, 150)}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {note.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-forest-50 text-forest-500 rounded-full">{t}</span>)}
                </div>
              )}
              <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }} className="mt-3 text-xs text-forest-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">删除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
