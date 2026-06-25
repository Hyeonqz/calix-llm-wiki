'use client'

import { useState } from 'react'
import Link from 'next/link'
import TilSearch from './TilSearch'
import TilTagFilter from './TilTagFilter'
import styles from './til.module.css'

export default function TilInteractiveSection({ entries, months }) {
  const [activeTag, setActiveTag] = useState(null)

  const allTags = [...new Set(entries.flatMap(e => e.tags))].sort()

  const tagFilteredEntries = activeTag
    ? entries.filter(e => e.tags.includes(activeTag))
    : entries

  return (
    <div>
      <TilSearch entries={tagFilteredEntries} />

      {allTags.length > 0 && (
        <TilTagFilter allTags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
      )}

      {activeTag ? (
        <FilteredResults entries={tagFilteredEntries} />
      ) : (
        <div className={styles.layout}>
          <aside className={styles.monthRail} aria-label="월별 바로가기">
            <div className={styles.railTitle}>월별</div>
            {months.map((month) => (
              <a key={month.key} href={`#month-${month.key}`} className={styles.monthLink}>
                <span>{month.label}</span>
                <strong>{month.entries.length}</strong>
              </a>
            ))}
          </aside>

          <section className={styles.timeline} aria-label="TIL timeline">
            {months.map((month) => (
              <MonthSection key={month.key} month={month} />
            ))}
          </section>
        </div>
      )}
    </div>
  )
}

function FilteredResults({ entries }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <p style={{ marginBottom: '12px', color: '#6b7280', fontSize: '0.88rem', fontWeight: 700 }}>
        {entries.length}개 결과
      </p>
      {entries.length === 0 ? (
        <section className={styles.empty}>해당 태그의 기록이 없습니다.</section>
      ) : (
        <div className={styles.dayGrid}>
          {entries.map((entry) => (
            <Link key={entry.date} href={`/til/${entry.date}`} className={styles.dayCard}>
              <span className={styles.dateLine}>
                <strong>{entry.day}</strong>
                <span>{entry.weekday}</span>
              </span>
              <span className={styles.cardDate}>{entry.date}</span>
              <span className={styles.cardTitle}>{entry.title}</span>
              <span className={styles.cardMeta}>
                {entry.sectionCount} sections
                {entry.tags.length > 0 ? ` · ${entry.tags.slice(0, 2).join(', ')}` : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MonthSection({ month }) {
  return (
    <section id={`month-${month.key}`} className={styles.monthSection}>
      <header className={styles.monthHeader}>
        <div>
          <h2>{month.label}</h2>
          <p>{month.entries.length}일 기록, {month.sectionCount}개 학습 항목</p>
        </div>
      </header>

      <div className={styles.weekStack}>
        {month.weeks.map((week) => (
          <section key={week.key} className={styles.weekSection}>
            <div className={styles.weekHeader}>
              <span>{week.label}</span>
              <strong>{week.entries.length}일</strong>
            </div>
            <div className={styles.dayGrid}>
              {week.entries.map((entry) => (
                <Link key={entry.date} href={`/til/${entry.date}`} className={styles.dayCard}>
                  <span className={styles.dateLine}>
                    <strong>{entry.day}</strong>
                    <span>{entry.weekday}</span>
                  </span>
                  <span className={styles.cardDate}>{entry.date}</span>
                  <span className={styles.cardTitle}>{entry.title}</span>
                  <span className={styles.cardMeta}>
                    {entry.sectionCount} sections
                    {entry.tags.length > 0 ? ` · ${entry.tags.slice(0, 2).join(', ')}` : ''}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
