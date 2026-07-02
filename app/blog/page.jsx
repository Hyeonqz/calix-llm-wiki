import { getPosts } from './posts'
import BlogList from './BlogList'
import styles from './blog.module.css'

export const metadata = {
  title: '블로그 | Calix Wiki',
  description: 'Calix Wiki에 축적된 지식을 AI가 한 편의 글로 정리합니다.',
}

export default function BlogPage() {
  const posts = getPosts().map(({ body, ...meta }) => meta)

  return (
    <main className={styles.wrap}>
      <header>
        <p className={styles.eyebrow}>Blog</p>
        <h1 className={styles.title}>위키가 쌓이면, 글이 됩니다</h1>
        <p className={styles.sub}>Calix Wiki에 축적된 지식을 AI가 한 편의 글로 정리합니다.</p>
      </header>
      <BlogList posts={posts} />
    </main>
  )
}
