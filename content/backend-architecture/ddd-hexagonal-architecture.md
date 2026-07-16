---
title: "DDD + Hexagonal Architecture 모범사례"
category: "backend-architecture"
tags: [DDD, Hexagonal, Ports-and-Adapters, Bounded-Context, Clean-Architecture, Java, Spring]
created: 2026-06-15
updated: 2026-06-15
---

# DDD + Hexagonal Architecture 모범사례

> 📖 서사적 딥다이브: [DDD라는 렌즈(7장)](/books/software-architecture/step-07-ddd)와 [세 형제 — 헥사고날·어니언·클린(8장)](/books/software-architecture/step-08-hexagonal-onion-clean). 이 노트는 실전 패키지 구조, 책 章은 "왜 이 구조가 이전 방식의 고통에서 태어났는가"를 다룬다.

## 개요

DDD(Domain-Driven Design)의 Bounded Context 기반 패키지 구조와 Hexagonal Architecture(Ports & Adapters)를 결합한 아키텍처 패턴이다.
두 패턴은 서로 다른 문제를 해결하지만 상호보완적으로 작동한다.

| 패턴 | 해결하는 문제 | 핵심 개념 |
|------|-------------|----------|
| DDD (Bounded Context) | 도메인 복잡성, 팀 간 경계 | BC 경계로 도메인 응집도 확보 |
| Hexagonal Architecture | 기술 의존성, 테스트 어려움 | Port 인터페이스로 의존성 역전 |
| EDA (선택적) | BC 간 결합도 | 이벤트로 BC 간 통신 (장기 목표) |

---

## 핵심 원칙

### 의존 방향 (절대 규칙)

```
Infrastructure (밖) → Application (중간) → Domain (안)
```

- **Domain**: 아무것도 모른다. 순수 Java, 프레임워크 의존 없음
- **Application**: Domain을 안다. Infrastructure는 Port 인터페이스로만 안다
- **Infrastructure**: Domain과 Application을 알고, Port를 구현한다

이를 위반하면 헥사고날 아키텍처의 근본 목적(기술 교체 가능성, 독립적 테스트)을 잃는다.

---

## 패키지 구조

### 최상위: Bounded Context

```
src/main/java/kr/co/example/
├── payment/          ← BC: 결제
├── refund/           ← BC: 취소/환불
├── inquiry/          ← BC: 조회
└── shared/           ← Shared Kernel (BC 간 공유)
```

BC를 최상위로 두는 이유: 팀/마이크로서비스 분리 시 BC 단위로 이동 가능하기 때문이다.

### BC 내부: 헥사고날 레이어

```
{bc-name}/
├── domain/
│   ├── model/           ← Entity, Value Object
│   ├── event/           ← Domain Event
│   └── port/
│       ├── in/          ← Inbound Port (Use Case 인터페이스)
│       └── out/         ← Outbound Port (외부 의존 인터페이스)
├── application/
│   ├── service/         ← Use Case 구현체
│   └── command/         ← 입력 구조체 (Command / Query)
└── infrastructure/
    └── adapter/
        ├── in/          ← Inbound Adapter (이벤트 리스너, 스케줄러)
        └── out/
            ├── persistence/      ← DB Adapter (QueryDSL, JPA)
            └── external/
                └── {partner}/
                    ├── {Partner}Adapter.java    ← Port 구현
                    └── dto/
                        ├── {Partner}Request.java
                        └── {Partner}Response.java
```

---

## 각 레이어 모범사례

### 1. Domain Layer — 순수 도메인

**Inbound Port (Use Case 인터페이스)**

```java
// domain/port/in/ProcessRefundUseCase.java
public interface ProcessRefundUseCase {
    RefundResult processRefund(ProcessRefundCommand command);
}
```

**Outbound Port (외부 의존 인터페이스)**

```java
// domain/port/out/CancelApiPort.java
public interface CancelApiPort {
    CancelResult cancel(CancelCommand command);
}

// domain/port/out/RefundQueryPort.java
public interface RefundQueryPort {
    Optional<OriginalPayment> findOriginalPayment(String transactionNo);
}
```

**규칙**
- `@Service`, `@Component`, `@Repository` 어노테이션 없음
- `RestClient`, `JpaRepository`, `EntityManager` 참조 없음
- 도메인 언어(Ubiquitous Language)로만 표현

---

### 2. Application Layer — 오케스트레이션

```java
// application/service/RefundApplicationService.java
@Service
@RequiredArgsConstructor
@Transactional
public class RefundApplicationService implements ProcessRefundUseCase {

    private final RefundQueryPort refundQueryPort;   // ← Port로만 주입
    private final CancelApiPort cancelApiPort;       // ← Port로만 주입

    @Override
    public RefundResult processRefund(ProcessRefundCommand command) {
        // 1. 원거래 조회
        OriginalPayment original = refundQueryPort
            .findOriginalPayment(command.transactionNo())
            .orElseThrow(() -> new OriginalPaymentNotFoundException(command.transactionNo()));

        // 2. 도메인 로직: cancelType 결정
        CancelType cancelType = original.determineCancelType(LocalDate.now());

        // 3. 외부 취소 API 호출 (Port 위임)
        CancelResult result = cancelApiPort.cancel(
            CancelCommand.of(command, original, cancelType)
        );

        return RefundResult.from(result);
    }
}
```

