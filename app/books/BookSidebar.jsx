'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BookSidebar.module.css'
import FullscreenButton from './FullscreenButton'

// 책 상세 전용 사이드바 — 그 책의 목차(부/장)만 보여준다.
// items: [{ type: 'part', title } | { type: 'chapter', href, label }]
export default function BookSidebar({ bookTitle, items }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label={`${bookTitle} 목차`}>
      <Link href="/books" className={styles.back}>← 전자책</Link>
      <p className={styles.bookTitle}>{bookTitle}</p>
      <FullscreenButton className={styles.fsBtn} />
      <ul className={styles.list}>
        {items.map((item, i) =>
          item.type === 'part' ? (
            <li key={`p-${i}`} className={styles.part}>
              {item.title}
            </li>
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? styles.chapterActive : styles.chapter}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}
