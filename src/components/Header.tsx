import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Posts' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
          My Baby
        </Link>
        <nav>
          <ul className="flex gap-6">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`text-sm transition-colors ${
                    pathname === to
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-900'
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
