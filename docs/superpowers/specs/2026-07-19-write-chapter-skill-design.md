# `write-chapter` 스킬 — 설계 문서

날짜: 2026-07-19
상태: 승인 대기

## 목적

전자책을 장 단위로 집필하는 **반복 사이클을 스킬로 자동화**한다. 트랜잭션 책
20장을 쓰면서 매 장 똑같이 반복한 워크플로우 — 집필 → 편집자 검수 → 수정 →
삽화 프롬프트 → 빌드 → 커밋·푸시 — 를 `write-chapter` 스킬 하나로 굳혀,
다음 책(문자 인코딩)부터 "N장 써줘" 한 마디로 일관되게 돌아가게 한다.

## 범위

- **이 스킬이 하는 것**: 이미 목차(`_meta.js`)와 골격(장 스텁)이 있는 책에서,
  **장 하나(또는 여러 장)의 집필 사이클 전체**를 풀 자동으로 수행.
- **이 스킬이 안 하는 것**(YAGNI):
  - 실제 이미지 생성 — Midjourney(반자동) + `image-jobs`/Codex 핸드오프 몫.
  - 새 책 스캐폴딩(목차·부/장 스텁·스타일가이드 생성) — 별도 setup 작업, 이번 범위 밖.
  - 목차 창작 — `_meta.js`/`index.md`에서 읽는다(중복 저장 안 함).

## 설계 결정 (확정)

1. **스킬 위치**: 프로젝트 스킬 `.claude/skills/write-chapter/SKILL.md`
   (기존 `attach-comic`·`commit-push`와 같은 위치·형식).
2. **트리거**: "17장 써줘", "다음 장", "12~15장 써줘", "write chapter N".
3. **책마다 설정 파일**로 재사용: 책 슬러그만 바꾸면 트랜잭션·인코딩·미래 책 전부
   같은 스킬로 커버.
4. **풀 자동**: 한 번 실행 시 집필→검수→수정→삽화프롬프트→빌드→커밋·푸시까지
   멈추지 않고. 여러 장이면 장마다 이 사이클을 순차 반복(장당 1커밋).
5. **기존 자산 재사용**: `attach-comic`(이미지 부착)·`commit-push`·`book-editor`
   에이전트·`illustration-prompts.md` 큐를 새로 만들지 않고 조합.

## 컴포넌트

### 1. 책별 설정 파일 — `content/books/{book}/book.json`

스킬이 그 책의 규칙을 아는 단일 소스. 변하는 목차·제목은 `_meta.js`에서 읽으므로
중복 저장하지 않는다. 린한 설정:

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

필드 정의:

- `title` — 책 제목(커밋 메시지·프롬프트에 사용).
- `voice` — 잠긴 문체 규칙. 집필·검수 양쪽의 기준.
- `structure` — 장 본문의 섹션 순서(H2). 상단 자동생성 블록은 이 구조 밖(보존).
- `styleGuide` — 삽화 스타일 가이드 경로(프롬프트 프리픽스 출처).
- `promptQueue` — 삽화 프롬프트를 append할 파일.
- `editorAgent` — 검수에 쓸 에이전트 이름(기본 `book-editor`).
- `spec` — 책 설계 스펙(검수 컨텍스트).
- `buildCmd` — 빌드 게이트 명령.
- `commit` — 커밋 타입·스코프(`docs(book): …`).

### 2. 스킬 본문 — `.claude/skills/write-chapter/SKILL.md`

프론트매터(`name`/`description`)로 트리거를 정의하고, 아래 사이클을 단계별로
지시하는 스킬 문서. `description`에 "N장 써줘/다음 장/write chapter" 트리거를 명시.

## 집필 사이클 (장 하나당, 풀 자동)

1. **장 해석·읽기**: 사용자가 준 장 번호(또는 범위)를 `content/books/{book}/_meta.js`
   에서 실제 파일로 매핑해 읽는다. **상단 자동생성 블록**(만화 이미지 `![…]` + 요약
   굵은 글씨 + "면접 실전 질문")이 있으면 **그대로 보존**한다.
2. **컨텍스트 로드**: `book.json`, `spec`, **앞뒤 장**(prev/next)을 읽어 연결·복선 파악.
3. **집필**: `voice` + `structure`대로 본문 작성(상단 블록 아래). 각 장 상단 삽화
   슬롯(`{/* 삽화 자리 … */}`)이 없으면 프롬프트 주석을 심는다.
