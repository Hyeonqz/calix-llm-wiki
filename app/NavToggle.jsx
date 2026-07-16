'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavToggle.module.css'

export default function NavToggle() {
  const pathname = usePathname()
  const isBlog = pathname.startsWith('/blog')
  const isBook = pathname.startsWith('/books')
  const isWiki = !isBlog && !isBook

  return (
    <nav className={styles.seg} aria-label="위키/블로그/전자책 전환">
      <Link href="/" className={isWiki ? styles.itemActive : styles.item}>
        위키
      </Link>
      <Link href="/blog" className={isBlog ? styles.itemActive : styles.item}>
        블로그
      </Link>
      <Link href="/books" className={isBook ? styles.itemActive : styles.item}>
        전자책
      </Link>
    </nav>
  )
}
