---
title: "약속된 데이터 — 트랜잭션은 왜 태어났는가"
book: "약속된 데이터"
description: "데이터베이스 트랜잭션을 역사부터 현재까지, 근본 원리와 실무 사례로 풀어낸 그림이 있는 전자책."
status: "집필 중"
---

# 약속된 데이터

### 트랜잭션은 왜 태어났는가

> 당신이 `commit` 한 줄을 칠 때, 그 뒤에서는 수십 년의 역사와 네 개의 약속,
> 자물쇠와 로그가 동시에 작동한다. 이 책은 그 보이지 않는 세계를 처음부터 끝까지 보여준다.

이 책은 RDB에 본격적으로 입문하기 전, **"왜 트랜잭션이 필요한가"** 를 근본부터
이해하고 싶은 예비·주니어 개발자를 위해 썼다. 정의를 외우는 대신, 트랜잭션이
*없던* 세계의 고통에서 출발해 — 손으로 쓰던 장부, 반쯤 부서진 파일, 그리고
"Transaction"이라는 단어가 처음 이름을 얻던 연구실까지 — 왜 이 개념이 그 순서로
태어났는지를 이야기로 따라간다.

각 장은 **배경 → 스토리 → 핵심** 세 걸음으로 나아가고, 개념마다 실행 가능한
SQL과 Spring/Java 예제, 그리고 그 장을 한 컷으로 요약한 삽화가 함께한다.

## 목차

**제1부 · 트랜잭션이 없던 세계**
1. [장부 앞의 회계사](/books/transaction/01-ledger-accountant)
2. [파일과 씨름하던 프로그래머들](/books/transaction/02-early-dbms)
3. [System R과 하나의 단어](/books/transaction/03-system-r)
4. [SQL 표준이 세운 약속](/books/transaction/04-sql-standard)

**제2부 · ACID, 네 개의 약속**
5. [전부 아니면 전무 — 원자성](/books/transaction/05-atomicity)
6. [규칙은 깨지지 않는다 — 일관성](/books/transaction/06-consistency)
7. [서로를 방해하지 않는 척 — 격리성](/books/transaction/07-isolation)
8. [한번 약속하면 영원히 — 지속성](/books/transaction/08-durability)

**제3부 · 동시성이라는 전쟁터**
9. [유령과 오염 — 동시성 괴현상](/books/transaction/09-anomalies)
10. [네 개의 문 — 격리 수준](/books/transaction/10-isolation-levels)
11. [표준이 말하지 않은 것 — 스냅샷 격리](/books/transaction/11-snapshot)

**제4부 · 질서를 지키는 장치들**
12. [자물쇠를 채우다 — 락](/books/transaction/12-locks)
13. [시간을 여러 겹으로 — MVCC](/books/transaction/13-mvcc)
14. [믿음의 문제 — 낙관적 제어](/books/transaction/14-optimistic)
15. [재난 후의 복구 — WAL](/books/transaction/15-wal-recovery)

**제5부 · 현장의 트랜잭션**
16. [서로를 붙든 채 멈추다 — 데드락](/books/transaction/16-deadlock)
17. [프레임워크가 숨긴 트랜잭션 경계](/books/transaction/17-transactional)

**제6부 · 트랜잭션의 확장과 미래**
18. [경계를 넘는 약속 — 분산 트랜잭션](/books/transaction/18-distributed)

---

▶ [여는 글부터 읽기 — 사라진 잔고의 밤](/books/transaction/00-opening)
