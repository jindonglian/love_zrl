import { siteConfig } from '../siteConfig.ts'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-400">
        <span>&copy; {year} {siteConfig.name}</span>
        <div className="flex gap-4">
          {siteConfig.github && (
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              GitHub
            </a>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-gray-600 transition-colors"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
