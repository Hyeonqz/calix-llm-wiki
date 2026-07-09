---
title: "소규모 팀을 위한 아키텍처 도출 방법론"
category: "backend-architecture"
tags: [architecture, methodology, risk-driven, C4, ATAM, evolutionary-architecture, conway, small-team]
created: 2026-07-08
updated: 2026-07-08
---

# 소규모 팀을 위한 아키텍처 도출 방법론

"상위 레이어에서 하위 레이어로 내려가며 병목을 찾아 해결한다"는 top-down 접근을, 감이 아닌 **방법론**으로 만드는 법. 소규모 팀(1~5명) 기준.

핵심 명제 하나: **아키텍처 노력은 "실패 리스크가 큰 곳"에만 투자한다.** 병목 = 리스크 = 아키텍처를 투자할 곳. 병목이 없는 레이어는 손대지 않는다.

---

## 1. 리스크 주도 설계 (엔진)

George Fairbanks, *Just Enough Software Architecture*. 아키텍처는 목적이 아니라 **리스크를 낮추는 수단**이다.

```
리스크 = 발생확률 × 영향도

루프: ① 리스크 식별 → ② 기법 적용 → ③ 재평가 → 낮아졌으면 멈춘다
```

두 안티패턴 사이의 중간을 잡는 것이 핵심:

| 안티패턴 | 증상 | 소규모 팀의 함정 |
|---------|------|-----------------|
| Architecture Theater | 리스크와 무관한 다이어그램·문서 남발 | "대기업 아키텍처 흉내" |
| Code-Only | 아키텍처를 아예 무시, 코드만 | 병목이 쌓여 Big Ball of Mud |

**결제 도메인 리스크 레지스터 예시**

| 리스크 | 확률 | 영향 | 기법 |
|--------|------|------|------|
| 중복 결제 / double-spend | 높음 | 치명적 | 멱등키, [Outbox](/backend-architecture/transactional-outbox-pattern), exactly-once |
| 외부(카드사/PG) 장애 전파 | 중간 | 높음 | Circuit Breaker, Bulkhead, Timeout Budget |
| 정산 트랜잭션 경계 | 중간 | 치명적 | Saga + Outbox + 대사(reconciliation) |
| 카드정보 노출 (PCI-DSS) | 낮음 | 치명적 | 토큰화, Vault, 망분리 |

확률이 낮아도 영향이 치명적이면(카드정보) 투자하고, 확률이 높아도 영향이 작으면 코드로만 처리한다. 이 표가 곧 "어디까지 하위 레이어로 하강할지"의 지도다.

---

## 2. C4 모델 (top-down 하강 경로)

Simon Brown의 C4는 top-down 방식 자체를 방법론화한 것. 4개 층을 위에서 내려가며 각 층에서 **"이 층의 병목/리스크는 무엇인가?"** 만 묻는다.

| 레벨 | 보는 것 | 찾는 병목 |
|------|---------|-----------|
| **L1 Context** | 시스템 ↔ 외부(PG·카드사·정산·사용자) | 결합·의존 리스크: 외부 장애가 우리를 죽이는가? |
| **L2 Container** | 배포 단위 + Kafka/Redis/Vault | 확장성·가용성: 어디가 상태를 갖는가? SPOF는? |
| **L3 Component** | 모듈 내부 | 응집도·결합도: 변경이 격리되는가 번지는가? |
| **L4 Code** | 클래스/패턴 | 국소 병목: 리스크 큰 곳만 여기까지 |

**규율: L4까지 항상 내려가지 않는다.** 리스크 낮은 컨테이너는 L2에서 멈추고, 리스크 큰 경로(결제 승인 트랜잭션)만 L4까지 판다. 이 **선택적 하강**이 top-down의 본질.

---

## 3. ATAM 경량판 (리스크를 정밀하게)

Architecture Tradeoff Analysis Method(SEI). 정식판은 다일 워크숍이라 무겁고, 소규모 팀은 핵심 도구만 쓴다.

