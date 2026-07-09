---
title: jOOQ vs QueryDSL
---

# jOOQ vs QueryDSL — 타입 세이프 쿼리의 두 철학과 마이그레이션 전략

자바 진영에서 **타입 세이프(type-safe) 동적 쿼리**를 작성하는 대표적인 두 라이브러리,
QueryDSL과 jOOQ를 비교한다. 단순 기능 나열이 아니라 **두 도구가 서로 다른 곳에서
출발했다는 철학적 차이**를 짚고, 그 차이가 코드 생성 방식·표현력·운영·라이선스에서
어떤 트레이드오프로 이어지는지를 정리한다. 마지막에는 **QueryDSL → jOOQ 마이그레이션**을
실제로 제안할 때 필요한 의사결정 근거와 단계별 전략을 담는다.

> 한 줄 요약: **QueryDSL은 "엔티티(JPA)에서 출발해 SQL로 내려가고", jOOQ는
> "데이터베이스 스키마에서 출발해 SQL을 그대로 표현한다."** 이 출발점의 차이가
> 거의 모든 장단점을 만든다.

---

## 1. 한눈 비교

| 항목 | QueryDSL | jOOQ |
|------|----------|------|
| 출발점(모델) | **JPA 엔티티 중심** (객체→DB) | **DB 스키마 중심** (DB→객체) |
| 코드 생성 소스 | 컴파일 타임 APT (엔티티 클래스 → `Q타입`) | 빌드 타임 코드젠 (실제 DB/DDL → `Tables`, `Records`) |
| SQL 추상화 수준 | JPQL 위에 얹힌 DSL (JPA 구현체가 SQL 변환) | **SQL 그 자체를 1:1 DSL로 표현** |
| 표현 가능한 SQL 범위 | JPQL이 지원하는 범위로 제한 | 윈도우 함수·CTE·UPSERT·벤더 전용 문법까지 거의 전부 |
| 영속성 컨텍스트 | JPA EntityManager와 통합(더티 체킹·1차 캐시) | 기본적으로 **영속성 컨텍스트 없음** (SQL 실행기) |
| 타입 안정성 검증 시점 | 컴파일 타임 (단, JPQL 변환 단계는 런타임) | **컴파일 타임 (SQL 구조까지)** |
| 스키마-코드 불일치 탐지 | 약함 (엔티티 매핑 신뢰) | **강함** (실제 스키마 기준 생성 → 컬럼 변경 시 컴파일 에러) |
| 활성 유지보수 | **2024년 이후 사실상 정체** (커뮤니티 포크로 분산) | **활발** (분기별 릴리스, 신규 SQL 표준/벤더 대응) |
| 라이선스 | Apache 2.0 (전면 무료) | **OSS DB는 무료 / 상용 DB(Oracle·SQL Server·DB2 등)는 유료** |
| 러닝 커브 | JPA 사용자에게 낮음 | SQL을 아는 사람에게 낮음 / JPA 마인드셋이면 전환 필요 |

---

## 2. 근본 철학: 객체에서 내려갈 것인가, DB에서 올라올 것인가

### QueryDSL — Object-first (JPA의 연장선)

QueryDSL의 표준 사용 형태는 `querydsl-jpa`다. 즉 **JPA 엔티티가 진실의 원천(source of
truth)**이고, QueryDSL은 그 엔티티로부터 `Q타입`을 생성해 **JPQL을 타입 세이프하게 조립**한다.

```
[JPA Entity] --APT--> [Q타입] --DSL--> [JPQL] --Hibernate--> [SQL] --> DB
```

- 장점: 더티 체킹, 1차 캐시, 연관관계 lazy 로딩 등 **JPA의 모든 이점을 그대로** 누린다.
- 한계: 최종 SQL은 **JPA 구현체(Hibernate)가 번역**한다. 개발자는 SQL을 직접 통제하지
  못하고, **JPQL이 표현할 수 있는 만큼만** 표현할 수 있다.

### jOOQ — Database-first (SQL이 1급 시민)

