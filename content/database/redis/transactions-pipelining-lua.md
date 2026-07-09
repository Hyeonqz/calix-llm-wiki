---
title: Redis 명령 묶기 — 트랜잭션·파이프라이닝·Lua
---

# Redis 명령 묶기 — 트랜잭션·파이프라이닝·Lua

> **한 줄 요약**: Redis도 여러 명령을 묶을 수 있지만 목적이 다른 **3가지**가 있다 — **Pipelining(네트워크 최적화)**, **MULTI/EXEC(롤백 없는 원자 실행)**, **Lua(로직 포함 원자 실행)**. "RDB 트랜잭션처럼 실패하면 전부 롤백"을 기대하면 안 된다.

RDB 트랜잭션을 떠올리며 "Redis도 묶을 수 있냐"고 묻기 쉬운데, 셋을 혼동하면 안 된다.

## ① Pipelining — "네트워크 묶음" (트랜잭션 ❌)

명령들을 한 번에 **몰아 보내고** 응답도 한 번에 받는다. **RTT(왕복 지연)를 줄이는 네트워크 최적화**일 뿐, 원자성·격리성 없음. 중간에 다른 클라이언트 명령이 끼어들 수 있다.

```text
SET a 1
SET b 2
INCR c
... (명령 100개를 1번의 왕복으로 전송) → 처리량 대폭 향상
```

## ② MULTI / EXEC — Redis의 "트랜잭션" (원자 실행 O, 롤백 ❌)

```redis
MULTI          # 트랜잭션 시작 (이후 명령은 큐에 쌓이고 즉시 실행 안 됨)
INCR stock
SET last_user "u123"
EXEC           # 큐의 명령들을 "끊김 없이" 순차 실행
```

- **원자성**: EXEC 시점에 큐의 명령들이 **다른 클라이언트 끼어듦 없이** 한 덩어리로 실행 (단일 스레드라 가능).
- **🚨 RDB와 결정적 차이 — 롤백이 없다.** 중간 명령이 **런타임 에러**(예: 타입 불일치)여도 **나머지 명령은 그대로 실행**된다. RDB의 "하나 실패 → 전부 원복"이 **안 됨**.
  - 단, `MULTI`~`EXEC` 사이에 **문법 오류**가 있으면 EXEC 자체가 거부됨(전체 취소).
- **WATCH**로 낙관적 락(CAS) 가능: 감시한 키가 바뀌면 EXEC가 실패(nil 반환)한다.

## ③ Lua Script (`EVAL`) — 원자성 + "로직"까지 (실무 선호)

```lua
-- 한도 체크와 증가를 하나의 원자 단위로 (쿠폰 발급 정석 패턴)
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
if current >= tonumber(ARGV[1]) then
  return -1                            -- 한도 초과
end
return redis.call('INCR', KEYS[1])     -- 발급
```

- 스크립트 전체가 **서버에서 원자적으로** 실행 → 도중에 다른 명령이 절대 못 끼어든다.
- **조건 분기·반복** 가능 → MULTI/EXEC로 못 하는 "읽고 판단해서 쓰기"를 안전하게. [INCR 후 앱에서 보상하는 위험 패턴](/database/redis/incr-atomic-counter)의 정답.

## RDB 트랜잭션 vs Redis 비교

| | RDB 트랜잭션 | Redis MULTI/EXEC | Lua Script |
|---|---|---|---|
| 원자 실행 | ✅ | ✅ | ✅ |
| **실패 시 롤백** | ✅ | **❌ 없음** | ❌ (직접 보상) |
| 격리(Isolation) | 레벨 선택 | 단일 스레드라 완전 직렬 | 완전 직렬 |
| 조건 로직 | 보통 앱에서 | ❌ (큐잉만) | ✅ |
| 지속성(Durability) | ✅ 기본 | 영속화 설정(AOF) 의존 | 동일 |

> **정리**: Pipelining은 **네트워크 최적화**, MULTI/EXEC는 **롤백 없는 원자 실행**, Lua는 **로직까지 포함한 원자 실행**. Redis의 정합성은 보통 **단일 명령(`INCR`)의 원자성**이나 **Lua**로 보장하지, "롤백"으로 보장하지 않는다.

## Related

- [INCR — 원자적 카운터](/database/redis/incr-atomic-counter) — 묶을 대상이 되는 대표 원자 명령
- [Redis](/database/redis) — 도메인 인덱스
