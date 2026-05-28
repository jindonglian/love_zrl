import { siteConfig } from '../data/siteConfig.ts'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-forest-100 mt-20 bg-white/50">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-4 text-sm text-forest-500">
        <div className="flex gap-6">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-forest-700 transition-colors">GitHub</a>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-forest-700 transition-colors">Email</a>
        </div>
        <p className="text-forest-400">
          &copy; {year} {siteConfig.name} · {siteConfig.handle} · Built with love and green tea
        </p>
      </div>
    </footer>
  )
}
