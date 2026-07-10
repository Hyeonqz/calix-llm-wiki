---
title: 트랜잭션과 ACID — 개념과 예시로 이해하기
---

# 트랜잭션과 ACID — 개념과 예시로 이해하기

![만화로 보는 요약 — 먼저 읽어보세요](/images/wiki/transaction-acid-fundamentals.png)

*만화로 보는 요약 — 먼저 읽어보세요*

트랜잭션 기본기(① 트랜잭션이 뭔지 ② ACID 4가지가 각각 뭘 막는지)를
계좌 이체라는 하나의 예시로 관통해서 정리한다.

## 1. 트랜잭션이란?

**트랜잭션(Transaction)**은 여러 개의 DB 연산을 **하나의 논리적 작업 단위**로 묶은 것이다.
전부 성공하거나, 하나라도 실패하면 전부 무효화된다 — 중간 상태로 남는 걸 허용하지 않는다.

**왜 필요한가**: 계좌 이체를 생각해보자. "A 계좌에서 1000원 빼고, B 계좌에 1000원 더하기"는
논리적으로 하나의 작업이지만 실제로는 SQL 두 문장이다.

```sql
UPDATE account SET balance = balance - 1000 WHERE id = 'A';  -- ①
UPDATE account SET balance = balance + 1000 WHERE id = 'B';  -- ②
```

트랜잭션 없이 이 둘을 그냥 순서대로 실행하면, ①이 성공하고 ②를 실행하기 전에 서버가
죽거나 예외가 나면 **A의 돈만 사라지고 B는 안 늘어난 상태**로 DB에 영구히 남는다. 트랜잭션은
①②를 하나로 묶어 "**둘 다 성공 → COMMIT(확정)**, 하나라도 실패 → **ROLLBACK(전부 취소)**"을
보장한다.

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE id = 'A';
UPDATE account SET balance = balance + 1000 WHERE id = 'B';
COMMIT;  -- 여기까지 문제없으면 확정. 중간에 에러나면 ROLLBACK으로 ①②를 전부 되돌림
```

## 2. ACID — 트랜잭션이 지켜야 할 4가지 성질

| 성질 | 한 줄 정의 | 계좌 이체 예시로 보면 |
|---|---|---|
| **A**tomicity (원자성) | 전부 성공 또는 전부 실패, 중간 없음 | ①만 되고 ②가 안 되는 상태는 절대 없다 — 있으면 자동 롤백 |
| **C**onsistency (일관성) | 트랜잭션 전후로 DB는 항상 유효한 상태(제약조건 만족) | 이체 전후로 "A잔액+B잔액의 합"은 그대로다. `CHECK (balance >= 0)` 같은 제약도 계속 지켜짐 |
| **I**solation (격리성) | 동시에 도는 트랜잭션끼리 서로의 중간 상태를 보지 않음 | 이체 도중(커밋 전) 다른 트랜잭션이 A 잔액을 조회해도 이체 전 값을 봄 (격리수준에 따라 다름) |
| **D**urability (지속성) | 커밋되면 서버가 바로 죽어도 그 결과는 사라지지 않음 | COMMIT 응답을 받은 순간, 정전이 나도 이체 결과는 디스크에 남아있다 |

### Atomicity — 원자성 실습

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE id = 'A';
-- 여기서 네트워크 끊김/서버 크래시 발생 → COMMIT 못 받음
-- InnoDB는 재시작 시 트랜잭션 로그(undo log)로 이 미완료 트랜잭션을 자동 ROLLBACK
-- 결과: A 잔액도 원래대로, ②는 아예 실행 안 된 것과 동일한 상태
```

### Consistency — 일관성 실습

```sql
ALTER TABLE account ADD CONSTRAINT chk_balance CHECK (balance >= 0);

START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE id = 'A';  -- A 잔액이 500이었다면 -500이 되어 제약 위반
-- CHECK 제약 위반 → 이 UPDATE 자체가 실패, 트랜잭션은 커밋 못 하고 ROLLBACK
COMMIT;  -- 에러 발생, 아무것도 반영 안 됨
```

일관성은 "트랜잭션이 끝난 뒤에도 DB의 규칙(제약조건·불변식)이 깨지지 않는다"는 뜻이지, DB가
알아서 비즈니스 로직을 맞춰주는 게 아니다 — 원자성·격리성·개발자가 정의한 제약조건이 합쳐진
**결과**로 얻어지는 성질에 가깝다.

