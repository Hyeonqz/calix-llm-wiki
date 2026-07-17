import fs from 'fs'
import path from 'path'

const BOOKS_DIR = path.join(process.cwd(), 'content', 'books')

// index.md 프론트매터(---...---)에서 `key: value` 를 파싱. 따옴표 제거.
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  const fm = {}
  if (!m) return fm
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return fm
}

// _meta.js 소스에서 실제 챕터(장) 수 = `'key': '문자열라벨'` 라인 중
// index·부록(appendix)을 제외. separator 항목은 `'key': { ... }` 형태라
// 문자열 라벨 정규식에 애초에 걸리지 않는다. 부록은 "장"이 아니므로 뺀다.
export function countChapters(metaSource) {
  let n = 0
  for (const line of metaSource.split('\n')) {
    const m = line.match(/^\s*['"]?([\w-]+)['"]?\s*:\s*['"]/)
    if (m && m[1] !== 'index' && !m[1].startsWith('appendix')) n++
  }
  return n
}

// 파트 수 = separator 개수. 단 부록(appendix) 구분자는 파트로 세지 않는다.
export function countParts(metaSource) {
  let n = 0
  for (const line of metaSource.split('\n')) {
    if (!/type:\s*['"]separator['"]/.test(line)) continue
    const key = line.match(/^\s*['"]?([\w-]+)['"]?\s*:/)
    if (key && /appendix|부록/i.test(key[1])) continue
    n++
  }
  return n
}

// _meta.js 소스를 순서대로 읽어 그 책의 목차(부/장) 항목 배열을 만든다.
// 반환: [{ type: 'part', title } | { type: 'chapter', href, label }] (등장 순서 유지).
export function parseBookNav(metaSource, bookSlug) {
  const items = []
  for (const line of metaSource.split('\n')) {
    const sep = line.match(/type:\s*['"]separator['"][\s\S]*?title:\s*['"]([^'"]+)['"]/)
    if (sep) {
      items.push({ type: 'part', title: sep[1] })
      continue
    }
    const ch = line.match(/^\s*['"]?([\w-]+)['"]?\s*:\s*['"]([^'"]*)['"]\s*,?\s*$/)
    if (ch) {
      const key = ch[1]
      const label = ch[2]
      const href = key === 'index' ? `/books/${bookSlug}` : `/books/${bookSlug}/${key}`
      items.push({ type: 'chapter', href, label })
    }
  }
  return items
}

// fs로 그 책의 _meta.js를 읽어 목차 항목을 반환. 없으면 빈 배열.
export function readBookNav(bookSlug) {
  try {
    const src = fs.readFileSync(path.join(BOOKS_DIR, bookSlug, '_meta.js'), 'utf-8')
    return parseBookNav(src, bookSlug)
  } catch {
    return []
  }
}

// 책 상세 렌더에 필요한 제목 + 목차를 한 번에 반환.
export function readBook(bookSlug) {
  const dir = path.join(BOOKS_DIR, bookSlug)
  let fm = {}
  try {
    fm = parseFrontmatter(fs.readFileSync(path.join(dir, 'index.md'), 'utf-8'))
  } catch {}
  return {
    slug: bookSlug,
    title: fm.book || fm.title || bookSlug,
    nav: readBookNav(bookSlug),
  }
}

// content/books/*/ 를 훑어 라이브러리 카드용 메타를 만든다.
export function readBooks() {
  let entries = []
  try {
    entries = fs.readdirSync(BOOKS_DIR, { withFileTypes: true })
  } catch {
    return []
  }
  const books = []
  for (const d of entries) {
    if (!d.isDirectory()) continue
    const slug = d.name
    const dir = path.join(BOOKS_DIR, slug)
    let fm = {}
    let chapters = 0
    let parts = 0
    try {
      fm = parseFrontmatter(fs.readFileSync(path.join(dir, 'index.md'), 'utf-8'))
    } catch {}
    try {
      const metaSrc = fs.readFileSync(path.join(dir, '_meta.js'), 'utf-8')
      chapters = countChapters(metaSrc)
      parts = countParts(metaSrc)
    } catch {}
    books.push({
      slug,
      title: fm.book || fm.title || slug,
      description: fm.description || '',
      status: fm.status || '',
      chapters,
      parts,
      href: `/books/${slug}`,
    })
  }
  return books
}
