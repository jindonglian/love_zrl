import { Link } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig.ts'
import { getAllPosts } from '../utils/loadPosts.ts'
import type { PostMeta } from '../utils/loadPosts.ts'

const FEATURES = [
  { to: '/gallery', icon: '📸', title: '个人相册', desc: '记录生活中美好的瞬间', color: 'gradient-card-green' },
  { to: '/love', icon: '💕', title: '我们的故事', desc: '属于我们的甜蜜时光', color: 'gradient-card-warm' },
  { to: '/posts', icon: '📝', title: '博客', desc: '技术笔记与生活感悟', color: 'gradient-card-green' },
  { to: '/write', icon: '📄', title: '论文写作', desc: 'Markdown 写作与学术排版', color: 'gradient-card-green' },
]

export default function Home() {
  const posts: PostMeta[] = getAllPosts().slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-md overflow-hidden">
            <img src={siteConfig.avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-forest-900 mb-2">{siteConfig.name}</h1>
          <p className="text-forest-500 text-lg mb-1">{siteConfig.handle} · {siteConfig.nickname}</p>
          <p className="text-forest-400 max-w-md mx-auto mt-4">{siteConfig.bio}</p>
          <div className="flex gap-4 justify-center mt-6">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-sm text-forest-500 hover:text-forest-700 transition-colors bg-white/60 px-4 py-2 rounded-full">GitHub</a>
            <a href={`mailto:${siteConfig.email}`} className="text-sm text-forest-500 hover:text-forest-700 transition-colors bg-white/60 px-4 py-2 rounded-full">Email</a>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className={`${f.color} glass-card p-6 text-center group hover:-translate-y-1 transition-all duration-300`}>
              <span className="text-3xl block mb-2">{f.icon}</span>
              <h3 className="font-bold text-forest-800 group-hover:text-forest-600 transition-colors">{f.title}</h3>
              <p className="text-xs text-forest-500 mt-1">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-forest-800">📝 最新文章</h2>
          <Link to="/posts" className="text-sm text-forest-500 hover:text-forest-700">全部文章 →</Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-forest-400 text-sm">还没有文章。</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link key={post.slug} to={`/posts/${post.slug}`} className="glass-card p-5 block group hover:shadow-md transition-shadow">
                <time className="text-xs text-forest-400">{post.date}</time>
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
