---
title: "Transactional Outbox Pattern"
category: "backend-architecture"
tags: [outbox, event-driven, distributed-systems, spring, kafka, reliability]
created: 2026-06-29
updated: 2026-06-29
---

# Transactional Outbox Pattern

> 📖 서사적 딥다이브: [소프트웨어 아키텍처 Deep Dive · 11장 — 데이터가 진짜 전장이다](/books/software-architecture/step-11-data). 이 노트는 빠른 레퍼런스, 책 章은 "왜 이중 쓰기가 코드 품질이 아니라 물리학인가"를 실행되는 코드와 함께 다룬다.

## 개요

서비스에서 DB 저장과 외부 이벤트(메시지 브로커, 외부 API) 발행이 동시에 일어날 때, 한쪽만 성공하는 **데이터 불일치** 문제를 해결하기 위한 패턴이다.

핵심 아이디어: **"외부에 전달해야 할 작업 의도를 DB 트랜잭션 안에 함께 기록"** 하면, 커밋 원자성 덕분에 의도가 유실되지 않는다. 이후 폴러(Poller) 또는 CDC가 이 기록을 읽어 실제 외부 호출을 수행한다.

---

## 해결하는 문제

```
// 전형적인 위험 구조
@Transactional
public void process(Command cmd) {
    repository.save(entity);          // ① DB 저장
    eventPublisher.publish(event);    // ② 이벤트 발행 (별도 스레드/브로커)
}
// ①은 성공했지만 ②가 실패하면? → 데이터 불일치
```

`@Async + @TransactionalEventListener(AFTER_COMMIT)` 조합도 마찬가지 — **서버 크래시 시 JVM 스레드가 사라져 이벤트 유실**.

---

## 동작 구조

```
[비즈니스 트랜잭션]
  ├── domain_table INSERT/UPDATE
  └── outbox_events INSERT  ← 같은 트랜잭션 (원자적 보장)

       커밋 후

[Poller / CDC]
  └── outbox_events PENDING 조회
      ├── 외부 API 호출 or 메시지 발행
      ├── 성공 → PROCESSED 표시
      └── 실패 → PENDING 유지 (retry_count++)
```

---

## 아웃박스 테이블 설계

### 필수 컬럼

```sql
CREATE TABLE payment_outbox (
    id             BIGINT       PRIMARY KEY AUTO_INCREMENT,
    aggregate_id   VARCHAR(100) NOT NULL,          -- transactionNo 등
    event_type     VARCHAR(200) NOT NULL,          -- 'ApprovalRequested'
    payload        JSON         NOT NULL,
    status         VARCHAR(20)  DEFAULT 'PENDING', -- PENDING / PROCESSING / PROCESSED / FAILED
    retry_count    INT          DEFAULT 0,
    created_at     TIMESTAMP    NOT NULL,
    processed_at   TIMESTAMP
);
```

### PROCESSING 상태가 중요한 이유

```
PENDING → PROCESSING (처리 시작 표시, 중복 처리 방지)
              ↓
      성공 → PROCESSED
      실패 → PENDING (retry_count++)
      스케줄러 크래시 → PROCESSING으로 stuck ← 안전장치 필요
              ↓
      N분 후 PROCESSING → PENDING 롤백 안전장치
```

### retry_count 상한 설정

```
retry_count > 5 → FAILED (알람 발송, 수동 처리)
FAILED 레코드 → Dead Letter 테이블 이관 or 알람
```

---

## 단일 통합 vs 도메인별 분리

| 구분 | 단일 통합 outbox | 도메인별 분리 outbox |
|------|-----------------|---------------------|
| 테이블 | `outbox_events` 하나 | `payment_outbox`, `merchant_outbox` 등 |
| 라우팅 | `aggregate_type` 컬럼으로 분기 | 폴러가 테이블별로 분리 |
| 적합 규모 | 중대규모, CDC + Kafka 연계 | 소규모, DB Polling |
| 장점 | 이벤트 추적 한 곳 집중, CDC 연계 용이 | 도메인 격리, 인덱스 단순, 독립 보존 정책 |
| 단점 | 테이블 비대화, 인덱스 설계 복잡 | 테이블/폴러 수 증가 |

