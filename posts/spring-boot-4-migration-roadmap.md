---
title: Spring Boot 3에서 4로, "코드 변경 0"은 불가능하다
description: Jackson 2→3, JUnit 5→6, Hibernate 7이 한꺼번에 바뀌는 메이저 업그레이드. 목표를 "코드 변경 0"이 아니라 "동작 변경 0 + 테스트로 증명"으로 재정의해야 하는 이유와 3개월 로드맵을 정리했습니다.
date: 2026-06-28
category: 백엔드
hero: /images/blog/springboot-upgrade-roadmap.png
heroCaption: 만화로 보는 요약 — 먼저 읽어보세요
---

Spring Boot 4 업그레이드 로드맵을 작성하면서 가장 먼저 버린 것은 "코드 변경 없이 올리기"라는 목표였습니다. Spring Boot 3→4는 단순 버전 업이 아니라 생태계 전체가 함께 움직이는 메이저 변경이기 때문입니다.

## 무엇이 한꺼번에 바뀌는가

- **Jackson 2 → 3**: 패키지가 `com.fasterxml.jackson`에서 `tools.jackson`으로 바뀝니다. import 문 단위로 전부 깨집니다.
- **JUnit 5 → 6**: 테스트 코드도 예외가 아닙니다.
- **Hibernate 7 동반 업그레이드**: JPA 매핑과 쿼리 동작이 미묘하게 달라질 수 있습니다.
- **QueryDSL**: 5.0.0은 유지보수가 중단되어 openfeign 포크(querydsl 7.0)로 갈아타야 합니다. 흥미로운 건 첫 번째 깨짐이 런타임이 아니라 **APT(Q클래스 생성) 단계**에서 발생한다는 점입니다.

이 정도 범위면 "코드 변경 0"은 불가능합니다. 그래서 목표를 재정의했습니다.

> 목표는 "코드 변경 0"이 아니라 "**동작 변경 0**, 그리고 그것을 테스트로 증명"이다.

## 동작을 박제하는 법: Characterization 테스트

레거시 업그레이드의 모범사례는 Characterization(Golden Master) 테스트로 **현재 동작을 그대로 박제**하는 것입니다. 업그레이드 후에도 같은 입력에 같은 출력이 나오는지를 기계적으로 검증할 수 있습니다.

단, 함정이 하나 있습니다. 현재 동작을 박제하면 **기존 버그까지 함께 박제**됩니다. 그래서 알고 있는 버그는 `KNOWN-BUG`로 명시해 분리해야, 나중에 "버그를 고쳤더니 테스트가 깨졌다"는 역설을 피할 수 있습니다.

## 커버리지는 허영지표다

안전망의 품질을 커버리지 %로 판단하고 싶어지지만, 라인 커버리지는 "실행됐다"만 보장할 뿐 "검증됐다"를 보장하지 않습니다. 그래서 PITest 뮤테이션 테스트로 보완하기로 했습니다. 코드를 일부러 망가뜨렸을 때 테스트가 실패하는지를 보는 것이 진짜 안전망 검증입니다.

Jacoco를 붙이면서 배운 것 두 가지:

- Jacoco는 콘솔에 커버리지를 출력하지 않고 HTML/XML 파일만 생성합니다. `build -x test`로 빌드하면 test가 실행되지 않아 exec 파일이 없고, 커버리지는 0이 됩니다. **커버리지는 테스트가 실제로 실행돼야 나옵니다.**
- 멀티모듈에서는 모듈별 `jacocoTestReport`(자동)와 root의 합산 `JacocoReport` 태스크가 공존할 수 있습니다. 다만 합산 태스크는 build 그래프에 묶이지 않으므로 명시적으로 호출해야 합니다.

```groovy
// root build.gradle — 합산 리포트는 명시 호출 필요
tasks.register('jacocoAggregateReport', JacocoReport) {
    dependsOn subprojects.collect { it.tasks.withType(Test) }
    // ...
}
```

```bash
./gradlew clean test jacocoAggregateReport
```

## 순서가 리스크를 결정한다

로드맵은 3개월, 순서는 이렇게 잡았습니다.

1. **JDK 21 먼저** — Spring Boot 4의 베이스라인. JVM만 먼저 올리면 프레임워크 업그레이드의 리스크를 절반으로 쪼갤 수 있습니다.
2. **테스트 안전망 구축** — Jacoco + Characterization 테스트 + CI 파이프라인.
3. **프레임워크 업그레이드** — Jackson/JUnit/Hibernate/QueryDSL을 안전망 위에서 교체.

업그레이드는 한 번의 큰 점프가 아니라, 되돌릴 수 있는 작은 단계의 연속이어야 합니다.
