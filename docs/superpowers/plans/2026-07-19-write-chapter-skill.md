# write-chapter 스킬 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 전자책을 장 단위로 쓰는 반복 사이클(집필→편집자 검수→수정→삽화 프롬프트→빌드→커밋·푸시)을 `write-chapter` 스킬로 자동화하고, 문자 인코딩 책을 첫 사용처로 검증한다.

**Architecture:** 스킬은 코드가 아니라 **지시 프로즈(SKILL.md) + 책별 설정(book.json)**이다. book.json이 그 책의 규칙(voice·structure·경로·에이전트)을 담고, SKILL.md가 그 설정을 읽어 9단계 사이클을 오케스트레이션한다. 기존 자산(`attach-comic`·`commit-push` 스킬, `book-editor` 에이전트, `illustration-prompts.md` 큐)을 재사용한다. 유닛 테스트할 순수 로직이 거의 없으므로, 수용 검증은 "인코딩 1장을 실제로 돌려보기"(실행 검증)로 한다.

**Tech Stack:** 마크다운 스킬(frontmatter `name`/`description` + 단계 프로즈), JSON 설정, Nextra `content/books/` 구조. 신규 npm 의존성 0.

## Global Constraints

- **스킬 형식**: `.claude/skills/{name}/SKILL.md`, frontmatter `name`/`description` + `## Steps`. 기존 `commit-push`·`attach-comic`와 동일 형식. 스크립트가 필요하면 `scripts/` 하위.
- **기존 자산 재사용, 재발명 금지**: `attach-comic`(이미지 부착), `commit-push`(커밋·푸시), `book-editor` 에이전트(검수), `illustration-prompts.md`(프롬프트 큐), `_meta.js`/`index.md`(목차).
- **`book.json` 위치**: `content/books/{book}/book.json`.
- **신규 npm 의존성 0.** 체크가 필요하면 Node 내장(`node -e`)만.
- **`app/` 소스 camelCase, `content/` 위키·도메인은 kebab-case.**
- **커밋은 사용자가 요청할 때만.** 이 플랜은 브랜치에서 실행(예: `write-chapter-skill`). 각 태스크 끝 커밋 스텝은 브랜치 로컬 커밋을 의미하며 main 병합은 별도 승인.
- **스킬은 프로즈 문서다.** 억지 유닛 테스트를 만들지 않는다. 검증은 필수-필드 체크(값쌈) + 인코딩 1장 실행 검증.
- **잠긴 문체(트랜잭션 책 기준, 재사용 대상)**: modern Korean dev-blog tone(velog/토스), 비소설체, `배경→스토리→핵심→정리→생각해볼 질문` 구조. 설계 근거: `docs/superpowers/specs/2026-07-19-write-chapter-skill-design.md`.

---

### Task 1: 트랜잭션 book.json (설정 포맷 확정) + 필수-필드 체크

**Files:**
- Create: `content/books/transaction/book.json`
- Test: 인라인 `node -e` 필수-필드 체크(파일 아님, 스텝 4의 명령)

**Interfaces:**
- Produces: `book.json` 스키마 — `{ title, voice, structure[], styleGuide, promptQueue, editorAgent, spec, buildCmd, commit{type,scope} }`. Task 2(SKILL.md)와 Task 3(encoding/book.json)이 이 포맷을 소비.

- [ ] **Step 1: 트랜잭션 book.json 작성**

`content/books/transaction/book.json`:

```json
{
  "title": "약속된 데이터",
  "voice": "modern Korean dev-blog tone (velog/토스 기술블로그). 독자에게 말 걸고, 짧고 리듬감 있는 문장, dev 어휘(쿼리·락·@Transactional)·인라인 코드. 비소설체 — purple prose·문어체 경직 금지.",
  "structure": ["배경", "스토리", "핵심", "정리", "생각해볼 질문"],
  "styleGuide": "docs/book/style-guide.md",
  "promptQueue": "docs/book/illustration-prompts.md",
  "editorAgent": "book-editor",
  "spec": "docs/superpowers/specs/2026-07-15-transaction-ebook-design.md",
  "buildCmd": "npm run build",
  "commit": { "type": "docs", "scope": "book" }
}
```

