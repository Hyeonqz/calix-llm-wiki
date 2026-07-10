---
title: MySQL
---

# MySQL

관계형 데이터베이스(MySQL/InnoDB) 스키마 설계, 타입 선택, 인덱싱, 쿼리 최적화 노트.

## Topics

- [MySQL DATETIME vs TIMESTAMP](/database/mysql/mysql-datetime-timestamp) — 시간 타입 비교, `(3)`/`(6)` 정밀도, 타임존 처리, 모범사례
- [SQL CROSS JOIN vs UNION](/database/mysql/sql-cross-join-union) — 집합 결합 방식 비교
- [jOOQ vs QueryDSL](/database/mysql/jooq-vs-querydsl) — 타입 세이프 쿼리 두 철학 비교, 트레이드오프, QueryDSL→jOOQ 마이그레이션 전략
- [인덱스 기본기](/database/mysql/index-fundamentals) — 풀스캔 O(N) vs B-Tree O(log N), 카디널리티, 복합 인덱스 최좌측 접두사
- [트랜잭션과 ACID](/database/mysql/transaction-acid-fundamentals) — 트랜잭션 개념, ACID 4가지를 계좌 이체 예시로

## Related

- [Database](/database)
- [Redis](/database/redis)
