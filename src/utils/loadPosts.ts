import fm from 'front-matter'

export interface PostMeta {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
}

export interface Post {
  meta: PostMeta
  content: string
}

interface RawModule {
  default: string
}

const modules = import.meta.glob<RawModule>('/src/content/*.md', {
  query: '?raw',
  import: 'default',
})

const postCache = new Map<string, Post>()

async function loadPost(path: string): Promise<Post> {
  const mod = await modules[path]()
  const raw = typeof mod === 'string' ? mod : (mod as RawModule).default
  const { attributes, body } = fm<{ title: string; date: string; description?: string; tags?: string[] }>(raw)
  const slug = path.replace('/src/content/', '').replace('.md', '')

  return {
    meta: {
      slug,
      title: attributes.title,
      date: attributes.date,
      description: attributes.description,
      tags: attributes.tags,
    },
    content: body,
  }
}

const allPaths = Object.keys(modules)
const allPosts = await Promise.all(allPaths.map(loadPost))
allPosts.sort(
  (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
)
for (const post of allPosts) {
  postCache.set(post.meta.slug, post)
}

export function getAllPosts(): PostMeta[] {
  return allPosts.map((p) => p.meta)
}

export function getPostBySlug(slug: string): Post | undefined {
  return postCache.get(slug)
}
