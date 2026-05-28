import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <p className="text-8xl font-bold text-forest-100 mb-4">404</p>
      <h1 className="text-xl font-bold text-forest-800 mb-2">Page Not Found</h1>
      <p className="text-forest-500 mb-8">你访问的页面不存在，迷路了吗？</p>
      <Link to="/" className="text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors bg-forest-50 px-6 py-2.5 rounded-full">
        &larr; 回到首页
      </Link>
    </div>
  )
}