**규칙**
- Port 인터페이스만 주입 — 구현체(Adapter) 직접 참조 금지
- 트랜잭션 경계는 Application Service에서 관리
- 비즈니스 흐름 오케스트레이션만 담당 (세부 로직은 Domain으로)
- Adapter/Repository 클래스명은 절대 등장하지 않음

---

### 3. Infrastructure Layer — 기술 구현

**Outbound Adapter (Port 구현체)**

```java
// infrastructure/adapter/out/external/app/MoretaPayCancelAdapter.java
@Component
@RequiredArgsConstructor
public class MoretaPayCancelAdapter implements CancelApiPort {

    private final MoretaPayRefundClient client;

    @Override
    public CancelResult cancel(CancelCommand command) {
        MoretaPayCancelRequest request = toRequest(command);  // 도메인 → 인프라 변환
        MoretaPayCancelResponse response = client.cancel(request);
        return toResult(response);                            // 인프라 → 도메인 변환
    }

    private MoretaPayCancelRequest toRequest(CancelCommand command) { /* ... */ }
    private CancelResult toResult(MoretaPayCancelResponse response) { /* ... */ }
}
```

**규칙**
- `implements XxxPort` 반드시 명시
- 도메인 타입 ↔ 인프라 타입 변환 책임
- 비즈니스 로직 없음 — 변환(mapping) 로직만

**Persistence Adapter**

```java
// infrastructure/adapter/out/persistence/RefundQueryAdapter.java
@Component
@RequiredArgsConstructor
public class RefundQueryAdapter implements RefundQueryPort {

    private final PaymentResultRepository repository;
    private final IntegratedTransactionQueryDsl queryDsl;

    @Override
    public Optional<OriginalPayment> findOriginalPayment(String transactionNo) {
        return queryDsl.findByTransactionNo(transactionNo)
            .map(OriginalPayment::from);   // Entity → Domain 변환
    }
}
```

---

### 4. Shared Kernel — BC 간 공유

```
shared/
├── config/         ← Spring 설정 (@Configuration)
├── exception/      ← 공통 예외
└── util/           ← 유틸리티
```

**주의**: Shared Kernel이 비대해지면 BC 간 결합도가 높아진다. 최소한으로 유지한다.

---

## 파일 명명 규칙

| 레이어 | 역할 | 명명 규칙 | 예시 |
|--------|------|----------|------|
| `domain/model/` | Value Object | `{도메인명}.java` | `CancelType.java` |
| `domain/port/in/` | Inbound Port | `{동작}UseCase.java` | `ProcessRefundUseCase.java` |
| `domain/port/out/` | Outbound Port | `{대상}{동작}Port.java` | `CancelApiPort.java` |
| `application/service/` | UseCase 구현 | `{BC명}ApplicationService.java` | `RefundApplicationService.java` |
| `application/command/` | 입력 구조체 | `{동작}Command.java` | `ProcessRefundCommand.java` |
| `infrastructure/adapter/out/persistence/` | DB Adapter | `{대상}QueryAdapter.java` | `RefundQueryAdapter.java` |
| `infrastructure/adapter/out/external/` | 외부 Adapter | `{Partner}{목적}Adapter.java` | `MoretaPayCancelAdapter.java` |

---

## 장점

### 1. 독립적 테스트 가능

Domain과 Application은 Port 인터페이스만 의존하므로, Mock으로 대체하여 데이터베이스/외부 API 없이도 테스트할 수 있다.

```java
// Port를 Mock으로 대체 → 외부 의존 없이 비즈니스 로직만 테스트
@Test
void processRefund_당일이면_CANCEL() {
    given(refundQueryPort.findOriginalPayment("TXN001"))
        .willReturn(Optional.of(originalPaymentOf("2026-06-15")));

    RefundResult result = service.processRefund(command("TXN001"));

    assertThat(result.cancelType()).isEqualTo(CancelType.CANCEL);
    verify(cancelApiPort).cancel(argThat(c -> c.cancelType() == CancelType.CANCEL));
}
```

### 2. 기술 교체가 쉽다

JPA → MyBatis, REST → gRPC, MoretaPay → 다른 PG사로 교체 시 Adapter 구현체만 교체한다. Domain과 Application 코드는 변경 없다.

### 3. MSA 분리 준비

BC가 패키지 경계로 명확히 나뉘어 있으므로, 추후 독립 서비스로 분리할 때 해당 패키지를 그대로 새 프로젝트로 이동할 수 있다.

### 4. 도메인 언어 보호

Domain 레이어에 프레임워크 어노테이션이 없으므로, 비즈니스 로직이 기술 세부사항에 오염되지 않는다. 코드가 비즈니스 요구사항을 그대로 표현한다.

### 5. 팀 분리 가능

