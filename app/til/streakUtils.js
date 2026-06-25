export function computeStreak(entries) {
  if (!entries || entries.length === 0) return { current: 0, longest: 0 }

  const dates = [...entries].map(e => e.date).sort()

  let longest = 1
  let run = 1

  for (let i = 1; i < dates.length; i++) {
    const diffDays = dateDiffDays(dates[i - 1], dates[i])
    if (diffDays === 1) {
      run++
      if (run > longest) longest = run
    } else {
      run = 1
    }
  }

  // current: streak ending at the most recent entry, only if that entry is today or yesterday
  const lastDate = dates[dates.length - 1]
  const todayStr = toDateStr(new Date())
  const yesterdayStr = toDateStr(new Date(Date.now() - 86400000))
  const isActive = lastDate === todayStr || lastDate === yesterdayStr

  let current = 0
  if (isActive) {
    current = 1
    for (let i = dates.length - 1; i > 0; i--) {
      if (dateDiffDays(dates[i - 1], dates[i]) === 1) {
        current++
      } else {
        break
      }
    }
  }

  return { current, longest }
}

function dateDiffDays(a, b) {
  return (parseUTC(b) - parseUTC(a)) / 86400000
}

function parseUTC(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
