---
title: Backend Architecture
---

# Backend Architecture

프레임워크 중립적인 백엔드 설계 원칙. 계층 분리, 데이터 모델 경계, 의존 방향 등 언어·프레임워크와 무관하게 적용되는 구조적 결정들을 정리한다.

## Topics

- [소규모 팀을 위한 아키텍처 도출 방법론](/backend-architecture/architecture-methodology-small-team) — 리스크 주도 + C4 + ATAM + 진화적 아키텍처 + Conway를 하나의 루프로, 트레이드오프와 대안 비교
- [아키텍처 실패 사례와 교훈](/backend-architecture/architecture-failure-lessons) — Knight Capital·Segment·Prime Video·TSB를 방법론 관점에서 재해석
- [DDD + Hexagonal Architecture](/backend-architecture/ddd-hexagonal-architecture) — Bounded Context + Ports & Adapters 패키지 구조와 의존 방향
- [Transactional Outbox Pattern](/backend-architecture/transactional-outbox-pattern) — DB 저장과 외부 이벤트 발행의 원자성 보장
- [Application Layer Response Models](/backend-architecture/application-layer-response-models) — 서비스 계층이 엔티티 대신 전용 뷰/응답 모델을 반환하는 이유와 계층별 모델 분리 설계
- [DDD + Hexagonal Architecture](/backend-architecture/ddd-hexagonal-architecture) — 도메인 중심 설계와 포트·어댑터 구조
- [Transactional Outbox Pattern](/backend-architecture/transactional-outbox-pattern) — DB 트랜잭션과 메시지 발행의 원자성 보장
- [REST API Resource Naming](/backend-architecture/rest-resource-naming) — 리소스 URI 네이밍 규칙
- [패키지/클래스/테이블 단수·복수 네이밍](/backend-architecture/package-naming-singular-plural) — 계층별 네이밍 컨벤션
- [진행 상태 피드백 패턴](/backend-architecture/progress-feedback-patterns) — Indicator / Staged / Polling / SSE 롱러닝 작업 피드백

## Related

- [Spring](/spring) — Spring 설계 패턴
- [Messaging](/messaging) — Kafka 등 메시지 기반 통신
