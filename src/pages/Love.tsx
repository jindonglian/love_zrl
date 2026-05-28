import { useState, useEffect, useRef } from 'react'
import { fetchLoveMemories, createLoveMemory, deleteLoveMemory, fetchLovePhotos, addLovePhoto, deleteLovePhoto, uploadPhoto } from '../lib/db.ts'
import type { LoveMemory, LovePhoto } from '../lib/db.ts'
import { anniversary } from '../data/love.ts'

function useCountdown(target: string) {
  const [t, setT] = useState('')
  useEffect(() => {
    const c = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setT('🎉 纪念日快乐！'); return }
      setT(`${Math.floor(diff / 86400000)} 天 ${Math.floor((diff % 86400000) / 3600000)} 小时`)
    }
    c(); const i = setInterval(c, 60000); return () => clearInterval(i)
  }, [target])
  return t
}

function getDaysTogether(start: string) { return Math.floor((Date.now() - new Date(start).getTime()) / 86400000) }

export default function Love() {
  const [memories, setMemories] = useState<LoveMemory[]>([])
  const [lovePhotos, setLovePhotos] = useState<LovePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')
  const [memTitle, setMemTitle] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const wallRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const countdown = useCountdown(anniversary)
  const days = getDaysTogether(anniversary)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [m, p] = await Promise.all([fetchLoveMemories(), fetchLovePhotos()])
    setMemories(m); setLovePhotos(p); setLoading(false)
  }

  async function handleAddMemory() {
    if (!memTitle || !date) return
    let imgUrl: string | undefined
    if (fileRef.current?.files?.[0]) {
      imgUrl = await uploadPhoto(fileRef.current.files[0], 'love-photos')
      if (imgUrl) await addLovePhoto(imgUrl, '东东')
    }
    await createLoveMemory({ title: memTitle, description: desc || undefined, date, image_url: imgUrl, created_by: '东东' })
    setMemTitle(''); setDesc(''); setDate(''); setShowForm(false)
    showMsg('添加成功!')
    loadAll()
  }

  async function handleDeleteMem(id: number) {
    if (!confirm('删除这条回忆？')) return
    await deleteLoveMemory(id)
    showMsg('已删除')
    loadAll()
  }

  async function handleUploadWall(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadPhoto(file, 'love-photos')
    if (url) { await addLovePhoto(url, '东东'); showMsg('上传成功!'); loadAll() }
    if (wallRef.current) wallRef.current.value = ''
  }

  async function handleDeleteWall(id: number) {
    if (!confirm('删除这张照片？')) return
    await deleteLovePhoto(id)
    showMsg('已删除')
    loadAll()
  }

  function showMsg(m: string) { setMsg(m); setTimeout(() => setMsg(''), 2000) }

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16"><p className="text-forest-400">加载中...</p></div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-forest-800 mb-2">💕 我们的故事</h1>
      <p className="text-forest-500 mb-4">东东 & 宝宝</p>
      {msg && <p className="text-sm text-forest-500 bg-forest-50 inline-block px-4 py-1 rounded-full mb-4">{msg}</p>}

      {/* Countdown */}
      <div className="gradient-card-warm rounded-2xl p-8 mb-10 text-center border border-sun-300/30">
        <p className="text-sm text-forest-500 mb-1">距离下一个纪念日</p>
        <p className="text-3xl font-bold text-sun-500">{countdown}</p>
        <p className="text-xs text-forest-400 mt-4">已经在一起 {days} 天</p>
      </div>

      {/* Photo Wall */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-forest-800">💝 甜蜜瞬间</h2>
        <label className="cursor-pointer bg-forest-50 hover:bg-forest-100 text-forest-600 px-3 py-1.5 rounded-full text-sm transition-colors border border-forest-100">
          上传照片
          <input ref={wallRef} type="file" accept="image/*" onChange={handleUploadWall} className="hidden" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-10">
        {lovePhotos.map(p => (
          <div key={p.id} className="glass-card overflow-hidden aspect-square group relative">
            <img src={p.url} alt="" className="w-full h-full object-cover" loading="lazy" />
            <button onClick={() => handleDeleteWall(p.id)} className="absolute top-2 right-2 bg-white/80 text-red-500 w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </div>
        ))}
        {lovePhotos.length === 0 && <p className="col-span-3 text-sm text-forest-400">还没有照片，上传第一张吧。</p>}
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-forest-800">📖 我们的时间轴</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-sm bg-sun-400 text-white px-4 py-2 rounded-full hover:bg-sun-500 transition-colors shadow-md">
          {showForm ? '取消' : '+ 添加回忆'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6 space-y-3">
          <input value={memTitle} onChange={e => setMemTitle(e.target.value)} placeholder="标题" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full px-4 py-2 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="描述" rows={3} className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 resize-y" />
          <input ref={fileRef} type="file" accept="image/*" className="text-sm text-forest-500" />
          <button onClick={handleAddMemory} disabled={!memTitle || !date} className="bg-sun-400 text-white px-6 py-2 rounded-full hover:bg-sun-500 transition-colors disabled:opacity-50">添加</button>
        </div>
      )}

      <div className="relative pl-8 border-l-2 border-forest-200 ml-4 space-y-8">
        {memories.map(m => (
          <div key={m.id} className="relative group">
            <div className="absolute -left-[2.25rem] top-1 w-4 h-4 rounded-full bg-forest-300 border-2 border-white shadow" />
            <time className="text-xs text-forest-400">{m.date}</time>
            <h3 className="font-bold text-forest-800 mt-1">{m.title}</h3>
            {m.description && <p className="text-sm text-forest-500 mt-1">{m.description}</p>}
            {m.image_url && <img src={m.image_url} alt={m.title} className="mt-3 rounded-xl w-full max-w-md object-cover" loading="lazy" />}
            <button onClick={() => handleDeleteMem(m.id)} className="absolute top-0 right-0 text-xs text-forest-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">删除</button>
          </div>
        ))}
        {memories.length === 0 && <p className="text-sm text-forest-400">还没有回忆，点击添加吧。</p>}
      </div>
    </div>
  )
}
