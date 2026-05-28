import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/loadPosts.ts'
import type { PostMeta } from '../utils/loadPosts.ts'

function groupByYear(posts: PostMeta[]): Record<string, PostMeta[]> {
  const groups: Record<string, PostMeta[]> = {}
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return groups
}

export default function PostList() {
  const posts: PostMeta[] = getAllPosts()
  const grouped = groupByYear(posts)
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-12">Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">还没有文章。</p>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-4">
                {year}
              </h2>
              <ul className="space-y-6">
                {grouped[year].map((post) => (
                  <li
                    key={post.slug}
                    className="pb-6 border-b border-gray-100 last:border-0"
                  >
                    <Link to={`/posts/${post.slug}`} className="group block">
                      <time className="text-xs text-gray-400">{post.date}</time>
                      <h3 className="text-lg font-medium group-hover:text-gray-500 transition-colors mt-1">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-400 mt-1">{post.description}</p>
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
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
