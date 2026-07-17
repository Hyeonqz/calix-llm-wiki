import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { readBook } from '../books/booksData'
import BookSidebar from '../books/BookSidebar'

export const generateStaticParams = generateStaticParamsFor('slug')

export async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.slug)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
  const params = await props.params
  const { default: MDXContent, toc, metadata } = await importPage(params.slug)
  const slug = params.slug || []
  // /books/{book}/... 은 "책 읽기" 컨텍스트 → 전용 사이드바 + 책 레이아웃
  const isBookReading = slug[0] === 'books' && slug.length > 1

  if (isBookReading) {
    const book = readBook(slug[1])
    const chapters = book.nav.filter((i) => i.type === 'chapter')
    const current = `/${slug.join('/')}`
    const idx = chapters.findIndex((c) => c.href === current)
    const prev = idx > 0 ? chapters[idx - 1] : null
    const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null

    return (
      <Wrapper toc={toc} metadata={metadata}>
        <div className="book-layout">
          <BookSidebar bookTitle={book.title} items={book.nav} />
          <div className="book-main">
            <article className="book-reading">
              <MDXContent params={params} />
            </article>
            <nav className="book-pager">
              {prev ? (
                <a className="book-pager-link book-pager-prev" href={prev.href}>
                  <span className="book-pager-dir">← 이전</span>
                  <span className="book-pager-label">{prev.label}</span>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a className="book-pager-link book-pager-next" href={next.href}>
                  <span className="book-pager-dir">다음 →</span>
                  <span className="book-pager-label">{next.label}</span>
                </a>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent params={params} />
    </Wrapper>
  )
}