jOOQ는 **실제 데이터베이스(또는 DDL 마이그레이션 스크립트)**를 읽어 코드를 생성한다.
생성물은 `Tables`, `Records`, 컬럼 상수이며, 개발자는 이를 조합해 **작성한 그대로의 SQL**을
만든다.

```
[DB Schema / DDL] --codegen--> [Tables, Records] --DSL--> [SQL 1:1] --> DB
```

- jOOQ의 DSL은 SQL을 "숨기지" 않는다. `select().from().join().where()`가
  실제 SQL 절과 1:1로 대응한다. **"자바로 쓰는 SQL"**이라는 표현이 정확하다.
- 따라서 SQL을 아는 사람은 **추가 추상화를 거의 학습하지 않고** 바로 강력함을 얻는다.

> 이 차이를 한 문장으로: **QueryDSL은 "JPQL을 안전하게 쓰는 도구", jOOQ는 "SQL을
> 안전하게 쓰는 도구"다.**

---

## 3. 타입 안정성의 "깊이" 차이

둘 다 "타입 세이프"를 표방하지만 보장 범위가 다르다.

| 깨질 수 있는 지점 | QueryDSL | jOOQ |
|------------------|----------|------|
| 컬럼/필드 이름 오타 | 컴파일 에러 ✅ | 컴파일 에러 ✅ |
| 타입 불일치(문자열↔숫자) | 컴파일 에러 ✅ | 컴파일 에러 ✅ |
| **DB 스키마 변경(컬럼 삭제/타입 변경)** | 런타임까지 모를 수 있음 ⚠️ | **재생성 시 컴파일 에러** ✅ |
| JPQL → SQL 변환 실패 | **런타임 예외** ⚠️ | 해당 없음 (SQL 직접) ✅ |
| 벤더 전용 함수 사용 | 표현 어려움 / 우회 필요 ⚠️ | 정식 타입 세이프 지원 ✅ |

핵심은 **jOOQ는 "DB 스키마"라는 외부 현실까지 컴파일 타임 안전망에 포함**시킨다는 점이다.
QueryDSL의 `Q타입`은 엔티티 매핑을 신뢰하므로, 매핑과 실제 스키마가 어긋나면 그 간극은
런타임에야 드러난다. jOOQ는 매 빌드마다 실제 스키마로 코드를 재생성하므로 **"컬럼을
지웠는데 코드는 그대로"인 상황이 빌드에서 잡힌다.**

---

## 4. 코드 생성 모델 비교

| | QueryDSL (APT) | jOOQ (codegen) |
|---|---|---|
| 입력 | 자바 엔티티(`@Entity`) | DB 연결 또는 DDL 스크립트 |
| 산출물 | `QXxx` 메타클래스 | `Xxx` 테이블/`XxxRecord`/POJO |
| 빌드 결합도 | 엔티티 컴파일에 종속 | DB 또는 DDL 파일에 종속 |
| CI 고려사항 | 추가 인프라 불필요 | **빌드 시점에 스키마 소스 필요** (Testcontainers/Flyway+H2/DDL 파일) |

jOOQ 도입 시 흔한 오해가 "빌드 때 운영 DB가 떠 있어야 한다"는 것이다. **그렇지 않다.**
실무에서는 다음 중 하나로 푼다.

- **Flyway/Liquibase 마이그레이션 스크립트** → jOOQ가 인메모리 DB(H2)나
  Testcontainers로 적용 후 스키마를 읽어 생성 (가장 권장)
- **DDL 파일 직접 파싱** (`org.jooq.meta.extensions.ddl`)
- 로컬/CI에 **Testcontainers로 실제 DB 컨테이너** 기동 후 생성

이렇게 하면 **"마이그레이션 스크립트 = 스키마의 단일 진실"**이 되어, 스키마 변경이
코드 생성으로 자연히 전파된다.

---

## 5. 표현력 — jOOQ가 압도적인 영역

QueryDSL(JPA)의 표현력은 **JPQL의 천장**에 묶인다. 반면 jOOQ는 SQL 표준 + 벤더 확장을
거의 전부 타입 세이프하게 제공한다.

