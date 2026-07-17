# 전자책 플랫폼 UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 상단 세그먼트 탭을 `위키 | 블로그 | 전자책` 3개로 만들고, `/books`를 실제 전자책 서재처럼 보이는 라이브러리 랜딩으로 바꾸고, 책 본문을 "진짜 전자책"처럼 읽히게(본문 폭·읽기 진행바) 만든다.

**Architecture:** 렌더 파이프라인은 재사용한다. 책 본문(`content/books/{book}/*.md`)은 기존 Nextra `app/[[...slug]]`가 그대로 렌더(사이드바·TOC·prev/next 자동). 신규는 ① 세그먼트 탭 항목, ② `/books` 라이브러리 라우트(+데이터 리더), ③ 리딩 본문 폭 래퍼 + 상단 진행바뿐. 나머지는 CSS·마크다운 저작.

**Tech Stack:** Next.js 16 App Router, Nextra 4 (nextra-theme-docs), React 19, CSS Modules, Pretendard. 테스트는 Node 내장 `node --test`(v22).

## Global Constraints

- **신규 npm 의존성 0.** 유일한 순수 로직만 Node 내장 `node --test`로 검증.
- **정적 자산은 `public/`에서만 서빙** (`/images/...`). `content/` 안 파일은 정적 URL로 안 열림.
- **Nextra는 `content/` 트리만 렌더.** 책은 `content/books/{book}/` 아래에 둔다.
- **`app/` 소스는 camelCase**(기존 `tilFiles.js`·`streakUtils.js`·`NavToggle.jsx` 스타일). CLAUDE.md의 kebab-case 규칙은 `content/` 위키 페이지·도메인 폴더 대상이며 app 소스에는 적용하지 않는다.
- **다크모드 필수** — 기존 방식 `:global(html.dark)` 셀렉터.
- **디자인 토큰은 토스 팔레트 재사용** — 배경 `#f2f4f6`/다크 `#1e2530`, 잉크 `#191f28`/`#4e5968`/`#8b95a1`, 서피스 다크 `#191f28`/`#333d4b`, 블루 `#3182f6`, radius 8/10/16, hover `translateY(-3px)`+`0 14px 30px rgba(0,0,0,.08)`, transition `0.15s ease`.
- **커밋은 사용자가 요청할 때만.** 이 플랜은 브랜치에서 실행(예: `ebook-platform-ux`). 각 태스크 끝 커밋 스텝은 브랜치 로컬 커밋을 의미하며, main 병합은 별도 승인.
- **디자인 근거**: `docs/superpowers/specs/2026-07-15-transaction-ebook-design.md`(책 스펙) + 디자이너 산출물(이 플랜에 반영됨). 책 스펙의 라우트는 `content/books/`로 통일(아래 Follow-ups).

---

### Task 1: 세그먼트 3탭(위키·블로그·전자책) + 위키 사이드바에서 전자책 숨김

**Files:**
- Modify: `app/NavToggle.jsx` (전체 교체)
- Modify: `content/_meta.js` (`books` 항목을 `display: 'hidden'`으로)

**Interfaces:**
- Consumes: 없음 (기존 `NavToggle.module.css` 클래스 `.seg/.item/.itemActive` 재사용)
- Produces: 상단 세그먼트에 `/books` 탭. `pathname.startsWith('/books')`일 때 활성. `content/books`는 좌측 위키 사이드바에서 사라짐.

- [ ] **Step 1: `NavToggle.jsx`를 3-way로 교체**

`app/NavToggle.jsx` 전체를 아래로 교체:

```jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavToggle.module.css'

export default function NavToggle() {
  const pathname = usePathname()
  const isBlog = pathname.startsWith('/blog')
  const isBook = pathname.startsWith('/books')
  const isWiki = !isBlog && !isBook

  return (
    <nav className={styles.seg} aria-label="위키/블로그/전자책 전환">
      <Link href="/" className={isWiki ? styles.itemActive : styles.item}>
        위키
      </Link>
      <Link href="/blog" className={isBlog ? styles.itemActive : styles.item}>
        블로그
      </Link>
      <Link href="/books" className={isBook ? styles.itemActive : styles.item}>
        전자책
      </Link>
    </nav>
  )
}
```

- [ ] **Step 2: `content/_meta.js`에서 `books`를 위키 사이드바에서 숨김**

`content/_meta.js`의 `books` 항목을 아래로 변경(제목 유지 + 숨김):

```js
  books: {
    title: '전자책 📖',
    display: 'hidden'
  },
```

