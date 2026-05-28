import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-medium mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-8">你访问的页面不存在。</p>
      <Link
        to="/"
        className="text-sm text-gray-900 font-medium hover:underline"
      >
        &larr; 回到首页
      </Link>
    </div>
  )
}
