import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '../utils/loadPosts.ts'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4">Not Found</h1>
        <p className="text-gray-500">无效的文章路径。</p>
        <Link
          to="/posts"
          className="text-sm text-gray-500 hover:text-gray-900 mt-4 inline-block"
        >
          &larr; Back to posts
        </Link>
      </div>
    )
  }

  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4">Not Found</h1>
        <p className="text-gray-500">这篇文章不存在。</p>
        <Link
          to="/posts"
          className="text-sm text-gray-500 hover:text-gray-900 mt-4 inline-block"
        >
          &larr; Back to posts
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <Link
        to="/posts"
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block"
      >
        &larr; Back to posts
      </Link>
      <header className="mb-8">
        <time className="text-sm text-gray-400">{post.meta.date}</time>
        <h1 className="text-3xl font-bold mt-2">{post.meta.title}</h1>
        {post.meta.description && (
          <p className="text-gray-500 mt-2">{post.meta.description}</p>
        )}
        {post.meta.tags && post.meta.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
