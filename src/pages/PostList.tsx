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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-forest-800 mb-2">📝 博客</h1>
      <p className="text-forest-500 mb-10">所有文章</p>

      {posts.length === 0 ? (
        <p className="text-forest-400 text-sm">还没有文章。</p>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-sm font-medium text-forest-300 uppercase tracking-wider mb-4">{year}</h2>
              <div className="space-y-2">
                {grouped[year].map((post) => (
                  <Link
                    key={post.slug}
                    to={`/posts/${post.slug}`}
                    className="glass-card p-5 block group hover:shadow-md transition-all"
                  >
                    <time className="text-xs text-forest-400">{post.date}</time>
                    <h3 className="font-medium text-forest-800 group-hover:text-forest-600 transition-colors mt-1">{post.title}</h3>
                    {post.description && <p className="text-sm text-forest-500 mt-1">{post.description}</p>}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-forest-50 text-forest-500 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
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
