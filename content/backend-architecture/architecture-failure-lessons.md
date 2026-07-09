---
title: "아키텍처 실패 사례와 교훈"
category: "backend-architecture"
tags: [failure, postmortem, lessons-learned, microservices, migration, fitness-function, conway]
created: 2026-07-08
updated: 2026-07-08
---

# 아키텍처 실패 사례와 교훈

방법론([소규모 팀 아키텍처 방법론](/backend-architecture/architecture-methodology-small-team))을 어겼을 때 실제로 무슨 일이 벌어지는가. 유명 사례를 방법론 관점에서 재해석한다. 각 사례의 교훈은 방법론의 어느 축으로 되돌아오는지 매핑했다.

---

## 1. Knight Capital — 45분에 $440M (2012)

**무슨 일**: 2012-08-01, 미국 최대 마켓메이커 중 하나가 배포 스크립트가 8대 서버 중 1대에 신규 코드를 복사하지 못하면서, 8년 전 폐기했던 dead code(Power Peg)가 재사용된 플래그 비트로 되살아났다. 45분간 400만 건의 의도치 않은 주문 → **$440M 손실**, 사실상 회사 소멸.

**방법론 관점 근본 원인**:
- **자동화된 배포 후 검증(fitness function) 부재** — 8대가 동일 상태인지 확인하는 장치가 없었다.
- **Dead code를 삭제하지 않고 주석 처리** — 리스크를 코드에 남겨둠.
- 실시간 킬 스위치(circuit breaker) 부재.

**교훈**:
- **[Continual Fitness Function](/backend-architecture/architecture-methodology-small-team)**: 배포 정합성·불변식을 자동 검증하라. "사람이 확인" = 검증 없음.
- Dead code는 주석이 아니라 **삭제**. 남긴 리스크는 언젠가 발동한다.
- 금융 시스템에 **킬 스위치는 필수 품질속성** (`(H,H)` 후보).

> 결제 게이트웨이 대입: 배포 후 "모든 인스턴스 버전 일치 + outbox 폴러 정상"을 검증하는 헬스체크가 곧 Knight를 막는 fitness function.

---

## 2. Segment — 마이크로서비스 → 모놀리스 회귀 (2018~2020)

**무슨 일**: 초기에 50개 이상 마이크로서비스로 분리. 3년 뒤 운영 부담이 감당 불가 수준이 되어 다시 모놀리스로 통합(Centrifuge로 큐 단일화, destination 코드를 단일 레포로).

**방법론 관점 근본 원인**:
- **Conway 법칙 위반** — 팀 규모 대비 서비스가 과도. 서비스 간 통신 디버깅에 시간을 다 씀.
- 마이크로서비스를 근본 문제의 해결책이 아니라 **밴드에이드**로 사용.

**교훈**:
- **역콘웨이 전략**: 팀이 감당할 수 있는 배포 단위 수를 넘지 마라. 서비스 수 > 팀 수면 위험 신호.
- "모듈성"과 "물리적 분리"는 다르다. **[모듈러 모놀리스](/backend-architecture/architecture-methodology-small-team)** 로 모듈성을 얻고 분리 비용은 피할 수 있다.
- 분리는 **리스크가 그것을 정당화할 때만**. "언젠가 필요할지도"(YAGNI 위반)는 근거가 아니다.

---

## 3. Amazon Prime Video — 서버리스/마이크로서비스 → 모놀리스, 비용 90%↓ (2023)

**무슨 일**: 실시간 스트림 품질 모니터링 도구를 AWS Step Functions + 분산 컴포넌트로 구축. 중간 산출물을 S3에 읽고 쓰는 대량 I/O와 상태 전이 비용이 폭발. 모든 컴포넌트를 **단일 프로세스(ECS 태스크)로 합쳐 인메모리 전달** → 운영비 90% 절감.

**방법론 관점 근본 원인**:
- **절충점 오판** — 이 워크로드는 컴포넌트 간 **고빈도 데이터 전달**이 특성인데, 분산은 그 경로에 네트워크·스토리지 비용을 부과.
- 도구(서버리스)를 워크로드 특성보다 먼저 선택.

**교훈**:
- **품질 속성 시나리오를 먼저 써라**: "초당 수천 프레임을 컴포넌트 간 전달" 시나리오를 썼다면 분산 오버헤드가 절충점으로 드러났을 것.
- 마이크로서비스/서버리스는 **기본값이 아니라 트레이드오프**. 데이터 지역성(data locality)이 중요한 워크로드엔 모놀리스가 우월.
- 단, 이건 "마이크로서비스는 나쁘다"가 아니라 **"맥락이 결정한다"** 는 사례. (조직 확장성 관점에선 여전히 유효할 수 있음)

