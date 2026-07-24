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
import Mermaid from '../Mermaid'

// ```mermaid 코드펜스는 다이어그램으로, 나머지 코드블록은 기존 하이라이트 그대로.
const markdownComponents = {
  code({ className = '', children }) {
    if (String(className).includes('language-mermaid')) {
      return <Mermaid chart={String(children).replace(/\n+$/, '')} />
    }
    return <code className={className}>{children}</code>
  },
  // mermaid 블록은 <pre> 래퍼 없이 렌더(코드박스 스타일이 다이어그램을 감싸지 않도록).
  pre({ node, children }) {
    const codeEl = node?.children?.[0]
    const cls = codeEl?.properties?.className
    const isMermaid =
      Array.isArray(cls) && cls.some((c) => String(c).includes('language-mermaid'))
    return isMermaid ? children : <pre>{children}</pre>
  },
}

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
            rehypePlugins={[rehypeSlug, [rehypeHighlight, { ignoreMissing: true }]]}
            components={markdownComponents}
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
