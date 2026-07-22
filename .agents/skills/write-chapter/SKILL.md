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
     않아 실패하면, `general-purpose`에게 `.Codex/agents/{editorAgent}.md`를 먼저 읽어
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