jOOQ가 자연스럽게 표현하지만 QueryDSL-JPA에서는 까다롭거나 불가능한 것들:

- **윈도우 함수** — `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)`
- **CTE / 재귀 CTE** — `WITH RECURSIVE`
- **UPSERT** — `INSERT ... ON DUPLICATE KEY UPDATE`(MySQL), `ON CONFLICT`(PG)
- **`MERGE`, `LATERAL` 조인, `GROUPING SETS`, `PIVOT`**
- **벤더 전용 함수/힌트**, JSON 함수, 풀텍스트 검색
- **다중 행 `INSERT`, 배치, `RETURNING`**

```java
// jOOQ: 윈도우 함수 — SQL 그대로가 코드가 된다
var rn = rowNumber().over(partitionBy(PAYMENT.MERCHANT_ID)
                          .orderBy(PAYMENT.CREATED_AT.desc()));
dsl.select(PAYMENT.MERCHANT_ID, PAYMENT.AMOUNT, rn.as("rn"))
   .from(PAYMENT)
   .where(PAYMENT.STATUS.eq("APPROVED"))
   .fetch();
```

QueryDSL에서 같은 것을 하려면 보통 **`Expressions.template(...)`로 SQL 문자열을
끼워넣게** 되는데, 이는 곧 타입 안정성을 스스로 포기하는 것이다. 즉 **"복잡한 쿼리일수록
QueryDSL은 네이티브로 탈출하고, jOOQ는 그대로 안전하게 표현한다."**

---

## 6. JPA/영속성 컨텍스트와의 관계 — 가장 중요한 트레이드오프

여기가 마이그레이션 제안에서 **가장 솔직하게 짚어야 할 지점**이다.

| | QueryDSL-JPA | jOOQ |
|---|---|---|
| 1차 캐시 / 동일성 보장 | ✅ | ❌ (기본) |
| 더티 체킹(자동 변경 감지) | ✅ | ❌ (명시적 UPDATE) |
| 연관관계 매핑/지연로딩 | ✅ | ❌ (조인을 직접) |
| 영속성 전이/cascade | ✅ | ❌ |
| **SQL 통제력** | 제한적 | **완전** |

jOOQ는 본질적으로 **고급 SQL 실행기**이지 ORM이 아니다. 따라서 jOOQ로 전면 전환한다는 것은
**"더티 체킹·1차 캐시 같은 JPA의 자동화를 일부 포기하고, 그 대가로 SQL 완전 통제권을
얻는다"**는 의미다. 이 트레이드오프를 숨기면 발표는 설득력을 잃는다.

**현실적 정석은 "하이브리드"다.**

- **쓰기(Command) / 단순 CRUD / 도메인 영속성** → JPA 유지 (더티 체킹의 가치가 큼)
- **읽기(Query) / 복잡한 조회 / 통계·리포트** → jOOQ (SQL 통제·표현력의 가치가 큼)

이는 CQRS 관점과도 잘 맞는다. QueryDSL이 담당하던 **복잡 조회 영역을 jOOQ로 이관**하고,
엔티티 영속성은 JPA에 남기는 방식이 리스크가 가장 낮다.

---

## 7. 성능

- **런타임 오버헤드**: 둘 다 얇다. jOOQ는 JPA 구현체의 JPQL 파싱/변환·엔티티 하이드레이션
  단계가 없어 **복잡 조회에서 더 예측 가능**하다. QueryDSL-JPA는 Hibernate를 거치므로
  엔티티 로딩·N+1·플러시 타이밍 등 ORM 비용이 함께 따라온다.
- **N+1**: jOOQ는 조인을 명시적으로 쓰므로 N+1이 "숨어들" 여지가 구조적으로 적다.
- **체감 성능보다 통제력**: 핵심 이점은 raw 속도보다 **"발생하는 SQL을 정확히 안다"**는
  예측 가능성이다. 운영 DB 부하 튜닝 시 이 차이가 크다.

