---
title: Application Layer Response Models
---

# Application Layer Response Models

서비스(application) 계층이 조회 결과를 반환할 때, **도메인 엔티티를 그대로 내보내지 않고 전용 뷰/응답 모델로 변환해서 반환**하는 설계. 계층마다 변경 이유가 다른 별도의 데이터 모델을 두는 것이 핵심이다.

```
Entity (영속 모델)  →  View (application 출력 계약)  →  Response DTO (presentation/JSON)
```

각 화살표는 한 계층의 책임 경계를 넘는 지점이고, 그때마다 모델이 한 번씩 바뀐다.

## 왜 엔티티를 직접 반환하지 않는가

### 1. 영속성 누수 차단 (가장 큰 이유)

ORM 엔티티(JPA `@Entity`, TypeORM Entity 등)를 상위 계층으로 그대로 흘리면:

- **Lazy 로딩 폭발** — 트랜잭션 경계 밖에서 연관 필드 접근 시 `LazyInitializationException`(JPA) 또는 의도치 않은 추가 쿼리.
- **프록시·더티체킹 누수** — ORM이 끼워 넣은 프록시 객체와 변경 감지 메커니즘이 컨트롤러/직렬화 계층까지 새어 나간다.
- **직렬화 사고** — 양방향 연관관계 순환 참조, 내부 컬럼(`password`, 내부 `status`)이 응답에 그대로 노출.

전용 뷰 모델은 **서비스가 트랜잭션 안에서 이미 가공한 값**만 담으므로 엔티티를 계층 경계 안에 가둔다.

### 2. 조회 결과는 "엔티티 미러"가 아니라 "계산된 뷰"

응답에 필요한 값이 단일 엔티티에 다 들어있는 경우는 드물다:

- DB에 없는 파생 값(예: 외부 캐시/Redis 카운터로 실시간 계산한 잔여 수량)
- 저장 상태가 아니라 요청 시점에 계산되는 런타임 상태(예: 시간/조건 기반 파생 상태)
- 여러 출처(엔티티 + 외부 시스템)를 조합한 결과

이렇게 **여러 출처를 조합한 산출물**은 엔티티가 표현할 수 없다. 별도 타입으로 분리하는 것이 자연스럽고, CQRS의 read model 발상과 닿아 있다.

### 3. 계층별 변경 이유 분리 (SRP)

```
Entity        → 변경 이유: DB 스키마 / 영속 규칙
View          → 변경 이유: 유스케이스 출력 계약
Response DTO  → 변경 이유: API 스펙 / 직렬화 규칙
```

세 모델의 필드가 거의 같아 보여도 **변경되는 이유가 다르므로** 별개 타입으로 두는 것이 SRP에 맞다. API 응답 포맷이 바뀐다고 도메인 엔티티를 건드려선 안 되고, 그 반대도 마찬가지다. 이 "의도된 중복"은 결합을 끊기 위한 비용이다.

## 뷰 모델을 어디에 둘 것인가 — 중첩 vs 별도 파일

작고 단일 소비자인 뷰는 **생산하는 서비스 안에 중첩(nested) 타입**으로 두는 것이 합리적 기본값이다.

```java
// 단일 소비자: 서비스 안에 중첩 record
@Service
public class EventService {
  public EventView getEvent(Long id) { /* ... */ }

  public record EventView(Long id, String name, State state, Long remainingCount) {}
}
```

**중첩의 장점**
- **소유권 표현** — "이건 이 유스케이스의 출력 계약"이라는 관계가 코드로 드러난다.
- **파일 수 절감 / 탐색성** — 작은 DTO를 별 파일로 흩뿌리지 않는다.
- **불변성 + 값 의미** — record/data class면 `equals`/접근자 자동 제공 → 테스트가 깔끔(`view.remainingCount()`).

**별도 파일로 승격(promote)할 때**
- 2개 이상의 서비스가 같은 뷰를 필요로 할 때 → `…/application/dto/EventView`로 분리.
- 뷰가 충분히 커지거나 자체 검증/매핑 로직을 가질 때.

> 기본값: **단일 소비자 → 중첩, 공유되면 분리.** 처음부터 모든 DTO를 별도 파일로 만들 필요는 없다.

## Degraded 응답을 담을 수 있는 타입 선택

뷰 모델은 **부분 실패(degraded)** 상태도 표현할 수 있어야 한다. 외부 의존성(캐시 등)이 죽어도 나머지 메타데이터는 정상 제공하려면, 실패할 수 있는 필드를 **nullable(박싱) 타입**으로 둔다.

```java
// remainingCount는 외부 카운터 의존 → 장애 시 null 가능해야 함
public record EventView(Long id, String name, State state,
                        int totalCount, Long remainingCount) {}  // long 아닌 Long
```

원시 타입(`long`)으로 두면 "값 없음"을 표현할 수 없어, 의존성 장애 시 예외를 던지거나 0 같은 거짓 값을 내보내게 된다. 이는 [의존성 장애 시 fail-fast vs degraded](/spring/transactional-event-listener) 같은 거동 결정과도 직결된다.

## 안티패턴

- **엔티티를 컨트롤러까지 직접 반환** — 영속성 누수 + 표현/저장 결합.
- **엔티티에 `@JsonIgnore` 덕지덕지** — 직렬화 관심사가 도메인 모델을 오염시킴. 뷰/응답 DTO로 분리하면 사라질 문제.
- **모든 계층이 단일 DTO 공유** — 한 모델이 영속·유스케이스·API 세 변경 이유를 동시에 떠안아 변경이 전파됨.
- **뷰 모델을 가변 클래스로** — 조회 결과는 불변이어야 안전. record/value object 사용.

## Related

- [Spring: 단위 테스트 vs 통합 테스트](/spring/unit-test-vs-integration-test) — 뷰 모델 덕에 서비스 단위 테스트가 단순해지는 이유
- [Spring: @TransactionalEventListener + @Transactional](/spring/transactional-event-listener) — 트랜잭션 경계와 계층 분리
- [Spring: Facade + Delegation 패턴](/spring/facade-delegation-pattern) — 서비스 계층 책임 분리
- [패키지/클래스/테이블 네이밍 규칙](/backend-architecture/package-naming-singular-plural) — 계층별 모델 네이밍
- [REST API Resource Naming](/backend-architecture/rest-resource-naming) — presentation 계층 응답 설계
- [JPA N+1 문제](/spring/jpa-n-plus-one) — 엔티티 직접 노출 시 발생하는 lazy 로딩 문제
