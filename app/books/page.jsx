import { readBooks } from './booksData'
import styles from './books.module.css'

export const metadata = {
  title: '전자책 | Calix Wiki',
  description: '긴 호흡으로 읽는 책을 모았습니다.',
}

export default function BooksPage() {
  const books = readBooks()

  return (
    <main className={styles.wrap}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>전자책 · LIBRARY</p>
        <h1 className={styles.title}>긴 호흡으로 읽는 책</h1>
        <p className={styles.sub}>
          원자적 위키 노트와 달리, 처음부터 끝까지 순서대로 읽도록 쓴 장편을 모았습니다.
        </p>
      </header>

      <ul className={styles.shelf}>
        {books.map((b) => (
          <li key={b.slug} className={styles.shelfRow}>
            <a href={b.href} className={styles.item}>
              <span className={styles.cover} aria-hidden="true">
                <span className={styles.coverTitle}>{b.title}</span>
              </span>
              <span className={styles.info}>
                <span className={styles.bookTitle}>{b.title}</span>
                {b.description && <span className={styles.desc}>{b.description}</span>}
                <span className={styles.meta}>
                  {b.status && <em className={styles.badge}>{b.status}</em>}
                  <span className={styles.metaText}>
                    {b.chapters}개 챕터{b.parts ? ` · ${b.parts}개 파트` : ''}
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