> 다만 "jOOQ라서 무조건 빠르다"는 과장이다. 단순 CRUD에서는 차이가 미미하며, 이점은
> **복잡 조회·대용량·튜닝이 필요한 워크로드**에서 드러난다.

---

## 8. 생태계·유지보수 (제안의 핵심 근거)

- **QueryDSL**: 원조 프로젝트(`com.querydsl`)는 **2021~2024를 거치며 릴리스가 크게 정체**
  되었고, 커뮤니티는 `OpenFeign/querydsl` 같은 **포크로 분산**됐다. Jakarta 전환·신규
  Hibernate/Spring Boot 대응이 지연되며 **"유지보수 리스크"**가 도입 반대 사유로 자주 거론된다.
- **jOOQ**: 상용 회사(Data Geekery)가 주도하며 **분기 단위로 활발히 릴리스**한다. 최신 SQL
  표준·신규 벤더 기능·자바 신버전 대응이 빠르다. **장기 유지보수 관점에서 더 안전**하다.

이 "지속가능성" 논거는 마이그레이션 제안에서 **기술적 우월성만큼 강력한 명분**이다.

---

## 9. 라이선스 — 발표에서 반드시 짚어야 할 함정

jOOQ의 라이선스는 **사용하는 DB 종류에 따라 비용이 갈린다.**

| DB 종류 | jOOQ Edition | 비용 |
|---------|-------------|------|
| PostgreSQL, MySQL, MariaDB, SQLite, H2, Derby, … (오픈소스 DB) | **Open Source Edition** | **무료 (Apache-style)** |
| Oracle, SQL Server, DB2, Sybase, Snowflake 등 상용 DB | Express / Professional / Enterprise | **유료 (구독)** |

- QueryDSL은 **Apache 2.0으로 DB 종류와 무관하게 전면 무료**다.
- 따라서 **상용 DB(Oracle/SQL Server)를 쓰는 조직**이라면 jOOQ 전환은 **라이선스 비용
  의사결정**이 동반된다. 반대로 **MySQL/PostgreSQL 환경이면 OSS 에디션으로 비용 없이**
  모든 이점을 누린다.

> 우리 프로젝트처럼 **MySQL 기반**이라면 이 항목은 **장애물이 아니라 오히려 강점**이다.
> 발표에서 "우리 DB는 OSS 에디션 무료 대상"임을 명확히 못 박으면 비용 우려를 선제 차단할 수 있다.

---

## 10. 트레이드오프 종합

### jOOQ를 선택해 얻는 것
- SQL 완전 통제 + 표준/벤더 기능 전부 타입 세이프
- **DB 스키마까지 포함한** 컴파일 타임 안전성
- 활발한 유지보수와 장기 지속가능성
- 복잡 조회의 예측 가능한 성능·가독성
- (OSS DB 한정) 무료

### jOOQ를 선택해 잃는/감수하는 것
- JPA 자동화(더티 체킹·1차 캐시·cascade)와의 결별 또는 분리 설계
- 빌드 파이프라인에 **스키마 소스(코드젠) 단계** 추가
- 팀의 **SQL 역량 의존도 상승** (양날의 검: 투명하지만 책임도 개발자에게)
- 상용 DB일 경우 **라이선스 비용**

### QueryDSL을 유지할 합리적 이유
- 이미 JPA에 깊게 결합된 도메인 + 단순~중간 복잡도 쿼리 위주
- 팀이 JPA 패러다임에 최적화되어 있고 복잡 SQL 수요가 낮음
- 추가 빌드 인프라 변경을 감당하기 어려운 상황

---

## 11. 의사결정 가이드 (한 장 요약)

```
복잡한 SQL(윈도우/CTE/UPSERT/통계)이 잦은가?
  ├─ 예 → jOOQ 유력
  └─ 아니오 → 단순 CRUD 위주? → QueryDSL/JPA로 충분

DB 스키마 변경이 빈번하고, 코드-스키마 불일치 사고가 있었는가?
  └─ 예 → jOOQ (스키마-퍼스트 안전망)

DB가 MySQL/PostgreSQL 등 OSS인가?
  ├─ 예 → jOOQ 비용 부담 없음 (강력 추천 가능)
  └─ 아니오(Oracle/SQL Server) → 라이선스 비용 검토 필요

QueryDSL 유지보수 정체가 실제 리스크로 느껴지는가?
  └─ 예 → jOOQ 전환 명분 강화
```

