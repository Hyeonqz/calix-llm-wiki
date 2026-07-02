import fs from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'posts')

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { data: {}, body: raw }
  const data = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = value
  }
  return { data, body: raw.slice(match[0].length) }
}

function formatDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  return `${y}. ${m}. ${d}`
}

export function getPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const { data, body } = parseFrontmatter(raw)
      return {
        slug: file.replace('.md', ''),
        title: data.title || file,
        description: data.description || '',
        date: data.date || '',
        displayDate: data.date ? formatDate(data.date) : '',
        category: data.category || '기타',
        readMinutes: Math.max(1, Math.round(body.length / 700)),
        body,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug) {
  return getPosts().find((post) => post.slug === slug) ?? null
}
