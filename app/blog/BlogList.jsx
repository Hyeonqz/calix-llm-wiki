'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './blog.module.css'

const THUMB_STYLES = {
  백엔드: { background: 'linear-gradient(135deg, #34c77b, #1fa867)', label: 'Be' },
  데이터베이스: { background: 'linear-gradient(135deg, #4593fc, #2272eb)', label: 'Db' },
  AI: { background: 'linear-gradient(135deg, #8e7cf3, #6b57e8)', label: 'AI' },
  회고: { background: 'linear-gradient(135deg, #3e4a5c, #232b38)', label: 'Re' },
}

const DEFAULT_THUMB = { background: 'linear-gradient(135deg, #ff9e44, #f97f2b)', label: 'Cx' }

export default function BlogList({ posts }) {
  const [category, setCategory] = useState('전체')
  const categories = ['전체', ...new Set(posts.map((post) => post.category))]
  const visible = category === '전체' ? posts : posts.filter((post) => post.category === category)

  return (
    <>
      {categories.length > 2 && (
        <div className={styles.cats}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cat === category ? styles.catActive : styles.cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className={styles.postList}>
        {visible.length === 0 && <p className={styles.empty}>아직 글이 없습니다.</p>}
        {visible.map((post) => {
          const thumb = THUMB_STYLES[post.category] ?? DEFAULT_THUMB
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.post}>
              <div className={styles.postBody}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postDesc}>{post.description}</p>
                <div className={styles.postMeta}>
                  <span className={styles.chip}>{post.category}</span>
                  <span>{post.displayDate}</span>
                  <span>·</span>
                  <span>{post.readMinutes}분</span>
                </div>
              </div>
              <div className={styles.thumb} style={{ background: thumb.background }} aria-hidden="true">
                {thumb.label}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
