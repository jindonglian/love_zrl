import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '../utils/loadPosts.ts'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-6xl font-bold text-forest-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-forest-800">Not Found</h1>
        <p className="text-forest-500 mt-2">无效的文章路径。</p>
        <Link to="/posts" className="text-sm text-forest-500 hover:text-forest-700 mt-4 inline-block">&larr; 返回博客</Link>
      </div>
    )
  }

  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-6xl font-bold text-forest-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-forest-800">Not Found</h1>
        <p className="text-forest-500 mt-2">这篇文章不存在。</p>
        <Link to="/posts" className="text-sm text-forest-500 hover:text-forest-700 mt-4 inline-block">&larr; 返回博客</Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/posts" className="text-sm text-forest-400 hover:text-forest-600 transition-colors mb-8 inline-block">&larr; 返回博客</Link>
      <header className="mb-8">
        <time className="text-sm text-forest-400">{post.meta.date}</time>
        <h1 className="text-3xl font-bold text-forest-800 mt-2">{post.meta.title}</h1>
        {post.meta.description && <p className="text-forest-500 mt-2">{post.meta.description}</p>}
        {post.meta.tags && post.meta.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.meta.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-forest-50 text-forest-500 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </header>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
