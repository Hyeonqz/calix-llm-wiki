---
title: Activity Log
---

# Activity Log

위키 작업(ingest, query, lint)의 시간순 기록.

## [2026-04-11] init | Wiki Initialized

Wiki structure created with Dendron hierarchy + MOC index pattern.
Schema defined in CLAUDE.md.

## [2026-04-15] scaffold | claude-code domain created

`claude-code` 도메인 골격 생성. 학습 소스로 [WikiDocs](https://wikidocs.net/book/19104)와 [공식 한국어 문서](https://code.claude.com/docs/ko/overview)를 사용 예정.

생성된 파일:
- `sources/claude-code/README.md` — 학습 소스 카탈로그
- `content/claude-code/index.md` — 도메인 MOC (계획된 토픽 목록 포함)
- `content/claude-code/_meta.js` — 사이드바 설정

업데이트된 파일:
- `content/index.md` — claude-code 도메인 등록
- `content/_meta.js` — 최상위 사이드바에 claude-code 추가

## [2026-04-15] ingest | WikiDocs 기초 4개 챕터

WikiDocs/공식문서의 기초 4개 영역(대화와 세션 / 자율권과 안전 / 컨텍스트 관리 / CLAUDE.md 잘 쓰는 방법)을 학습. 그대로 옮기지 않고 핵심만 추려 7개 토픽 페이지 + 1개 소스 요약으로 분해.

생성된 페이지:
- `claude-code/sessions.md` — 세션 시작/이어하기/체크포인트/보관기간
- `claude-code/cli-essentials.md` — `@`, `/`, 멀티라인 입력
- `claude-code/permission-modes.md` — 6개 권한 모드 (Auto는 Team/Enterprise/API 한정)
- `claude-code/plan-mode.md` — 실행 전 계획 워크플로우
- `claude-code/permission-rules.md` — `/permissions` + deny 1차 방어선 + defense-in-depth
- `claude-code/context-management.md` — `/clear`/`/compact`/`/context` + 자동압축 환경변수
- `claude-code/claude-md-best-practices.md` — 추론 불가능한 것만, 200줄 룰, `@` 임포트
- `claude-code/src-wikidocs-foundations.md` — 소스 요약 + 다음 학습 우선순위

업데이트된 파일:
- `claude-code/index.md` — Topics를 학습완료/예정으로 재구성, Sources 섹션 추가
- `claude-code/_meta.js` — 사이드바에 8개 항목 추가 (학습 흐름 순서로 정렬)

다음 학습 우선순위: hooks → sandbox → skills → subagents → MCP.

## [2026-04-15] ingest | Claude Skills 구축 완벽 가이드

Anthropic 공식 "The Complete Guide to Building Skills for Claude"를 학습. 스킬의 개념/설계 원칙/파일 구조/프론트매터/사용 사례 3대 카테고리/성공 기준/명령어 작성법/테스트 방법론/배포 모델/API/워크플로 패턴 5가지/트러블슈팅을 5개 토픽 페이지 + 1개 소스 요약으로 분해.

생성된 페이지:
- `claude-code/skills-overview.md` — 스킬 개념, 설계 원칙(점진적 공개/조합성/이식성), 파일 구조, 프론트매터, MCP 관계
- `claude-code/skills-development.md` — 사용 사례 정의, 3대 카테고리(문서생성/워크플로자동화/MCP강화), 성공 기준, 명령어 작성법
- `claude-code/skills-testing.md` — 트리거/기능/성능 테스트, skill-creator 사용법, 피드백 기반 반복
- `claude-code/skills-deployment.md` — 배포 모델(개인/조직), 오픈 표준, API, 포지셔닝
- `claude-code/skills-patterns.md` — 5가지 워크플로 패턴, 트러블슈팅, 빠른 체크리스트
- `claude-code/src-skills-building-guide.md` — 소스 요약, 핵심 인사이트 7개

업데이트된 파일:
- `claude-code/index.md` — "스킬" 섹션 추가, skills를 학습 예정에서 제거, Sources에 소스 추가
- `claude-code/_meta.js` — 사이드바에 6개 항목 추가

다음 학습 우선순위: hooks → sandbox → subagents → MCP.

## [2026-04-15] refactor | Skills 페이지를 하위 카테고리로 재구성

기존 `claude-code/skills-*.md` 6개 플랫 파일을 `claude-code/skills-building-guide/` 하위 섹션으로 재구성. 하나의 소스(Anthropic 공식 가이드 PDF)에서 나온 내용을 응집된 서브 카테고리로 묶음.

변경 사항:
- `content/claude-code/skills-building-guide/` 디렉터리 생성 (index.md + _meta.js)
- 5개 토픽 페이지 이동: skills-overview, skills-development, skills-testing, skills-deployment, skills-patterns
- `src-skills-building-guide.md` 제거 → 소스 요약을 하위 섹션 index.md에 통합
- 모든 내부 링크를 새 경로로 수정
- 부모 `claude-code/index.md`, `_meta.js` 업데이트

## [2026-06-09] note | concepts: 패키지/클래스/테이블 단수·복수 네이밍 규칙

패키지·클래스는 단수, DB 테이블은 복수라는 레이어별 네이밍 컨벤션과 그 이유를 정리.
대화 중 "event vs events" 질문에서 도출. rest-resource-naming과 교차 링크.

- content/backend-architecture/package-naming-singular-plural.md (신규)
- content/concepts/index.md (링크 추가 + 누락됐던 rest-resource-naming 링크 보강)
- content/concepts/_meta.js (사이드바 항목 추가)

## [2026-06-09] note | database 도메인 생성 + MySQL DATETIME/TIMESTAMP 노트

새 `database` 도메인 골격 생성 후 첫 페이지로 MySQL 시간 타입 비교 노트 작성.
DATETIME vs TIMESTAMP(타임존 변환 유무), fsp `(3)`밀리초/`(6)`마이크로초, 저장 크기,
반올림·2038·정밀도 유실 gotcha, UTC 저장/JPA 매핑 중심 모범사례 정리. spring·concepts와 교차 링크.

- content/database/index.md (신규 도메인 MOC)
- content/database/_meta.js (신규)
- content/database/mysql/mysql-datetime-timestamp.md (신규)
- sources/database/ (신규 디렉터리)
- content/index.md (Domains에 database 등록)
- content/_meta.js (사이드바에 database 추가)

## [2026-06-11] note | backend-architecture 도메인 생성 + 애플리케이션 계층 응답 모델 설계 노트

새 `backend-architecture` 도메인 골격 생성 후 첫 페이지로 "Application Layer Response Models" 작성.
서비스 계층이 엔티티 대신 전용 뷰/응답 모델을 반환하는 이유(영속성 누수 차단, 계산된 뷰,
계층별 변경 이유 분리=SRP), 중첩 vs 별도 파일 트레이드오프, degraded 응답을 위한 nullable 타입 선택,
안티패턴을 프레임워크 중립적으로 정리. kakaopay 과제 Phase2 EventService.EventView 논의에서 일반화.
concepts·spring 도메인과 교차 링크.

- content/backend-architecture/index.md (신규 도메인 MOC)
- content/backend-architecture/_meta.js (신규)
- content/backend-architecture/application-layer-response-models.md (신규)
- sources/backend-architecture/ (신규 디렉터리)
- content/index.md (Domains에 backend-architecture 등록)
- content/_meta.js (사이드바에 backend-architecture 추가)

## [2026-06-13] note | java-concurrency 도메인 생성 + CountDownLatch 학습 노트

새 `java-concurrency` 도메인 골격 생성(향후 java.util.concurrent 전반 학습 예정) 후 첫 페이지로
CountDownLatch 작성. 핵심 API, 두 사용 패턴(끝날 때까지 대기 / 일제 출발 3-latch),
고정 풀+await 데드락 함정과 가상 스레드(Java 21) 해법, 쿠폰 발급 동시성 테스트 실전 맥락 정리.
kakaopay 과제 동시성 테스트 논의에서 도출. backend-architecture·spring과 교차 링크.

- content/java-concurrency/index.md (신규 도메인 MOC + 학습 로드맵)
- content/java-concurrency/_meta.js (신규)
- content/java-concurrency/countdownlatch.md (신규)
- sources/java-concurrency/ (신규 디렉터리)
- content/index.md (Domains에 java-concurrency 등록)
- content/_meta.js (사이드바 추가)

## [2026-06-28] ingest | gstack (Garry Tan의 Claude Code 스킬 팩) 페이지 추가

YC CEO Garry Tan의 오픈소스 Claude Code 설정 `gstack` 분석 후 ai-harness/plugins에 페이지 추가.
9개 전문가 역할(CEO/EM/디자이너/스태프엔지니어/QA/릴리스/보안/작가) 기반 가상 엔지니어링 팀,
"Planning is not review" 단계 분리 철학, 생명주기별 23개+ 슬래시 커맨드 카탈로그, 설치/지원 호스트,
한계 정리. Superpowers·OMC와 비교 링크. 마스터 index에 누락돼 있던 ai-harness 도메인도 등록(2-hop 보정).
goddaehee 블로그(https://goddaehee.tistory.com/570) + 공식 GitHub README 기반.

- content/ai-harness/plugins/gstack.md (신규)
- content/ai-harness/plugins/_meta.js (gstack 추가)
- content/ai-harness/index.md (Plugins에 gstack 링크)
- content/index.md (Domains에 ai-harness 등록)

## [2026-07-04] note | 트랜잭션 격리수준 (@Transactional 기준) 페이지 추가

카카오페이손보 면접 대비 CS 퀴즈 중 격리수준 4단계를 답하지 못해(기본값 RR만 인지, propagation만 학습한 상태) 정리 요청.
이상현상 3종(dirty/non-repeatable/phantom) ↔ 4단계 매핑 표, MySQL InnoDB RR 특이점(MVCC 스냅샷·갭 락·current read),
핵심 함정 "격리수준은 lost update를 못 막는다"(해법 3종: FOR UPDATE/조건부 원자 UPDATE/낙관 락),
Spring isolation 속성 동작(커넥션 단위 SET, 실무에서 거의 안 바꾸는 이유), isolation vs propagation 구분 표, 면접 요약 3문장.

- content/spring/transaction-isolation-levels.md (신규)
- content/spring/index.md (Topics 링크 추가)
- content/spring/_meta.js (사이드바 추가)

## [2026-07-08] ingest | OS 면접 기본기 (프로세스·스레드·동기화) 페이지 추가

2026-07-07 카카오페이손보 실무진 면접에서 받은 OS 질문 4개(① 프로세스 vs 스레드 ② 멀티스레드 동작 방식
③ 공유 자원 선점 ④ 뮤텍스락 vs 세마포어)를 하나의 흐름으로 정리. 프로세스=격리/스레드=공유 비교표,
동시성 vs 병렬성·컨텍스트 스위칭, 경쟁 조건·임계 영역·상호 배제(lost update Java 예시),
뮤텍스(1개+소유권) vs 세마포어(N개+무소유권 카운터) 비교표(화장실/주차장 비유)·Java Semaphore 예시,
구두 30초 요약 스크립트. 신규 operating-system 도메인 생성. GPT 만화 상단 첨부 예정.
출처: TIL/2026-07-07.md (면접 회고).

- content/operating-system/process-thread-synchronization.md (신규)
- content/operating-system/index.md (신규 도메인 MOC)
- content/operating-system/_meta.js (신규)
- content/index.md (Domains에 operating-system 등록)
- content/_meta.js (사이드바에 operating-system 추가)
- sources/operating-system/ (디렉터리 생성)

## [2026-07-08] ingest | 소규모 팀 아키텍처 방법론 + 실패 사례 2개 페이지 추가

세션 대화(QRGW-Senior-Architecture)에서 논의한 "top-down으로 병목 찾아 해결하는 아키텍처 도출법"을
2개 페이지로 정리. ① 방법론 페이지: 리스크 주도 설계(Fairbanks) 엔진 + C4 하강 경로 + ATAM 경량판
(품질속성 시나리오 6요소·민감점/절충점·효용트리) + 진화적 아키텍처(fitness function, 대사=FF) + Conway
역콘웨이 전략 + 전체 순환 루프 + 방법론 트레이드오프/대안 비교표(C4 vs 4+1 vs arc42, 리스크주도 vs
BDUF vs YAGNI, ATAM vs LAAM, FF vs 리뷰 vs 정적게이트). ② 실패 사례 페이지: Knight Capital($440M/45분,
배포검증 FF 부재), Segment(MSA→모놀리스 회귀, Conway 위반), Prime Video(분산→모놀리스 90% 절감,
절충점 오판), TSB(빅뱅 이관 참사, 리스크주도 일정 실패) + 반복 안티패턴표. 웹 리서치로 사실 근거 확보.
기존 _meta.js/index.md 동기화 누락(ddd-hexagonal, outbox 2개)도 함께 보정.

- content/backend-architecture/architecture-methodology-small-team.md (신규)
- content/backend-architecture/architecture-failure-lessons.md (신규)
- content/backend-architecture/_meta.js (신규 2개 + 누락 2개 동기화)
- content/backend-architecture/index.md (Topics 전체 재정렬)

## [2026-07-08] ingest | 인덱스 기본기 (B-Tree·카디널리티) 페이지 추가

2026-07-07 카카오페이손보 실무진 면접에서 받은 DB 질문 3개(① 인덱스를 왜 걸어야 하는지
② 인덱스 동작 방식 ③ 회원 테이블(name, age) 중 어디에 인덱스를 걸지)를 하나의 흐름으로 정리.
풀스캔 O(N) vs 인덱스 O(log N) 비교, B-Tree 동작 방식(정렬된 자료구조·내부/리프 노드·리프
연결 리스트로 범위 검색), 인덱스의 대가(쓰기 오버헤드·저장공간), 카디널리티 개념과
"name vs age 중 카디널리티 높은 name에 인덱스" 답, 복합 인덱스 최좌측 접두사(leftmost prefix)
짧게, CREATE INDEX 예시, 구두 30초 요약. 기존 database 도메인에 추가.
출처: TIL/2026-07-07.md (면접 회고).

- content/database/mysql/index-fundamentals.md (신규)
- content/database/index.md (Topics 링크 추가)
- content/database/_meta.js (사이드바 추가)

## [2026-07-08] ingest | TCP vs UDP (네트워크 기본기) 페이지 추가

2026-07-07 카카오페이손보 실무진 면접에서 받은 네트워크 질문 3개(① TCP vs UDP 차이 ② UDP 사용처
③ 유튜브는 TCP/UDP 중 무엇을 쓰나)를 정리. TCP(연결/재전송/순서/혼잡제어) vs UDP(비연결/저오버헤드) 비교표,
UDP 사용처(실시간 스트리밍·게임·VoIP·DNS, "지연이 유실보다 치명적일 때") 원리, 유튜브 함정 질문 해설
(일반 VOD는 TCP, 최신 유튜브는 UDP 기반 QUIC/HTTP3, 초저지연 실시간은 UDP), 구두 30초 요약.
신규 network 도메인 생성. 출처: TIL/2026-07-07.md (면접 회고).

- content/network/tcp-vs-udp.md (신규)
- content/network/index.md (신규 도메인 MOC)
- content/network/_meta.js (신규)
- content/index.md (Domains에 network 등록)
- content/_meta.js (사이드바에 network 추가)
- sources/network/ (디렉터리 생성)

## [2026-07-09] refactor | 사이드바 정리 + Database 분리 + Concepts 해체 + Messaging 신설

TIL 폴더를 연/월(TIL/YYYY/MM/)로 재구성하고 reader를 깊이 무관 재귀 탐색으로 변경(분기/연은 계산 뷰).
사이드바에서 blog·til 항목 숨김(_meta.js display:hidden). Database를 MySQL/Redis 두 하위 탭으로 분리
(redis 도메인을 database/redis로 이동, mysql 페이지는 database/mysql로 이동). Concepts 도메인 해체 →
jpa-n-plus-one·payment-completion-gateway·transaction-event-publishing은 spring, rest-resource-naming·
package-naming-singular-plural·progress-feedback-patterns는 backend-architecture, kafka-dlt는 신규 messaging
도메인으로 이동. 모든 cross-link(/concepts, /redis, /database/*) 일괄 교정. 관련 _meta.js·index.md·master index 갱신.

- TIL/YYYY/MM/*.md (45개 이동), app/til/tilFiles.js (신규 재귀 리더), app/til/page.jsx·[date]/page.jsx (리더 교체)
- content/_meta.js (concepts 제거, messaging 추가, blog·til 숨김)
- content/database/{index.md,_meta.js} + database/mysql/{index.md,_meta.js} + database/redis/ (이동)
- content/messaging/{index.md,_meta.js,kafka-dlt.md} (신규)
- content/spring/ (+3 페이지, index·_meta 갱신), content/backend-architecture/ (+3 페이지, index·_meta 갱신)
- content/index.md (Database 설명 갱신, Messaging 추가), CLAUDE.md (TIL 경로 규칙)

## [2026-07-09] refactor | Cross-Domain 도메인 제거

내용 없이 플레이스홀더만 있던 cross-domain 도메인을 삭제. 폴더·_meta 엔트리 제거, 8개 도메인 index의
Related 링크 정리(빈 spring Related는 Database·Messaging 링크로 대체), master index의 Cross-Domain 섹션 삭제.

- content/cross-domain/ (삭제)
- content/_meta.js, content/index.md, 각 도메인 index.md Related 정리

## [2026-07-09] refactor | Claude Code를 AI Harness 하위로 통합

독립 최상위 도메인이던 claude-code를 ai-harness 하위 서브도메인으로 이동. 사이드바에서 AI Harness > Claude Code로 중첩.

- content/claude-code/ → content/ai-harness/claude-code/ (git mv, 하위 skills-building-guide 포함)
- content/_meta.js: 최상위 claude-code 엔트리 제거
- content/ai-harness/_meta.js: claude-code 엔트리 추가 / index.md: 코딩 에이전트 섹션 추가
- 내부 링크 /claude-code/ → /ai-harness/claude-code/ 일괄 치환, master index 정리

## [2026-07-10] refactor | java-concurrency 도메인을 Java로 확장 + List 자료구조 노트 2편

동시성 전용이던 `java-concurrency` 도메인을 범용 `java` 도메인으로 확장(concurrency는 하위 로드맵으로 유지).
`ArrayList` vs `LinkedList` 개관 노트와, 캐시 지역성·포인터 체이싱·가상 메모리·GC 관점의 OS 레벨 deep dive를
별도 페이지로 분리해 작성(한 페이지 200줄 제한 준수). OS 도메인과 상호 링크.

- content/java-concurrency/ → content/java/ (git mv)
- content/java/list-data-structures.md (신규 — ArrayList/LinkedList 개관·동작 방식·선택 기준)
- content/java/list-memory-and-cache.md (신규 — 캐시·페이징·GC deep dive)
- content/java/index.md, _meta.js (신규 페이지 반영, 도메인 설명을 Java로 확장)
- content/java/countdownlatch.md (내부 링크 /java-concurrency → /java)
- content/index.md, content/_meta.js (도메인 키/타이틀 java-concurrency → java)
- content/operating-system/index.md, process-thread-synchronization.md (링크 경로 갱신 + List deep dive로 역링크 추가)

## [2026-07-10] refactor | List 메모리·캐시 deep dive를 별도 페이지 → 부록으로 병합

`list-memory-and-cache.md`를 독립 페이지로 분리했으나, 사용자 판단으로 별도 글이 불필요하다고 정정 —
`list-data-structures.md` 하단에 "부록: 메모리·캐시 관점 (OS 레벨)" 섹션으로 병합하고 원 페이지 삭제.

- content/java/list-memory-and-cache.md (삭제, 내용은 list-data-structures.md 부록으로 이동)
- content/java/list-data-structures.md (부록 섹션 추가)
- content/java/index.md, _meta.js (분리 페이지 항목 제거)
- content/operating-system/index.md, process-thread-synchronization.md (역링크를 list-data-structures.md로 정정)

## [2026-07-10] chore | sources/ 폴더를 content/ 도메인 구조와 재동기화

content/ 도메인 리네임·재구성(java-concurrency→java, claude-code→ai-harness 하위 이동)이 있었지만
sources/는 예전 이름 그대로 남아있던 것을 발견해 정리. spring·thinking 도메인은 sources/ 폴더 자체가
없던 것도 생성(향후 소스 추가용). CLAUDE.md의 남아있던 java-concurrency 표기도 java로 수정.

- sources/java-concurrency/ → sources/java/ (빈 폴더, 단순 rename)
- sources/claude-code/README.md → sources/ai-harness/claude-code/README.md (소스 목록 내용은 그대로)
- sources/spring/, sources/thinking/ (신규 빈 폴더)
- CLAUDE.md (도메인 목록·예시의 java-concurrency 표기 2곳 수정)
