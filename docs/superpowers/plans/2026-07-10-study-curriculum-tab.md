# Study 커리큘럼 탭 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 카테고리별 학습 커리큘럼을 보여주고 "오늘 학습할 것"을 자동 계산하는 비공개 `/study` 탭을 만든다.

**Architecture:** repo 루트 `study/curriculum.json` 하나에 커리큘럼 상태를 담고, `/study` 서버 컴포넌트가 이를 읽어 렌더한다(기존 `app/til` 패턴 재사용). "오늘 학습" 선택 로직은 순수 ESM 모듈로 분리해 Node 내장 `node --test`로 검증한다. `middleware.js`가 `/study`·`/til`을 `til-auth` 쿠키 뒤로 숨긴다. 브라우저는 읽기 전용이며 상태 변경(주제 추가·완료)은 Claude가 JSON을 편집한다.

**Tech Stack:** Next.js 16 (App Router) + Nextra 4, React 19, Node 내장 `node:test`(신규 의존성 없음).

## Global Constraints

- 신규 npm 의존성 추가 금지 — 검증은 `node --test`(stdlib)와 `npm run build`로만.
- 데이터 파일 경로: repo 루트 `study/curriculum.json` (`TIL/`과 같은 레벨).
- 인증 쿠키명 `til-auth`, 유효 토큰 문자열 `calix-til-auth-token` (기존 `app/api/login/route.js`와 반드시 일치).
- 날짜 문자열은 `YYYY-MM-DD` ISO 포맷(사전식 비교 = 시간순 비교). "오늘" 계산은 `Asia/Seoul` 기준.
- 파일명은 기존 `app/til/*` 스타일·구조를 따른다 — app 소스는 camelCase(`tilFiles.js`, `streakUtils.js`)가 관례. (CLAUDE.md의 kebab-case 규칙은 `content/` wiki 페이지·도메인 폴더 대상이며 app 소스에는 적용하지 않는다.)
- 상태 변경 UI 없음(YAGNI) — 브라우저는 읽기 전용.

---

## File Structure

- Create `app/study/selectPicks.mjs` — 순수 선택 로직(fs·React 없음). `dueToday`, `nextTodos`, `todaysPicks`.
- Create `app/study/selectPicks.test.mjs` — `node --test` 검증.
- Create `app/study/curriculumData.js` — `study/curriculum.json` fs 리더 + `selectPicks` 재노출.
- Create `study/curriculum.json` — 시드 커리큘럼 데이터.
- Create `app/study/page.jsx` — `/study` 서버 컴포넌트(렌더).
- Create `app/study/study.module.css` — 페이지 스타일.
- Create `middleware.js` (repo 루트) — `/study`·`/til` 인증 게이트.
- Modify `app/layout.jsx` — Navbar에 Study 링크 추가.

---

## Task 1: 오늘의 학습 선택 로직 (순수 모듈 + 테스트)

**Files:**
- Create: `app/study/selectPicks.mjs`
- Test: `app/study/selectPicks.test.mjs`

**Interfaces:**
- Consumes: 없음(순수 함수, plain data 입력).
- Produces:
  - `dueToday(categories, todayISO) -> Array<{...topic, category: string}>` — `srs.next <= todayISO`인 주제.
  - `nextTodos(categories, limit) -> Array<{...topic, category: string}>` — 카테고리별 가장 오래된 `todo`를 라운드로빈으로 최대 `limit`개.
  - `todaysPicks(categories, todayISO, limit=3) -> { due: [...], todos: [...] }` — due 먼저, 남는 자리 todos로 채움.
  - `categories`는 `[{ label, topics: [{ id, title, status, added, writeup, srs }] }]` 형태.

- [ ] **Step 1: Write the failing test**

