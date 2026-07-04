'use client'

import styles from './blog.module.css'

export default function DownloadMd({ raw, slug }) {
  function download() {
    const blob = new Blob([raw], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" onClick={download} className={styles.downloadBtn}>
      ↓ .md 다운로드
    </button>
  )
}
