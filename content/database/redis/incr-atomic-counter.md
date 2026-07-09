---
title: Redis INCR — 원자적 카운터
---

# Redis INCR — 원자적 카운터

> **한 줄 요약**: `INCR`는 키의 정수 값을 **원자적으로 1 증가**시키고 증가된 값을 반환한다. Redis가 명령을 **단일 스레드**로 처리하기 때문에, 동시 요청에도 race condition 없이 정확히 증가한다 → RDB의 `UPDATE ... cnt = cnt + 1` + 락을 **명령어 하나로 lock-free**하게 대체.

## 기본 동작

```redis
SET counter 10
INCR counter      # → 11
INCR counter      # → 12

# 키가 없으면 0으로 초기화 후 증가
INCR new_key      # → 1
```

- 값은 String으로 저장되지만 **64bit signed 정수**로 해석.
- 정수로 파싱 안 되면 에러, overflow 시 에러.
- 반환값은 **증가 후**의 값.

## 관련 명령어

| 명령 | 동작 |
|------|------|
| `INCRBY key n` | n만큼 증가 |
| `DECR` / `DECRBY` | 감소 |
| `INCRBYFLOAT key f` | 실수 증가 |

## 왜 원자적인가 — 단일 스레드 모델

Redis의 명령 실행 루프는 **단일 스레드**다. 여러 클라이언트가 동시에 `INCR`를 보내도, 명령은 큐에서 **하나씩 순차 실행**되므로 "읽고-더하고-쓰는(read-modify-write)" 과정이 쪼개지지 않는다 → **원자성 보장**.

> 면접 꼬리질문: **"단일 스레드인데 왜 빠른가?"** → ① 인메모리라 디스크 I/O 없음 ② epoll 기반 I/O 멀티플렉싱으로 수만 커넥션 처리 ③ 락/컨텍스트 스위칭 비용 제거. CPU보다 메모리·네트워크가 병목이라 단일 스레드로도 충분.

## 대표 활용 패턴

### 1. 쿠폰 재고 / 발급 수 카운터
```redis
INCR coupon:issued_count   # 발급 시마다 원자 증가
```
RDB에서 락 잡고 `SELECT ... FOR UPDATE` → `UPDATE` 하던 것을 명령 1방으로. 대량 동시 발급(load test)에서 경합 제거.

### 2. Rate Limiting (고정 윈도우)
```redis
INCR rate:user:123     # 요청마다 증가
EXPIRE rate:user:123 60  # 최초 1회 TTL 60초 → "1분에 N회" 제한
```

## ⚠️ 주의: INCR 후 앱에서 보상(DECR)하는 패턴

쿠폰 한도 체크에서 흔한 실수:

```text
current = INCR(issued)        # 원자적
if current > LIMIT:           # ← 여기서 다른 요청이 끼어들 수 있음
    DECR(issued)              # 보상 시도 — 그 사이 상태가 어긋남
```

`INCR` 자체는 원자적이지만, **"증가 → 판단 → 보상"이라는 묶음은 원자적이지 않다**. 한도 체크+증가를 **하나의 원자 단위**로 묶으려면 [Lua 스크립트](/database/redis/transactions-pipelining-lua)를 써야 한다.

## Related

- [명령 묶기: 트랜잭션·파이프라이닝·Lua](/database/redis/transactions-pipelining-lua) — INCR을 다른 명령과 안전하게 묶는 방법
- [Redis](/database/redis) — 도메인 인덱스
