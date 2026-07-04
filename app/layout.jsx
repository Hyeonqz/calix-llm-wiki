import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import 'nextra-theme-docs/style.css'
import './globals.css'
import DocSearch from './DocSearch'
import NavToggle from './NavToggle'

function buildDocsIndex() {
  const contentDir = path.join(process.cwd(), 'content')
  const SKIP = new Set(['index', 'log'])
  const pages = []

  function walk(dir, urlPrefix = '') {
    for (const item of fs.readdirSync(dir).sort()) {
      const fullPath = path.join(dir, item)
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath, `${urlPrefix}/${item}`)
      } else if (item.endsWith('.md')) {
        const slug = item.replace('.md', '')
        if (urlPrefix === '' && SKIP.has(slug)) continue
        const urlPath = slug === 'index' ? urlPrefix : `${urlPrefix}/${slug}`
        const content = fs.readFileSync(fullPath, 'utf-8')
        const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m)
        const h1Match = content.match(/^#\s+(.+)$/m)
        const title = (titleMatch?.[1] || h1Match?.[1] || slug).replace(/^["']|["']$/g, '')
        pages.push({ title, path: urlPath })
      }
    }
  }

  walk(contentDir)
  return pages
}

export const metadata = {
  title: 'Calix Wiki',
  description: 'Personal knowledge wiki maintained by LLM'
}

export default async function RootLayout({ children }) {
  const docsIndex = buildDocsIndex()

  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Layout
          navbar={
            <Navbar
              logo={
                <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Calix Wiki</Link>
                  <NavToggle />
                </span>
              }
              logoLink={false}
              projectLink="https://github.com/Hyeonqz/calix-wiki"
            >
              <DocSearch pages={docsIndex} />
              <Link
                href="/til"
                style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.8 }}
              >
                TIL
              </Link>
            </Navbar>
          }
          footer={<Footer>MIT {new Date().getFullYear()} © Calix</Footer>}
          search={null}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/Hyeonqz/calix-wiki/tree/main/wiki"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          toc={{ float: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
