'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavToggle.module.css'

export default function NavToggle() {
  const pathname = usePathname()
  const isBlog = pathname.startsWith('/blog')

  return (
    <nav className={styles.seg} aria-label="위키/블로그 전환">
      <Link href="/" className={isBlog ? styles.item : styles.itemActive}>
        위키
      </Link>
      <Link href="/blog" className={isBlog ? styles.itemActive : styles.item}>
        블로그
      </Link>
    </nav>
  )
}
