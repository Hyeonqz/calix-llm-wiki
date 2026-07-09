---
title: "SQL CROSS JOIN / UNION / UNION ALL 완전 정리"
category: "database"
tags: [sql, mysql, cross-join, union, union-all, join]
created: 2026-06-24
updated: 2026-06-24
---

# SQL CROSS JOIN / UNION / UNION ALL 완전 정리

## 개요

| 구문 | 목적 | 중복 처리 |
|---|---|---|
| `CROSS JOIN` | 두 테이블의 모든 조합(곱집합) 생성 | N/A |
| `UNION` | 두 쿼리 결과를 합치고 **중복 제거** | 제거 |
| `UNION ALL` | 두 쿼리 결과를 합치고 **중복 유지** | 유지 |

---

## 1. CROSS JOIN (교차 조인 / 카테시안 곱)

### 개념

두 테이블의 **모든 행 × 모든 행** 조합을 생성한다.
A 테이블 3행, B 테이블 5행 → 결과 15행 (3 × 5).

```
A 테이블       B 테이블       CROSS JOIN 결과
-------       --------       ---------------
A1            X              A1-X
A2      ×     Y       →      A1-Y
A3            Z              A2-X
                             A2-Y
                             A2-Z
                             A3-X
                             A3-Y
                             A3-Z
```

### 문법

```sql
-- 명시적 CROSS JOIN
SELECT a.col, b.col
FROM table_a a
CROSS JOIN table_b b;

-- 암묵적 CROSS JOIN (콤마 방식, 동일한 결과)
SELECT a.col, b.col
FROM table_a a, table_b b;
```

### 실전 예시 — 가맹점 × 결제수단 조합 생성

수수료 INSERT 작업에서 실제로 사용한 패턴:

```sql
-- 크레소티 가맹점 N개 × 결제수단 5개 = N×5 건 한 번에 INSERT
INSERT INTO pymt_cmpy_rat (merchant_id, pymt_cmpy, cost, ...)
SELECT m.id, v.pymt_cmpy, v.cost, ...
FROM merchant m                           -- N개 행
CROSS JOIN (                              -- 5개 행 (인라인 테이블)
    SELECT 'UnionPay'      AS pymt_cmpy, 1.5500 AS cost UNION ALL
    SELECT 'Wechat',                     0.9000          UNION ALL
    SELECT 'Alipay_Micro',               0.8500          UNION ALL
    SELECT 'Alipay+_Micro',              1.0500          UNION ALL
    SELECT 'LINEPay',                    3.2000
) v
WHERE m.agency_id = 2;

-- 결과: 가맹점 10개 × 5개 결제수단 = 50건 INSERT
```

### CROSS JOIN 활용 패턴

```sql
-- 패턴 1: 고정 값 목록(인라인 테이블)과 결합
-- → 위 수수료 예시처럼 "N개 대상 × M개 고정값" 을 한 번에 처리

-- 패턴 2: 날짜 범위 생성
SELECT DATE_ADD('2026-01-01', INTERVAL n.num DAY) AS dt
FROM (
    SELECT 0 AS num UNION ALL SELECT 1 UNION ALL SELECT 2 -- ... 
) n
WHERE DATE_ADD('2026-01-01', INTERVAL n.num DAY) <= '2026-01-31';

-- 패턴 3: 모든 상품 × 모든 지역 조합 (재고 초기화 등)
SELECT p.id AS product_id, r.id AS region_id
FROM product p
CROSS JOIN region r;
```

### 주의사항

```
⚠️ 대용량 테이블에 CROSS JOIN 사용 금지
   - A: 10만 행, B: 10만 행 → 결과: 100억 행 → DB 다운
   - 반드시 WHERE 조건으로 대상을 먼저 좁혀야 함
```

---

## 2. UNION vs UNION ALL

### 개념 비교

```
쿼리1 결과:   쿼리2 결과:
A             B
B       →     C
C             B  ← 중복

UNION     → A, B, C       (중복 제거, 정렬 발생)
UNION ALL → A, B, C, B, C (중복 유지, 정렬 없음)
```

### 문법

```sql
-- UNION: 중복 제거 (느림 - 내부적으로 DISTINCT 수행)
SELECT col FROM table_a
UNION
SELECT col FROM table_b;

-- UNION ALL: 중복 유지 (빠름 - 단순 합치기)
SELECT col FROM table_a
UNION ALL
SELECT col FROM table_b;
```

### 규칙

```
1. 컬럼 수가 같아야 한다
2. 대응되는 컬럼의 데이터 타입이 호환되어야 한다
3. 컬럼명은 첫 번째 SELECT 기준으로 결정된다
```

```sql
-- ✅ 올바른 예
SELECT id, name FROM merchant
UNION ALL
SELECT id, name FROM agency;

-- ❌ 컬럼 수 불일치
SELECT id, name FROM merchant
UNION ALL
SELECT id FROM agency;  -- ERROR

-- 컬럼명은 첫 번째 SELECT 기준
SELECT id AS merchant_id, name FROM merchant    -- 결과 컬럼명: merchant_id, name
UNION ALL
SELECT id AS agency_id,   name FROM agency;     -- agency_id 는 무시됨
```

### 성능 비교

| 항목 | UNION | UNION ALL |
|---|---|---|
| 중복 제거 | O (DISTINCT 수행) | X |
| 임시 테이블 생성 | O | X (또는 최소화) |
| 정렬 발생 | O | X |
| 속도 | 느림 | 빠름 |
| 권장 상황 | 실제로 중복이 있고, 제거가 필요한 경우 | 중복이 없거나, 중복을 남겨도 되는 경우 |

