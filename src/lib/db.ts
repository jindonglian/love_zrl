import { supabase } from './supabase.ts'

// ========== 类型 ==========
export interface Post { id: number; slug: string; title: string; description?: string; content: string; tags: string[]; created_at: string; updated_at: string }
export interface Album { id: number; name: string; description?: string; cover_url?: string; created_at: string }
export interface Photo { id: number; album_id: number; url: string; alt?: string; created_at: string }
export interface Note { id: number; title: string; content: string; tags: string[]; parent_id: number | null; created_at: string; updated_at: string }
export interface LoveMemory { id: number; title: string; description?: string; date: string; image_url?: string; created_by?: string; created_at: string }
export interface LovePhoto { id: number; url: string; uploaded_by?: string; created_at: string }
export interface Message { id: number; author: string; content: string; created_at: string }
export interface WritingDraft { id: number; title: string; content: string; created_at: string; updated_at: string }

// ========== 博客 ==========
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (error) { console.error('fetchPosts:', error); return [] }
  return data as Post[]
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single()
  if (error) { console.error('fetchPostBySlug:', error); return null }
  return data as Post
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').insert(post).select().single()
  if (error) { console.error('createPost:', error); return null }
  return data as Post
}

export async function updatePost(id: number, updates: Partial<Post>): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) { console.error('updatePost:', error); return null }
  return data as Post
}

export async function deletePost(id: number): Promise<boolean> {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) { console.error('deletePost:', error); return false }
  return true
}

// ========== 相册 ==========
export async function fetchAlbums(): Promise<Album[]> {
  const { data, error } = await supabase.from('albums').select('*').order('created_at', { ascending: false })
  if (error) { console.error('fetchAlbums:', error); return [] }
  return data as Album[]
}

export async function createAlbum(album: { name: string; description?: string; cover_url?: string }): Promise<Album | null> {
  const { data, error } = await supabase.from('albums').insert(album).select().single()
  if (error) { console.error('createAlbum:', error); return null }
  return data as Album
}

export async function deleteAlbum(id: number): Promise<boolean> {
  const { error } = await supabase.from('albums').delete().eq('id', id)
  if (error) { console.error('deleteAlbum:', error); return false }
  return true
}

export async function fetchPhotos(albumId?: number): Promise<Photo[]> {
  let q = supabase.from('photos').select('*').order('created_at', { ascending: false })
  if (albumId) q = q.eq('album_id', albumId)
  const { data, error } = await q
  if (error) { console.error('fetchPhotos:', error); return [] }
  return data as Photo[]
}

export async function uploadPhoto(file: File, bucket: string): Promise<string | null> {
  const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const { data, error } = await supabase.storage.from(bucket).upload(name, file)
  if (error) { console.error('uploadPhoto:', error); return null }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function addPhoto(albumId: number, url: string, alt?: string): Promise<Photo | null> {
  const { data, error } = await supabase.from('photos').insert({ album_id: albumId, url, alt }).select().single()
  if (error) { console.error('addPhoto:', error); return null }
  return data as Photo
}

export async function deletePhoto(id: number): Promise<boolean> {
  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) { console.error('deletePhoto:', error); return false }
  return true
}

// ========== 学习笔记 ==========
export async function fetchNotes(parentId?: number | null): Promise<Note[]> {
  let q = supabase.from('notes').select('*').order('created_at', { ascending: false })
  if (parentId === undefined) q = q.is('parent_id', null)
  else q = q.eq('parent_id', parentId)
  const { data, error } = await q
  if (error) { console.error('fetchNotes:', error); return [] }
  return data as Note[]
}

export async function createNote(note: { title: string; content: string; tags?: string[]; parent_id?: number | null }): Promise<Note | null> {
  const { data, error } = await supabase.from('notes').insert(note).select().single()
  if (error) { console.error('createNote:', error); return null }
  return data as Note
}

export async function updateNote(id: number, updates: Partial<Note>): Promise<Note | null> {
  const { data, error } = await supabase.from('notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) { console.error('updateNote:', error); return null }
  return data as Note
}

export async function deleteNote(id: number): Promise<boolean> {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) { console.error('deleteNote:', error); return false }
  return true
}

// ========== 情侣空间 ==========
export async function fetchLoveMemories(): Promise<LoveMemory[]> {
  const { data, error } = await supabase.from('love_memories').select('*').order('date', { ascending: false })
  if (error) { console.error('fetchLoveMemories:', error); return [] }
  return data as LoveMemory[]
}

export async function createLoveMemory(mem: { title: string; description?: string; date: string; image_url?: string; created_by?: string }): Promise<LoveMemory | null> {
  const { data, error } = await supabase.from('love_memories').insert(mem).select().single()
  if (error) { console.error('createLoveMemory:', error); return null }
  return data as LoveMemory
}

export async function deleteLoveMemory(id: number): Promise<boolean> {
  const { error } = await supabase.from('love_memories').delete().eq('id', id)
  if (error) { console.error('deleteLoveMemory:', error); return false }
  return true
}

export async function fetchLovePhotos(): Promise<LovePhoto[]> {
  const { data, error } = await supabase.from('love_photos').select('*').order('created_at', { ascending: false })
  if (error) { console.error('fetchLovePhotos:', error); return [] }
  return data as LovePhoto[]
}

export async function addLovePhoto(url: string, uploadedBy?: string): Promise<LovePhoto | null> {
  const { data, error } = await supabase.from('love_photos').insert({ url, uploaded_by: uploadedBy }).select().single()
  if (error) { console.error('addLovePhoto:', error); return null }
  return data as LovePhoto
}

export async function deleteLovePhoto(id: number): Promise<boolean> {
  const { error } = await supabase.from('love_photos').delete().eq('id', id)
  if (error) { console.error('deleteLovePhoto:', error); return false }
  return true
}

export async function fetchLoveSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase.from('love_settings').select('value').eq('key', key).single()
  if (error) return null
  return (data as { value: string }).value
}

export async function upsertLoveSetting(key: string, value: string): Promise<boolean> {
  const { error } = await supabase.from('love_settings').upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) { console.error('upsertLoveSetting:', error); return false }
  return true
}

// ========== 留言板 ==========
export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(100)
  if (error) { console.error('fetchMessages:', error); return [] }
  return data as Message[]
}

export async function createMessage(author: string, content: string): Promise<Message | null> {
  const { data, error } = await supabase.from('messages').insert({ author, content }).select().single()
  if (error) { console.error('createMessage:', error); return null }
  return data as Message
}

// ========== 写作 ==========
export async function fetchWritingDrafts(): Promise<WritingDraft[]> {
  const { data, error } = await supabase.from('writing_drafts').select('*').order('updated_at', { ascending: false })
  if (error) { console.error('fetchWritingDrafts:', error); return [] }
  return data as WritingDraft[]
}

export async function createWritingDraft(title?: string, content?: string): Promise<WritingDraft | null> {
  const { data, error } = await supabase.from('writing_drafts').insert({ title: title || '未命名', content: content || '' }).select().single()
  if (error) { console.error('createWritingDraft:', error); return null }
  return data as WritingDraft
}

export async function updateWritingDraft(id: number, updates: { title?: string; content?: string }): Promise<WritingDraft | null> {
  const { data, error } = await supabase.from('writing_drafts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) { console.error('updateWritingDraft:', error); return null }
  return data as WritingDraft
}

export async function deleteWritingDraft(id: number): Promise<boolean> {
  const { error } = await supabase.from('writing_drafts').delete().eq('id', id)
  if (error) { console.error('deleteWritingDraft:', error); return false }
  return true
}
