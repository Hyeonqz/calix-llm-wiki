---
title: Kafka Request-Reply
---

# Kafka Request-Reply

## 핵심 개념

Kafka는 단방향 pub/sub이다. 동기 요청-응답은 **두 개의 단방향 토픽 + 두 개의 헤더**로 흉내 낸다. 브로커가 왕복을 알아서 연결해주는 기능은 없다.

| 헤더 | 역할 |
|------|------|
| `KafkaHeaders.REPLY_TOPIC` | 요청자가 "응답은 이 토픽으로 달라"고 알려주는 값 |
| `KafkaHeaders.CORRELATION_ID` | 요청 1건을 식별하는 키. 응답자가 **그대로 되돌려줘야** 한다 |

Spring Kafka에서는 `ReplyingKafkaTemplate`이 이 두 헤더를 자동으로 붙이고, 내부 맵(`correlationId → Future`)으로 대기 중인 요청을 관리한다.

## 동작 흐름

```
[요청자]                                        [응답자]
ReplyingKafkaTemplate
  = 프로듀서 + reply 리스너 컨테이너

sendAndReceive(record)
  ├ correlationId 생성
  ├ futures.put(correlationId, future)
  ├ REPLY_TOPIC   헤더 주입 ─┐
  └ CORRELATION_ID 헤더 주입 ┘
                             │
                     request topic
                             │
                             └──────────────→ @KafkaListener
                                                 │ 비즈니스 처리
                                                 │ 헤더에서 REPLY_TOPIC / CORRELATION_ID 추출
                     reply topic ←───────────────┘ CORRELATION_ID 에코해서 전송
                             │
  reply 컨테이너 ←───────────┘
  ├ futures.remove(correlationId)
  ├ 있으면  → future 완료 (요청자 스레드 깨어남)
  └ 없으면  → logLateArrival() 후 폐기
```

요청자가 보내는 시점에 **자기 reply 컨테이너가 구독 중인 토픽명**을 헤더에 실어 보내는 것이 전부다. 응답자는 그 헤더를 읽을 뿐, 어느 토픽으로 보낼지 스스로 정하지 않는다.

## 응답자 구현

```java
public <T, R> void sendReply(ConsumerRecord<String, T> record, R response) {
    byte[] correlationId = record.headers().lastHeader(KafkaHeaders.CORRELATION_ID).value();
    byte[] replyTopicBytes = record.headers().lastHeader(KafkaHeaders.REPLY_TOPIC).value();
    String replyTopic = new String(replyTopicBytes, StandardCharsets.UTF_8);

    ProducerRecord<String, Object> replyRecord = new ProducerRecord<>(replyTopic, response);
    replyRecord.headers().add(KafkaHeaders.CORRELATION_ID, correlationId);  // 에코 필수

    kafkaTemplate.send(replyRecord);
}
```

`CORRELATION_ID`를 에코하지 않으면 요청자는 자기 요청과 매칭하지 못하고, 응답이 정상 도착했음에도 **타임아웃**이 난다.

## 공유 reply 토픽과 격리

요청자 인스턴스가 여러 대일 때, reply 토픽을 인스턴스별로 나눌 필요는 없다. 하나를 공유하고 **group.id로 격리**한다.

### group.id가 인스턴스별로 다를 때 — 정상

```
reply topic ─┬→ group "...-inst1" → 서버1 : 전량 수신, correlationId로 내 것만 채택
             └→ group "...-inst2" → 서버2 : 전량 수신, 남의 것은 폐기
```

각자 모든 응답을 받지만 correlationId로 걸러내므로 문제없다.

### group.id가 같을 때 — 응답 도난

```
reply topic ─→ group "...-app" ─┬─ 서버1 (P0)
                                └─ 서버2 (P1)

서버2가 보낸 요청의 응답이 P0에 떨어지면
  → 서버1이 가져가 "모르는 correlationId"로 폐기
  → 서버2는 영원히 못 받고 타임아웃
```

**중복이 아니라 유실**이라는 점이 중요하다. 파티션이 1개면 한쪽 인스턴스가 전부 독식해 다른 쪽은 100% 실패하고, N개면 약 `(N-1)/N` 확률로 무작위 실패한다.

> 단일 인스턴스 테스트에서는 절대 재현되지 않는다. 2대를 띄우는 순간 터진다.

자세한 그룹 시맨틱은 [Kafka 컨슈머 그룹](/messaging/kafka-consumer-group) 참고.

## `setSharedReplyTopic(true)`의 정확한 동작

가장 오해하기 쉬운 설정이다.

> ❌ "이걸 켜야 correlationId로 자기 응답만 골라 받는다"

**아니다.** correlationId 매칭은 이 플래그와 무관하게 **항상** 수행된다. 이 플래그가 바꾸는 것은 **미매칭 응답이 도착했을 때의 로그 레벨 하나**뿐이다.

```java
protected void logLateArrival(ConsumerRecord<K, R> record, CorrelationKey correlationId) {
    if (this.sharedReplyTopic) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug(() -> missingCorrelationLogMessage(record, correlationId));
        }
    }
    else if (this.logger.isErrorEnabled()) {
        this.logger.error(() -> missingCorrelationLogMessage(record, correlationId));
    }
}
```

