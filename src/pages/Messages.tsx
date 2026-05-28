import { useState, useEffect } from 'react'
import { fetchMessages, createMessage } from '../lib/db.ts'
import type { Message } from '../lib/db.ts'

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await fetchMessages()
    setMessages(data)
    setLoading(false)
  }

  async function handleSend() {
    if (!author.trim() || !content.trim()) return
    await createMessage(author.trim(), content.trim())
    setContent('')
    load()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-forest-800 mb-2">💬 留言板</h1>
      <p className="text-forest-500 mb-8">留下你的足迹</p>

      {/* Input */}
      <div className="glass-card p-6 mb-8 space-y-3">
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="你的名字" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="想说什么..." rows={3} className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 resize-y" />
        <button onClick={handleSend} disabled={!author || !content} className="bg-forest-500 text-white px-6 py-2 rounded-full hover:bg-forest-600 transition-colors disabled:opacity-50 shadow-md">发送</button>
      </div>

      {/* Messages */}
      {loading ? (
        <p className="text-forest-400 text-sm">加载中...</p>
      ) : messages.length === 0 ? (
        <p className="text-forest-400 text-sm">还没有留言，成为第一个吧。</p>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-forest-700 text-sm">{m.author}</span>
                <time className="text-xs text-forest-400">{new Date(m.created_at).toLocaleDateString('zh-CN')}</time>
              </div>
              <p className="text-sm text-forest-600">{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
