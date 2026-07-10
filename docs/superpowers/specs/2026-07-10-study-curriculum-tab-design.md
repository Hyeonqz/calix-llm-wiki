# Study 커리큘럼 탭 — 설계 문서

날짜: 2026-07-10
상태: 승인 대기

## 목적

망각곡선(간격 반복)을 토대로 개발 지식을 매일 학습하기 위한 **비공개 학습 탭**을 만든다.
큰 카테고리(OS, Network, Java, Spring Boot, MySQL, JPA 등)를 잡고, Claude가 학습 주제를
제안하면 사용자가 학습 후 TIL/Wiki/블로그로 글을 쓴다. 쓴 글을 주제에 연결해 진도를 추적한다.

## 범위

두 단계로 나눈다. **이 문서는 1단계만 확정**한다.

- **1단계 (지금):** 카테고리별 학습 커리큘럼 보드. 주제 제안 → 학습 → 글 작성 → 주제에 연결.
  비공개 접근 제어.
- **2단계 (나중, 별도 스펙):** 쌓인 TIL·Wiki 기반 망각곡선 퀴즈. 1단계에서 "완료"된 주제에
  심어둔 복습 스케줄(`srs`)을 그대로 사용한다.

## 설계 결정 (확정)

1. 라우트: `/study`
2. 데이터 저장: JSON 파일 하나 (`study/curriculum.json`, repo 루트 — `TIL/`과 같은 위치)
3. 접근 제어: `middleware.js`로 `/study`와 `/til` 둘 다 쿠키 인증 뒤로 숨김

## 데이터 모델

repo 루트 `study/curriculum.json` 파일 하나에 전체 커리큘럼을 담는다.
주제는 페이지가 생기기 전에 Claude가 먼저 제안하므로, 페이지 frontmatter가 아니라
중앙 파일로 관리한다.

```json
{
  "categories": [
    {
      "id": "os",
      "label": "Operating System",
      "topics": [
        {
          "id": "os-process-thread",
          "title": "프로세스 vs 스레드 & 컨텍스트 스위칭",
          "status": "todo",
          "added": "2026-07-10",
          "writeup": null,
          "srs": null
        }
      ]
    }
  ]
}
```

필드 정의:

- `status`: `"todo"` → `"learning"` → `"done"`
- `writeup`: 완료 시 `{ "type": "til" | "wiki" | "blog", "path": "/til/2026-07-11" }`
- `srs`: 완료 시 심는 복습 스케줄. `{ "learned": "YYYY-MM-DD", "next": "YYYY-MM-DD",
  "interval": 1, "ease": 2.5 }`. 1단계에서는 초기값만 심고, 실제 등급 조정은 2단계에서 한다.

초기 시드 카테고리: OS, Network, Java, Spring Boot, MySQL, JPA. 각 카테고리에
Claude가 1~2개 주제를 미리 채워 예시로 보여준다.

## 컴포넌트

### 1. 데이터 리더 — `app/study/curriculumData.js`

`app/til/tilFiles.js`와 같은 패턴. `process.cwd()/study/curriculum.json`을 `fs`로 읽어
파싱한 객체를 반환한다. 파일이 없으면 빈 `{ categories: [] }`을 반환한다.
파생 계산 헬퍼:

- `dueToday(data, todayISO)`: `srs.next <= today`인 주제 목록 (2단계에서 주로 쓰지만
  리더에 같이 둔다).
- 진도는 페이지에서 카테고리별 `done/total`로 계산.

### 2. 탭 페이지 — `app/study/page.jsx`

`app/til/page.jsx`와 같은 서버 컴포넌트 구조. 렌더 내용:

- **"오늘 학습" 섹션 (상단):** 오늘 추천 주제. 1단계에서는 각 카테고리의 다음 `todo` 주제
  중심 + `dueToday` 결과를 함께 노출.
- **카테고리별 카드:** 카테고리 라벨, 진도 바(`3/8 완료`), 다음 학습할 `todo` 주제 목록.
- **완료 주제:** `writeup.path`로 링크(내가 쓴 TIL/wiki/블로그로 이동).

스타일은 기존 `til.module.css` 톤을 따르는 새 `study.module.css`.

### 3. 접근 제어 — `middleware.js` (repo 루트, 신규)

```
matcher: ['/study/:path*', '/til/:path*']
```

요청 쿠키 `til-auth`가 유효 토큰(`calix-til-auth-token`)이 아니면
`/login?from=<원래경로>`로 리다이렉트. `/login`과 `/api/*`는 매처에서 제외.

> 참고: 로그인 자격증명·토큰이 코드에 하드코딩된 기존 약점은 그대로 둔다(개인용으로 충분).
> 나중에 환경변수로 빼는 건 별도 작업.

### 4. 내비게이션 — `app/layout.jsx`

Navbar의 기존 TIL 링크 옆에 `/study` 링크("Study") 추가. 미들웨어가 접근을 막으므로
링크 노출 자체는 무방(비로그인 클릭 시 로그인으로 리다이렉트).

## 워크플로우 (운영 방식)

- **주제 뽑기:** 사용자가 "OS 다음 주제 뽑아줘" / "이번 주 커리큘럼 짜줘" 요청 →
  Claude가 `curriculum.json`에 `todo` 주제 추가.
- **학습 후 연결:** 사용자가 TIL/wiki/블로그 글 작성(기존 스킬) → "이거 os-process-thread에
  연결해줘" → Claude가 해당 주제를 `status: "done"` + `writeup` 링크 + 초기 `srs` 심음.
- **탭 확인:** 사용자가 `/study`를 열어 진도·다음 학습 주제 확인.

## 테스트 / 검증

- `curriculumData.js`: 최소 self-check — 샘플 JSON에서 `dueToday`가 `next <= today`만
  거르는지 assert 한 줄.
- `middleware.js`: 쿠키 없이 `/study`·`/til` 요청 시 `/login` 리다이렉트, 유효 쿠키 시 통과.
  로컬 `next dev`로 수동 확인(쿠키 유무 두 케이스).
- 탭 렌더: `next build` 통과 + `/study` 페이지가 시드 데이터로 카테고리·진도 표시.

## 명시적으로 안 하는 것 (YAGNI)

- 2단계 퀴즈 UI·등급 조정 알고리즘(SM-2 전체) — 별도 스펙.
- 브라우저에서 상태를 바꾸는 인터랙션(완료 체크 버튼 등) — 상태 변경은 Claude가 파일 편집으로 처리.
- 로그인 토큰의 환경변수화·다중 사용자 — 개인용 단일 사용자.
- 주제별 개별 페이지 라우트 — `writeup` 링크로 기존 TIL/wiki/블로그 재사용.
