'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './DocSearch.module.css'

export default function DocSearch({ pages }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const router = useRouter()
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const filtered = query.trim()
    ? pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIdx(0)
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [close])

  function handleKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      router.push(filtered[activeIdx].path)
      close()
    } else if (e.key === 'Escape') {
      close()
      inputRef.current?.blur()
    }
  }

  function handleChange(e) {
    setQuery(e.target.value)
    setOpen(true)
    setActiveIdx(0)
  }

  function handleSelect(path) {
    router.push(path)
    close()
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={containerRef} className={styles.wrap}>
      <div className={styles.inputWrap}>
        <svg className={styles.icon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search docs..."
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search documentation"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && (
        <div className={styles.dropdown} role="listbox">
          {filtered.length === 0 ? (
            <div className={styles.empty}>검색 결과가 없습니다.</div>
          ) : (
            filtered.map((page, i) => (
              <button
                key={page.path}
                className={`${styles.item} ${i === activeIdx ? styles.itemActive : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => handleSelect(page.path)}
                role="option"
                aria-selected={i === activeIdx}
              >
                <span className={styles.itemTitle}>{page.title}</span>
                <span className={styles.itemPath}>{page.path}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
