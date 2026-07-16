'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ReadingProgress() {
  const pathname = usePathname()
  const [pct, setPct] = useState(0)
  const active = pathname.startsWith('/books/') // /books 랜딩은 제외

  useEffect(() => {
    if (!active) return
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [active, pathname])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 'var(--nextra-navbar-height, 64px)',
        left: 0,
        height: '2px',
        width: `${pct}%`,
        background: '#3182f6',
        transition: 'width 0.1s linear',
        zIndex: 30,
      }}
    />
  )
}
