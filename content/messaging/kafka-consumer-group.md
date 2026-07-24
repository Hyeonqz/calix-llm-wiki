---
title: Kafka 컨슈머 그룹
---

# Kafka 컨슈머 그룹

## 핵심 개념

`group.id`는 Kafka에서 **메시지가 분배될지 복제될지를 결정하는 유일한 축**이다. 토픽을 나누는 것도, 컨슈머 수를 조절하는 것도 아니다.

```
같은 group.id  → 파티션 분배 (경쟁 소비, competing consumers)
다른 group.id  → 각자 전량 수신 (팬아웃, broadcast)
```

하나의 메시지는 하나의 파티션에만 존재하고, 그 파티션은 **그룹 내 정확히 한 컨슈머**에게만 할당된다. 이것이 "같은 그룹이면 중복 처리가 없다"의 근거다.

## 동작 흐름

### 같은 group.id — 파티션 분배

```
topic (3 partitions)
  P0 ─┐
  P1 ─┼→ group "order-processor" ├─ app1 (P0, P1)
  P2 ─┘                          └─ app2 (P2)

메시지 1건 = 컨슈머 1대만 처리
```

### 다른 group.id — 팬아웃

```
topic ─┬→ group "order-processor"  → app1 : 전량 수신
       └→ group "audit-logger"     → app2 : 전량 수신

메시지 1건 = 모든 그룹이 각각 1번씩 처리
```

## 다중 인스턴스 배포에서 무엇을 골라야 하나

같은 애플리케이션을 N대로 스케일아웃할 때, 의도에 따라 정반대의 설정이 필요하다.

| 목적 | group.id | 결과 |
|------|----------|------|
| 처리량 분산 (작업 큐) | 인스턴스 간 **동일** | 파티션 분배, 중복 없음 |
| 각 인스턴스가 모두 알아야 하는 이벤트 (캐시 무효화 등) | 인스턴스별 **고유** | 전 인스턴스가 각자 수신 |
| Request-Reply의 응답 수신 | 인스턴스별 **고유** | [Kafka Request-Reply](/messaging/kafka-request-reply) 참고 |

대부분의 업무 리스너는 첫 번째다. 두 번째·세 번째를 첫 번째처럼 설정하면 조용히 오동작한다.

## 함정

### 1. `${spring.application.name}` 기반 group.id는 인스턴스 단위가 아니다

```yaml
group-id: "order-processor-group-${spring.application.name:unknown}"
```

`spring.application.name`은 보통 빌드 산출물에 고정된 상수다. 이 값으로 만든 group.id는 **애플리케이션 단위**이지 인스턴스 단위가 아니다. 3대를 띄워도 전부 같은 그룹이다.

- 작업 큐 용도라면 → 의도대로 동작 (분배)
- 인스턴스별 고유성이 필요했다면 → **결함**. 인스턴스별로 다른 값을 주입하거나 UUID를 붙여야 한다

```java
// 인스턴스별 고유가 필요할 때
String instanceId = StringUtils.hasText(configured)
    ? configured.trim()
    : UUID.randomUUID().toString().replace("-", "").substring(0, 12);
String groupId = baseGroupId + "-" + applicationName + "-" + instanceId;
```

설정으로 주입하는 쪽(`${HOSTNAME}` 등)이 UUID보다 낫다. 재기동해도 group이 유지되어 빈 그룹 메타데이터가 누적되지 않는다.

### 2. 컨슈머 수가 파티션 수를 넘으면 남는 컨슈머는 논다

파티션 3개에 컨슈머 5개면 2개는 할당을 못 받고 유휴 상태로 대기한다. 스케일아웃의 상한은 **파티션 수**다.

### 3. 같은 그룹이어도 중복은 완전히 사라지지 않는다

Kafka는 기본이 at-least-once다. 리밸런스·오프셋 커밋 실패 시 **같은 메시지가 재배달**될 수 있다. "같은 그룹 = 동시 중복 없음"이지 "재처리 없음"이 아니다.

동시 중복과 순차 재처리는 방어 방법이 다르다:

