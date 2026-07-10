import Link from 'next/link'
import styles from './study.module.css'
import { readCurriculum, todaysPicks } from './curriculumData'

export const metadata = { title: 'Study | Calix Wiki' }

// "Today" in KST as YYYY-MM-DD (en-CA locale formats ISO-style).
function todayKST() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
}

export default function StudyPage() {
  const data = readCurriculum()
  const today = todayKST()
  const { due, todos } = todaysPicks(data.categories, today)
  const picks = [...due, ...todos]

  return (
    <main className={styles.wrapper}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Learning Curriculum</p>
        <h1 className={styles.heading}>Study</h1>
        <p className={styles.description}>
          카테고리별 학습 주제를 추적하고, 망각곡선 기반으로 오늘 학습할 것을 계산합니다.
        </p>
      </header>

      <section className={styles.today}>
        <h2 className={styles.todayTitle}>오늘 학습</h2>
        {picks.length === 0 ? (
          <p className={styles.empty}>오늘 예정된 주제가 없습니다.</p>
        ) : (
          <ol className={styles.pickList}>
            {picks.map((t) => (
              <li key={t.id}>
                <span className={styles.pickCat}>{t.category}</span>
                {t.title}
                {t.srs ? ' · 복습' : ''}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.grid}>
        {data.categories.map((cat) => {
          const done = cat.topics.filter((t) => t.status === 'done').length
          return (
            <article key={cat.id} className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardLabel}>{cat.label}</h3>
                <span className={styles.progress}>
                  {done}/{cat.topics.length} 완료
                </span>
              </div>
              <ul className={styles.topicList}>
                {cat.topics.map((t) =>
                  t.status === 'done' && t.writeup ? (
                    <li key={t.id}>
                      <Link href={t.writeup.path} className={styles.done}>
                        ✓ {t.title}
                      </Link>
                    </li>
                  ) : (
                    <li key={t.id}>
                      {t.status === 'done' ? '✓ ' : '· '}
                      {t.title}
                    </li>
                  )
                )}
              </ul>
            </article>
          )
        })}
      </section>
    </main>
  )
}
