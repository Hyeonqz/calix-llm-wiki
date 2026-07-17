'use client'

import { useState, useEffect } from 'react'

// 브라우저 전체화면(Fullscreen API) 토글 버튼.
export default function FullscreenButton({ className }) {
  const [fs, setFs] = useState(false)

  useEffect(() => {
    const onChange = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      document.documentElement.requestFullscreen?.()
    }
  }

  return (
    <button type="button" onClick={toggle} className={className}>
      {fs ? '⛶ 전체화면 종료' : '⛶ 전체화면'}
    </button>
  )
}
