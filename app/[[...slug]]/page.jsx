import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

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
  // /books/{book}/... 은 "책 읽기" 컨텍스트 → 본문 폭·타이포를 책용으로
  const isBookReading = slug[0] === 'books' && slug.length > 1
  return (
    <Wrapper toc={toc} metadata={metadata}>
      {isBookReading ? (
        <div className="book-reading">
          <MDXContent params={params} />
        </div>
      ) : (
        <MDXContent params={params} />
      )}
    </Wrapper>
  )
}