| 상황 | 방어 |
|------|------|
| 순차 재처리 (리밸런스) | 상태 검사(이미 처리된 건이면 skip) 로 충분 |
| 동시 중복 (그룹 분리 오설정) | 상태 검사만으로 부족. DB 유니크 제약 / 비관적 락 필요 |

특히 `select → 없으면 insert` 구조는 순차 재처리에는 안전하지만 동시 실행에는 그대로 뚫린다. 유니크 인덱스 + upsert로 바꿔야 한다.

## 교훈

### 브로드캐스트 걱정 전에 실제 group.id를 확인하라

"여러 서버에 배포했으니 중복 처리되는 것 아닌가"는 흔한 오해다. 확인 순서는 다음과 같다.

1. 설정 파일의 group.id 표현식을 읽는다
2. 그 표현식에 쓰인 프로퍼티가 **인스턴스마다 다른 값인지** 확인한다
3. 실행 옵션(`-D`, 환경변수)으로 덮어쓰고 있지 않은지 확인한다

3번이 함정이다. yml에 상수처럼 보여도 배포 스크립트에서 인스턴스별로 주입하고 있으면 결론이 뒤집힌다.

### 컨슈머 그룹은 운영 중에 이름을 바꾸면 안 된다

group.id를 바꾸면 새 그룹이 되어 오프셋이 초기화된다. `auto.offset.reset` 값에 따라:

- `latest` → 배포 순간부터의 메시지만 소비, **그 사이 메시지 유실**
- `earliest` → 토픽 처음부터 재소비, **대량 중복 처리**

group.id 변경은 사실상 마이그레이션 작업이다.

## 모범사례

### 1. group.id의 의미를 이름에 드러내라

`{업무}-{역할}-group-{범위}` 형태로 쓰면 "이게 분배용인지 팬아웃용인지"가 이름에서 읽힌다.

### 2. 무의미한 prefix를 붙이지 마라

`${spring.profiles.active}` 같은 prefix는 **브로커가 환경별로 분리되어 있으면 격리에 전혀 기여하지 않는다.** 이름만 길어지고, 프로파일 오설정 시 조용히 새 그룹이 생기는 위험만 남는다.

### 3. 인스턴스별 고유 group.id는 설정 주입을 우선하라

```yaml
consumer:
  instance-id: ${HOSTNAME:}      # 컨테이너/파드마다 유일, 재기동해도 유지
```

코드 폴백(UUID)은 값이 없을 때의 안전망으로만 둔다. 폴백이 상수가 되지 않도록 주의한다 — 이 실수는 **단일 인스턴스 테스트에서 절대 재현되지 않는다.**

### 4. 주석과 코드가 어긋나지 않게 하라

"미지정이면 기동마다 생성"이라는 주석 아래에 상수 폴백이 있는 코드는 리뷰를 통과한다. 사람은 주석을 읽고 코드를 안 읽기 때문이다. 격리 로직은 주석이 아니라 **테스트나 기동 로그로 검증**해야 한다.

### 5. 리스너마다 ContainerFactory를 나눌지는 소비 정책으로 판단하라

group.id와 무관한 이야기지만 자주 같이 헷갈린다. ContainerFactory Bean은 **컨슈머도 커넥션도 스레드도 만들지 않는 청사진**이다. 공유해도 컨슈머 수가 줄지 않고, 나눠도 늘지 않는다.

나눠야 하는 기준은 소비 정책이 다를 때다:

- 에러/재시도/DLT 정책
- ack 모드 (수동 vs 자동)
- 메시지 컨버터 (JSON vs String)
- batch vs record 리스닝
- `auto.offset.reset`

## Related

- [Kafka Request-Reply](/messaging/kafka-request-reply) — 공유 reply 토픽에서 group.id가 격리 축이 되는 이유
- [Kafka DLT (Dead Letter Topic)](/messaging/kafka-dlt) — 실패 메시지 보관소 설계
- [트랜잭션과 이벤트 발행 모범사례](/spring/transaction-event-publishing)
