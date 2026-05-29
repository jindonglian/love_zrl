import { useState, useEffect, useRef } from 'react'
import {
  fetchLoveMemories, createLoveMemory, deleteLoveMemory,
  fetchLovePhotos, addLovePhoto, deleteLovePhoto, uploadPhoto,
  fetchLoveSetting, upsertLoveSetting,
} from '../lib/db.ts'
import type { LoveMemory, LovePhoto } from '../lib/db.ts'
import { anniversary } from '../data/love.ts'

// 从"今天"到下一个周年纪念日的倒计时
function useCountdown(start: string) {
  const [t, setT] = useState('')
  useEffect(() => {
    const calc = () => {
      const startDate = new Date(start)
      const now = new Date()
      // 下一个纪念日：今年或明年
      const next = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate())
      if (next <= now) next.setFullYear(next.getFullYear() + 1)
      const diff = next.getTime() - now.getTime()
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      setT(d === 0 ? '🎉 今天就是纪念日！' : `${d} 天 ${h} 小时`)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [start])
  return t
}

// 基于"基准天数 + 基准日期"计算当前天数，每天自动 +1
function computeDays(baseDays: number, baseDate: string): number {
  const elapsed = Math.floor((Date.now() - new Date(baseDate).getTime()) / 86400000)
  return baseDays + elapsed
}

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

  // 天数计时器状态
  const [days, setDays] = useState(0)
  const [editingDays, setEditingDays] = useState(false)
  const [daysInput, setDaysInput] = useState('')
  const [savingDays, setSavingDays] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [m, p, baseDaysStr, baseDateStr] = await Promise.all([
      fetchLoveMemories(),
      fetchLovePhotos(),
      fetchLoveSetting('days_base'),
      fetchLoveSetting('days_base_date'),
    ])
    setMemories(m)
    setLovePhotos(p)

    if (baseDaysStr && baseDateStr) {
      setDays(computeDays(parseInt(baseDaysStr), baseDateStr))
    } else {
      // 首次：用 anniversary 初始化
      const d = Math.floor((Date.now() - new Date(anniversary).getTime()) / 86400000)
      setDays(d)
    }
    setLoading(false)
  }

  async function handleSaveDays() {
    const newDays = parseInt(daysInput)
    if (isNaN(newDays) || newDays < 0) return
    setSavingDays(true)
    const today = new Date().toISOString().slice(0, 10)
    await Promise.all([
      upsertLoveSetting('days_base', String(newDays)),
      upsertLoveSetting('days_base_date', today),
    ])
    setDays(newDays)
    setEditingDays(false)
    setSavingDays(false)
    showMsg('天数已更新')
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
    showMsg('添加成功！')
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
    if (url) { await addLovePhoto(url, '东东'); showMsg('上传成功！'); loadAll() }
    if (wallRef.current) wallRef.current.value = ''
  }

  async function handleDeleteWall(id: number) {
    if (!confirm('删除这张照片？')) return
    await deleteLovePhoto(id)
    showMsg('已删除')
    loadAll()
  }

  function showMsg(m: string) { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="inline-block w-8 h-8 border-2 border-sun-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-forest-800 mb-2">我们的故事</h1>
        <p className="text-forest-400 tracking-widest text-sm">东东 ♡ 宝宝</p>
      </div>

      {/* Toast */}
      {msg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-forest-700 text-white text-sm px-5 py-2 rounded-full shadow-lg transition-all">
          {msg}
        </div>
      )}

      {/* Days Counter Card */}
      <div className="relative overflow-hidden rounded-3xl mb-10 p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #fce8ef 40%, #fdf3e0 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #f9a8c9, transparent)' }} />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />

        <p className="text-xs text-forest-400 uppercase tracking-widest mb-1">在一起</p>

        {editingDays ? (
          <div className="flex items-center justify-center gap-3 my-3">
            <input
              type="number"
              value={daysInput}
              onChange={e => setDaysInput(e.target.value)}
              className="w-28 text-center text-3xl font-bold border-b-2 border-sun-400 bg-transparent outline-none text-forest-800"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSaveDays(); if (e.key === 'Escape') setEditingDays(false) }}
            />
            <span className="text-2xl text-forest-600 font-semibold">天</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 my-3">
            <span className="text-6xl font-bold text-rose-400 tabular-nums leading-none">{days}</span>
            <span className="text-2xl text-forest-500 font-semibold">天</span>
          </div>
        )}

        {editingDays ? (
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={handleSaveDays}
              disabled={savingDays}
              className="text-sm bg-rose-400 text-white px-4 py-1.5 rounded-full hover:bg-rose-500 transition-colors disabled:opacity-50"
            >
              {savingDays ? '保存中…' : '确认'}
            </button>
            <button
              onClick={() => setEditingDays(false)}
              className="text-sm text-forest-400 hover:text-forest-600 px-3 py-1.5"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDaysInput(String(days)); setEditingDays(true) }}
            className="mt-2 text-xs text-forest-400 hover:text-forest-600 underline underline-offset-2 transition-colors"
          >
            手动修改天数
          </button>
        )}

        <div className="mt-5 pt-5 border-t border-rose-100 flex justify-center gap-8">
          <div>
            <p className="text-xs text-forest-400">距下一个纪念日</p>
            <p className="text-sm font-semibold text-sun-500 mt-0.5">{countdown}</p>
          </div>
          <div>
            <p className="text-xs text-forest-400">在一起起始</p>
            <p className="text-sm font-semibold text-forest-600 mt-0.5">{anniversary}</p>
          </div>
        </div>
      </div>

      {/* Photo Wall */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-forest-800">甜蜜瞬间</h2>
          <label className="cursor-pointer text-sm text-forest-600 hover:text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-100 px-4 py-1.5 rounded-full transition-colors">
            + 上传照片
            <input ref={wallRef} type="file" accept="image/*" onChange={handleUploadWall} className="hidden" />
          </label>
        </div>

        {lovePhotos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-forest-100 py-14 text-center">
            <p className="text-4xl mb-3">📷</p>
            <p className="text-sm text-forest-400">还没有照片，上传第一张吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {lovePhotos.map(p => (
              <div key={p.id} className="aspect-square rounded-2xl overflow-hidden group relative shadow-sm">
                <img src={p.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <button
                  onClick={() => handleDeleteWall(p.id)}
                  className="absolute top-2 right-2 bg-white/90 text-red-400 hover:text-red-600 w-7 h-7 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Timeline */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-forest-800">时间轴</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm bg-forest-600 text-white px-4 py-1.5 rounded-full hover:bg-forest-700 transition-colors shadow-sm"
          >
            {showForm ? '取消' : '+ 添加回忆'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8 space-y-3">
            <input
              value={memTitle}
              onChange={e => setMemTitle(e.target.value)}
              placeholder="标题 *"
              className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 text-sm"
            />
            <input
              value={date}
              onChange={e => setDate(e.target.value)}
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 text-sm"
            />
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="描述（可选）"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-forest-200 bg-white focus:ring-2 focus:ring-forest-300 outline-none text-forest-800 resize-y text-sm"
            />
            <div className="flex items-center gap-4">
              <label className="text-sm text-forest-500 cursor-pointer hover:text-forest-700">
                附加图片
                <input ref={fileRef} type="file" accept="image/*" className="hidden" />
              </label>
              <button
                onClick={handleAddMemory}
                disabled={!memTitle || !date}
                className="ml-auto bg-sun-400 text-white px-6 py-2 rounded-full hover:bg-sun-500 transition-colors disabled:opacity-40 text-sm"
              >
                添加
              </button>
            </div>
          </div>
        )}

        {memories.length === 0 ? (
          <div className="text-center py-12 text-forest-400 text-sm">还没有回忆，点击上方按钮添加吧。</div>
        ) : (
          <div className="relative pl-8 border-l-2 border-forest-100 ml-3 space-y-8">
            {memories.map(m => (
              <div key={m.id} className="relative group">
                <div className="absolute -left-[2.3rem] top-1 w-4 h-4 rounded-full bg-white border-2 border-forest-300 shadow-sm" />
                <div className="glass-card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <time className="text-xs text-forest-400">{m.date}</time>
                      <h3 className="font-bold text-forest-800 mt-0.5">{m.title}</h3>
                      {m.description && <p className="text-sm text-forest-500 mt-1 leading-relaxed">{m.description}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteMem(m.id)}
                      className="text-xs text-forest-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                    >
                      删除
                    </button>
                  </div>
                  {m.image_url && (
                    <img
                      src={m.image_url}
                      alt={m.title}
                      className="mt-4 rounded-xl w-full max-w-sm object-cover shadow-sm"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
