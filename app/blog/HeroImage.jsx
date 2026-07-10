'use client'

import { useState } from 'react'
import styles from './blog.module.css'

export default function HeroImage({ src, caption, alt }) {
  const [broken, setBroken] = useState(false)
  if (broken) return null

  return (
    <figure className={styles.hero}>
      <img src={src} alt={alt} onError={() => setBroken(true)} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
