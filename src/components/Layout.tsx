import { Outlet } from 'react-router-dom'
import Header from './Header.tsx'
import Footer from './Footer.tsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf5]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