**① 품질 속성 시나리오 6요소** — 막연한 병목을 측정 가능한 계약으로:

```
[자극원]   카드사 승인 API가
[자극]     3초간 지연될 때
[대상]     결제 승인 서비스가
[환경]     피크 500 TPS 상황에서
[응답]     사용자 스레드 블로킹 없이 타임아웃 폴백 반환
[측정]     p99 4초 이내, 유실 0건
```

**② 민감점 / 절충점**

- **민감점(Sensitivity Point)**: 하나의 결정이 하나의 품질속성을 크게 좌우 (예: 승인 스레드 풀 크기 = 처리량)
- **절충점(Tradeoff Point)**: 하나의 결정이 여러 품질속성을 상충되게 건드림 ← **아키텍처의 핵심 전장**
  - 승인을 **동기**로 → 정합성 ↑, 가용성 ↓ (외부 장애 전파)
  - 정산을 **Kafka 비동기**로 → 가용성·확장성 ↑, 즉시 정합성 ↓ (최종적 일관성)

**③ 효용 트리(Utility Tree)** — top-down 그 자체. 품질속성을 트리로 펼치고 (중요도, 난이도)를 매겨 `(H,H)`만 집중:

```
효용
├─ 가용성 → 카드사 장애 격리        (H, H) ★
├─ 정합성 → 중복결제 0 / 멱등        (H, H) ★
├─ 성능   → 승인 p99 < 2s           (H, M)
└─ 보안   → PCI-DSS 카드정보         (H, M)
```

소규모 팀은 `(H,H)` 두세 개만 제대로 하면 된다. 나머지는 평범하게.

---

## 4. 진화적 아키텍처 (병목을 다시 안 생기게 고정)

Ford/Parsons/Kua, *Building Evolutionary Architectures*. 핵심 도구는 **fitness function**: 아키텍처 특성을 자동 측정·강제하는 장치. 한 번 해결한 병목이 리팩터링으로 되살아나는 걸 막는다.

| 축 | 종류 | 결제 예시 |
|----|------|-----------|
| 범위 | Atomic / Holistic | Atomic: 의존 방향 규칙 / Holistic: 승인 p99 |
| 시점 | Triggered / Continual | Triggered: ArchUnit(CI) / Continual: 정산 대사 배치 |
| 성격 | Static / Dynamic | Static: 커버리지 80% / Dynamic: 부하별 SLA |

**대사(Reconciliation)를 fitness function으로 격상**하는 것이 결제의 백미: "우리 원장 합계 = 카드사 원장 합계"를 매일 검증하는 배치는 사실 정합성 아키텍처의 적합도 함수다. 불일치 = 아키텍처가 깨졌다는 신호.

```java
// Atomic / Triggered — ArchUnit으로 의존 방향 고정
@ArchTest
static final ArchRule 계층_의존_방향 = layeredArchitecture()
    .layer("gateway").definedBy("..gateway..")
    .layer("external").definedBy("..external..")
    .whereLayer("gateway").mayNotBeAccessedByAnyLayer();
```

---

## 5. Conway 법칙 (팀 적합성 = 제약 조건)

> 시스템 구조는 그것을 만든 조직의 커뮤니케이션 구조를 닮는다.

**역콘웨이 전략**: 팀 구조에 맞는 아키텍처를 고른다. 소규모 팀의 결론은 거의 항상 **모듈러 모놀리스**:

- 마이크로서비스는 "팀당 서비스 하나"일 때만 이득. 팀이 하나인데 서비스가 4개면 분산 시스템의 비용만 지불하고 이득은 0 → [실패 사례](/backend-architecture/architecture-failure-lessons) 참고.
- 모듈 경계([DDD Bounded Context](/backend-architecture/ddd-hexagonal-architecture))는 코드로 긋되, 배포 단위(Architectural Quantum)는 최소화.

