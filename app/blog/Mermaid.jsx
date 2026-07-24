'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import styles from './blog.module.css'

// mermaid.render 는 다이어그램마다 고유 id 를 요구한다. 모듈 스코프 카운터로 부여.
let seq = 0

// 사이트 테마(html.dark 클래스)에 맞춰 mermaid 테마를 고른다.
function currentTheme() {
  if (typeof document === 'undefined') return 'default'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default'
}

export default function Mermaid({ chart }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const idRef = useRef(`mermaid-${seq++}`)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: currentTheme(),
          securityLevel: 'strict', // 공개 블로그 — 사용자/AI가 넣은 코드이므로 sanitize
          fontFamily: 'inherit',
        })
        const out = await mermaid.render(idRef.current, chart)
        if (!cancelled) {
          setSvg(out.svg)
          setError('')
        }
      } catch (e) {
        if (!cancelled) setError(String(e?.message || e))
      }
    }

    render()

    // 라이트/다크 토글 시 다이어그램도 다시 그린다.
    const observer = new MutationObserver(render)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [chart])

  // 렌더 실패 시 원본 소스를 그대로 보여줘 디버깅 가능하게.
  if (error) {
    return (
      <pre className={styles.mermaidError}>
        {`mermaid 렌더 실패: ${error}\n\n${chart}`}
      </pre>
    )
  }

  return (
    <div
      className={styles.mermaid}
      role="img"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
