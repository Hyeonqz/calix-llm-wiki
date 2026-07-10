import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import 'highlight.js/styles/github-dark.css'
import { getPost, getPosts } from '../posts'
import styles from '../blog.module.css'
import Toc from '../Toc'
import DownloadMd from '../DownloadMd'
import HeroImage from '../HeroImage'

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: '블로그 | Calix Wiki' }
  return { title: `${post.title} | Calix Wiki`, description: post.description }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <main className={styles.articleWrap}>
      <div className={styles.articleMain}>
        <Link href="/blog" className={styles.back}>
          ← 블로그
        </Link>
        <div>
          <span className={styles.articleChip}>{post.category}</span>
        </div>
        <h1 className={styles.articleTitle}>{post.title}</h1>
        <div className={styles.articleMeta}>
          <span className={styles.byline}>
            <span className={styles.avatar}>C</span>
            Calix AI
          </span>
          <span>·</span>
          <span>{post.displayDate}</span>
          <span>·</span>
          <span>{post.readMinutes}분 읽기</span>
          <DownloadMd raw={post.raw} slug={post.slug} />
        </div>
        {post.hero && (
          <HeroImage
            src={post.hero}
            caption={post.heroCaption}
            alt={post.heroCaption || post.title}
          />
        )}
        <article className={styles.prose}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeHighlight]}
          >
            {post.body}
          </ReactMarkdown>
        </article>
      </div>
      <aside className={styles.articleAside}>
        <Toc toc={post.toc} />
      </aside>
    </main>
  )
}
