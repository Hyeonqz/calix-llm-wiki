import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export async function generateMetadata({ params }) {
  const { date } = await params
  return { title: `TIL ${date} | Calix Wiki` }
}

export default async function TilDetailPage({ params }) {
  const { date } = await params
  const tilDir = path.join(process.cwd(), 'TIL')
  const filePath = path.join(tilDir, `${date}.md`)

  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const content = fs.readFileSync(filePath, 'utf-8')

  const allDates = fs.readdirSync(tilDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
    .sort()

  const currentIndex = allDates.indexOf(date)
  const prevDate = currentIndex > 0 ? allDates[currentIndex - 1] : null
  const nextDate = currentIndex < allDates.length - 1 ? allDates[currentIndex + 1] : null

  return (
    <div style={styles.wrapper}>
      <Link href="/til" style={styles.back}>← 목록으로</Link>
      <h1 style={styles.heading}>{date}</h1>
      <article style={styles.article}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
      </article>
      <nav style={styles.nav}>
        {prevDate ? (
          <Link href={`/til/${prevDate}`} style={styles.navLink}>← {prevDate}</Link>
        ) : <span />}
        {nextDate ? (
          <Link href={`/til/${nextDate}`} style={styles.navLink}>{nextDate} →</Link>
        ) : <span />}
      </nav>
    </div>
  )
}

const styles = {
  wrapper: {
    maxWidth: '1130px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  back: {
    display: 'inline-block',
    marginBottom: '1.25rem',
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--nextra-border, #e5e7eb)',
    paddingBottom: '0.75rem',
  },
  article: {
    lineHeight: 1.8,
    fontSize: '0.95rem',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--nextra-border, #e5e7eb)',
  },
  navLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
}
