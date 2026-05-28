import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { siteConfig } from '../data/siteConfig.ts'
import { fetchPosts } from '../lib/db.ts'
import type { Post } from '../lib/db.ts'

const FEATURES = [
  { to: '/gallery', icon: '📸', title: '个人相册', desc: '记录美好瞬间', color: 'gradient-card-green' },
  { to: '/love', icon: '💕', title: '我们的故事', desc: '甜蜜时光', color: 'gradient-card-warm' },
  { to: '/posts', icon: '📝', title: '博客', desc: '技术与生活', color: 'gradient-card-green' },
  { to: '/notes', icon: '📒', title: '学习笔记', desc: '知识积累', color: 'gradient-card-green' },
  { to: '/write', icon: '📄', title: '论文写作', desc: '学术排版', color: 'gradient-card-green' },
  { to: '/messages', icon: '💬', title: '留言板', desc: '留下足迹', color: 'gradient-card-warm' },
]

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => { fetchPosts().then(p => setPosts(p.slice(0, 3))) }, [])

  return (
    <div>
      <section className="gradient-hero py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-md overflow-hidden ring-4 ring-forest-100">
            <img src={siteConfig.avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-forest-900 mb-2">{siteConfig.name}</h1>
          <p className="text-forest-500 text-lg mb-1">{siteConfig.handle} · {siteConfig.nickname}</p>
          <p className="text-forest-400 max-w-md mx-auto mt-4">{siteConfig.bio}</p>
          <div className="flex gap-4 justify-center mt-6">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-sm text-forest-600 hover:text-forest-800 bg-white/70 px-4 py-2 rounded-full shadow-sm transition-colors">GitHub</a>
            <a href={`mailto:${siteConfig.email}`} className="text-sm text-forest-600 hover:text-forest-800 bg-white/70 px-4 py-2 rounded-full shadow-sm transition-colors">Email</a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURES.map(f => (
            <Link key={f.to} to={f.to} className={`${f.color} glass-card p-5 text-center group hover:-translate-y-1 transition-all duration-300`}>
              <span className="text-2xl block mb-1">{f.icon}</span>
              <h3 className="font-bold text-forest-800 text-sm group-hover:text-forest-600">{f.title}</h3>
              <p className="text-xs text-forest-500 mt-0.5">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-forest-800">📝 最新文章</h2>
          <Link to="/posts" className="text-sm text-forest-500 hover:text-forest-700">全部文章 →</Link>
        </div>
        {posts.length === 0 ? (
          <Link to="/posts" className="glass-card p-6 block text-center hover:shadow-md transition-shadow">
            <p className="text-forest-400 text-sm">还没有文章，点击开始写第一篇文章。</p>
          </Link>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <Link key={post.id} to={`/posts/${post.slug}`} className="glass-card p-5 block group hover:shadow-md transition-shadow">
                <time className="text-xs text-forest-400">{new Date(post.created_at).toLocaleDateString('zh-CN')}</time>
                <h3 className="font-medium text-forest-800 group-hover:text-forest-600 transition-colors mt-1">{post.title}</h3>
                {post.description && <p className="text-sm text-forest-500 mt-1">{post.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
