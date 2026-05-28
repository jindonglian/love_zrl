export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
        <p>&copy; {year} My Baby. Built with love.</p>
      </div>
    </footer>
  )
}
