---
title: gstack
---

# gstack

## 개요

**Garry Tan(Y Combinator CEO)의 실전 Claude Code 설정을 그대로 패키징한 오픈소스 스킬 팩**. 단순 프롬프트 모음이 아니라, 하나의 AI 코딩 에이전트를 **가상 엔지니어링 팀**으로 바꾸는 슬래시 커맨드 묶음이다. CEO·디자이너·엔지니어링 매니저·스태프 엔지니어·QA 리드·릴리스 엔지니어·보안 책임자·기술 작가 등 **9개 전문가 역할**이 소프트웨어 개발 생명주기 전체에 매핑된다.

공식 저장소 [garrytan/gstack](https://github.com/garrytan/gstack) 기준 **23개의 opinionated 도구**로 출발했고, 공개 후 빠르게 스타를 모으며 2026년 가장 화제가 된 Claude Code 하네스 중 하나가 됐다. MIT 라이선스.

> Garry Tan: *"That is not a copilot. That is a team."*

## 철학

gstack의 핵심은 **개발 단계마다 인지 모드(cognitive mode)를 명시적으로 분리**한다는 것이다.

> "Planning is not review. Review is not shipping. Founder taste is not engineering rigor."

- **단계 분리** — 기획·리뷰·테스트·배포는 서로 다른 사고방식을 요구하므로 별도 스킬로 강제 분리한다.
- **단계 간 산출물 전달** — 각 스킬은 명확한 입/출력을 가지며 이전 단계의 결과물을 읽는다. 예: 설계 문서는 `/office-hours`에서 나와 `/plan-ceo-review`가 읽고, 테스트 계획은 `/plan-eng-review`에서 나와 `/qa`가 활용한다.
- **하네스 엔지니어링** — "에이전트가 접근할 수 없는 것은 존재하지 않는 것과 같다"는 원칙으로 행동 공간을 재설계한다. 같은 모델이라도 하네스(harness)를 바꾸면 성능이 크게 오른다는 관점.

이 점에서 [Superpowers](/ai-harness/plugins/superpowers)(프로세스 규율 강제)와 철학을 공유하지만, gstack은 **스타트업 창업자의 역할 기반(CEO/EM/QA…) 워크플로우**라는 색이 더 강하다.

---

## 스킬 카탈로그

생명주기 단계별로 슬래시 커맨드가 배치된다. 전체 흐름: **Think → Plan → Build → Review → Test → Ship → Reflect**.

### 기획 / 계획

| 스킬 | 역할 |
|------|------|
| `/office-hours` | YC Office Hours 스타일 6개 강제 질문으로 문제 재정의 |
| `/plan-ceo-review` | 창업자 관점에서 제품 범위 재검토, 10배 솔루션 탐색 |
| `/plan-eng-review` | 아키텍처 락 (다이어그램, 데이터 플로우, 엣지 케이스) |
| `/plan-design-review` | 디자인 품질 0-10 평가 |
| `/plan-devex-review` | 개발자 경험 설계 |
| `/autoplan` | CEO → Design → Eng 리뷰를 자동 순차 실행 (권장 진입점) |
| `/spec` | 모호한 의도를 정확한 스펙으로 변환 |

### 구축 / 디자인

| 스킬 | 역할 |
|------|------|
| `/design-consultation` | 디자인 시스템 제로 빌드 |
| `/design-shotgun` | 4-6개 AI 목업 변형 생성 + 비교 보드 |
| `/design-html` | 목업 → 프로덕션 HTML |

### 검수 / 테스트

| 스킬 | 역할 |
|------|------|
| `/review` | 스태프 엔지니어 모드로 프로덕션 버그 탐색 (자동 수정 + 플래그) |
| `/design-review` | 디자이너 리뷰 + 자동 수정 |
| `/investigate` | 체계적 근본 원인 디버깅 |
| `/qa` | diff-aware 실제 브라우저 QA + 버그 수정 + 회귀 테스트 생성 |
| `/browse` | 실제 Chromium 브라우저로 스크린샷·QA 자동화 |
| `/cso` | OWASP Top 10 + STRIDE 위협 모델 기반 보안 감사 |
| `/codex` | OpenAI Codex를 통한 독립 크로스모델 Second Opinion |

### 배포 / 운영

| 스킬 | 역할 |
|------|------|
| `/ship` | main 싱크 → 테스트 → 커버리지 감사 → PR 생성 |
| `/land-and-deploy` | PR 병합 → 배포 대기 → 프로덕션 검증 |
| `/canary` | 포스트 배포 모니터링 (콘솔 에러, 성능) |
| `/benchmark` | 로드 타임·Core Web Vitals·리소스 크기 비교 |

### 문서 / 회고

| 스킬 | 역할 |
|------|------|
| `/document-release` | 배포 코드에 맞춰 모든 문서 자동 업데이트 |
| `/document-generate` | Diataxis 프레임워크로 문서 생성 |
| `/retro` | 팀 메트릭 기반 주간 회고 |

### 안전 가드레일

| 스킬 | 역할 |
|------|------|
| `/careful` | 파괴적 명령(`rm -rf`, `DROP TABLE`, force-push) 전 경고 |
| `/freeze` | 편집 가능 디렉터리를 하나로 제한 |
| `/guard` | `/careful` + `/freeze` 통합 (최대 안전 모드) |
| `/unfreeze` | 편집 제한 해제 |

---

## 9개 전문가 역할

gstack 스킬은 결국 다음 9개 역할로 수렴한다.

| 역할 | 대표 스킬 |
|------|-----------|
| CEO / 창업자 | `/plan-ceo-review` |
| 엔지니어링 매니저 | `/plan-eng-review` |
| 시니어 디자이너 | `/plan-design-review` |
| 스태프 엔지니어 | `/review` |
| 설계 엔지니어 | `/design-html` |
| QA 리드 | `/qa`, `/browse` |
| 릴리스 엔지니어 | `/ship`, `/land-and-deploy` |
| 보안 책임자 | `/cso` |
| 기술 작가 | `/document-release` |

---

## 표준 워크플로우

5단계 스프린트(블로그 기준 총 오버헤드 ~25분):

1. **문제 정의** (`/office-hours`) — 6개 강제 질문으로 기획 수립
2. **계획 리뷰** (`/autoplan`) — CEO·설계·엔지니어링 관점 자동 검토
3. **코드 리뷰** (`/review`) — 스태프 엔지니어 수준 버그 탐색
4. **QA 테스트** (`/qa`) — 실제 브라우저로 시각적 검증
5. **배포** (`/ship`) — PR 생성 및 자동화 배포

가장 가치가 큰 단계는 `/office-hours`로 꼽힌다 — 코드를 쓰기 전 문제 자체를 다시 정의하기 때문.

## 설치

```bash
# 글로벌 설치 (개인 사용)
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && \
cd ~/.claude/skills/gstack && ./setup
```

`./setup`은 설치된 에이전트를 자동 감지한다. Codex/Cursor 등 다른 호스트는 `./setup --host codex` 식으로 지정한다. `setup`이 `CLAUDE.md`에 스킬 목록과 개발 철학을 자동 추가하며, 각 스킬은 `SKILL.md` 템플릿에서 생성되므로 직접 수정하지 않는다.

별도로 [Ahacad/gstack](https://github.com/Ahacad/gstack)은 동일 스킬을 Claude Code **플러그인 시스템**으로 노출해 수동 심링크 없이 설치하게 해주는 래퍼다.

## 지원 호스트

Claude Code(기본) 외에 OpenAI Codex CLI, Cursor, OpenCode, Gemini CLI 등 다수 에이전트를 `--host` 플래그로 지원한다. 멀티 에이전트 환경에서 일관된 워크플로우를 유지하는 것이 목표.

## 기술 스택

- **언어/런타임**: TypeScript + Bun v1.0+ (Node.js 호환)
- **브라우저 자동화**: Playwright / Chromium (CDP 기반 실제 브라우저)
- **플랫폼**: macOS, Linux (Windows는 WSL 권장 — 브라우저 자동화가 macOS/Linux 최적화)
- **라이선스**: MIT

## 한계 / 주의

- **진입 장벽** — Bun, 바이너리 컴파일, Claude Code 숙련도가 필요해 입문자에게는 무겁다.
- **비용** — Conductor 등으로 병렬 세션(10-15개)을 돌리면 API 비용이 빠르게 증가한다.
- **차별성 논쟁** — "결국 텍스트 파일의 프롬프트 모음"이라는 비판과, YC CEO의 가시성이 인기를 키웠다는 지적이 공존한다. 반대로 "검증된 스태프 엔지니어의 사고방식을 설치한다"는 평가도 있다.
- **언어** — 영어 중심이라 한국어 맥락 최적화는 별도 커스터마이징이 필요하다.

## 다른 플러그인과의 비교

- [Superpowers](/ai-harness/plugins/superpowers)와 마찬가지로 "프로세스를 건너뛰지 못하게" 강제하지만, gstack은 **역할(CEO/EM/QA) 메타포**가 전면에 있고 브라우저 QA·배포 자동화까지 생명주기 전체를 덮는다.
- [Oh My ClaudeCode (OMC)](/ai-harness/plugins/omc)는 **모델 라우팅 + 멀티 에이전트 오케스트레이션**이 핵심인 반면, gstack은 **창업자 워크플로우의 표준화**가 핵심이다.

## 참고자료

- [garrytan/gstack (공식 GitHub)](https://github.com/garrytan/gstack) — MIT, 23개 opinionated 도구
- [Ahacad/gstack](https://github.com/Ahacad/gstack) — Claude Code 플러그인 래퍼
- [GStack 완전 분석 (goddaehee 블로그)](https://goddaehee.tistory.com/570) — 한국어 상세 분석
- [gstack: Garry Tan's Claude Setup (mager.co)](https://www.mager.co/blog/2026-03-28-gstack-garry-tan-claude-plugin/)

## Related

- [Superpowers](/ai-harness/plugins/superpowers)
- [Oh My ClaudeCode (OMC)](/ai-harness/plugins/omc)
- [AI Harness](/ai-harness)
