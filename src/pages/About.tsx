import { siteConfig } from '../data/siteConfig.ts'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-forest-800 mb-6">关于我</h1>
      <div className="glass-card p-8">
        <div className="prose">
          <p>{siteConfig.bio}</p>
          <h2>技能栈</h2>
          <ul>
            <li>语言：TypeScript, Go, Python, Rust</li>
            <li>前端：React, Vue, Next.js, Tailwind CSS</li>
            <li>后端：Gin, gRPC, PostgreSQL, Redis</li>
            <li>工具：Docker, Git, Linux</li>
          </ul>
          <h2>关于本站</h2>
          <p>Vite + React 19 + TypeScript 构建，Tailwind CSS v4 样式，清新自然的绿色主题。博客用 Markdown 编写，代码完全开源。</p>
          <p>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">GitHub →</a>
          </p>
        </div>
      </div>
    </div>
  )
}
