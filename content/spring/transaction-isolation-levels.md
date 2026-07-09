---
title: 트랜잭션 격리수준 (@Transactional 기준)
---

# 트랜잭션 격리수준 (@Transactional 기준)

![트랜잭션 격리수준을 만화로 요약](/images/wiki/transaction-isolation-levels.png)

*만화로 보는 요약 — 먼저 읽어보세요*

격리수준(isolation level)은 **동시에 실행되는 트랜잭션끼리 서로의 변경을 어디까지 봐도 되는가**를 정하는 규칙이다. `@Transactional`의 두 축 중 하나 — **propagation(전파)은 "트랜잭션 경계를 어떻게 이어받나"**, **isolation(격리)은 "동시 트랜잭션 간 무엇이 보이나"**. 전파만 알고 격리를 모르면 절반만 아는 것.

## 격리수준이 막으려는 이상 현상 3종

| 이상 현상 | 무슨 일이 벌어지나 | 예시 |
|---|---|---|
| **Dirty Read** | 남이 **커밋 안 한** 값을 읽음 | A가 잔액을 100→0으로 바꾸는 중(미커밋)인데 B가 0을 읽음. A가 롤백하면 B는 존재한 적 없는 값을 본 것 |
| **Non-Repeatable Read** | 같은 행을 두 번 읽었는데 **값이 다름** | B가 잔액 100을 읽음 → A가 50으로 바꾸고 커밋 → B가 같은 행을 다시 읽으니 50 |
| **Phantom Read** | 같은 조건으로 두 번 조회했는데 **행 개수가 다름** | B가 `WHERE amount>10`으로 3건 조회 → A가 조건에 맞는 행 INSERT 커밋 → B가 재조회하니 4건 |

암기 축: **값 하나가 더러움(dirty) → 값이 변함(non-repeatable) → 행이 늘어남(phantom)** — 점점 넓은 범위의 이상.

## 4단계와 막히는 것

낮을수록 빠르고 위험, 높을수록 안전하고 느리다.

| 격리수준 | Dirty | Non-Repeatable | Phantom | 비고 |
|---|---|---|---|---|
| READ UNCOMMITTED | ❌ 허용 | ❌ | ❌ | 실무 사용 거의 없음 |
| READ COMMITTED | ✅ 차단 | ❌ | ❌ | **Oracle·PostgreSQL 기본** |
| REPEATABLE READ | ✅ | ✅ 차단 | △(아래) | **MySQL InnoDB 기본** |
| SERIALIZABLE | ✅ | ✅ | ✅ 차단 | 사실상 직렬 실행. 처리량 급락 |

### MySQL InnoDB의 REPEATABLE READ 특이점

- 일반 `SELECT`는 **락 없는 MVCC 스냅샷 읽기**(consistent read) — 트랜잭션 시작 시점의 스냅샷을 계속 봄. 그래서 non-repeatable read가 막힌다.
- Phantom도 **갭 락(gap lock) + 넥스트키 락** 덕에 표준 RR보다 강하게 방어됨(locking read 기준). 그래서 MySQL에서는 "RR인데 phantom 걱정은 거의 없다"가 실전 답.
- `UPDATE`/`DELETE`/`SELECT ... FOR UPDATE`는 스냅샷이 아니라 **current read** — 락을 잡고 최신 커밋 데이터를 읽는다. (스냅샷 읽기와 current read의 공존이 MySQL RR 이해의 핵심)

## ⚠️ 최대 함정: 격리수준은 lost update를 못 막는다

```
T1: SELECT qty → 1    T2: SELECT qty → 1     (둘 다 무락 스냅샷 읽기)
T1: if qty>0 통과      T2: if qty>0 통과
T1: UPDATE qty=qty-1   T2: UPDATE qty=qty-1   → 재고 -1, 초과 차감
```

