import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/loadPosts.ts'
import type { PostMeta } from '../utils/loadPosts.ts'

export default function PostList() {
  const posts: PostMeta[] = getAllPosts()

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">还没有文章。</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`} className="group block">
                <time className="text-xs text-gray-400">{post.date}</time>
                <h2 className="text-xl font-medium group-hover:text-gray-500 transition-colors mt-1">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-sm text-gray-400 mt-2">{post.description}</p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
