---
title: 트랜잭션과 이벤트 발행 모범사례
---

# 트랜잭션과 이벤트 발행 모범사례

## 핵심 개념

Spring의 `ApplicationEventPublisher`와 `@TransactionalEventListener`를 활용한 이벤트 기반 후속 처리 패턴. 트랜잭션 커밋 이후에 안전하게 부가 작업(Redis 갱신, Kafka 전송, 알림 등)을 수행한다.

---

## 1. publishEvent()는 "등록"이지 "실행"이 아니다

```java
@Transactional
public void savePayment(Payment payment) {
    paymentRepository.save(payment);                        // [1] DB 저장
    eventPublisher.publishEvent(new PaymentCompletedEvent(payment));  // [2] 이벤트 등록만
    doSomethingElse();                                      // [3] 계속 실행됨
}
// ← 메서드 종료 → 트랜잭션 커밋 → 그 다음에 리스너 실행
```

| 시점 | 동작 |
|------|------|
| `publishEvent()` 호출 | 이벤트를 **큐에 등록**만 함. 리스너 실행하지 않음 |
| 이후 코드 | 정상적으로 계속 실행됨 |
| 트랜잭션 커밋 | 커밋 완료 후 `AFTER_COMMIT` 리스너 실행 |
| 트랜잭션 롤백 | 리스너 **실행하지 않음** (데이터가 저장 안 됐으므로 안전) |

---

## 2. @EventListener vs @TransactionalEventListener

```java
// 즉시 실행 — publishEvent() 호출 시점에 바로 실행
@EventListener
public void handle(PaymentCompletedEvent event) { ... }

// 트랜잭션 커밋 후 실행 — DB 저장이 확정된 후에만 실행
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handle(PaymentCompletedEvent event) { ... }
```

| 어노테이션 | 실행 시점 | 트랜잭션 롤백 시 | 사용 케이스 |
|-----------|----------|----------------|-----------|
| `@EventListener` | `publishEvent()` 즉시 | **실행됨** (위험!) | 트랜잭션 무관한 순수 로직 |
| `@TransactionalEventListener(AFTER_COMMIT)` | 커밋 후 | **실행 안 됨** (안전) | DB 저장 후 후속 처리 |

**원칙: DB 저장 후 후속 처리는 반드시 `@TransactionalEventListener(AFTER_COMMIT)` 사용**

---

## 3. fallbackExecution = true (트랜잭션 없는 환경 대응)

### 문제

`@TransactionalEventListener`는 **활성 트랜잭션이 있어야** 동작한다. 트랜잭션 없이 `publishEvent()`하면 이벤트가 **무시(drop)**된다.

### 해결

```java
@TransactionalEventListener(
    phase = TransactionPhase.AFTER_COMMIT,
    fallbackExecution = true  // ← Spring 5.3+
)
public void onCompleted(PaymentCompletedEvent event) { ... }
```

| 호출 환경 | 동작 |
|-----------|------|
| 트랜잭션 안에서 호출 | `AFTER_COMMIT` 시점에 실행 |
| 트랜잭션 없이 호출 | **즉시 실행** (폴백) |

---

## 4. @Async와 스레드 분리

### 동기 vs 비동기 선택 기준

| 기준 | 동기 (`@Async` 없음) | 비동기 (`@Async`) |
|------|---------------------|------------------|
| 실패 시 호출자에 영향 | 예외 전파 가능 | 별도 스레드 |
| 응답 속도 | 리스너 완료까지 대기 | 즉시 리턴 |
| 사용 케이스 | Redis 상태 갱신 (핵심) | Kafka 전송, 알림 (부가) |

---

## 5. 단일 이벤트 발행 지점 (Gateway Pattern)

### 모범사례: Gateway로 단일 발행 지점

```
LinePay  ──┐
QBPay    ──┼──▶ paymentCompletionGateway.complete(payment)  ← 딱 한 곳
EZL      ──┘         │
                     └─ publishEvent(PaymentCompletedEvent)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         Redis 갱신      Kafka 전송      Telegram 알림
```

**효과:**
- 결제사 추가 → `gateway.complete()` 한 줄 추가
- 후속 처리 추가 → 리스너 클래스 1개 추가 (기존 코드 수정 없음, OCP)

---

## 6. 리스너 자기 필터링

Gateway는 **누가 듣는지 모르고**, 각 리스너가 **자기 관심사인지 스스로 판단**한다.

```java
// 리스너가 자기 판단하는 방식 (모범사례)
@Component
public class RealTimeKafkaListener {
    private static final Set<String> TARGETS = Set.of("CRE");

    @Async
    @TransactionalEventListener(phase = AFTER_COMMIT, fallbackExecution = true)
    public void onCompleted(PaymentCompletedEvent event) {
        if (!TARGETS.contains(event.context().agencyCode())) return;
        kafkaProducer.send(...);
    }
}
```

---

## 7. 승인 / 환불 이벤트 분리

```
PaymentCompletionGateway  → PaymentCompletedEvent   // 승인
RefundCompletionGateway   → RefundCompletedEvent     // 환불
```

하나의 이벤트로 합치면 리스너마다 `if (승인) ... else (환불) ...` 분기가 생김 → 분리가 맞다.

---

## 교훈

1. **`publishEvent()`는 등록만** — 트랜잭션 커밋 후 실행됨. 이후 코드에 영향 없음
2. **`fallbackExecution = true`** — `@Async` 메서드처럼 트랜잭션 없는 환경에서 필수
3. **Gateway 패턴** — 이벤트 발행은 한 곳에서만. 리스너 추가는 무제한
4. **리스너 자기 필터링** — Gateway가 분기하지 않고, 리스너가 자기 관심사를 판단
5. **동기(핵심) / 비동기(부가)** — Redis는 동기, Kafka/알림은 `@Async`

## Related

- [Kafka DLT](/messaging/kafka-dlt)
