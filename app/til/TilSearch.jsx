'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './TilSearch.module.css'

export default function TilSearch({ entries }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? entries.filter(e => {
        const q = query.toLowerCase()
        return (
          e.title.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q))
        )
      })
    : []

  return (
    <div>
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="제목, 태그 검색..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {query.trim() && (
        <div>
          <p className={styles.resultCount}>{filtered.length}개 결과</p>
          {filtered.length === 0 ? (
            <p className={styles.empty}>검색 결과가 없습니다.</p>
          ) : (
            <div className={styles.resultGrid}>
              {filtered.map(entry => (
                <Link key={entry.date} href={`/til/${entry.date}`} className={styles.dayCard}>
                  <div className={styles.dateLine}>
                    <strong>{entry.day}</strong>
                    <span>{entry.weekday}</span>
                  </div>
                  <div>
                    <div className={styles.cardDate}>{entry.displayDate}</div>
                    <div className={styles.cardTitle}>{entry.title}</div>
                    <div className={styles.cardMeta}>
                      {entry.sectionCount}개 항목
                      {entry.tags.length > 0 && ` · ${entry.tags.slice(0, 3).join(', ')}`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
