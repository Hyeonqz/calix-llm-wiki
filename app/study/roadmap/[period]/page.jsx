import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './roadmap.module.css'
import { readRoadmap } from '../../curriculumData'

const PERIODS = {
  weekly: '주간',
  monthly: '월간',
  yearly: '연간',
}

const STATUS_LABELS = {
  todo: '할 일',
  doing: '진행 중',
  done: '완료',
}

export function generateStaticParams() {
  return Object.keys(PERIODS).map((period) => ({ period }))
}

export async function generateMetadata({ params }) {
  const { period } = await params
  const label = PERIODS[period]
  return { title: label ? `${label} 로드맵 | Calix Wiki` : 'Roadmap | Calix Wiki' }
}

export default async function RoadmapDetailPage({ params }) {
  const { period } = await params
  const label = PERIODS[period]
  if (!label) notFound()

  const roadmap = readRoadmap()
  const items = roadmap[period] || []
  const done = items.filter((item) => item.status === 'done').length
  const percent = items.length === 0 ? 0 : Math.round((done / items.length) * 100)

  return (
    <main className={styles.wrapper}>
      <Link href="/study" className={styles.back}>
        ← Study로 돌아가기
      </Link>

      <header className={styles.hero}>
        <p className={styles.kicker}>Roadmap</p>
        <h1 className={styles.heading}>{label} 로드맵</h1>
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>아직 계획이 없습니다.</p>
      ) : (
        <>
          <div className={styles.progress}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
            <span className={styles.progressLabel}>
              {done}/{items.length} 완료 ({percent}%)
            </span>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>목표</th>
                <th>상태</th>
                <th>기한</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[item.status] || styles.todo}`}>
                      {STATUS_LABELS[item.status] || STATUS_LABELS.todo}
                    </span>
                  </td>
                  <td>{item.due || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  )
}
