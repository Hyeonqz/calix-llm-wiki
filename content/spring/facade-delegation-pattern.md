---
title: "Facade + Delegation 패턴 조합"
category: "spring"
tags: [design-pattern, facade, delegation, cross-cutting-concern, spring]
created: 2026-06-01
updated: 2026-06-01
---

# Facade + Delegation 패턴 조합

## 개요

Facade 패턴과 Delegation 패턴을 함께 사용하면 여러 횡단 관심사(cross-cutting concern)를
**단일 진입점에서 조율**하면서 각 관심사의 구현을 **독립적인 메서드로 위임**할 수 있다.

| 패턴 | 역할 |
|------|------|
| **Facade** | 복잡한 하위 로직을 단일 인터페이스로 감추고 호출 순서를 조율 |
| **Delegation** | 실제 처리를 전문화된 개별 메서드(또는 객체)에 위임 |

두 패턴의 조합은 "무엇을 언제 실행할지"(Facade)와 "어떻게 실행할지"(Delegation)를 분리한다.

---

## 언제 사용하는가

- 하나의 비즈니스 플로우 완료 후 **여러 독립적인 후처리**가 필요할 때
- 각 후처리가 서로 다른 외부 시스템(Kafka, Push, 실시간 API 등)과 연동될 때
- 후처리 목록이 향후 추가/제거될 가능성이 높을 때
- 비즈니스 로직과 횡단 관심사를 명확히 분리하고 싶을 때

---

## 구조

```
processCallback()         ← 비즈니스 로직
    │
    └─► handlePostPaymentEvents()  ← Facade (진입점)
             ├─► publishKtpRealTimeEvent()        ← Delegation
             ├─► publishMposAppPush()             ← Delegation
             └─► publishIntegrationTransactionEvent()  ← Delegation
```

---

## 실제 적용 예시 (S-MPM 콜백 처리)

### AS-IS — 비즈니스 로직과 이벤트 발행이 혼재

```java
@Transactional
public PaymentCallbackHolder processCallback(...) {
    // 비즈니스 로직
    Payment payment = createAndSavePayment(...);
    PaymentCallbackHolder holder = getSuccessPaymentCompanyHolder(payment, input);

    // 횡단 관심사 — 비즈니스 로직 사이에 직접 삽입
    applicationEventPublisher.publishEvent(new KtpTransactionEvent(this, payment.getTransactionNo()));
    applicationEventPublisher.publishEvent(StaticMpmCallbackReceivedEvent.of(...));
    // (통합거래 이벤트 누락)

    return holder;
}
```

**문제점:**
- 이벤트 발행 코드가 비즈니스 로직과 뒤섞여 가독성 저하
- 새 이벤트 추가 시 비즈니스 로직 메서드를 직접 수정해야 함
- 실패 경로(catch)에서 동일한 이벤트를 다시 신경 써야 함
- `processPaymentWithErrorHandling()`이 `PaymentCallbackHolder`만 반환해 caller에서 `Payment`에 접근 불가

---

### TO-BE — Facade + Delegation 분리

#### 1. 내부 레코드로 반환값 확장

```java
// 기존: PaymentCallbackHolder 만 반환
// 변경: Payment + PaymentCallbackHolder 묶음 반환
private record ProcessResult(Payment payment, PaymentCallbackHolder holder) {}
```

`ProcessResult`를 도입하면 caller(`processCallback`)에서 이벤트 발행에 필요한 `Payment` 객체에
접근할 수 있다.

#### 2. 비즈니스 로직과 횡단 관심사 분리

```java
@Transactional
public PaymentCallbackHolder processCallback(...) {
    // [1~3] 검증, 파싱 ...

    // [4] 비즈니스 로직
    StaticMpmProcessType processType = StaticMpmProcessType.fromProcessCode(
        callbackInput.brandInformation().processCode()
    );
    ProcessResult processResult = processPaymentWithErrorHandling(context, callbackInput, intermediateInput);
    paymentCallbackHolder = processResult.holder();

    // [5] 횡단 관심사 — Facade 단일 호출
    handlePostPaymentEvents(processResult.payment(), callbackInput, context, processType);

    return paymentCallbackHolder;
}
```

#### 3. Facade 메서드 — 호출 순서 조율

```java
private void handlePostPaymentEvents(Payment payment, IlkCallbackInput callbackInput,
    SMpmCallbackContext context, StaticMpmProcessType processType) {
    publishKtpRealTimeEvent(payment);                              // [1] KTP
    publishMposAppPush(callbackInput, context, payment);          // [2] MPOS Push
    publishIntegrationTransactionEvent(payment, processType);     // [3] 통합거래
}
```

#### 4. 위임 메서드 — 각 관심사의 구현