Create `app/study/selectPicks.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dueToday, nextTodos, todaysPicks } from './selectPicks.mjs'

const cats = [
  { label: 'OS', topics: [
    { id: 'a', status: 'done', added: '2026-07-01', srs: { next: '2026-07-09' } },
    { id: 'b', status: 'todo', added: '2026-07-02', srs: null },
  ] },
  { label: 'Net', topics: [
    { id: 'c', status: 'todo', added: '2026-07-01', srs: null },
    { id: 'd', status: 'done', added: '2026-07-01', srs: { next: '2026-07-20' } },
  ] },
]

test('dueToday returns only topics whose srs.next <= today', () => {
  assert.deepEqual(dueToday(cats, '2026-07-10').map((t) => t.id), ['a'])
})

test('dueToday tags each result with its category label', () => {
  assert.equal(dueToday(cats, '2026-07-10')[0].category, 'OS')
})

test('nextTodos round-robins oldest todo across categories', () => {
  // OS 'b' added 07-02, Net 'c' added 07-01. Round-robin walks categories in order: OS→Net.
  assert.deepEqual(nextTodos(cats, 5).map((t) => t.id), ['b', 'c'])
})

test('nextTodos respects the limit', () => {
  assert.equal(nextTodos(cats, 1).length, 1)
})

test('todaysPicks fills remaining slots after due items', () => {
  const { due, todos } = todaysPicks(cats, '2026-07-10', 2)
  assert.equal(due.length, 1)
  assert.equal(todos.length, 1) // limit 2 - 1 due = 1 todo
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test app/study/`
Expected: FAIL — `Cannot find module './selectPicks.mjs'`.

- [ ] **Step 3: Write minimal implementation**

Create `app/study/selectPicks.mjs`:

```js
// Pure curriculum selection — no fs, no React. Unit-testable via `node --test`.
// ISO date strings (YYYY-MM-DD) compare lexicographically = chronologically.

export function dueToday(categories, todayISO) {
  const due = []
  for (const cat of categories) {
    for (const t of cat.topics) {
      if (t.srs && t.srs.next <= todayISO) due.push({ ...t, category: cat.label })
    }
  }
  return due
}

export function nextTodos(categories, limit) {
  const queues = categories.map((cat) =>
    cat.topics
      .filter((t) => t.status === 'todo')
      .sort((a, b) => a.added.localeCompare(b.added))
      .map((t) => ({ ...t, category: cat.label }))
  )
  const picks = []
  let i = 0
  while (picks.length < limit && queues.some((q) => q.length)) {
    const q = queues[i % queues.length]
    if (q.length) picks.push(q.shift())
    i++
  }
  return picks
}

export function todaysPicks(categories, todayISO, limit = 3) {
  const due = dueToday(categories, todayISO)
  const todos = nextTodos(categories, Math.max(0, limit - due.length))
  return { due, todos }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test app/study/`
