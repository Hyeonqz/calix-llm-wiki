'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './blog.module.css'

// 카드 썸네일 배경 — hero 이미지 대신 카테고리별 그라디언트 위에 제목 텍스트를 얹는다
const THUMB_STYLES = {
  백엔드: { background: 'linear-gradient(135deg, #34c77b, #1fa867)' },
  데이터베이스: { background: 'linear-gradient(135deg, #4593fc, #2272eb)' },
  AI: { background: 'linear-gradient(135deg, #8e7cf3, #6b57e8)' },
  회고: { background: 'linear-gradient(135deg, #3e4a5c, #232b38)' },
}

const DEFAULT_THUMB = { background: 'linear-gradient(135deg, #ff9e44, #f97f2b)' }

const PER_PAGE = 12 // 가로 3 × 세로 4

export default function BlogList({ posts }) {
  const [tag, setTag] = useState('전체')
  const [page, setPage] = useState(1)

  const allTags = ['전체', ...new Set(posts.flatMap((post) => post.tags))]
  const filtered = tag === '전체' ? posts : posts.filter((post) => post.tags.includes(tag))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const selectTag = (next) => {
    setTag(next)
    setPage(1)
  }

  return (
    <>
      <div className={styles.cats}>
        {allTags.map((name) => (
          <button
            key={name}
            type="button"
            className={name === tag ? styles.catActive : styles.cat}
            onClick={() => selectTag(name)}
          >
            {name === '전체' ? name : `#${name}`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>아직 글이 없습니다.</p>
      ) : (
        <div className={styles.grid}>
          {visible.map((post) => {
            const thumb = THUMB_STYLES[post.category] ?? DEFAULT_THUMB
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.cardThumb} style={{ background: thumb.background }}>
                  <span className={styles.cardThumbCategory}>{post.category}</span>
                  <span className={styles.cardThumbTitle}>{post.title}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTags}>
                    {post.tags.slice(0, 3).map((name) => (
                      <span
                        key={name}
                        className={name === tag ? styles.cardTagActive : styles.cardTag}
                      >
                        #{name}
                      </span>
                    ))}
                  </div>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardDesc}>{post.description}</p>
                  <div className={styles.cardMeta}>
                    {post.displayDate} · {post.readMinutes}분
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="페이지 이동">
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={n === currentPage ? styles.pageBtnActive : styles.pageBtn}
              onClick={() => setPage(n)}
              aria-current={n === currentPage ? 'page' : undefined}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            →
          </button>
        </nav>
      )}
    </>
  )
}