```
→ 중복이 없다고 확신할 수 있으면 항상 UNION ALL 을 써라 (더 빠름)
```

### 실전 예시 — 인라인 고정값 테이블 생성

```sql
-- UNION ALL로 인라인 테이블(Derived Table) 생성
-- → 코드에서 배열처럼 사용하는 패턴
SELECT *
FROM (
    SELECT 'UnionPay'      AS pymt_cmpy, 1.5500 AS cost, 2.5000 AS mer_cmms UNION ALL
    SELECT 'Wechat',                     0.9000,          1.5000             UNION ALL
    SELECT 'Alipay_Micro',               0.8500,          1.8000             UNION ALL
    SELECT 'Alipay+_Micro',              1.0500,          2.2000             UNION ALL
    SELECT 'LINEPay',                    3.2000,          3.6500
) AS fee_table;

-- 결과:
-- pymt_cmpy    | cost   | mer_cmms
-- UnionPay     | 1.5500 | 2.5000
-- Wechat       | 0.9000 | 1.5000
-- ...
```

### 실전 예시 — 여러 테이블 건수 한 번에 조회

```sql
-- 6개 테이블 건수를 한 쿼리로 확인
SELECT 'pymt_cmpy_rat'      AS tbl, COUNT(*) AS cnt
FROM pymt_cmpy_rat JOIN merchant m ON merchant_id = m.id WHERE m.agency_id = 2
UNION ALL
SELECT 'mer_pymt_cmpy_rat',           COUNT(*)
FROM mer_pymt_cmpy_rat JOIN merchant m ON merchant_id = m.id WHERE m.agency_id = 2
UNION ALL
SELECT 'agncy_pymt_cmpy_rat',         COUNT(*)
FROM agncy_pymt_cmpy_rat WHERE agency_id = 2;
```

---

## 3. CROSS JOIN + UNION ALL 조합 패턴

앞서 수수료 INSERT에서 사용한 핵심 패턴:

```sql
-- 핵심: UNION ALL로 고정값 목록 → CROSS JOIN으로 대상과 조합
INSERT INTO some_table (merchant_id, code, value, ...)
SELECT
    m.id,           -- merchant 테이블에서
    v.code,         -- 고정값 목록에서
    v.value,
    ...
FROM merchant m                     -- ① 대상 테이블
CROSS JOIN (                        -- ② UNION ALL로 만든 고정값 테이블
    SELECT 'CODE_A' AS code, 100 AS value UNION ALL
    SELECT 'CODE_B',          200          UNION ALL
    SELECT 'CODE_C',          300
) v
WHERE m.agency_id = 2;              -- ③ 대상 필터

-- → 코드를 루프 없이 한 번의 SQL로 처리하는 실용적 패턴
-- → Java/Python에서 for loop + 개별 INSERT 하는 것보다 훨씬 빠름
```

---

## 4. 자주 하는 실수

### 실수 1: UNION인데 UNION ALL을 써야 하는 경우

```sql
-- 두 쿼리 결과에 중복이 없는데 UNION 사용 → 불필요한 DISTINCT 비용
SELECT id FROM active_merchants
UNION          -- ← 중복 없다면 UNION ALL이 더 빠름
SELECT id FROM pending_merchants;
```

### 실수 2: CROSS JOIN으로 데이터 폭발

```sql
-- 위험: WHERE 없이 CROSS JOIN
SELECT * FROM orders o CROSS JOIN products p;
-- orders 10만건 × products 5만건 = 50억건 → DB 사망
```

### 실수 3: UNION에서 ORDER BY 위치

```sql
-- ❌ 각 SELECT에 ORDER BY 불가
SELECT name FROM a ORDER BY name
UNION ALL
SELECT name FROM b;  -- ERROR (일부 DB)

-- ✅ 전체 결과에 ORDER BY는 맨 끝에
SELECT name FROM a
UNION ALL
SELECT name FROM b
ORDER BY name;  -- 전체 결과에 적용

-- ✅ 특정 SELECT만 정렬이 필요하면 서브쿼리로 감싸기
SELECT * FROM (SELECT name FROM a ORDER BY name LIMIT 5) sub
UNION ALL
SELECT name FROM b;
```

### 실수 4: NULL 처리

```sql
-- UNION은 NULL도 중복으로 취급 → NULL 2개면 1개로 합쳐짐
SELECT NULL AS val UNION SELECT NULL;  -- 결과: 1행

-- UNION ALL은 NULL도 그대로 유지
SELECT NULL AS val UNION ALL SELECT NULL;  -- 결과: 2행
```

---

## 5. 요약 치트시트

```sql
-- 모든 조합 생성 (N × M)
FROM tableA CROSS JOIN tableB

-- 결과 합치기 (중복 제거, 느림)
SELECT ... UNION SELECT ...

-- 결과 합치기 (중복 유지, 빠름) ← 대부분 이걸 쓰는 게 좋음
SELECT ... UNION ALL SELECT ...

-- 고정값 인라인 테이블
SELECT 'val1' AS col UNION ALL SELECT 'val2' UNION ALL SELECT 'val3'

-- 가장 자주 쓰는 실전 패턴: N대상 × M고정값 한 번에 처리
FROM target_table CROSS JOIN (SELECT ... UNION ALL SELECT ...) fixed_values
WHERE target_table.조건 = ?
```

## 참고

- MySQL 8.0 공식 문서 - JOIN Syntax
- 실전 사용 맥락: 크레소티 수수료 초기화 SQL (`docs/sql/2026-06-24_fee-update-runbook.md`)
