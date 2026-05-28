import { useState, useEffect, useRef } from 'react'
import { fetchAlbums, fetchPhotos, uploadPhoto, addPhoto, createAlbum, deletePhoto, deleteAlbum } from '../lib/db.ts'
import type { Album, Photo } from '../lib/db.ts'

export default function Gallery() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [activeAlbum, setActiveAlbum] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showNewAlbum, setShowNewAlbum] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState('')
  const [newAlbumDesc, setNewAlbumDesc] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [a, p] = await Promise.all([fetchAlbums(), fetchPhotos()])
    setAlbums(a); setPhotos(p); setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !activeAlbum) return
    setUploading(true)
    const url = await uploadPhoto(file, 'photos')
    if (url) {
      await addPhoto(activeAlbum, url, file.name)
      showMsg('上传成功!')
      loadData()
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleCreateAlbum() {
    if (!newAlbumName) return
    await createAlbum({ name: newAlbumName, description: newAlbumDesc || undefined })
    setNewAlbumName(''); setNewAlbumDesc(''); setShowNewAlbum(false)
    showMsg('相册创建成功!')
    loadData()
  }

  async function handleDeletePhoto(id: number) {
    if (!confirm('删除这张照片？')) return
    await deletePhoto(id)
    showMsg('已删除')
    loadData()
  }

  async function handleDeleteAlbum(id: number) {
    if (!confirm('删除相册会同时删除其中所有照片？')) return
    await deleteAlbum(id)
    if (activeAlbum === id) setActiveAlbum(null)
    showMsg('已删除')
    loadData()
  }

  function showMsg(m: string) { setMsg(m); setTimeout(() => setMsg(''), 2000) }

  const filteredPhotos = activeAlbum ? photos.filter(p => p.album_id === activeAlbum) : photos

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-forest-800">📸 个人相册</h1>
        <button onClick={() => setShowNewAlbum(!showNewAlbum)} className="text-sm bg-forest-500 text-white px-4 py-2 rounded-full hover:bg-forest-600 transition-colors shadow-md">
          {showNewAlbum ? '取消' : '+ 新建相册'}
        </button>
      </div>
      <p className="text-forest-500 mb-4">每一张照片都是一个故事</p>
      {msg && <p className="text-sm text-forest-500 bg-forest-50 inline-block px-4 py-1 rounded-full mb-4">{msg}</p>}

      {showNewAlbum && (
        <div className="glass-card p-6 mb-6 space-y-3">
          <input value={newAlbumName} onChange={e => setNewAlbumName(e.target.value)} placeholder="相册名称" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <input value={newAlbumDesc} onChange={e => setNewAlbumDesc(e.target.value)} placeholder="描述（可选）" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <button onClick={handleCreateAlbum} disabled={!newAlbumName} className="bg-forest-500 text-white px-6 py-2 rounded-full hover:bg-forest-600 transition-colors disabled:opacity-50">创建</button>
        </div>
      )}

      {/* Album tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button onClick={() => setActiveAlbum(null)} className={`px-4 py-2 rounded-full text-sm transition-all ${activeAlbum === null ? 'bg-forest-500 text-white shadow-md' : 'bg-white text-forest-600 hover:bg-forest-50 border border-forest-100'}`}>全部</button>
        {albums.map(a => (
          <button key={a.id} onClick={() => setActiveAlbum(a.id)} className={`px-4 py-2 rounded-full text-sm transition-all group relative ${activeAlbum === a.id ? 'bg-forest-500 text-white shadow-md' : 'bg-white text-forest-600 hover:bg-forest-50 border border-forest-100'}`}>
            {a.name}
            <span onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(a.id) }} className="ml-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">×</span>
          </button>
        ))}
      </div>

      {activeAlbum && (
        <div className="mb-6">
          <button onClick={() => setActiveAlbum(null)} className="text-sm text-forest-500 hover:text-forest-700 mb-2 inline-block">← 返回全部</button>
          <div className="flex items-center gap-3 mb-4">
            <label className="cursor-pointer bg-forest-50 hover:bg-forest-100 text-forest-600 px-4 py-2 rounded-full text-sm transition-colors border border-forest-100">
              {uploading ? '上传中...' : '📤 上传照片'}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-forest-400 text-sm">加载中...</p>
      ) : photos.length === 0 ? (
        <p className="text-forest-400 text-sm">还没有照片，先创建一个相册然后上传吧。</p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredPhotos.map(photo => (
            <div key={photo.id} className="break-inside-avoid glass-card overflow-hidden group relative">
              <img src={photo.url} alt={photo.alt || ''} className="w-full object-cover" loading="lazy" />
              <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 bg-white/80 text-red-500 w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