- 이 현상의 이름은 **갱신 유실(lost update)** — 데드락이 아니다(데드락은 멈추는 것, 이건 조용히 틀리는 것).
- 일반 SELECT가 락을 안 잡으니 **RR로도, RC로도 안 막힌다.** SERIALIZABLE 전까지 check-then-act는 격리수준의 소관이 아님.
- 막는 법 3종:
  1. **비관적 락**: `SELECT ... FOR UPDATE` — 읽기부터 행 락. 락을 커밋까지 쥐므로 경합 심하면 병목.
  2. **조건부 원자 UPDATE**: `UPDATE ... SET qty=qty-1 WHERE id=? AND qty>0` → **affected rows 0이면 실패 처리**. 락 점유가 한 문장뿐이라 고경합에 유리.
  3. **낙관적 락**: `@Version` 컬럼 — 충돌 시 `OptimisticLockException`, 재시도는 앱 책임.

## Spring @Transactional에서의 사용

```java
@Transactional(
    isolation   = Isolation.DEFAULT,      // ← 격리: DB 기본값 사용 (MySQL이면 RR)
    propagation = Propagation.REQUIRED    // ← 전파: 기존 트랜잭션 참여
)
public void issue(...) { ... }
```

- `Isolation.DEFAULT`가 기본 — **Spring이 정하는 게 아니라 DB 설정을 따른다.** MySQL이면 REPEATABLE READ.
- 값: `DEFAULT / READ_UNCOMMITTED / READ_COMMITTED / REPEATABLE_READ / SERIALIZABLE`.
- 동작 방식: 트랜잭션 시작 시 커넥션에 `SET TRANSACTION ISOLATION LEVEL ...`을 실행하고, 끝나면 원복. 즉 **커넥션 단위로 잠깐 바꾸는 것**.
- **실무에서는 거의 안 바꾼다.** 이유:
  - 격리수준을 올려서 풀리는 문제(읽기 이상)보다, 실무에서 실제로 터지는 문제(lost update, check-then-act)는 격리수준으로 안 풀리기 때문 — 위 3종(락/조건부/버전)으로 푼다.
  - 낮추는 경우는 대량 배치 조회에서 `READ_COMMITTED`로 스냅샷 부담을 줄이는 정도.
  - `JpaTransactionManager` + 일부 드라이버 조합에서 isolation 변경이 무시되거나 커넥션 풀 반환 시 원복 비용이 있는 점도 주의.

## isolation vs propagation 한판 정리

| | isolation (격리) | propagation (전파) |
|---|---|---|
| 질문 | **동시** 트랜잭션끼리 뭐가 보이나 | **호출 체인**에서 트랜잭션을 새로 여나 합류하나 |
| 축 | 데이터 가시성 (시간·동시성) | 트랜잭션 경계 (코드 구조) |
| 기본값 | DEFAULT (=DB 기본, MySQL RR) | REQUIRED (있으면 합류, 없으면 생성) |
| 대표 이슈 | dirty/non-repeatable/phantom, (못 막는) lost update | REQUIRES_NEW 커넥션 추가 점유, 내부 호출 프록시 우회 |

면접 단골 함정: "REQUIRES_NEW는 격리수준인가?" → **아니다, 전파다.** 격리와 전파를 섞어 말하면 바로 감점.

## 면접 요약 (3문장)

1. "MySQL 기본은 REPEATABLE READ고, MVCC 스냅샷으로 non-repeatable read까지 막고 갭 락으로 phantom도 대부분 방어합니다."
2. "다만 일반 SELECT는 락 없는 스냅샷 읽기라 **check-then-act(lost update)는 격리수준으로 못 막습니다** — FOR UPDATE, 조건부 원자 UPDATE, 낙관적 락으로 풉니다."
3. "저는 고경합 구간에서 락 점유 시간이 한 문장으로 끝나는 **조건부 원자 UPDATE + affected rows 확인**을 선호합니다."

## Related

- [@TransactionalEventListener + @Transactional 충돌](/spring/transactional-event-listener) — AFTER_COMMIT 리스너와 전파
- [MySQL InnoDB Buffer Pool](/database/mysql/mysql-innodb-buffer-pool) — InnoDB 내부 구조
- [MySQL DATETIME vs TIMESTAMP](/database/mysql/mysql-datetime-timestamp)
