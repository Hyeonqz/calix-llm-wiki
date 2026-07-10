import fs from 'fs'
import path from 'path'
import GithubSlugger from 'github-slugger'

const POSTS_DIR = path.join(process.cwd(), 'posts')

// h2/h3 헤딩 → 목차 항목. rehype-slug와 동일한 github-slugger로 id 생성해 앵커 일치.
function buildToc(body) {
  const slugger = new GithubSlugger()
  const toc = []
  for (const line of body.split('\n')) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/)
    if (!m) continue
    const text = m[2].replace(/[*`_]/g, '')
    toc.push({ depth: m[1].length, text, id: slugger.slug(text) })
  }
  return toc
}

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

// `tags: [a, b]`, `tags: ["a", "b"]`, `tags: a, b` 모두 지원
function parseList(value) {
  if (!value) return []
  return value
    .trim()
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((item) => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

export function getPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const { data, body } = parseFrontmatter(raw)
      const parsedTags = parseList(data.tags)
      const category = data.category || '기타'
      return {
        slug: file.replace('.md', ''),
        title: data.title || file,
        description: data.description || '',
        date: data.date || '',
        displayDate: data.date ? formatDate(data.date) : '',
        category,
        // 명시적 tags가 없으면 category를 단일 태그로 사용 (필터/칩 동작 보장)
        tags: parsedTags.length ? parsedTags : [category],
        hero: data.hero || '',
        heroCaption: data.heroCaption || '',
        readMinutes: Math.max(1, Math.round(body.length / 700)),
        body,
        raw,
        toc: buildToc(body),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug) {
  return getPosts().find((post) => post.slug === slug) ?? null
}
