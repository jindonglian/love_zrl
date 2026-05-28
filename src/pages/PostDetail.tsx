import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchPostBySlug } from '../lib/db.ts'
import type { Post } from '../lib/db.ts'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setLoading(false); return }
    fetchPostBySlug(slug).then(p => { setPost(p); setLoading(false) })
  }, [slug])

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-20"><p className="text-forest-400">加载中...</p></div>
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-6xl font-bold text-forest-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-forest-800">Not Found</h1>
        <p className="text-forest-500 mt-2">这篇文章不存在或已被删除。</p>
        <Link to="/posts" className="text-sm text-forest-500 hover:text-forest-700 mt-4 inline-block">&larr; 返回博客</Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/posts" className="text-sm text-forest-400 hover:text-forest-600 transition-colors mb-8 inline-block">&larr; 返回博客</Link>
      <header className="mb-8">
        <time className="text-sm text-forest-400">{new Date(post.created_at).toLocaleDateString('zh-CN')}</time>
        <h1 className="text-3xl font-bold text-forest-800 mt-2">{post.title}</h1>
        {post.description && <p className="text-forest-500 mt-2">{post.description}</p>}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {post.tags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-forest-50 text-forest-500 rounded-full">{tag}</span>)}
          </div>
        )}
      </header>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
