'use client'

import styles from './TilTagFilter.module.css'

export default function TilTagFilter({ allTags, activeTag, onTagChange }) {
  if (!allTags || allTags.length === 0) return null

  return (
    <div className={styles.container}>
      {allTags.map((tag) => {
        const isActive = tag === activeTag
        return (
          <button
            key={tag}
            className={isActive ? `${styles.pill} ${styles.pillActive}` : styles.pill}
            onClick={() => onTagChange(isActive ? null : tag)}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