- [ ] **Step 2: 필수-필드 체크 실행(검증)**

Run:
```bash
node -e 'const b=require("./content/books/transaction/book.json");const need=["title","voice","structure","styleGuide","promptQueue","editorAgent","buildCmd","commit"];const miss=need.filter(k=>!(k in b));if(miss.length){console.error("MISSING:",miss.join(","));process.exit(1)}console.log("book.json OK:",b.title)'
```
Expected: `book.json OK: 약속된 데이터` (exit 0). 필드 누락 시 `MISSING: …`로 실패.

- [ ] **Step 3: 참조 무결성 확인(경로가 실제 존재하는지)**

Run:
```bash
node -e 'const b=require("./content/books/transaction/book.json");const fs=require("fs");for(const p of [b.styleGuide,b.promptQueue,b.spec]){if(!fs.existsSync(p)){console.error("PATH NOT FOUND:",p);process.exit(1)}}console.log("paths OK")'
```
Expected: `paths OK`. (styleGuide·promptQueue·spec 파일이 실재.)

- [ ] **Step 4: 커밋**

```bash
git add content/books/transaction/book.json
git commit -m "feat(book): write-chapter 스킬용 book.json 설정 포맷 + 트랜잭션 설정"
```

---

### Task 2: write-chapter SKILL.md (핵심 산출물)

**Files:**
- Create: `.claude/skills/write-chapter/SKILL.md`

**Interfaces:**
- Consumes: `content/books/{book}/book.json`(Task 1 포맷), `_meta.js`, `book-editor` 에이전트, `commit-push`·`attach-comic` 스킬, `promptQueue`.
- Produces: 트리거("N장 써줘"/"다음 장"/"write chapter N")로 발동하는 스킬. Task 4가 이 스킬을 실행해 검증.

- [ ] **Step 1: SKILL.md 작성**

`.claude/skills/write-chapter/SKILL.md`:

````markdown
---
name: write-chapter
description: Write one (or several) chapters of an e-book in this Nextra wiki, running the full per-chapter cycle automatically — draft → book-editor review → apply fixes → illustration prompt → build → commit+push. Use when the user says "N장 써줘", "다음 장 써줘", "12~15장 써줘", "write chapter N", or asks to continue writing the current book. Config-driven per book via content/books/{book}/book.json, so it works for the transaction book, the encoding book, and future books alike.
---

# write-chapter

전자책 한 장(또는 여러 장)을 **집필 사이클 전체**로 자동 완성한다. 이 스킬은 코드가
아니라 지시 문서다. 책별 규칙은 `content/books/{book}/book.json`이 담고, 이 문서가
그 설정을 읽어 아래 사이클을 오케스트레이션한다.

## 전제

- 대상 책은 이미 목차(`content/books/{book}/_meta.js`)와 장 스텁(빈 장 파일)이 있어야
  한다. 목차·골격이 없으면 이 스킬이 아니라 별도 setup이 먼저다.
- `content/books/{book}/book.json`이 있어야 한다(없으면 사용자에게 어느 책인지 묻고,
  포맷은 트랜잭션 book.json 참고).

## 입력 해석

1. 사용자 요청에서 **어느 책·몇 장**인지 파악한다.
   - 책이 불분명하면(여러 책 존재) 묻는다. 최근 작업 맥락에 책이 하나면 그걸로.
   - 장은 단일("17장") 또는 범위("12~15장"). "다음 장"이면 `_meta.js`에서 마지막으로
     채워진 장의 다음을 고른다(스텁=`🚧 집필 중` 표시가 남은 첫 장).
2. `content/books/{book}/book.json`을 읽어 `voice·structure·styleGuide·promptQueue·
   editorAgent·spec·buildCmd·commit`을 확보한다.

## 한 장당 사이클 (풀 자동 — 커밋·푸시까지 멈추지 않는다)

각 장에 대해 아래 1~8을 수행하고, 범위면 다음 장으로 반복한다(장당 1커밋).