(참고: `blog`·`til`이 이미 `display: 'hidden'`인 것과 동일 패턴. 이러면 `/books`·`/books/{book}` 라우트는 살아있되 좌측 위키 사이드바 트리에서만 빠진다. 책 안에서의 챕터 내비는 각 책 `index.md`의 목차 + Nextra prev/next가 담당.)

- [ ] **Step 3: 빌드로 검증**

Run: `npm run build`
Expected: 빌드 성공. 라우트 목록에 `/books`, `/books/software-architecture/...`가 그대로 존재. 에러 없음.

- [ ] **Step 4: 수동 렌더 확인(dev)**

Run: `npm run dev` 후 브라우저에서:
- 상단 세그먼트에 `위키 | 블로그 | 전자책` 3개 노출.
- `/` → 위키 활성, `/blog` → 블로그 활성, `/books` → 전자책 활성(흰 배경 pill).
- 위키(`/`)의 좌측 사이드바에 더 이상 "전자책 📖" 도메인이 없음.
- `/books/software-architecture`는 여전히 열림.

- [ ] **Step 5: 커밋**

```bash
git add app/NavToggle.jsx content/_meta.js
git commit -m "feat(books): 세그먼트 탭에 전자책 추가 + 위키 사이드바에서 숨김"
```

---

### Task 2: 전자책 데이터 리더 + 순수 헬퍼(+테스트) + 책 index 프론트매터

**Files:**
- Create: `app/books/booksData.mjs`
- Test: `app/books/booksData.test.mjs`
- Modify: `content/books/software-architecture/index.md` (프론트매터에 `book`/`description`/`status` 추가)

(`.mjs` 확장자 이유: `package.json`에 `"type":"module"`이 없어 `.js` ESM은 `MODULE_TYPELESS_PACKAGE_JSON` 경고를 낼 수 있다. `.mjs`로 못 박아 제거. Next 빌드는 확장자 생략 import를 해결하고, `node --test`는 명시 import를 쓴다.)

**Interfaces:**
- Consumes: `content/books/*/index.md` 프론트매터, `content/books/*/_meta.js` 소스 텍스트.
- Produces:
  - `parseFrontmatter(raw: string) -> { [k]: string }`
  - `countChapters(metaSource: string) -> number` (index·separator 제외 챕터 수)
  - `countParts(metaSource: string) -> number` (separator 개수 = 파트 수)
  - `readBooks() -> Array<{ slug, title, description, status, chapters, parts, href }>` (Task 3이 소비)

- [ ] **Step 1: 실패하는 테스트 작성**

`app/books/booksData.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFrontmatter, countChapters, countParts } from './booksData.mjs'

const META = `export default {
  index: '들어가며 (서문)',

  '_part1': { type: 'separator', title: 'Part 1 · 원론' },
  'step-01-birth': '01. 탄생',
  'step-02-problem': '02. 문제',

  '_part2': { type: 'separator', title: 'Part 2 · 발전사' },
  'step-03-layered': '03. 레이어드',

  '_appendix': { type: 'separator', title: '부록' },
  'appendix-a-d': '부록 A~D',
}`

test('countChapters: index·separator 제외한 챕터만 센다', () => {
  // step 3개 + appendix 1개 = 4
  assert.equal(countChapters(META), 4)
})

test('countParts: separator 개수를 파트로 센다', () => {
  assert.equal(countParts(META), 3)
})

test('parseFrontmatter: 따옴표를 벗겨 키-값을 뽑는다', () => {
  const raw = `---
title: "들어가며"
book: "소프트웨어 아키텍처 Deep Dive"
status: 완간
---
# 본문`
  const fm = parseFrontmatter(raw)
  assert.equal(fm.book, '소프트웨어 아키텍처 Deep Dive')
  assert.equal(fm.title, '들어가며')
  assert.equal(fm.status, '완간')
})

