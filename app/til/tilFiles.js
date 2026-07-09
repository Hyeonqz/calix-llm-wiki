import fs from 'fs'
import path from 'path'

const DATE_RE = /^(\d{4}-\d{2}-\d{2})\.md$/

// Recursively collect TIL entries from TIL/, independent of folder layout.
// The date lives in the filename, so the on-disk structure is free to evolve
// (flat → 연/월 → 연/분기/월) without touching this reader.
function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full))
    } else {
      const match = entry.name.match(DATE_RE)
      if (match) out.push({ date: match[1], path: full })
    }
  }
  return out
}

// Returns [{ date, path }] sorted ascending by date.
export function collectTilFiles() {
  const tilDir = path.join(process.cwd(), 'TIL')
  if (!fs.existsSync(tilDir)) return []
  return walk(tilDir).sort((a, b) => a.date.localeCompare(b.date))
}

// Resolve a YYYY-MM-DD date to its file path regardless of folder nesting.
export function tilFilePath(date) {
  return collectTilFiles().find((entry) => entry.date === date)?.path ?? null
}
