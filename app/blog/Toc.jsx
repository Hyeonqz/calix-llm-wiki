'use client'

import { useEffect, useState } from 'react'
import styles from './blog.module.css'

export default function Toc({ toc }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean)
    if (!headings.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px' }
    )
    headings.forEach((h) => obs.observe(h))
    return () => obs.disconnect()
  }, [toc])

  if (!toc.length) return null

  return (
    <nav className={styles.toc} aria-label="목차">
      <p className={styles.tocTitle}>목차</p>
      <ul className={styles.tocList}>
        {toc.map((t) => (
          <li key={t.id} style={{ paddingLeft: t.depth === 3 ? 12 : 0 }}>
            <a
              href={`#${t.id}`}
              className={active === t.id ? styles.tocLinkActive : styles.tocLink}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
