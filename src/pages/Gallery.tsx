import { useState } from 'react'
import { albums, photos } from '../data/photos.ts'
import type { Album } from '../data/photos.ts'

export default function Gallery() {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null)

  const filteredPhotos = activeAlbum
    ? photos.filter((p) => p.albumId === activeAlbum)
    : photos

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-forest-800 mb-2">📸 个人相册</h1>
      <p className="text-forest-500 mb-8">每一张照片都是一个故事</p>

      {/* Album Tabs */}
      <div className="flex gap-2 flex-wrap mb-10">
        <button
          onClick={() => setActiveAlbum(null)}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            activeAlbum === null
              ? 'bg-forest-500 text-white shadow-md'
              : 'bg-white text-forest-600 hover:bg-forest-50 border border-forest-100'
          }`}
        >
          全部
        </button>
        {albums.map((album: Album) => (
          <button
            key={album.id}
            onClick={() => setActiveAlbum(album.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeAlbum === album.id
                ? 'bg-forest-500 text-white shadow-md'
                : 'bg-white text-forest-600 hover:bg-forest-50 border border-forest-100'
            }`}
          >
            {album.name}
          </button>
        ))}
      </div>

      {/* Album Covers (when no filter active) */}
      {!activeAlbum && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {albums.map((album: Album) => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(album.id)}
              className="glass-card overflow-hidden group text-left"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-forest-800">{album.name}</h3>
                <p className="text-xs text-forest-500 mt-1">{album.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Photo Grid */}
      {activeAlbum && (
        <button
          onClick={() => setActiveAlbum(null)}
          className="text-sm text-forest-500 hover:text-forest-700 mb-4 inline-block"
        >
          ← 返回全部相册
        </button>
      )}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {filteredPhotos.map((photo, i) => (
          <div key={i} className="break-inside-avoid glass-card overflow-hidden group">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
