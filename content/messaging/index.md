---
title: Messaging
---

# Messaging

Kafka 등 메시지 기반 비동기 통신·이벤트 스트리밍 학습 노트. 메시지 신뢰성, 실패 처리, 재처리 패턴 등.

## Topics

- [Kafka 컨슈머 그룹](/messaging/kafka-consumer-group) — 분배 vs 팬아웃, 다중 인스턴스 배포에서의 group.id 설계
- [Kafka Request-Reply](/messaging/kafka-request-reply) — 헤더 기반 왕복 구조, 공유 reply 토픽과 응답 도난
- [Kafka DLT (Dead Letter Topic)](/messaging/kafka-dlt) — 실패 메시지 보관소 설계와 운영 모범사례

## Related

- [Spring](/spring) — Spring Kafka, 트랜잭션과 이벤트 발행
- [Backend Architecture](/backend-architecture) — Transactional Outbox 등 메시지 안정성 패턴
