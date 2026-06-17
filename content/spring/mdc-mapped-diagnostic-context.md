---
title: "MDC (Mapped Diagnostic Context) 관리 모범사례"
category: "spring"
tags: [MDC, Logback, SLF4J, 멀티스레드, 로그, Jackson, RestClient]
created: 2026-06-17
updated: 2026-06-17
---

# MDC (Mapped Diagnostic Context) 관리 모범사례

## 개요

MDC는 SLF4J/Logback에서 제공하는 스레드 로컬 기반 컨텍스트 저장소다.
로그에 `transactionNo`, `paymentCompanyCode` 같은 요청 식별자를 자동으로 포함시킬 때 활용한다.

## 주요 사용 목적 (이 프로젝트 기준)

`RestClientInterceptor`에서 외부 API 호출/응답을 DB에 로그로 기록할 때,
호출자가 MDC에 미리 `paymentCompanyCode`와 `transactionNo`를 세팅해두면
인터셉터에서 별도 파라미터 없이 꺼내 쓸 수 있다.

```java
// 호출자 (Strategy 클래스)
MDC.put("paymentCompanyCode", "moretapay");
MDC.put("transactionNo", "003801...");

// RestClientInterceptor 내부에서
String companyCode = MDC.get("paymentCompanyCode"); // "moretapay"
String transactionNo = MDC.get("transactionNo");    // "003801..."
```

## AS-IS: try-finally 패턴 (문제점)

```java
try {
    MDC.put("paymentCompanyCode", getCompanyCode());
    MDC.put("transactionNo", transactionNo);
    // ... 로직
} finally {
    MDC.remove("paymentCompanyCode");
    MDC.remove("transactionNo");
}
```

**문제점**
- `finally`에서 `remove` 누락 시 MDC가 오염됨 (스레드 풀 재사용 환경에서 치명적)
- 보일러플레이트 반복

## TO-BE: try-with-resources 패턴 (권장)

`MDC.putCloseable()`은 `AutoCloseable`을 구현한 `MDCCloseable`을 반환한다.
블록 종료(정상 or 예외) 시 자동으로 `MDC.remove()`가 호출된다.

```java
@Override
protected RefundHolder doRefund(RefundContext refundContext) {
    String transactionNo = refundContext.refundPaymentHolder().originalPayment().getTransactionNo();

    try (
        MDC.MDCCloseable mdcCompany = MDC.putCloseable("paymentCompanyCode", getCompanyCode());
        MDC.MDCCloseable mdcTxNo   = MDC.putCloseable("transactionNo", transactionNo)
    ) {
        // 이 블록 안의 모든 코드에서 MDC 값이 유효함
        // 예외 발생 여부와 무관하게 블록 종료 시 자동 cleanup
        ...
        return RefundHolder.builder()...build();
    }
}
```

**장점**
- 예외 발생 시에도 MDC 자동 정리 보장
- `remove()` 누락 불가능한 구조
- 가독성: MDC 유효 범위가 블록으로 명확하게 표현됨

## MDC 값이 null일 때 — Interceptor 처리

MDC를 세팅하지 않은 채 호출되는 경우 `MDC.get()`은 `null`을 반환한다.
`fromCode(null)` 같은 enum 변환 시 예외가 발생할 수 있으므로 안전하게 처리해야 한다.

```java
// RestClientInterceptor.java
private PaymentCompanyConstants.PaymentCompanyCode resolvePaymentCompanyCode(String code) {
    if (code == null) return PaymentCompanyConstants.PaymentCompanyCode.UNKNOWN;
    try {
        return PaymentCompanyConstants.PaymentCompanyCode.fromCode(code);
    } catch (IllegalArgumentException e) {
        return PaymentCompanyConstants.PaymentCompanyCode.UNKNOWN;
    }
}
```

**핵심:** null이거나 알 수 없는 코드일 때 다른 결제사 코드(예: UNIONPAY)로 fallback하면
로그 데이터가 오염되므로, 반드시 `UNKNOWN` 같은 명시적 값을 사용해야 한다.

## 주의사항

| 항목 | 내용 |
|------|------|
| 스레드 로컬 기반 | 비동기(`@Async`, 새 스레드) 환경에서는 MDC가 자동으로 전파되지 않음 |
| 스레드 풀 오염 | `remove()` 없이 MDC를 남기면 다음 요청이 이전 값을 물려받을 수 있음 |
| 스프링 이벤트 리스너 | `@Async` 이벤트 처리 시 부모 스레드의 MDC가 복사되지 않으므로 별도 세팅 필요 |

## 참고

- SLF4J MDC 공식 문서: https://logback.qos.ch/manual/mdc.html
- `MDC.putCloseable()` — Logback 1.1.5+, SLF4J 1.7.15+부터 지원