**권장**: 소규모는 도메인별로 시작 → 규모 성장 시 단일 통합 + CDC 전환.

---

## 릴레이 방식

### 1. DB Polling (소규모)

```java
// module-scheduler (싱글 인스턴스에서 실행 → 중복 처리 없음)
@Scheduled(fixedDelay = 5000)
public void relay() {
    List<PaymentOutbox> pending = outboxRepository.findByStatus(PENDING, limit(100));
    for (PaymentOutbox outbox : pending) {
        outboxRepository.updateStatus(outbox.getId(), PROCESSING);
        try {
            externalApiClient.send(outbox.getPayload());
            outboxRepository.updateStatus(outbox.getId(), PROCESSED);
        } catch (Exception e) {
            outboxRepository.incrementRetry(outbox.getId());
        }
    }
}
```

- 싱글 스케줄러: 분산 락 불필요
- 멀티 인스턴스: `SELECT ... FOR UPDATE SKIP LOCKED` 또는 분산 락 필요

### 2. CDC + Kafka (중대규모)

```
DB outbox_events 변경 → Debezium CDC 감지
→ Kafka 토픽 (`payment.events`, `merchant.events`) 자동 발행
→ Consumer가 처리
```

- Kafka 자체 재시도/DLQ 활용 가능
- 폴러 없이 실시간에 가까운 처리

---

## 하이브리드 패턴 (Best-effort + 안전망)

즉시 처리(실시간성)와 신뢰성을 함께 얻는 방식:

```
트랜잭션 내
  ├── outbox INSERT (PENDING)        ← 안전망 기록
  └── Spring 이벤트 발행 (예약)      ← 즉시 처리 시도

커밋 후
  @Async 스레드
    성공 → outbox PROCESSED 표시
    실패 → outbox PENDING 유지

module-scheduler
    PENDING만 재처리 (유실/실패 건만)
```

---

## D-MPM 결제에서의 실전 분석

### 적용 포인트

D-MPM에서 Payment INSERT는 `module-gateway`(POS)가 담당. `module-api`의 `processDpm()`은 읽기만 하고 이벤트를 발행한다.

**아웃박스 적용 위치**: `processDpm()` 성공 시 → 같은 트랜잭션 내 `payment_outbox` INSERT.

```
"App이 QR 유효함을 확인했다" = "moretapay 승인 요청을 반드시 한 번 이상 실행해야 한다"
이 의도를 DB에 기록하는 것이 아웃박스의 역할
```

### TTL과 실효성

```
QR TTL = 66초
서버 재시작 시간 >> 66초 (현실적으로)

→ outbox 재처리 시 이미 만료
→ 사용자 결제 성공 불가
→ outbox의 가치 = 데이터 정합성 + 감사 추적 (성공률 향상 아님)
```

### 결론

| 목적 | outbox로 해결? |
|------|---------------|
| 서버 크래시 후 결제 성공률 향상 | ❌ TTL 짧아 현실적 효과 없음 |
| 좀비 PROGRESSING 거래 정리 | ✅ 재처리→만료에러→FAILED 처리 |
| Transient 오류 재시도 | △ @Async retry로도 가능 |
| 감사 추적 | ✅ outbox 테이블 기록 |

---

## @Async retry와의 차이

| 구분 | @Async + Spring Retry | Outbox Pattern |
|------|----------------------|----------------|
| 저장 위치 | JVM 메모리 (스레드) | DB (영속) |
| 서버 크래시 시 | ❌ 스레드 소멸 → 유실 | ✅ DB에 기록 남음 |
| Transient 오류 | ✅ 자동 재시도 | ✅ 폴러가 재처리 |
| 구현 복잡도 | 낮음 | 높음 |
| 적합한 상황 | 일시적 실패 방어 | 서버 장애 포함 완전한 신뢰성 |

---

## 참고

- Martin Fowler - Outbox Pattern
- Debezium CDC 문서
- Chris Richardson - Microservices Patterns (Chapter 3)
