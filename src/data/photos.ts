/** 相册数据 — 图片用占位 URL，替换为你自己的图片地址 */
export interface Album {
  id: string
  name: string
  cover: string
  description: string
}

export interface Photo {
  albumId: string
  src: string
  alt: string
}

export const albums: Album[] = [
  { id: 'travel', name: '旅行日记', cover: 'https://picsum.photos/seed/travel1/400/300', description: '路上的风景和故事' },
  { id: 'daily', name: '日常生活', cover: 'https://picsum.photos/seed/daily1/400/300', description: '人间烟火，最抚人心' },
  { id: 'coding', name: '代码时光', cover: 'https://picsum.photos/seed/code1/400/300', description: '键盘敲出的成就感' },
  { id: 'food', name: '美食探店', cover: 'https://picsum.photos/seed/food1/400/300', description: '吃遍大街小巷' },
]

export const photos: Photo[] = [
  // 旅行
  { albumId: 'travel', src: 'https://picsum.photos/seed/t1/600/400', alt: '旅行1' },
  { albumId: 'travel', src: 'https://picsum.photos/seed/t2/600/400', alt: '旅行2' },
  { albumId: 'travel', src: 'https://picsum.photos/seed/t3/400/600', alt: '旅行3' },
  { albumId: 'travel', src: 'https://picsum.photos/seed/t4/600/400', alt: '旅行4' },
  // 日常
  { albumId: 'daily', src: 'https://picsum.photos/seed/d2/600/400', alt: '日常1' },
  { albumId: 'daily', src: 'https://picsum.photos/seed/d3/400/600', alt: '日常2' },
  { albumId: 'daily', src: 'https://picsum.photos/seed/d4/600/400', alt: '日常3' },
  { albumId: 'daily', src: 'https://picsum.photos/seed/d5/600/400', alt: '日常4' },
  // 代码
  { albumId: 'coding', src: 'https://picsum.photos/seed/c2/600/400', alt: '代码1' },
  { albumId: 'coding', src: 'https://picsum.photos/seed/c3/600/400', alt: '代码2' },
  { albumId: 'coding', src: 'https://picsum.photos/seed/c4/400/600', alt: '代码3' },
  // 美食
  { albumId: 'food', src: 'https://picsum.photos/seed/f2/600/400', alt: '美食1' },
  { albumId: 'food', src: 'https://picsum.photos/seed/f3/600/400', alt: '美食2' },
  { albumId: 'food', src: 'https://picsum.photos/seed/f4/400/600', alt: '美食3' },
  { albumId: 'food', src: 'https://picsum.photos/seed/f5/600/400', alt: '美食4' },
  { albumId: 'food', src: 'https://picsum.photos/seed/f6/600/400', alt: '美食5' },
]
