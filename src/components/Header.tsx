import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig.ts'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: '相册' },
  { to: '/love', label: '我们的故事' },
  { to: '/posts', label: '博客' },
  { to: '/notes', label: '笔记' },
  { to: '/write', label: '写作' },
  { to: '/messages', label: '留言' },
]

export default function Header() {
  const location = useLocation()
  const currentPath = location.pathname === '/'
    ? location.hash.replace('#', '') || '/'
    : location.pathname

  return (
    <header className="sticky top-0 z-50 bg-[#f7faf5]/80 backdrop-blur-md border-b border-forest-100/50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-forest-800 text-lg group-hover:text-forest-600 transition-colors">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="flex gap-0.5 overflow-x-auto">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                currentPath === to
                  ? 'bg-forest-100 text-forest-700 font-medium'
                  : 'text-forest-600 hover:bg-forest-50 hover:text-forest-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