### Isolation — 격리성은 별도 문서로

격리성은 "동시 트랜잭션끼리 뭐가 보이고 뭐가 안 보이는가"를 다루는데, 이상 현상(Dirty
Read/Non-Repeatable Read/Phantom Read)과 4단계 격리수준(READ UNCOMMITTED ~ SERIALIZABLE)까지
다루면 그 자체로 큰 주제라 [트랜잭션 격리수준](/spring/transaction-isolation-levels)에 예시와
함께 따로 정리했다. 여기서는 "ACID의 I가 격리수준이라는 다이얼로 조절 가능한 성질"이라는
것만 기억하면 된다.

### Durability — 지속성 실습

```sql
COMMIT;
-- 이 응답을 받았다는 것은 InnoDB가 redo log(WAL, Write-Ahead Log)를 디스크에 먼저 기록했다는 뜻.
-- 바로 다음 순간 정전이 나도, 재시작 시 redo log를 replay해서 커밋된 변경을 복구한다.
-- 반대로 커밋 "전"에 죽으면? undo log로 롤백되어 애초에 반영 안 된 것처럼 처리된다.
```

핵심은 "커밋 응답을 실제로 받았는지"다. COMMIT을 보냈어도 응답을 못 받았다면 서버 입장에서
커밋됐는지 확신할 수 없다 — 그래서 이체 API는 대개 멱등키(idempotency key)로 재시도를 안전하게
만든다 (별도 주제).

## 3. 트랜잭션 상태 전이 (간단히)

```
[Active] --모든 연산 실행--> [Partially Committed] --COMMIT 성공--> [Committed]
   |                                  |
   +---------에러 발생--------------> [Failed] --ROLLBACK--> [Aborted]
```

`Active`(연산 실행 중) → 마지막 연산까지 끝나면 `Partially Committed` → 디스크에 안전하게
쓰기 완료되면 `Committed`. 중간에 에러가 나면 `Failed`를 거쳐 `Aborted`(롤백 완료) 상태로
끝난다.

## 4. Redis와 대비해보면 ACID가 더 선명해진다

Redis도 `MULTI`/`EXEC`로 명령을 묶을 수 있지만, RDB 트랜잭션과 이름만 같지 성질이 다르다 —
**원자성은 있지만(끊김 없이 순차 실행) 커밋 전 검증 실패 시 자동 롤백은 없다.** 즉 A/C/I/D 중
일부만 흉내 낸다. 자세한 비교는 [Redis 명령 묶기 — 트랜잭션·파이프라이닝·Lua](/database/redis/transactions-pipelining-lua)
참고. "트랜잭션"이라는 단어가 기술마다 보장 범위가 다르다는 걸 보여주는 좋은 대조 사례다.

## 핵심 요약

> 트랜잭션은 여러 연산을 하나의 논리적 단위로 묶어서, 전부 성공하거나 전부 실패하게 만드는
> 것이다. ACID로 보면 — **원자성**은 전부/전무를 보장하고, **일관성**은 트랜잭션 전후로
> 제약조건이 깨지지 않는 걸 보장하고, **격리성**은 커밋 전 중간 상태를 다른 트랜잭션이 못 보게
> 막고, **지속성**은 커밋된 결과가 크래시에도 살아남는 걸 보장한다. 원자성·지속성은 보통
> redo/undo log로, 격리성은 격리수준으로 조절하는 성질이라는 점이 실무에서 자주 헷갈리는
> 부분이다.

## Related

- [트랜잭션 격리수준 (@Transactional 기준)](/spring/transaction-isolation-levels) — Isolation을 깊게, 이상 현상·MVCC·lost update 함정까지
- [Redis 명령 묶기 — 트랜잭션·파이프라이닝·Lua](/database/redis/transactions-pipelining-lua) — "트랜잭션"이라는 이름이 기술마다 다른 걸 보장한다는 대조 사례
- [MySQL InnoDB Buffer Pool](/database/mysql/mysql-innodb-buffer-pool) — redo/undo log가 실제로 쓰이는 InnoDB 내부 구조
- [인덱스 기본기](/database/mysql/index-fundamentals) — 같은 MySQL 기초 시리즈
