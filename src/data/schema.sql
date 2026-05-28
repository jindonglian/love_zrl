-- 在 Supabase SQL Editor 中执行以下语句建表

-- 博客文章
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 相册
CREATE TABLE IF NOT EXISTS albums (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 照片
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  album_id BIGINT REFERENCES albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习笔记
CREATE TABLE IF NOT EXISTS notes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  parent_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 情侣空间时间线
CREATE TABLE IF NOT EXISTS love_memories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  image_url TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 情侣空间照片墙
CREATE TABLE IF NOT EXISTS love_photos (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 留言板
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 论文/写作草稿
CREATE TABLE IF NOT EXISTS writing_drafts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '未命名',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_love_memories_date ON love_memories(date DESC);
CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album_id);

-- 存储桶（文件上传用）
-- 在 Supabase Storage 页面手动创建 bucket: photos, love-photos
-- 权限设 public read