1. **장 파일 읽기.** `_meta.js`에서 장 번호 → 파일명 매핑. 파일을 읽어, 상단에
   **자동생성 블록**(`![만화…]` 이미지 + 요약 굵은 글씨 + "면접 실전 질문" + `---`)이
   있으면 **한 글자도 건드리지 말고 보존**한다. 본문의 `🚧 집필 중` 스텁 자리만 채운다.
2. **컨텍스트 로드.** `book.json`의 `spec`, 그리고 **앞장·뒷장**을 읽어 연결·복선·
   콜백을 파악한다(앞장의 "생각해볼 질문"을 이 장이 받는가, 이 장이 뒷장을 예고하는가).
3. **집필.** `voice`대로, `structure` 순서(H2)로 본문을 쓴다. 상단 자동생성 블록 아래에.
   삽화 슬롯 주석(`{/* 삽화 자리 … */}`)이 없으면 그 장의 요약 장면 프롬프트 주석을 심는다.
   장 끝에 다음 장으로 잇는 "생각해볼 질문" + `▶ [다음 장](...)` 링크.
4. **검수 디스패치.** `editorAgent` 페르소나로 리뷰 서브에이전트를 띄운다.
   - 우선 `editorAgent`(예: `book-editor`) 에이전트 타입으로 시도. 세션에 로드돼 있지
     않아 실패하면, `general-purpose`에게 `.claude/agents/{editorAgent}.md`를 먼저 읽어
     그 페르소나·검수기법·출력형식을 채택하게 한 뒤 검수시킨다.
   - 넘길 것: 검수 대상 장 파일 경로, 컨텍스트(spec·앞장·뒷장 경로), **이 장의 검증
     포인트**(사실·역사·코드 정확성 체크리스트 — 도메인에서 직접 도출). "파일 수정 금지,
     리뷰 텍스트만 반환"을 지시.
   - 반환: verdict(SHIP/REVISE/RERANGE) + 심각도별 findings(Critical/Major/Minor/Nit).
5. **수정 반영.** Critical·Major는 전부, 값싼 Minor는 함께 고친다. SHIP이면 폴리시만.
   기술 정확성 지적(사실·코드 오류)은 최우선. 반영 후 필요하면 재검수는 생략(수정이
   리뷰어 처방 그대로면).
6. **삽화 프롬프트 조립.** `styleGuide`의 프리픽스(STYLE PREFIX + 해당 ERA ACCENT +
   NEGATIVE)에 이 장의 장면 묘사를 끼워 `promptQueue`에 블록으로 append:
   장 제목 헤더, 저장 경로(`public/images/books/{book}/{2자리 장번호}/webtoon.png`),
   연결 스니펫(`![내용 서술 alt](/images/books/{book}/{장}/webtoon.png)`), `/imagine …`
   프롬프트. Midjourney 파라미터(`--ar 16:9 --style raw --no …`)는 styleGuide 규칙대로.
7. **빌드 게이트.** `buildCmd`(예: `npm run build`) 실행. 실패하면 원인을 확인한다.
   내 장과 무관한 기존 에러(예: 다른 위키 파일의 이미지 경로)면 그것도 바로잡아 통과.
   내 장 때문이면 고친다. 통과 못 하면 커밋하지 말고 사용자에게 보고하고 멈춘다.
8. **커밋·푸시.** `commit-push` 스킬 프로토콜로, 그 장 파일 + `promptQueue`를 명시적
   스테이징해 커밋·푸시한다. 메시지:
   `{commit.type}({commit.scope}): {책 약칭} N장 '장 제목' 집필 + 편집 검수 반영`
   본문에 검수 판정과 주요 수정 요약 1~3줄 + 표준 트레일러.

## 범위 처리

- "12~15장"이면 12→13→14→15 순으로 각각 1~8을 돌리고 장마다 커밋·푸시.
- 한 장이 7단계 빌드 실패로 막히면 **거기서 멈추고** 원인·현재 상태를 보고한다
  (나머지 장을 조용히 건너뛰지 않는다).

## 하지 않는 것

- 실제 이미지 생성(Midjourney·`image-jobs`/Codex 몫). 이 스킬은 프롬프트만 만든다.
- 이미지 부착은 `attach-comic` 스킬이 담당(사용자가 이미지 생성 후 별도 실행).
- 새 책 목차 창작·스캐폴딩(별도 setup).

