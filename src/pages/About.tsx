export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-8">About</h1>

      <div className="prose">
        <p>
          北京交通大学计算机科学与技术专业学生。对系统编程、分布式系统、编程语言设计感兴趣。
        </p>

        <h2>技能</h2>
        <ul>
          <li>语言：TypeScript, Go, Python, Rust</li>
          <li>前端：React, Vue, Next.js, Tailwind CSS</li>
          <li>后端：Gin, gRPC, PostgreSQL, Redis</li>
          <li>工具：Docker, Git, Linux</li>
        </ul>

        <h2>关于这个网站</h2>
        <p>
          用 Vite + React + TypeScript 构建，部署在 GitHub Pages。博客文章用 Markdown 编写，
          通过 front-matter 管理元数据。
        </p>
      </div>
    </div>
  )
}