---

## 12. QueryDSL → jOOQ 마이그레이션 전략

**빅뱅 전환은 권하지 않는다.** 영속성 패러다임이 바뀌므로 점진적 공존이 정석이다.

### Phase 0 — 사전 정비
- 스키마의 **단일 진실 확정**: Flyway/Liquibase 마이그레이션을 정비해 jOOQ 코드젠 입력으로 삼는다.
- CI에 **Testcontainers(MySQL) 또는 Flyway+H2** 기반 코드젠 단계 추가 (운영 DB 의존 X).

### Phase 1 — 공존 셋업
- `jooq`, `jooq-codegen`, `spring-boot-starter-jooq` 추가. JPA/QueryDSL은 **그대로 유지**.
- jOOQ `DSLContext`가 **JPA와 동일한 DataSource·트랜잭션(@Transactional)**을 공유하도록 구성
  → 한 트랜잭션 안에서 두 도구가 섞여도 일관성 유지.

### Phase 2 — 읽기부터 이관 (Strangler Fig)
- 가장 **복잡하거나 성능 이슈가 있는 조회 쿼리**부터 jOOQ로 1건씩 교체.
- 새 통계/리포트/검색 기능은 **신규부터 jOOQ로** 작성.
- 각 이관마다 결과 동등성 테스트(기존 QueryDSL 결과 vs jOOQ 결과) 확보.

### Phase 3 — 쓰기/도메인 영역 정책 결정
- 더티 체킹 가치가 큰 **도메인 영속성은 JPA 유지**(하이브리드 권장), 또는
- 도메인이 단순하고 SQL 통제가 더 중요하면 단계적으로 jOOQ 쓰기까지 확장.

### Phase 4 — 정리
- QueryDSL 의존성·`Q타입` 생성 설정 제거(또는 잔존 영역만 남김), 가이드라인 문서화.

> 핵심 메시지: **"한 트랜잭션에서 JPA와 jOOQ가 공존 가능"**하다는 점이 점진적 전환을
> 안전하게 만든다. 위험을 한 번에 지지 않고, 가치가 큰 조회부터 증명하며 넓힌다.

---

## 13. 사내 발표용 핵심 메시지 (Talking Points)

1. **"우리는 JPQL의 천장에 묶여 있다"** — 복잡 조회마다 `Expressions.template`로
   네이티브 SQL을 끼워넣으며 타입 안정성을 스스로 깨고 있다.
2. **"QueryDSL은 유지보수가 정체됐다"** — 장기 지속가능성 리스크. jOOQ는 활발.
3. **"jOOQ는 스키마 변경을 빌드에서 잡는다"** — 컬럼 변경발 런타임 장애를 컴파일로 전진 배치.
4. **"우리 DB는 MySQL → OSS 에디션 무료"** — 비용 우려 선제 차단.
5. **"빅뱅 아니다, 복잡 조회부터 점진 이관"** — 한 트랜잭션 공존으로 리스크 최소화.
6. **솔직한 트레이드오프** — 더티 체킹/1차 캐시는 JPA에 남기는 하이브리드가 정석.

---

## 14. 참고

- jOOQ 공식 문서 — https://www.jooq.org/doc/latest/manual/
- jOOQ 라이선스/에디션 — https://www.jooq.org/legal/licensing
- Spring Boot + jOOQ 연동(`spring-boot-starter-jooq`) — Spring Boot Reference, Data 섹션
- QueryDSL Reference — http://querydsl.com/static/querydsl/latest/reference/html/
- QueryDSL 커뮤니티 포크 — https://github.com/OpenFeign/querydsl
- Lukas Eder(jOOQ 저자), "jOOQ vs. Hibernate/JPA" 블로그 시리즈 — https://blog.jooq.org/
