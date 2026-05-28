import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import PostList from './pages/PostList.tsx'
import PostDetail from './pages/PostDetail.tsx'
import Gallery from './pages/Gallery.tsx'
import Love from './pages/Love.tsx'
import Writing from './pages/Writing.tsx'
import Notes from './pages/Notes.tsx'
import Messages from './pages/Messages.tsx'
import NotFound from './pages/NotFound.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/love" element={<Love />} />
        <Route path="/write" element={<Writing />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