콘웨이 법칙은 전체 루프에 걸린 제약이다 — 팀이 감당 못 하는 아키텍처는 아무리 우아해도 리스크.

---

## 6. 전체 루프

```
① ATAM 효용트리   위에서부터 품질속성 → (H,H) 병목으로 수렴
② 리스크 레지스터  병목을 확률×영향으로 정량화, 기법 선택
③ 리스크 주도 적용 리스크 큰 가지만 L4까지, 나머지 평범하게
④ Fitness Function 해결한 병목을 ArchUnit·대사·계약테스트로 고정
⑤ 운영 측정        Continual FF가 새 리스크 발견 → ①로 순환
        (Conway 법칙이 전 과정의 제약 조건)
```

---

## 7. 방법론 트레이드오프 & 대안

깊게 들어가려면 각 축의 대안을 알아야 한다. "정답"이 아니라 **팀 규모/리스크에 맞는 선택**이다.

**문서화 방법론**

| 방법론 | 성격 | 소규모 팀 적합성 |
|--------|------|-----------------|
| **C4** | 4계층 하강, 경량 | ★★★ top-down에 최적, 진입장벽 낮음 |
| 4+1 View (Kruchten) | 5개 뷰(논리/개발/프로세스/물리/시나리오) | ★★ 완전하나 무거움, 대형 조직용 |
| arc42 | 12섹션 템플릿 | ★★ 체계적이나 채우기 부담 |
| UML 전면 | 정밀 표기 | ★ 유지보수 비용 과다, 실무 외면 |

**설계 투자 시점**

| 방법론 | 입장 | 리스크 |
|--------|------|--------|
| **리스크 주도** | 리스크 있는 곳만 선설계 | 균형점. 권장 |
| BDUF (Big Design Up Front) | 전부 선설계 | 요구 변화에 취약, 낭비 (→ Waterfall 실패) |
| YAGNI / Emergent Design | 전부 후설계, 리팩터링 의존 | 치명 리스크(결제 정합성)를 놓칠 수 있음 |

핵심: 결제·금융은 순수 Emergent Design이 위험하다. **정합성·보안 같은 (H,H)는 반드시 선설계**하고, 나머지는 창발적으로.

**아키텍처 평가**

| 방법론 | 무게 | 용도 |
|--------|------|------|
| **품질 속성 시나리오만** | 매우 가벼움 | 소규모 팀 일상 |
| Lightweight ATAM (LAAM) | 가벼움 | 반나절 워크숍 |
| 정식 ATAM | 무거움 | 다일 워크숍, 대형 시스템 |
| DCAR (결정 중심) | 중간 | ADR과 결합 시 유용 |

**품질 강제**

| 방법론 | 자동화 | 회귀 방지 |
|--------|--------|-----------|
| **Fitness Function (ArchUnit 등)** | 자동 | ★★★ CI에서 강제 |
| 코드 리뷰 | 수동 | ★ 사람 의존, 누락 |
| 정적 게이트 (SonarQube) | 반자동 | ★★ 일반 품질엔 좋으나 아키텍처 규칙 표현력 약함 |

---

## 결론 (한 문장)

**C4로 위에서부터 내려가되, ATAM으로 병목을 `(H,H)`로 정밀화하고, 리스크 주도로 거기에만 투자하며, 진화적 아키텍처로 고정하고, Conway 법칙으로 팀이 감당 가능한 선을 지킨다.** 결정은 ADR로 남긴다.

## Related

- [아키텍처 실패 사례와 교훈](/backend-architecture/architecture-failure-lessons) — 방법론을 어겼을 때 무슨 일이 벌어지는가
- [DDD + Hexagonal Architecture](/backend-architecture/ddd-hexagonal-architecture) — 모듈 경계를 코드로 긋는 법
- [Transactional Outbox Pattern](/backend-architecture/transactional-outbox-pattern) — 정합성 리스크 기법
- [Application Layer Response Models](/backend-architecture/application-layer-response-models) — 계층 경계 설계