| 설정 | 미매칭 응답 도착 시 |
|------|---------------------|
| `false` (기본) | **ERROR** — `"No pending reply: ... perhaps timed out, or using a shared reply topic"` |
| `true` | **DEBUG** — 조용히 폐기 |

### 그래도 켜야 하는 이유

인스턴스별 고유 group.id를 쓰는 순간 **남의 응답을 받는 것이 정상 동작**이 된다. 플래그가 `false`면 정상 상황에서 ERROR 로그가 인스턴스 수만큼 쏟아져 운영 알림이 오탐으로 뒤덮인다.

### 이 플래그가 해결하지 못하는 것

**같은 group.id를 쓰는 응답 도난은 막지 못한다.** 같은 그룹이면 애초에 내 컨슈머에게 배달 자체가 안 되기 때문이다. 이 플래그는 "받았는데 내 것이 아닐 때"의 처리이지, "아예 못 받는" 상황과는 무관하다.

> 격리의 축은 토픽 분리도, 이 플래그도 아니라 **group.id**다.

## 실패 모드 정리

| 증상 | 원인 | 확인 지점 |
|------|------|-----------|
| 항상 타임아웃 | 응답자가 `CORRELATION_ID`를 에코하지 않음 | 응답 레코드의 헤더 |
| 일부 인스턴스만 타임아웃 | reply consumer group.id가 인스턴스 간 동일 | 기동 로그의 group.id |
| 응답은 오는데 처리 안 됨 | reply 컨테이너가 구독하는 토픽 ≠ REPLY_TOPIC 헤더 값 | 컨테이너 설정 vs 요청 헤더 |
| 정상인데 ERROR 로그 폭주 | `setSharedReplyTopic(false)` + 다중 인스턴스 | 템플릿 설정 |
| 간헐적 타임아웃 후 지각 도착 로그 | 응답자 처리 시간 > reply timeout | 응답자 처리 시간 분포 |

## 교훈

### req/rep 리스너는 에러를 던지지 말고 에러 코드를 응답하라

일반 리스너는 예외를 던져 재시도·DLT로 흘리는 것이 맞지만, req/rep의 응답자는 다르다. 예외를 던지면 요청자는 **아무것도 못 받고 타임아웃까지 매달린다.**

```java
try {
    return service.process(message);
} catch (Exception e) {
    log.error(e.getMessage(), e);
    return failResponse(SYSTEM_INTERNAL_SERVER_ERROR);  // 일단 응답부터
}
```

대신 이 구조에서는 예외가 컨테이너까지 올라가지 않아 **`DefaultErrorHandler`·DLT가 사실상 도달 불가**가 된다. 의도한 트레이드오프인지 인지하고 써야 하며, 실패가 로그로만 흘러가지 않도록 별도 기록 경로(원장 상태 업데이트, 메트릭)를 마련해야 한다.

### 타임아웃은 응답자의 최악 처리 시간 기준으로 잡아라

reply timeout이 응답자의 p99보다 짧으면, 정상 처리된 건이 요청자 쪽에서는 실패로 기록되고 응답은 지각 도착해 폐기된다. **양쪽 상태가 어긋나는** 최악의 형태다.

### reply 토픽도 명시적으로 생성하라

auto-create에 맡기면 브로커 기본 파티션 수가 적용된다. 파티션 수는 앞서 본 응답 도난 시나리오의 실패 확률을 좌우하는 값이므로, 운영 토픽으로 관리해야 한다.

## 모범사례

### 1. reply 토픽은 공유하고 group.id로 격리하라

인스턴스마다 토픽을 만들면 토픽 수가 인스턴스 수에 비례해 늘고, 오토스케일 환경에서는 관리가 불가능해진다.

### 2. `setSharedReplyTopic(true)`를 켜고, 주석에 이유를 남겨라

```java
// 공유 Reply 토픽 사용 선언 — 타 인스턴스 응답 수신은 정상이므로
// 미매칭 로그를 ERROR -> DEBUG 로 낮춘다 (correlationId 필터링은 항상 동작)
template.setSharedReplyTopic(true);
```

"correlationId로 본인 응답만 처리"라고만 적으면 다음 사람이 이 플래그를 격리 장치로 오해한다.

### 3. 요청 키에 업무 식별자를 넣어라

```java
new ProducerRecord<>(requestTopic, transactionNo, request);
```

파티션 분배가 업무 단위로 안정되고, 장애 조사 시 특정 거래의 요청/응답을 파티션에서 추적하기 쉬워진다.

### 4. 동기 응답이 정말 필요한지 먼저 의심하라

Request-Reply는 Kafka의 결을 거스르는 패턴이다. 요청자 스레드가 블로킹되고, 응답자 장애가 요청자 장애로 전파된다. 결과 통지로 충분하다면 단방향 이벤트 + 결과 noti 토픽이 더 안정적이다.

## Related

- [Kafka 컨슈머 그룹](/messaging/kafka-consumer-group) — 분배 vs 팬아웃, group.id 설계
- [Kafka DLT (Dead Letter Topic)](/messaging/kafka-dlt) — 실패 메시지 보관소 설계
