---
title: "10장. 네 개의 문 — 격리 수준"
---

{/* 삽화 자리 — 웹툰식 요약 1컷 (hero, 16:9, 현대 톤 · 은유적)
프롬프트: 낮은 문에서 높은 문으로 이어지는 4단 계단. 각 문 앞에서 9장의 세 유령이
단계별로 하나씩 차단된다 — 아래 문은 유령이 다 통과, 위로 갈수록 막힘. 맨 위 문은
완전 봉쇄지만 통로가 좁아(느림) 사람들이 줄 서 기다린다. 차가운 현대 톤, 통과=toss blue.
[STYLE PREFIX] + 현대 ERA + --ar 16:9 --style raw --no ...
→ public/images/books/transaction/10/summary.png */}

# 10장. 네 개의 문 — 격리 수준

## 배경 — 안전과 속도를 고르는 다이얼

9장에서 세 유령의 이름을 알았죠. 이제 진짜 실무 이야기입니다. **격리 수준
(isolation level)** 은 "이 세 유령 중 무엇을 막고 무엇을 허용할지"를 고르는 **네 칸짜리
다이얼**이에요. SQL 표준(SQL-92)이 이 네 단계를 정의했습니다.

원리는 단순합니다. **막을수록 안전하지만, 막을수록 느립니다.** 유령을 막으려면
데이터를 더 오래 잠그거나 더 엄격히 검사해야 하고, 그럼 동시성이 줄거든요. 그래서
"내 서비스엔 어느 유령까지 허용해도 괜찮은가"를 개발자가 **고르는** 겁니다.

## 스토리 — 낮은 문부터 높은 문까지

네 단계를 낮은 문(느슨·빠름)에서 높은 문(엄격·느림) 순으로 올라가 봅시다.

- **① READ UNCOMMITTED (가장 낮은 문).** 아무것도 안 막아요. 커밋 안 된 값도 읽습니다.
  → 세 유령 다 통과(더티·반복불가·팬텀). 거의 안 씁니다.
- **② READ COMMITTED.** "커밋된 것만 읽어라." **더티 리드를 막습니다.** 하지만 읽을
  때마다 최신 커밋을 보니, 반복불가(non-repeatable read)·팬텀은 아직 통과.
- **③ REPEATABLE READ.** "내 트랜잭션 동안 **같은 행은 항상 같은 값**으로 보여라."
  더티 + 반복불가를 막습니다. 표준상 팬텀은 아직 남아요.
- **④ SERIALIZABLE (가장 높은 문).** 세 유령을 **다 막습니다.** 완벽하게 "한 명씩
  처리한 것과 같은" 결과(3장의 직렬성). 대신 가장 느려요.

## 핵심 — 세 유령의 조합표

이걸 표로 만들면, 격리 수준의 정체가 한눈에 보입니다. 각 칸은 그 유령을 **막는지
(차단)**, 그냥 **놔두는지(허용)** 를 뜻해요.

| 격리 수준 | Dirty Read | Non-repeatable | Phantom |
|---|---|---|---|
| READ UNCOMMITTED | 허용 | 허용 | 허용 |
| READ COMMITTED | 차단 | 허용 | 허용 |
| REPEATABLE READ | 차단 | 차단 | 허용 |
| SERIALIZABLE | 차단 | 차단 | 차단 |

> **중요:** 이 표는 **SQL 표준의 정의**입니다. 실제 DB는 이 표대로 안 움직이는 경우가
> 많아요. 예를 들어 MySQL의 REPEATABLE READ는 팬텀까지 상당 부분 막고, PostgreSQL은
> 내부적으로 전혀 다른 방식(스냅샷)으로 구현합니다. **표준과 현실의 간극**은 바로
> 다음 장(11장)의 주제예요. 지금은 "표준은 이렇게 정의했다"를 기준선으로 잡으세요.

직접 손으로 확인해 봅시다. 터미널 **두 개**를 열고(세션 A, 세션 B), 반복불가 읽기를
재현해 볼게요. **(아래는 MySQL 기준. 격리 수준 설정 문법은 DB마다 조금씩 다릅니다.)**

```sql
-- [세션 B] 격리 수준을 READ COMMITTED로 낮추고 시작
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT balance FROM account WHERE id = 42;   -- 10000
```
```sql
-- [세션 A] 그 사이에 값을 바꾸고 커밋
START TRANSACTION;
UPDATE account SET balance = 5000 WHERE id = 42;
COMMIT;
```
```sql
-- [세션 B] 다시 읽으면?
SELECT balance FROM account WHERE id = 42;   -- 5000  ← 반복불가 읽기 발생!
```

이제 세션 B를 `REPEATABLE READ`로 올리고 같은 실험을 하면, 두 번째 읽기도 `10000`으로
**고정**됩니다. 유령이 막힌 거죠. 격리 수준을 손으로 올렸다 내렸다 하며 유령이 나타났다
사라지는 걸 직접 보는 것 — 이게 이 개념을 몸으로 익히는 가장 빠른 길입니다.

실무에서는 보통 프레임워크에서 트랜잭션 단위로 지정합니다.

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void transfer(long from, long to, long amount) { ... }
```

### 그래서 뭘 골라야 하나

기본값부터 알아두면 됩니다. 대부분의 DB는 **READ COMMITTED**를 기본으로 씁니다
(PostgreSQL, Oracle, SQL Server). 예외가 **MySQL(InnoDB)** 로, 기본이 **REPEATABLE
READ**예요. 그래서 "같은 코드가 MySQL과 PostgreSQL에서 다르게 도는" 함정이 실제로
생깁니다. 대부분의 서비스는 기본값으로 충분하고, 돈·재고처럼 **정확성이 생명인 소수의
트랜잭션**만 골라 수준을 올리는 게 실무의 정석이에요.

## 정리

- **격리 수준** = 9장 세 유령 중 무엇을 막을지 고르는 4단계 다이얼. **높을수록 안전·느림.**
- 표준(SQL-92) 조합표:
  - **READ UNCOMMITTED** — 아무것도 안 막음(더티 리드까지 허용).
  - **READ COMMITTED** — 더티 리드 차단.
  - **REPEATABLE READ** — + 반복불가 차단(표준상 팬텀은 허용).
  - **SERIALIZABLE** — 세 유령 다 차단(직렬성).
- 기본값: 대부분 **READ COMMITTED**, 단 **MySQL InnoDB는 REPEATABLE READ**.
- **이 표는 표준의 정의일 뿐** — 실제 DB 구현은 다르다(11장).

**생각해볼 질문:** 방금 "표준은 이런데 실제 DB는 다르다"고 몇 번 흘렸죠. 특히
PostgreSQL은 잠금이 아니라 **스냅샷**이라는 전혀 다른 방식을 씁니다. 그러면 표준의
네 문 이름표가 붙어 있어도, 문 뒤의 실제 동작은 딴판일 수 있어요. 표준이 **말하지
않은** 그 간극에서 무슨 일이 벌어질까요? (11장으로 갑니다.)

▶ [11장 · 표준이 말하지 않은 것 — 스냅샷 격리](/books/transaction/11-snapshot)
