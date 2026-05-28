import { useState, useEffect } from 'react'
import { anniversary, loveStory, loveGallery } from '../data/love.ts'

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime()
      const next = new Date(targetDate).getTime()
      const diff = next - now

      if (diff <= 0) {
        setTimeLeft('🎉 今天是我们在一起的纪念日！')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      setTimeLeft(`${days} 天 ${hours} 小时`)
    }

    calc()
    const timer = setInterval(calc, 60000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function getDaysTogether(start: string): number {
  const startDate = new Date(start).getTime()
  const now = new Date().getTime()
  return Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
}

export default function Love() {
  const countdown = useCountdown(anniversary)
  const daysTogether = getDaysTogether(anniversary)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-forest-800 mb-2">💕 我们的故事</h1>
      <p className="text-forest-500 mb-8">
        {loveStory.name1} & {loveStory.name2}
      </p>

      {/* Countdown Banner */}
      <div className="gradient-card-warm rounded-2xl p-8 mb-12 text-center border border-sun-300/30">
        <p className="text-sm text-forest-500 mb-1">距离下一个纪念日</p>
        <p className="text-3xl font-bold text-sun-500">{countdown}</p>
        <p className="text-xs text-forest-400 mt-4">
          已经在一起 {daysTogether} 天
        </p>
      </div>

      {/* Photo Wall */}
      <h2 className="text-lg font-bold text-forest-800 mb-4">💝 甜蜜瞬间</h2>
      <div className="grid grid-cols-3 gap-3 mb-12">
        {loveGallery.map((src, i) => (
          <div key={i} className="glass-card overflow-hidden aspect-square group">
            <img
              src={src}
              alt={`甜蜜瞬间${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <h2 className="text-lg font-bold text-forest-800 mb-6">📖 我们的时间轴</h2>
      <div className="relative pl-8 border-l-2 border-forest-200 ml-4 space-y-8">
        {[...loveStory.memories]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((mem, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[2.25rem] top-1 w-4 h-4 rounded-full bg-forest-300 border-2 border-white shadow" />
              <time className="text-xs text-forest-400">{mem.date}</time>
              <h3 className="font-bold text-forest-800 mt-1">{mem.title}</h3>
              <p className="text-sm text-forest-500 mt-1">{mem.description}</p>
              {mem.image && (
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="mt-3 rounded-xl w-full max-w-md object-cover glass-card overflow-hidden"
                  loading="lazy"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
