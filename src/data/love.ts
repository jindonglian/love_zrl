/** 情侣空间数据 — 修改为你的真实信息 */
export interface Memory {
  date: string
  title: string
  description: string
  image?: string
}

export const anniversary = '2025-01-01' // 纪念日，格式 YYYY-MM-DD

export const loveStory = {
  name1: '东东',
  name2: 'TA的名字',
  memories: [
    { date: '2024-09-01', title: '初次相遇', description: '那天的阳光正好，你刚好经过。', image: 'https://picsum.photos/seed/love1/600/400' },
    { date: '2024-10-15', title: '第一次约会', description: '紧张到手心出汗，但看到你的笑容就什么都忘了。', image: 'https://picsum.photos/seed/love2/600/400' },
    { date: '2025-01-01', title: '在一起的这一天', description: '从今天起，每一天都值得纪念。', image: 'https://picsum.photos/seed/love3/600/400' },
    { date: '2025-02-14', title: '第一个情人节', description: '原来被爱是这样美好的一件事。', image: 'https://picsum.photos/seed/love4/400/600' },
    { date: '2025-05-01', title: '第一次旅行', description: '目的地不重要，重要的是和你一起。', image: 'https://picsum.photos/seed/love5/600/400' },
  ] as Memory[],
}

export const loveGallery = [
  'https://picsum.photos/seed/lg1/400/400',
  'https://picsum.photos/seed/lg2/400/400',
  'https://picsum.photos/seed/lg3/400/400',
  'https://picsum.photos/seed/lg4/400/400',
  'https://picsum.photos/seed/lg5/400/400',
  'https://picsum.photos/seed/lg6/400/400',
]