BC 단위로 팀이 독립적으로 작업할 수 있다. payment BC 팀과 refund BC 팀이 서로의 코드를 몰라도 개발 가능하다.

---

## 단점 / 트레이드오프

### 1. 초기 복잡도 증가

간단한 CRUD에도 Port 인터페이스 + Adapter + Command 구조가 필요하다. 작은 기능에도 파일 수가 많아진다.

```
// 간단한 조회 기능에도:
domain/port/out/UserQueryPort.java
application/service/UserApplicationService.java
application/command/FindUserQuery.java
infrastructure/adapter/out/persistence/UserQueryAdapter.java
```

**대응**: 단순 CRUD 기능은 Application Service에서 Port 직접 위임 (오케스트레이션 없음)으로 단순화할 수 있다.

### 2. 변환 코드(Mapping) 중복

인프라 DTO ↔ 도메인 객체 변환 코드가 Adapter마다 필요하다. 외부 응답이 복잡할수록 변환 코드가 비대해진다.

**대응**: MapStruct 또는 정적 팩토리 메서드(`from()`, `of()`)로 변환 로직을 캡슐화한다.

### 3. 학습 곡선

Port/Adapter 개념, BC 경계 판단, Inbound vs Outbound 구분이 익숙하지 않으면 초기 진입 장벽이 높다.

**대응**: ADR(Architecture Decision Record)로 결정 근거를 문서화하고, 팀 내 패턴 예시 코드를 레퍼런스로 유지한다.

### 4. 과도한 추상화 위험

Port 인터페이스를 구현하는 Adapter가 하나뿐이라면 추상화 비용만 발생하고 이점이 없다.

**대응**: 단일 구현체가 확실한 경우, Port 없이 직접 주입도 현실적 타협이다 (단, 테스트 용이성은 포기).

### 5. BC 경계 설정이 어렵다

도메인 전문 지식 없이 BC를 잘못 나누면 나중에 BC 간 데이터 공유 문제가 발생한다. BC 경계는 기술 판단이 아닌 비즈니스 판단이다.

---

## 안티패턴 (하지 말아야 할 것)

| 안티패턴 | 문제 | 해결 |
|---------|------|------|
| Application Service에서 Adapter 직접 주입 | 의존성 역전 파괴 | Port 인터페이스로만 주입 |
| Domain에 `@Service` 어노테이션 | 프레임워크 의존성 유입 | 순수 Java로 유지 |
| BC 간 패키지 직접 import | BC 경계 위반 | Shared Kernel 또는 이벤트 |
| Adapter에 비즈니스 로직 배치 | 테스트 불가, 책임 혼재 | 로직은 Application/Domain으로 |
| 인프라 DTO를 Domain에서 사용 | 기술 의존성 유입 | 변환 후 도메인 타입 전달 |
| Shared Kernel 비대화 | BC 간 결합도 증가 | Shared에는 최소한만 (설정, 예외, 유틸) |

---

## 레거시 코드와의 공존 전략

레거시 코드를 한 번에 이전하지 않고 점진적으로 적용하는 전략:

1. **신규 기능은 새 패키지 구조로 작성** (`refund/`, `payment/`)
2. **레거시 코드는 수정 시 이동** — 기능 추가/버그 수정 시 해당 파일을 새 구조로 이동
3. **Anti-Corruption Layer**: 레거시 서비스를 Port 구현체처럼 감싸서 사용 (Domain이 레거시를 직접 알지 않도록)

```
// 레거시 서비스를 Port Adapter로 감싸기
@Component
public class LegacyRefundAdapter implements CancelApiPort {
    private final LegacyRefundService legacy;  // 기존 서비스

    @Override
    public CancelResult cancel(CancelCommand command) {
        return legacy.processRefund(command.transactionNo(), ...);
    }
}
```

---

## 실제 적용 예시 (이 프로젝트)

qrgw-payment-be-springboot의 `module-gateway`에서 적용 중인 구조:

```
gateway/
├── refund/                          ← 취소/환불 BC
│   ├── domain/port/out/
│   │   ├── CancelApiPort.java       ← MoretaPay 취소 API 추상화
│   │   └── RefundQueryPort.java     ← 원거래 조회 추상화
│   ├── application/service/
│   │   └── RefundApplicationService.java
│   └── infrastructure/adapter/out/
│       ├── persistence/
│       │   └── RefundQueryAdapter.java
│       └── external/app/
│           ├── MoretaPayCancelAdapter.java
│           └── dto/
│               ├── MoretaPayCancelRequest.java
│               └── MoretaPayCancelResponse.java
└── shared/
    └── config/
```

---

## 참고

- ADR-006: `docs/05_ADR/ADR-006_DDD_Hexagonal_아키텍처_패키지_구조.md`
- `.claude/guide/architecture.md` — 섹션 3-1
- 큐뱅 간편결제사 연동 가이드 v1.7 — 5.3 Cancellation Request API
- Vaughn Vernon — *Implementing Domain-Driven Design*
- Tom Hombergs — *Get Your Hands Dirty on Clean Architecture*
