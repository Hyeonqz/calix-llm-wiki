---
title: Spring @TransactionalEventListener 모범사례
---

# Spring @TransactionalEventListener 모범사례

> Spring Boot 3.x / JPA / 결제 시스템 기준

---

## 핵심 원칙

```
@TransactionalEventListener(AFTER_COMMIT) 은
활성 트랜잭션이 COMMIT된 직후에만 실행된다.

트랜잭션이 없으면 → 리스너가 영원히 실행되지 않는다.
트랜잭션이 있으면 → COMMIT 후 리스너가 실행된다.
```

---

## 왜 문제가 생기는가

### 안티패턴 — 트랜잭션 없는 곳에서 publishEvent()

```java
// processPayment()에 @Transactional 없음
@Async("linePayExecutor")
public CompletableFuture<ResponseEntity<Void>> processPayment(String orderId) {

    // 외부 API 호출들...
    Payment saved = persistenceService.savePayment(payment, outputs);

    // 트랜잭션이 없는 상태에서 발행
    eventPublisher.publishEvent(new PaymentCompletedEvent(saved));
    // → @TransactionalEventListener 리스너 실행 안 됨
}
```

```
실행 흐름:
  processPayment() 스레드 → 트랜잭션 없음
  savePayment() → 내부 @Transactional 시작 → COMMIT → 종료
  publishEvent() → 트랜잭션 없음 → AFTER_COMMIT 트리거 없음
  리스너: 무반응
```

### 왜 @Async 메서드는 트랜잭션을 받지 못하는가

```java
// 호출자 스레드 (트랜잭션 있어도)
linePayDispatch.processPayment(orderId); // @Async → 별도 스레드로 분기

// linePayExecutor 스레드 (새 스레드)
// Spring TX Context = null  ← 스레드 로컬이라 전파 불가
```

Spring 트랜잭션은 ThreadLocal 기반이다. `@Async`로 새 스레드가 생성되는 순간 트랜잭션 컨텍스트가 끊긴다.

---

## 올바른 구조 — PaymentCompletionGateway 패턴

### 설계 원칙

```
savePayment()       → 저장만 담당 (SRP)
PaymentCompletionGateway → 이벤트 발행 담당 (SRP)
```

Gateway가 `TransactionSynchronizationManager`로 트랜잭션 유무를 직접 감지하여 처리한다. 호출자는 트랜잭션 유무를 신경 쓰지 않아도 된다.

### 두 가지 접근법 비교

| 접근법 | 방식 | 장점 | 단점 |
|--------|------|------|------|
| `fallbackExecution = true` | 리스너에 옵션 추가 | 간단 | 리스너마다 설정 필요, TX 없으면 즉시 실행 |
| `TransactionSynchronizationManager` | Gateway가 TX 감지 | 발행 시점에서 제어, 호출자 투명 | 구현이 약간 복잡 |

**권장: `TransactionSynchronizationManager` 방식** — Gateway가 책임지므로 리스너는 TX 유무를 신경 쓸 필요 없음.

---

## 구현 코드

### PaymentCompletionGateway

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentCompletionGateway {

    private final ApplicationEventPublisher eventPublisher;

    public void complete(Payment payment) {
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        publish(payment);
                    }
                }
            );
            log.debug("[Gateway] AFTER_COMMIT 이벤트 등록 - txNo: {}",
                payment.getTransactionNo());
        } else {
            publish(payment);
            log.debug("[Gateway] 즉시 이벤트 발행 - txNo: {}",
                payment.getTransactionNo());
        }
    }

    public void publishAfterCommit(Payment payment) {
        if (!TransactionSynchronizationManager.isActualTransactionActive()) {
            throw new IllegalStateException(
                "publishAfterCommit은 활성 트랜잭션 안에서 호출해야 합니다. txNo: "
                + payment.getTransactionNo()
            );
        }
        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    publish(payment);
                }
            }
        );
    }

    public void publishImmediately(Payment payment) {
        publish(payment);
    }

    private void publish(Payment payment) {
        eventPublisher.publishEvent(new PaymentStateUpdatedEvent(payment));
        eventPublisher.publishEvent(new PaymentCompletedEvent(payment));
    }
}
```

### savePayment — 저장 후 Gateway 호출

```java
@Transactional
public Payment savePayment(Payment payment, IlkApproveOutputs response) {

    if (SUCCESS.equals(response.getStatus())) {
        payment.updateLatestStage(PaymentConstants.PaymentStage.Q1APR);
        payment.updateState(PaymentConstants.PaymentState.COMPLETED);
    } else {
        payment.updateLatestStage(PaymentConstants.PaymentStage.Q1FAL);
        payment.updateState(PaymentConstants.PaymentState.FAILED);
    }
    Payment saved = paymentRepository.save(payment);

    paymentResultRepository.save(buildPaymentResult(payment, response));

    paymentCompletionGateway.complete(saved);

    return saved;
}
```

---

## 전체 트랜잭션 흐름

```
linePayExecutor 스레드
  │
  ├─ cardInfoRequest()              // 외부 API — TX 없음, DB 커넥션 미점유
  ├─ cardApproveRequest()           // 외부 API — TX 없음, DB 커넥션 미점유
  │
  ├─ savePayment()
  │     @Transactional 시작          // DB 커넥션 획득 (여기서만)
  │     ├─ paymentRepository.save()
  │     ├─ paymentResultRepository.save()
  │     └─ Gateway.complete()
  │           └─ TransactionSynchronizationManager 감지
  │                 → 트랜잭션 활성 → AFTER_COMMIT 큐에 등록
  │     COMMIT                        // DB 커넥션 반환
  │           └─ AFTER_COMMIT 트리거
  │                 ├─ PaymentStateUpdateListener   (eventListenerExecutor)
  │                 └─ RealTimeTransactionListener  (eventListenerExecutor)
  │
  └─ sendApprovalNotification()      // TX 없음
```

---

## 교훈 — 자주 하는 실수 체크리스트

- `@Async` 메서드에 `@Transactional`을 기대하고 `publishEvent()` 호출
  → `@Async`는 새 스레드. 트랜잭션 컨텍스트 전파 안 됨

- 외부 API 호출을 `@Transactional` 범위 안에 포함
  → DB 커넥션 점유 시간 증가 → 커넥션 풀 고갈 위험

- `@TransactionalEventListener` 리스너에 `@Async` 없이 무거운 작업 처리
  → 이벤트 발행 스레드 블로킹

- 리스너에서 예외 처리 없이 예외 전파
  → catch로 삼키지 않으면 결제 성공 건이 실패 처리될 수 있음

- Payment 엔티티를 이벤트에 직접 담고 `@Async` 리스너에서 Lazy 로딩 접근
  → AFTER_COMMIT 이후 JPA 세션 없음 → `LazyInitializationException`

## Related

- [트랜잭션과 이벤트 발행 모범사례](/concepts/transaction-event-publishing)
- [Kafka DLT](/concepts/kafka-dlt)