## 재사용

- `commit-push` — 8단계.
- `book-editor` 에이전트 — 4단계.
- `attach-comic` — (사이클 밖) 이미지 준비 후 상단 부착.
- `illustration-prompts.md` — 6단계 큐.
````

- [ ] **Step 2: 스킬 등록 확인**

Run: `cat .claude/skills/write-chapter/SKILL.md | head -3`
Expected: frontmatter `name: write-chapter`가 보임. (스킬은 다음 세션부터 트리거로
로드되지만, 이번 세션에서도 문서로 참조 가능.)

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/write-chapter/SKILL.md
git commit -m "feat(skill): write-chapter — 장 단위 집필 사이클 자동화 스킬"
```

---

### Task 3: 인코딩 책 부트스트랩 (목차·골격·book.json)

**Files:**
- Create: `content/books/encoding/_meta.js`
- Create: `content/books/encoding/index.md`
- Create: `content/books/encoding/*.md` (여는 글 + 장 스텁들 + 닫는 글)
- Create: `content/books/encoding/book.json`
- Modify: `content/books/_meta.js` (encoding 도메인 등록)

**Interfaces:**
- Consumes: Task 1의 book.json 포맷.
- Produces: `write-chapter` 스킬이 집필을 시작할 수 있는 완성된 골격. Task 4가 검증.

- [ ] **Step 1: 저자 에이전트로 인코딩 책 목차 도출**

`oh-my-claudecode:planner`(opus) 또는 general-purpose(opus)에게 "20년차 시니어 개발자 +
베테랑 기술서 저자" 관점으로 문자 인코딩 책 목차를 도출시킨다. 요구: 트랜잭션 책과
같은 결(역사→원리→실무, `배경→스토리→핵심`), 주제 커버리지 = 모스/전신 → ASCII(왜
128자) → 각국 인코딩 난립(EUC-KR·Shift-JIS, "사투리 전쟁") → 유니코드(코드포인트) →
UTF-8(가변길이·ASCII 호환·BOM·이모지) → 현장(`String.length` 이모지, MySQL `utf8` vs
`utf8mb4`, 인코딩 버그). 제목 후보 3개 + 부/장 구조 + 장별 배경/스토리 훅·삽화 아이디어.
결과를 받아 아래 스캐폴딩에 반영.

- [ ] **Step 2: `_meta.js` 작성 (트랜잭션 형식 그대로)**

`content/books/encoding/_meta.js` — 도출된 목차를 트랜잭션 `_meta.js`와 동일 형식으로:

```js
export default {
  index: '표지 · 서문',
  '00-opening': '여는 글 · {훅 제목}',

  '_part1': { type: 'separator', title: '제1부 · {부 제목}' },
  '01-{slug}': '1장. {제목}',
  // … 도출된 장들 …

  '99-closing': '닫는 글 · {제목}',
}
```

- [ ] **Step 3: `index.md`(표지·서문·목차) + 장 스텁 생성**

`content/books/encoding/index.md`는 트랜잭션 `index.md` 구조(frontmatter `title`/`book`/
`description`/`status: "집필 중"` + 서문 + 부별 목차 링크 + "여는 글부터 읽기" + 닫는 글
링크)를 따른다. 각 장 파일은 스텁:

```markdown
---
title: "{N}장. {제목}"
---

# {N}장. {제목}

> 🚧 집필 중 — 곧 채워집니다.
```

(여는 글·닫는 글 포함. 트랜잭션 책 스텁 생성 절차와 동일.)

- [ ] **Step 4: `encoding/book.json` 작성**

`content/books/encoding/book.json` (트랜잭션과 같은 포맷, 값만 인코딩용):

```json
{
  "title": "{인코딩 책 제목}",
  "voice": "modern Korean dev-blog tone (velog/토스 기술블로그). 독자에게 말 걸고, 짧고 리듬감 있는 문장, dev 어휘·인라인 코드. 비소설체.",
  "structure": ["배경", "스토리", "핵심", "정리", "생각해볼 질문"],
  "styleGuide": "docs/book/style-guide.md",
  "promptQueue": "docs/book/illustration-prompts.md",
  "editorAgent": "book-editor",
  "spec": "content/books/encoding/index.md",
  "buildCmd": "npm run build",
  "commit": { "type": "docs", "scope": "book" }
}
```

(스타일 가이드는 우선 트랜잭션 것을 재사용. 인코딩 전용 화풍이 필요하면 추후 분리 —
YAGNI. `spec`은 아직 별도 스펙이 없으므로 `index.md`를 가리킨다.)

- [ ] **Step 5: 도메인 등록 + 빌드 검증**

`content/books/_meta.js`에 `encoding` 항목 추가(트랜잭션과 같은 방식). 그다음:

Run: `npm run build`
Expected: 빌드 성공. `/books`에 인코딩 책 카드가 등장(집필 중 배지), 각 장 스텁 라우트 생성.

- [ ] **Step 6: 커밋**

```bash
git add content/books/encoding/ content/books/_meta.js
git commit -m "feat(book): 문자 인코딩 책 골격 + book.json 부트스트랩"
```

---

### Task 4: write-chapter 스킬 실행 검증 (인코딩 1장)

**Files:**
- Modify: `content/books/encoding/00-opening.md` 또는 `01-*.md` (스킬이 채움)
- Modify: `docs/book/illustration-prompts.md` (스킬이 프롬프트 append)

**Interfaces:**
- Consumes: Task 2 스킬, Task 3 골격.
- Produces: 스킬이 실제로 한 사이클을 완주했다는 수용 증거.

- [ ] **Step 1: 스킬을 인코딩 여는 글(또는 1장)에 적용**

`write-chapter` 스킬을 발동해 인코딩 책의 **여는 글**(또는 1장)을 쓴다. 스킬의 1~8단계가
실제로 도는지 확인하며 진행: 집필 → book-editor 검수 → 수정 → 프롬프트 append → 빌드 →
커밋·푸시.

- [ ] **Step 2: 수용 체크리스트 검증**

아래가 모두 참인지 확인:
- [ ] 상단 자동생성 블록(있었다면)이 보존됐다.
- [ ] 본문이 `structure` 순서(배경→스토리→핵심→정리→생각해볼 질문)를 따른다.
- [ ] book-editor 검수가 돌고 verdict + findings가 나왔고, Critical/Major가 반영됐다.
- [ ] `docs/book/illustration-prompts.md`에 그 장 프롬프트 블록이 append됐다(저장 경로·
      연결 스니펫·`/imagine` 포함).
- [ ] `npm run build` 통과.
- [ ] 커밋 메시지가 `docs(book): … 집필 + 편집 검수 반영` 형식과 일치하고 푸시됨.

- [ ] **Step 3: 검증 결과 기록**

스킬이 사이클을 완주했으면 성공. 어긋난 단계가 있으면 SKILL.md(Task 2)를 그 지점만
보완하고 재실행. (이 태스크의 커밋은 스킬 실행이 8단계에서 자동 수행하므로 별도 커밋
없음 — 스킬이 만든 커밋이 곧 이 태스크의 산출.)

---

## Self-Review

- **Spec coverage**: (1) 스킬 위치·트리거 → Task 2. (2) book.json 재사용 설정 → Task 1(포맷)+Task 3(인코딩). (3) 풀 자동 9단계 사이클 → Task 2 SKILL.md 사이클. (4) 기존 자산 재사용 → Task 2 "재사용" 섹션. (5) 인코딩 책으로 검증 → Task 3(골격)+Task 4(실행). 스펙의 "열린 질문"(범위 중단·에이전트 폴백)은 Task 2 SKILL.md에 명시 반영. 누락 없음.
- **Placeholder scan**: `{제목}`·`{slug}` 류는 Task 3의 창작 산출물(저자 에이전트가 채움)로, 구조는 정확히 지정됨 — 플랜 결함 아님. TBD/미완 섹션 없음.
- **Type consistency**: book.json 필드(`title/voice/structure/styleGuide/promptQueue/editorAgent/spec/buildCmd/commit`)가 Task 1·2·3에서 동일. 커밋 형식 `{commit.type}({commit.scope})`이 Task 1 설정과 Task 2 사용에서 일치.