```java
private void publishKtpRealTimeEvent(Payment payment) {
    applicationEventPublisher.publishEvent(
        new KtpTransactionEvent(this, payment.getTransactionNo())
    );
}

private void publishMposAppPush(IlkCallbackInput callbackInput,
    SMpmCallbackContext context, Payment payment) {
    applicationEventPublisher.publishEvent(StaticMpmCallbackReceivedEvent.of(
        callbackInput,
        context.merchantInformationHolder().getMerchant(),
        payment.getTransactionNo()
    ));
}

private void publishIntegrationTransactionEvent(Payment payment, StaticMpmProcessType processType) {
    // 실패 거래는 발행하지 않음 (guard clause)
    if (payment == null || !PaymentState.COMPLETED.equals(payment.getState())) return;
    applicationEventPublisher.publishEvent(
        new IntegrationTransactionPublishEvent(payment, toTransactionType(processType))
    );
}

private IntegrationTransactionEvent.TransactionType toTransactionType(StaticMpmProcessType processType) {
    return switch (processType) {
        case APPROVE          -> IntegrationTransactionEvent.TransactionType.PAYMENT;
        case CANCEL, REFUND   -> IntegrationTransactionEvent.TransactionType.CANCEL;
    };
}
```

---

## 핵심 원칙

### 1. processType은 try 블록 외부에서 계산

```java
// 잘못된 예: try 안에서 계산 → catch에서 접근 불가
try {
    StaticMpmProcessType processType = ...;  // ❌
    ...
} catch (Exception e) {
    // processType 사용 불가
}

// 올바른 예: try 전에 계산
StaticMpmProcessType processType = StaticMpmProcessType.fromProcessCode(...);  // ✅
try {
    ...
} catch (Exception e) {
    // processType 접근 가능
}
```

### 2. Facade는 "무엇을 언제" 만 결정한다

Facade 메서드는 **순서와 조합**만 결정하고, 실제 구현은 위임 메서드에 맡긴다.
Facade 메서드 안에 직접 구현 코드를 쓰기 시작하면 패턴의 의미가 퇴색된다.

```java
// 잘못된 예: Facade 안에 구현 코드 혼재
private void handlePostPaymentEvents(Payment payment, ...) {
    applicationEventPublisher.publishEvent(new KtpTransactionEvent(...));  // ❌ 직접 구현
    applicationEventPublisher.publishEvent(StaticMpmCallbackReceivedEvent.of(...));  // ❌
}

// 올바른 예: 위임만
private void handlePostPaymentEvents(Payment payment, ...) {
    publishKtpRealTimeEvent(payment);      // ✅ 위임
    publishMposAppPush(...);               // ✅ 위임
    publishIntegrationTransactionEvent(payment, processType);  // ✅ 위임
}
```

### 3. 위임 메서드는 단일 책임

각 위임 메서드는 하나의 외부 시스템 또는 하나의 이벤트 타입만 담당한다.
guard clause(`null` 체크, 상태 체크)는 위임 메서드 내부에서 처리한다.

```java
// guard clause를 위임 메서드 내부에
private void publishIntegrationTransactionEvent(Payment payment, StaticMpmProcessType processType) {
    if (payment == null || !PaymentState.COMPLETED.equals(payment.getState())) return;  // ✅ 내부 guard
    ...
}
```

### 4. 메서드 이름은 구현이 아닌 의도를 표현

| 나쁜 이름 (구현 노출) | 좋은 이름 (의도 표현) |
|----------------------|----------------------|
| `notifyTerminalPaymentResult()` | `handlePostPaymentEvents()` |
| `sendKafkaMessage()` | `publishIntegrationTransactionEvent()` |
| `callMposApi()` | `publishMposAppPush()` |

책임이 확장될 때 구현 노출 이름은 리네임이 필요하지만,
의도 표현 이름은 확장에도 여전히 유효하다.

---

## 장점 요약

| 장점 | 설명 |
|------|------|
| **가독성** | `processCallback()`이 비즈니스 로직만 포함, 횡단 관심사는 `handlePostPaymentEvents()` 한 줄 |
| **단일 책임** | Facade = 조율, 각 위임 = 구현. 각 메서드가 하나의 역할만 수행 |
| **확장성** | 새 이벤트 추가 시 위임 메서드 하나 추가 + Facade에 호출 한 줄 추가만으로 완료 |
| **테스트 용이성** | 각 위임 메서드를 독립적으로 단위 테스트 가능 |
| **횡단 관심사 분리** | 파트너별 로직과 전사 공통 로직을 명확히 구분 |

---

## 주의사항

- Facade 메서드가 너무 많은 위임을 조율하면 God Method가 될 수 있다. 위임이 5개 이상이면 별도 클래스(`PostPaymentEventPublisher`)로 분리 검토
- 위임 메서드 내 예외 처리: 하나의 위임 실패가 다른 위임을 막지 않도록 필요 시 try-catch 적용
- `@Transactional` 컨텍스트: `@TransactionalEventListener(AFTER_COMMIT)`와 조합 시 트랜잭션 외부 메서드(`@Async`)는 `fallbackExecution = true` 필요

---

## 참고

- 오늘 작업: `SMpmCallbackServiceImpl`, `LinePayDispatch`, `RefundService`에 동일 패턴 적용
- 관련 문서: `transaction-event-publishing.md`
