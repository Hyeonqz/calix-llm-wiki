import fs from 'fs'
import styles from './til.module.css'
import { computeStreak } from './streakUtils'
import { collectTilFiles } from './tilFiles'
import TilLogoutButton from './TilLogoutButton'
import TilInteractiveSection from './TilInteractiveSection'

export const metadata = { title: 'TIL | Calix Wiki' }

const weekdayFormatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
})

export default function TilListPage() {
  const entries = getTilEntries()
  const months = groupByMonth(entries)
  const latest = entries[0]
  const totalSections = entries.reduce((sum, entry) => sum + entry.sectionCount, 0)
  const activeDays = entries.length
  const streak = computeStreak(entries)

  return (
    <main className={styles.wrapper}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Learning Journal</p>
          <h1 className={styles.heading}>Today I Learned</h1>
          <p className={styles.description}>
            날짜별 기록을 월, 주, 일 단위로 묶어 최근 흐름과 빈도를 빠르게 훑어볼 수 있습니다.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <TilLogoutButton />
          </div>
          <div className={styles.summaryGrid} aria-label="TIL summary">
            <SummaryMetric label="기록일" value={activeDays} />
            <SummaryMetric label="학습 항목" value={totalSections} />
            <SummaryMetric label="최근 기록" value={latest?.displayDate ?? '-'} />
            <SummaryMetric label="최장 스트릭" value={`${streak.longest}일`} />
          </div>
        </div>
      </header>

      {entries.length === 0 ? (
        <section className={styles.empty}>아직 기록이 없습니다.</section>
      ) : (
        <TilInteractiveSection entries={entries} months={months} />
      )}
    </main>
  )
}

function SummaryMetric({ label, value }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}


function getTilEntries() {
  return collectTilFiles()
    .reverse()
    .map(({ date, path: filePath }) => {
      const content = readTilFile(filePath)
      const parsedDate = parseLocalDate(date)
      const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim())
      const tags = [...new Set([...content.matchAll(/#([A-Za-z0-9_-]+)/g)].map((match) => `#${match[1]}`))]

      return {
        date,
        displayDate: `${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`,
        day: String(parsedDate.getDate()).padStart(2, '0'),
        weekday: weekdayFormatter.format(parsedDate),
        monthKey: date.slice(0, 7),
        monthLabel: monthFormatter.format(parsedDate),
        weekKey: getWeekKey(parsedDate),
        weekLabel: `${getWeekOfMonth(parsedDate)}주차`,
        title: content ? headings[0] || normalizeTitle(content, date) : '읽기 권한이 필요한 기록',
        sectionCount: headings.length || 1,
        tags,
      }
    })
}

function readTilFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

function groupByMonth(entries) {
  const monthMap = new Map()

  for (const entry of entries) {
    if (!monthMap.has(entry.monthKey)) {
      monthMap.set(entry.monthKey, {
        key: entry.monthKey,
        label: entry.monthLabel,
        entries: [],
        weeks: new Map(),
        sectionCount: 0,
      })
    }

    const month = monthMap.get(entry.monthKey)
    month.entries.push(entry)
    month.sectionCount += entry.sectionCount

    if (!month.weeks.has(entry.weekKey)) {
      month.weeks.set(entry.weekKey, {
        key: entry.weekKey,
        label: entry.weekLabel,
        entries: [],
      })
    }
    month.weeks.get(entry.weekKey).entries.push(entry)
  }

  return [...monthMap.values()].map((month) => ({
    ...month,
    weeks: [...month.weeks.values()],
  }))
}

function parseLocalDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getWeekOfMonth(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstMondayOffset = (firstDay.getDay() + 6) % 7
  return Math.ceil((date.getDate() + firstMondayOffset) / 7)
}

function getWeekKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-w${getWeekOfMonth(date)}`
}

function normalizeTitle(content, date) {
  const firstHeading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  return firstHeading || `TIL ${date}`
}