4. **검수 디스패치**: `editorAgent` 페르소나로 리뷰 서브에이전트를 띄운다. 넘기는 것:
   검수 대상 파일, 컨텍스트 파일(spec·prev/next), 그리고 **내가 도메인에서 도출한
   장별 검증 포인트**(사실·코드 정확성 체크리스트). 에이전트 타입이 세션에 로드돼
   있지 않으면 general-purpose가 `.claude/agents/{editorAgent}.md` 페르소나를 읽고
   그 역할로 수행. 반환: verdict(SHIP/REVISE/RERANGE) + 심각도별 findings.
5. **수정 반영**: Critical·Major는 전부, 값싼 Minor는 함께 반영. SHIP이면 폴리시만.
6. **삽화 프롬프트 조립**: `styleGuide`의 프리픽스(STYLE + ERA + NEGATIVE) + 그 장의
   장면을 조립해 `promptQueue`에 블록으로 append. 저장 경로
   (`public/images/books/{book}/{장}/webtoon.png`)·연결 스니펫(alt 포함) 포함.
7. **빌드 게이트**: `buildCmd` 실행. 실패하면 원인(대개 무관한 이미지 경로 등)을
   확인·수정 후 통과시킨다. 통과 못 하면 커밋하지 않고 사용자에게 보고.
8. **커밋·푸시**: `commit-push` 스킬로 그 장 파일 + 프롬프트 큐를 스테이징해
   `{type}({scope}): 트랜잭션 N장 '제목' 집필 + 편집 검수 반영` 형식으로 커밋·푸시.
9. **반복**: 범위(예: 12~15장)면 다음 장으로 2~8을 반복(장당 1커밋).

## 재사용하는 기존 자산

- **`attach-comic` 스킬** — 사용자가 생성한 이미지를 장 상단에 부착(사이클 밖, 이미지
  준비되면 별도 실행). 이 스킬은 프롬프트만 만들고 이미지는 안 만든다.
- **`commit-push` 스킬** — 8단계 커밋·푸시.
- **`book-editor` 에이전트** — 4단계 검수 페르소나.
- **`illustration-prompts.md`** — 6단계 프롬프트가 쌓이는 큐.
- **`_meta.js`/`index.md`** — 목차·장 파일 매핑(스킬이 읽음).

## 워크플로우 (운영 방식)

- 새 책을 시작할 때: (이번 범위 밖) 목차·골격을 만들고 `book.json`을 한 번 작성.
- 집필: 사용자가 "N장 써줘"/"다음 장"/"12~15장 써줘" → 스킬이 사이클을 풀 자동 수행.
- 삽화: 사용자가 프롬프트 큐로 Midjourney 생성 → `attach-comic`으로 상단 부착.

## 테스트 / 검증

- `book.json` 파서 최소 self-check: 필수 필드(`voice`/`structure`/`promptQueue`/
  `editorAgent`/`buildCmd`) 누락 시 명확한 에러.
- 스킬 드라이런: 트랜잭션 책의 이미 완성된 장 하나로 사이클을 돌려, (a) 상단
  자동생성 블록 보존, (b) 검수 디스패치·수정 반영, (c) 프롬프트 큐 append,
  (d) 빌드 통과, (e) 커밋 형식이 기존과 일치하는지 확인.
- 재사용 검증: `content/books/transaction/book.json`을 만들고, 인코딩 책 골격이
  생기면 `content/books/encoding/book.json`만 추가해 같은 스킬이 도는지.

## 명시적으로 안 하는 것 (YAGNI)

- 이미지 생성 파이프라인(Midjourney/Codex는 별도).
- 새 책 스캐폴딩·목차 생성(별도 setup 스킬 후보, 이번 범위 밖).
- 장별 검증 포인트를 설정 파일에 저장(집필 시 도메인에서 도출).
- 다국어·다른 문체 프리셋(설정 `voice` 문자열로 충분).

## 열린 질문 (구현 계획에서 확정)

- 스킬이 장 범위를 순차 처리할 때, 한 장이 빌드 실패로 막히면 나머지를 중단할지
  건너뛸지(기본: 중단하고 보고).
- `book-editor` 에이전트가 세션에 로드돼 있는지 판별하는 방법(기본: 실패 시
  general-purpose + 페르소나 파일 폴백).