test('parseFrontmatter: 프론트매터 없으면 빈 객체', () => {
  assert.deepEqual(parseFrontmatter('# 제목만'), {})
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test app/books/*.test.mjs`
Expected: FAIL — `Cannot find module './booksData.mjs'` 또는 export 없음.

- [ ] **Step 3: `booksData.mjs` 구현**

`app/books/booksData.mjs`:

```js
import fs from 'fs'
import path from 'path'

const BOOKS_DIR = path.join(process.cwd(), 'content', 'books')

// index.md 프론트매터(---...---)에서 `key: value` 를 파싱. 따옴표 제거.
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  const fm = {}
  if (!m) return fm
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return fm
}

// _meta.js 소스에서 실제 챕터 수 = `'key': '문자열라벨'` 라인 중 index 제외.
// separator 항목은 `'key': { ... }` 형태라 문자열 라벨 정규식에 걸리지 않음.
export function countChapters(metaSource) {
  let n = 0
  for (const line of metaSource.split('\n')) {
    const m = line.match(/^\s*['"]?([\w-]+)['"]?\s*:\s*['"]/)
    if (m && m[1] !== 'index') n++
  }
  return n
}

// separator 개수 = 파트 수.
export function countParts(metaSource) {
  return (metaSource.match(/type:\s*['"]separator['"]/g) || []).length
}

// content/books/*/ 를 훑어 라이브러리 카드용 메타를 만든다.
export function readBooks() {
  let entries = []
  try {
    entries = fs.readdirSync(BOOKS_DIR, { withFileTypes: true })
  } catch {
    return []
  }
  const books = []
  for (const d of entries) {
    if (!d.isDirectory()) continue
    const slug = d.name
    const dir = path.join(BOOKS_DIR, slug)
    let fm = {}
    let chapters = 0
    let parts = 0
    try {
      fm = parseFrontmatter(fs.readFileSync(path.join(dir, 'index.md'), 'utf-8'))
    } catch {}
    try {
      const metaSrc = fs.readFileSync(path.join(dir, '_meta.js'), 'utf-8')
      chapters = countChapters(metaSrc)
      parts = countParts(metaSrc)
    } catch {}
    books.push({
      slug,
      title: fm.book || fm.title || slug,
      description: fm.description || '',
      status: fm.status || '',
      chapters,
      parts,
      href: `/books/${slug}`,
    })
  }
  return books
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test app/books/*.test.mjs`
Expected: PASS — 4 테스트 통과.

- [ ] **Step 5: 기존 책 `index.md`에 카드용 프론트매터 추가**

`content/books/software-architecture/index.md` 최상단 프론트매터를 아래로 교체(본문은 그대로):

```markdown
---
title: "들어가며 — 이 책을 읽는 법"
book: "소프트웨어 아키텍처 Deep Dive"
description: "각 아키텍처를 '정답'이 아니라 '이전 방식의 어떤 고통이 낳았는가'로 읽는 15장짜리 책."
status: "완간"
---
```

- [ ] **Step 6: 커밋**

```bash
git add app/books/booksData.mjs app/books/booksData.test.mjs content/books/software-architecture/index.md
git commit -m "feat(books): 라이브러리 데이터 리더 + 순수 헬퍼(테스트) + 책 메타"
```

---

### Task 3: 전자책 라이브러리 랜딩 라우트 `/books` (서가형)

**Files:**
- Create: `app/books/page.jsx`
- Create: `app/books/books.module.css`

**Interfaces:**
- Consumes: `readBooks()` (Task 2).
- Produces: `/books` 라우트가 커스텀 서가형 랜딩으로 렌더(기존 `content/books/index.md`의 `/books` 렌더를 오버라이드). **정적 세그먼트(`app/books/page.jsx`)가 optional catch-all(`app/[[...slug]]`)보다 우선한다 — Next.js 라우트 특이성 규칙.** `content/books/`가 실재하므로 catch-all도 `/books`를 프리렌더하지만(죽은 HTML), 서빙은 정적 세그먼트가 이긴다. `/books/{book}` 이하는 계속 catch-all이 렌더.

- [ ] **Step 1: 랜딩 페이지 컴포넌트 작성**

`app/books/page.jsx`:

```jsx
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
```

- [ ] **Step 2: 서가형 CSS 작성 (토스 토큰·다크모드 포함)**

`app/books/books.module.css`:

```css
.wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 56px 24px 120px;
}

.head {
  margin-bottom: 40px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3182f6;
  margin: 0 0 10px;
}

.title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: #191f28;
  margin: 0 0 12px;
}

.sub {
  font-size: 16px;
  color: #4e5968;
  margin: 0;
}

.shelf {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 28px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e8eb;
  border-radius: 16px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.item:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
  border-color: #d1d9e0;
}

.item:active {
  transform: translateY(-1px) scale(0.995);
  transition: transform 0.1s ease;
}

.cover {
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  background: linear-gradient(150deg, #3182f6 0%, #1b64da 100%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1), 0 0 0 0.5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: flex-end;
  padding: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item:hover .cover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.16);
}

.coverTitle {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  min-width: 0;
}

.bookTitle {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #191f28;
  transition: color 0.15s ease;
}

.item:hover .bookTitle {
  color: #3182f6;
}

.desc {
  font-size: 15px;
  line-height: 1.6;
  color: #4e5968;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #8b95a1;
  font-variant-numeric: tabular-nums;
}

.badge {
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  background: #f2f4f6;
  color: #4e5968;
}

@media (max-width: 900px) {
  .item {
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 20px;
    padding: 20px;
  }
  .title {
    font-size: 28px;
  }
  .bookTitle {
    font-size: 19px;
  }
}

@media (max-width: 560px) {
  .item {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 16px;
  }
  .wrap {
    padding: 40px 16px 96px;
  }
}

/* 다크모드 */
:global(html.dark) .title {
  color: #f2f4f6;
}
:global(html.dark) .sub,
:global(html.dark) .desc {
  color: #a8b1bb;
}
:global(html.dark) .item {
  background: #191f28;
  border-color: #252c38;
}
:global(html.dark) .item:hover {
  border-color: #34404f;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.4);
}
:global(html.dark) .item:hover .cover {
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.5);
}
:global(html.dark) .bookTitle {
  color: #f2f4f6;
}
:global(html.dark) .item:hover .bookTitle {
  color: #6ea8fe;
}
:global(html.dark) .badge {
  background: #252c38;
  color: #a8b1bb;
}
```

- [ ] **Step 3: 빌드로 검증**

Run: `npm run build`
Expected: 빌드 성공. 라우트 목록에 `○ /books`(정적)가 커스텀 페이지로 잡힘. `/books/software-architecture` 등 하위는 여전히 catch-all로 렌더.

- [ ] **Step 4: 수동 확인(dev)**

Run: `npm run dev` → `/books`:
- **`/books`가 서가형 커스텀 페이지를 서빙하는지 확인**(= catch-all의 `content/books/index.md` 렌더가 아닌지). 서가 카드가 보이면 오버라이드 성공.
- 서가형 카드 1장(소프트웨어 아키텍처) 노출: 그라디언트 표지 + 제목 + 소개 + "완간" 배지 + "17개 챕터 · 4개 파트".
- hover 시 카드가 살짝 떠오르고 제목이 파랗게, 표지가 미세하게 확대.
- 카드 클릭 → `/books/software-architecture`(책 서문)로 이동.
- 다크모드 토글 시 색 반전 정상.
- 모바일 폭(≤560px)에서 표지 축소·레이아웃 유지.

- [ ] **Step 5: 커밋**

```bash
git add app/books/page.jsx app/books/books.module.css
git commit -m "feat(books): 서가형 라이브러리 랜딩 /books"
```

---

### Task 4: 리딩 경험 — 본문 폭(measure) + 상단 읽기 진행바

**Files:**
- Modify: `app/[[...slug]]/page.jsx` (책 경로일 때 본문을 래퍼로 감쌈)
- Modify: `app/globals.css` (`.book-reading` 타이포·폭)
- Create: `app/ReadingProgress.jsx`
- Modify: `app/layout.jsx` (진행바 마운트)

**Interfaces:**
- Consumes: 없음.
- Produces: `/books/{book}/...` 문서에서 본문 폭이 42rem로 좁혀지고 타이포가 장편용으로 커짐. `/books/` 하위 경로에서 상단에 스크롤 진행바(2px) 노출.

- [ ] **Step 1: catch-all 페이지에서 책 경로를 래퍼로 감싸기**

`app/[[...slug]]/page.jsx`의 기본 export를 아래로 교체(래퍼 div 추가):

```jsx
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
```

- [ ] **Step 2: `globals.css`에 리딩 타이포 추가**

`app/globals.css` 맨 끝에 추가:

```css
/* 전자책 읽기 화면 — 본문 폭(measure)과 장편용 타이포 */
.book-reading {
  max-width: 42rem;
  margin-inline: auto;
}
.book-reading :is(p, li) {
  font-size: 18px;
  line-height: 1.9;
}
.book-reading p {
  margin-bottom: 26px;
}
/* 각 장 상단 웹툰 요약컷 — 챕터의 문 */
.book-reading img {
  border-radius: 16px;
  border: 1px solid #e5e8eb;
}
:global(html.dark) .book-reading img {
  border-color: #252c38;
}
@media (max-width: 640px) {
  .book-reading :is(p, li) {
    font-size: 17px;
  }
  .book-reading img {
    border-radius: 12px;
  }
}
```

- [ ] **Step 3: 상단 읽기 진행바 컴포넌트 작성**

`app/ReadingProgress.jsx`:

```jsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ReadingProgress() {
  const pathname = usePathname()
  const [pct, setPct] = useState(0)
  const active = pathname.startsWith('/books/') // /books 랜딩은 제외

  useEffect(() => {
    if (!active) return
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [active, pathname])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 'var(--nextra-navbar-height, 64px)',
        left: 0,
        height: '2px',
        width: `${pct}%`,
        background: '#3182f6',
        transition: 'width 0.1s linear',
        zIndex: 30,
      }}
    />
  )
}
```

- [ ] **Step 4: 레이아웃에 진행바 마운트**

`app/layout.jsx`에서 import 추가:

```jsx
import ReadingProgress from './ReadingProgress'
```

그리고 `<body>` 바로 안, `<Layout>` 앞에 마운트:

```jsx
      <body>
        <ReadingProgress />
        <Layout
