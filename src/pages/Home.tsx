import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/loadPosts.ts'
import { siteConfig } from '../siteConfig.ts'
import type { PostMeta } from '../utils/loadPosts.ts'

export default function Home() {
  const posts: PostMeta[] = getAllPosts().slice(0, 5)

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <section className="mb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{siteConfig.name}</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
          {siteConfig.bio}
        </p>
        <div className="flex gap-6 mt-8">
          {siteConfig.github && (
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Email
            </a>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
          Recent Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">还没有文章。</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="pb-6 border-b border-gray-100 last:border-0">
                <Link to={`/posts/${post.slug}`} className="group block">
                  <time className="text-xs text-gray-400">{post.date}</time>
                  <h3 className="text-lg font-medium group-hover:text-gray-500 transition-colors mt-1">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-gray-400 mt-1">{post.description}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/posts"
          className="inline-block mt-8 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          View all posts &rarr;
        </Link>
      </section>
    </div>
  )
}