Expected: PASS — `# pass 5`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add app/study/selectPicks.mjs app/study/selectPicks.test.mjs
git commit -m "feat(study): add pure today's-picks selection logic with tests"
```

---

## Task 2: 시드 데이터 + JSON 리더

**Files:**
- Create: `study/curriculum.json`
- Create: `app/study/curriculumData.js`

**Interfaces:**
- Consumes: `dueToday`, `nextTodos`, `todaysPicks` (Task 1).
- Produces: `readCurriculum() -> { categories: [...] }` — 파일 없으면 `{ categories: [] }`. `selectPicks`의 세 함수를 재노출.

- [ ] **Step 1: Create seed data**

Create `study/curriculum.json`:

```json
{
  "categories": [
    {
      "id": "os",
      "label": "Operating System",
      "topics": [
        { "id": "os-process-thread", "title": "프로세스 vs 스레드 & 컨텍스트 스위칭", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null },
        { "id": "os-virtual-memory", "title": "가상 메모리와 페이지 교체", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null }
      ]
    },
    {
      "id": "network",
      "label": "Network",
      "topics": [
        { "id": "net-tcp-handshake", "title": "TCP 3-way / 4-way handshake", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null },
        { "id": "net-http-versions", "title": "HTTP/1.1 vs HTTP/2 vs HTTP/3", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null }
      ]
    },
    {
      "id": "java",
      "label": "Java",
      "topics": [
        { "id": "java-gc", "title": "JVM 가비지 컬렉션 동작과 세대별 힙", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null },
        { "id": "java-equals-hashcode", "title": "equals / hashCode 계약", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null }
      ]
    },
    {
      "id": "spring-boot",
      "label": "Spring Boot",
      "topics": [
        { "id": "sb-di-container", "title": "IoC 컨테이너와 빈 생명주기", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null },
        { "id": "sb-transaction", "title": "@Transactional 전파와 프록시 동작", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null }
      ]
    },
    {
      "id": "mysql",
      "label": "MySQL",
      "topics": [
        { "id": "mysql-btree-index", "title": "B-tree 인덱스와 커버링 인덱스", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null },
        { "id": "mysql-isolation", "title": "트랜잭션 격리 수준과 MVCC", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null }
      ]
    },
    {
      "id": "jpa",
      "label": "JPA",
      "topics": [
        { "id": "jpa-n-plus-one", "title": "N+1 문제와 fetch join", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null },
        { "id": "jpa-persistence-context", "title": "영속성 컨텍스트와 1차 캐시", "status": "todo", "added": "2026-07-10", "writeup": null, "srs": null }
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('study/curriculum.json','utf8')); console.log('ok')"`
Expected: `ok`.

- [ ] **Step 3: Write the reader**

Create `app/study/curriculumData.js`:

```js
import fs from 'fs'
import path from 'path'

export { dueToday, nextTodos, todaysPicks } from './selectPicks.mjs'

// Reads repo-root study/curriculum.json. Missing/invalid file → empty curriculum.
export function readCurriculum() {
  const file = path.join(process.cwd(), 'study', 'curriculum.json')
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return { categories: [] }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add study/curriculum.json app/study/curriculumData.js
git commit -m "feat(study): seed curriculum data and JSON reader"
```

---

## Task 3: `/study` 페이지 + 스타일

**Files:**
- Create: `app/study/page.jsx`
- Create: `app/study/study.module.css`

**Interfaces:**
- Consumes: `readCurriculum`, `todaysPicks` (Task 2).
- Produces: `/study` 라우트 렌더.

- [ ] **Step 1: Write the styles**

Create `app/study/study.module.css`:

```css
.wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1rem 4rem;
}
.hero {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--nextra-border, #e5e7eb);
  padding-bottom: 1.25rem;
}
.kicker {
  margin: 0 0 0.35rem;
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
}
.heading {
  margin: 0;
  font-size: 2rem;
  font-weight: 820;
  line-height: 1.2;
}
.description {
  margin: 0.6rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}
.today {
  margin-bottom: 2.25rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--nextra-border, #e5e7eb);
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.04);
}
.todayTitle {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 750;
}
.pickList {
  margin: 0;
  padding-left: 1.1rem;
  line-height: 1.9;
}
.pickCat {
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 700;
  margin-right: 0.5rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid var(--nextra-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.25rem 1.35rem;
}
.cardHead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
}
.cardLabel {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 750;
}
.progress {
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 700;
}
.topicList {
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1.9;
  font-size: 0.92rem;
}
.done {
  color: #6b7280;
  text-decoration: none;
}
.done:hover {
  text-decoration: underline;
}
.empty {
  color: #6b7280;
}
```

- [ ] **Step 2: Write the page**

Create `app/study/page.jsx`:

```jsx
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
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: 빌드 성공, 라우트 목록에 `/study` 포함. 에러 없음.

- [ ] **Step 4: Manual render check**

Run: `npm run dev` 후 브라우저에서 `http://localhost:3000/study` 접속.
Expected: "오늘 학습" 섹션에 주제 3개, 그 아래 6개 카테고리 카드가 `0/2 완료`로 표시.
(로그인 게이트는 Task 4에서 추가되므로 이 시점엔 바로 보임.)

- [ ] **Step 5: Commit**

```bash
git add app/study/page.jsx app/study/study.module.css
git commit -m "feat(study): add /study curriculum page"
```

---

## Task 4: 인증 미들웨어 (`/study`·`/til` 게이트)

**Files:**
- Create: `middleware.js` (repo 루트)

**Interfaces:**
- Consumes: 쿠키 `til-auth` (기존 `app/api/login/route.js`가 심음).
- Produces: `/study`·`/til` 및 하위 경로 보호. 미인증 시 `/login?from=<path>`로 리다이렉트.

- [ ] **Step 1: Write the middleware**

Create `middleware.js`:

```js
import { NextResponse } from 'next/server'

const TOKEN = 'calix-til-auth-token'

export function middleware(req) {
  const token = req.cookies.get('til-auth')?.value
  if (token === TOKEN) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('from', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/study', '/study/:path*', '/til', '/til/:path*'],
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: 빌드 성공, `ƒ Middleware` 항목이 출력에 표시됨.

- [ ] **Step 3: Manual auth check — 비인증**

Run: `npm run dev` 후 새 시크릿 창(쿠키 없음)에서 `http://localhost:3000/study` 접속.
Expected: `/login?from=/study`로 리다이렉트. `/til`도 동일하게 리다이렉트.

- [ ] **Step 4: Manual auth check — 인증**

로그인 페이지에서 `admin` / `admin1234!@`로 로그인.
Expected: `/study`로 이동, 페이지 정상 표시. `/til`도 정상 접근. 공개 wiki 경로(`/`, `/database` 등)는 로그인 없이도 여전히 접근 가능.

- [ ] **Step 5: Commit**

```bash
git add middleware.js
git commit -m "feat(study): gate /study and /til behind til-auth cookie"
```

---

## Task 5: 내비게이션 링크 추가

**Files:**
- Modify: `app/layout.jsx` (기존 TIL `<Link>` 바로 뒤)

**Interfaces:**
- Consumes: `/study` 라우트 (Task 3).
- Produces: Navbar에 Study 링크.

- [ ] **Step 1: Add the nav link**

`app/layout.jsx`에서 기존 TIL 링크 블록:

```jsx
              <Link
                href="/til"
                style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.8 }}
              >
                TIL
              </Link>
```

바로 뒤에 다음을 추가:

```jsx
              <Link
                href="/study"
                style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.8 }}
              >
                Study
              </Link>
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: 빌드 성공.

- [ ] **Step 3: Manual check**

Run: `npm run dev` 후 로그인 상태로 아무 페이지 접속.
Expected: 상단 Navbar에 TIL 옆으로 Study 링크 표시, 클릭 시 `/study` 이동.

- [ ] **Step 4: Commit**

```bash
git add app/layout.jsx
git commit -m "feat(study): add Study link to navbar"
```

---

## 향후 (이 계획 범위 밖 — 별도 스펙)

- **2단계 퀴즈:** 완료 주제의 `srs`를 기반으로 한 망각곡선 퀴즈 UI + SM-2 등급 조정.
- **푸시 알림(옵션):** 예약 클라우드 에이전트가 매일 아침 오늘 학습 목록을 텔레그램/Discord/Slack로 발송.
- **주제 자동 보충(옵션):** 카테고리 todo 소진 시 예약 에이전트가 새 주제 생성.
- **로그인 자격증명 env 분리:** 현재 하드코딩된 `admin`/토큰을 환경변수로.

## Self-Review

- **Spec 커버리지:** 데이터 모델(Task 2) / `/study` 탭(Task 3) / middleware `/study`·`/til`(Task 4) / nav(Task 5) / "오늘 학습" 선택(Task 1) — 스펙 각 섹션에 대응 태스크 존재. 워크플로우(주제 추가·완료 연결)는 Claude 운영 절차라 코드 태스크 없음(스펙과 일치).
- **플레이스홀더:** 없음. 모든 코드 블록 실제 내용.
- **타입 일관성:** `readCurriculum` 반환 `{ categories }`를 `todaysPicks(data.categories, ...)`에 전달, 토픽 필드(`id/title/status/added/writeup/srs`)가 시드 JSON·선택 로직·페이지 렌더에서 일치. 쿠키명·토큰 문자열이 middleware와 기존 login route에서 동일.
