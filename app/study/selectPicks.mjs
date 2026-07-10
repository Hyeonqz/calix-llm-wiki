// Pure curriculum selection — no fs, no React. Unit-testable via `node --test`.
// ISO date strings (YYYY-MM-DD) compare lexicographically = chronologically.

export function dueToday(categories, todayISO) {
  const due = []
  for (const cat of categories) {
    for (const t of cat.topics) {
      if (t.srs && t.srs.next <= todayISO) due.push({ ...t, category: cat.label })
    }
  }
  return due
}

export function nextTodos(categories, limit) {
  const queues = categories.map((cat) =>
    cat.topics
      .filter((t) => t.status === 'todo')
      .sort((a, b) => a.added.localeCompare(b.added))
      .map((t) => ({ ...t, category: cat.label }))
  )
  const picks = []
  let i = 0
  while (picks.length < limit && queues.some((q) => q.length)) {
    const q = queues[i % queues.length]
    if (q.length) picks.push(q.shift())
    i++
  }
  return picks
}

export function todaysPicks(categories, todayISO, limit = 3) {
  const due = dueToday(categories, todayISO)
  const todos = nextTodos(categories, Math.max(0, limit - due.length))
  return { due, todos }
}
