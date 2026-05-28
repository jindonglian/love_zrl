import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Posts' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const location = useLocation()
  // HashRouter 下 pathname 永远是 '/'，路由信息在 hash 中
  const currentPath = location.pathname === '/'
    ? location.hash.replace('#', '') || '/'
    : location.pathname

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
          LJD
        </Link>
        <nav>
          <ul className="flex gap-6">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`text-sm transition-colors ${
                    currentPath === to
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
