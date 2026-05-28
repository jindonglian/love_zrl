import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts, deletePost } from '../lib/db.ts'
import type { Post } from '../lib/db.ts'

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    setLoading(true)
    const data = await fetchPosts()
    setPosts(data)
    setLoading(false)
  }

  async function handleCreate() {
    if (!title || !content) return
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60) + '-' + Date.now()
    // Dynamic import to avoid circular deps
    const { createPost } = await import('../lib/db.ts')
    await createPost({ slug, title, description: description || undefined, content, tags: tags ? tags.split(',').map(t => t.trim()) : [] })
    setShowEditor(false)
    setTitle(''); setContent(''); setDescription(''); setTags('')
    loadPosts()
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('确认删除？')) return
    await deletePost(id)
    loadPosts()
  }

  function groupByYear(ps: Post[]): Record<string, Post[]> {
    const g: Record<string, Post[]> = {}
    for (const p of ps) {
      const y = new Date(p.created_at).getFullYear().toString()
      if (!g[y]) g[y] = []
      g[y].push(p)
    }
    return g
  }

  const grouped = groupByYear(posts)
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-forest-800">📝 博客</h1>
        <button onClick={() => setShowEditor(!showEditor)} className="text-sm bg-forest-500 text-white px-4 py-2 rounded-full hover:bg-forest-600 transition-colors shadow-md">
          {showEditor ? '取消' : '+ 写文章'}
        </button>
      </div>
      <p className="text-forest-500 mb-10">所有文章</p>

      {showEditor && (
        <div className="glass-card p-6 mb-8 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="文章标题" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="摘要（可选）" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="标签，逗号分隔" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="正文（支持 Markdown）..." rows={10} className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 resize-y" />
          <button onClick={handleCreate} disabled={!title || !content} className="bg-forest-500 text-white px-6 py-2 rounded-full hover:bg-forest-600 transition-colors disabled:opacity-50 shadow-md">发布</button>
        </div>
      )}

      {loading ? (
        <p className="text-forest-400 text-sm">加载中...</p>
      ) : posts.length === 0 ? (
        <p className="text-forest-400 text-sm">还没有文章，点击"+ 写文章"开始创作。</p>
      ) : (
        <div className="space-y-10">
          {years.map(year => (
            <section key={year}>
              <h2 className="text-sm font-medium text-forest-300 uppercase tracking-wider mb-4">{year}</h2>
              <div className="space-y-2">
                {grouped[year].map(post => (
                  <Link key={post.id} to={`/posts/${post.slug}`} className="glass-card p-5 block group hover:shadow-md transition-all relative">
                    <time className="text-xs text-forest-400">{new Date(post.created_at).toLocaleDateString('zh-CN')}</time>
                    <h3 className="font-medium text-forest-800 group-hover:text-forest-600 transition-colors mt-1">{post.title}</h3>
                    {post.description && <p className="text-sm text-forest-500 mt-1">{post.description}</p>}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.tags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-forest-50 text-forest-500 rounded-full">{tag}</span>)}
                      </div>
                    )}
                    <button onClick={(e) => handleDelete(post.id, e)} className="absolute top-4 right-4 text-xs text-forest-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">删除</button>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