---

## 4. TSB Bank — 빅뱅 코어뱅킹 이관 참사 (2018)

**무슨 일**: Lloyds 시스템에서 신규 코어뱅킹(Proteo4UK)으로 **빅뱅 방식** 이관. 5일간 520만 고객 상당수가 로그인 불가, 잔액 오류, **타인 계좌가 보이는** 사고까지. 정상화에 8개월, 규제 벌금 £48.65M, 고객 배상 £32.7M, CIO 개인 벌금, CEO 사임.

**방법론 관점 근본 원인**:
- **빅뱅 이관** — Strangler Fig 같은 점진적 이관 대신 한 번에 전환.
- **프로덕션 환경 완전 복제 실패**, 데이터 테스트 시간 부족.
- 마감일이 리스크가 아니라 **정해진 일정**에 의해 결정됨 (BDUF + Waterfall의 결합).
- 70개+ 서드파티 의존, 이관 중 신기능 추가.

**교훈**:
- **점진적 이관(Strangler Fig)**: 한 번에 바꾸지 말고 라우팅으로 조금씩 넘긴다. 롤백 가능성을 항상 유지.
- **리스크 주도 일정**: 일정이 리스크를 이기면 재앙. "언제까지"가 아니라 "무엇이 검증되면"으로 게이트.
- 프로덕션 동등 환경에서의 **데이터 이관 테스트는 fitness function** — 대사 불일치가 0일 때만 전환.

> 이 프로젝트(망분리 문서 기반 개발)에 직접적 교훈: 개발망 이관 시에도 빅뱅 금지, 검증 게이트 우선.

---

## 5. 반복되는 안티패턴 (이름을 알면 피한다)

| 안티패턴 | 증상 | 방법론 처방 |
|---------|------|------------|
| **Distributed Monolith** | 마이크로서비스인데 서로 강결합, 동시 배포 필요 | Bounded Context로 경계 재설정, 동기 호출 최소화 |
| **Big Ball of Mud** | 경계 없는 코드, 변경이 전방위 전파 | L3 결합도 fitness function(ArchUnit) |
| **Second System Effect** (Brooks) | 첫 성공 후 2번째 시스템에 기능 과적재 | 리스크 주도로 (H,H)만, YAGNI로 나머지 억제 |
| **Architecture Theater** | 리스크와 무관한 문서·다이어그램 | 리스크 레지스터 없는 설계는 중단 |
| **Resume-Driven Development** | 팀에 안 맞는 최신 기술 도입 | 역콘웨이: 팀 규모가 기술을 정당화하는가? |

---

## 공통 교훈 3줄

1. **거의 모든 재앙은 "리스크 없는 곳에 과투자 + 리스크 있는 곳에 무투자"의 조합**이다. → 리스크 주도.
2. **분산은 기본값이 아니다.** 팀 규모(Conway)와 워크로드 특성(데이터 지역성)이 정당화할 때만. → Segment/Prime Video.
3. **검증되지 않은 전환은 재앙이다.** 자동 fitness function과 점진적 이관이 안전망. → Knight/TSB.

## Related

- [소규모 팀을 위한 아키텍처 도출 방법론](/backend-architecture/architecture-methodology-small-team) — 이 교훈들이 되돌아오는 방법론
- [Transactional Outbox Pattern](/backend-architecture/transactional-outbox-pattern) — 정합성 안전망
- [DDD + Hexagonal Architecture](/backend-architecture/ddd-hexagonal-architecture) — 경계 설정

## 출처

- Knight Capital: [Market Histories](https://www.markethistories.com/en/the-knight-capital-meltdown-how-45-minutes-of-bad-code-cost-440-million-2012), [PRMIA Case Study](https://prmia.org/common/Uploaded%20files/eAI/PRMIA%20Case%20study%20-%20Knight%20Trading.pdf)
- Segment: [InfoQ — To Microservices and Back Again](https://www.infoq.com/news/2020/04/microservices-back-again/)
- Prime Video: [The New Stack — Return of the Monolith](https://thenewstack.io/return-of-the-monolith-amazon-dumps-microservices-for-video-monitoring/), [devclass](https://devclass.com/2023/05/05/reduce-costs-by-90-by-moving-from-microservices-to-monolith-amazon-internal-case-study-raises-eyebrows/)
- TSB: [Computer Weekly](https://www.computerweekly.com/news/252528519/TSB-hit-with-huge-fine-after-IT-migration-disaster), [TSB 독립 리뷰(Slaughter and May)](https://www.tsb.co.uk/news-releases/slaughter-and-may.html)