```

- [ ] **Step 5: 빌드로 검증**

Run: `npm run build`
Expected: 빌드 성공, 에러 없음. `/books/software-architecture/...` 라우트 정상.

- [ ] **Step 6: 수동 확인(dev)**

Run: `npm run dev`:
- `/books/software-architecture/step-01-birth-of-architecture` 열기 → 본문 폭이 좁아져(≈672px) 한 줄 글자 수가 줄고 읽기 편함. 행간이 넉넉.
- **폰트 크기(18px)가 실제로 적용됐는지 확인**. Nextra prose 기본 스타일이 더 높은 specificity로 이기면 안 먹을 수 있음 → 그 경우 `.book-reading :is(p, li)`를 `.book-reading p, .book-reading li`로 바꾸거나 최소한의 `!important` 하나 추가.
- 스크롤 내리면 상단(네비 아래)에 파란 진행바가 우측으로 차오름.
- `/books`(랜딩)·`/`(위키)·`/blog`에서는 진행바가 없음.
- 다크모드에서 본문색·이미지 테두리 정상.

- [ ] **Step 7: 커밋**

```bash
git add "app/[[...slug]]/page.jsx" app/globals.css app/ReadingProgress.jsx app/layout.jsx
git commit -m "feat(books): 리딩 본문 폭(measure) + 상단 읽기 진행바"
```

---

## Follow-ups (이 플랜 범위 밖, 별도)

- **트랜잭션 책 스펙 라우트 통일**: `docs/superpowers/specs/2026-07-15-transaction-ebook-design.md`의 `content/book/`·`/book`·`/book/full` 참조를 `content/books/transaction/`·`/books/transaction`으로 수정(도서관은 `content/books/` 하나). 집필 착수 전 반영.
- **전권 통합 인쇄 뷰 `/books/{book}/full`**: 사용자가 PDF를 직접 제작하므로 이번 범위 제외. 필요 시 `_meta.js` 순서로 장을 이어붙이고 `@media print`로 크롬을 숨기는 소규모 라우트로 추가.
- **표지 이미지**: 지금은 타이포+그라디언트. 각 책 `public/images/books/{book}/cover.png`를 넣고 `.cover`를 이미지로 교체하면 업그레이드(에셋 준비되면).
- **책 안 챕터 드로어**: 현재 `display:'hidden'`로 위키·책 양쪽에서 좌측 트리를 숨김. 책 안에서만 챕터 드로어를 다시 살리려면 Nextra 커스텀이 필요(YAGNI, 요청 시).

## Self-Review

- **Spec coverage**: (1) 위키·블로그·전자책 3탭 → Task 1. (2) 전자책을 왼쪽 메뉴에서 제거 → Task 1(`display:'hidden'`). (3) 전자책 탭 클릭 시 화면(라이브러리 UI) → Task 3(디자이너 서가형). (4) 개별 책 클릭 시 리딩 UX "진짜 전자책처럼" → Task 4(본문 폭·진행바) + 재사용되는 Nextra prev/next·TOC. (5) 서브에이전트로 UI 구성 → 디자이너 산출물 반영. 누락 없음.
- **Placeholder scan**: 모든 스텝에 실제 코드/명령/기대 출력 포함. TBD·"적절히 처리" 없음.
- **Type consistency**: `readBooks()` 반환 필드(`slug/title/description/status/chapters/parts/href`)가 Task 3 `page.jsx` 소비와 일치. `countChapters/countParts/parseFrontmatter` 시그니처가 테스트·리더에서 동일.
