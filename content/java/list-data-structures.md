---
title: List (ArrayList vs LinkedList)
---

# List (ArrayList vs LinkedList)

![만화로 보는 요약 — 먼저 읽어보세요](/images/wiki/list-data-structures.png)

*만화로 보는 요약 — 먼저 읽어보세요*

`java.util.List`는 순서가 있고 중복을 허용하는 컬렉션 인터페이스다. 실무에서 마주치는 구현체는 대부분 `ArrayList`와 `LinkedList` 두 가지이며, 내부 자료구조가 완전히 달라 성능 특성도 반대로 갈린다.

## List란? (자료구조 관점)

**List**(=**Sequence**)는 순서가 있고 인덱스로 원소에 접근 가능한 선형 자료구조의 추상 개념이다. 구현 전략은 근본적으로 두 갈래로 갈린다.

- **배열 기반 (Contiguous)**: 원소를 메모리상 연속된 블록에 나란히 저장. `주소 = 시작 주소 + 인덱스 × 원소 크기`로 즉시 계산 가능 → 랜덤 접근 O(1). 대신 중간에 끼워 넣으려면 뒤 원소를 통째로 밀어야 함.
- **연결 기반 (Linked)**: 원소를 노드로 감싸고 포인터로 체인 연결. 메모리 어디에 흩어져 있어도 상관없음 → 삽입/삭제는 포인터만 갈아끼우면 O(1). 대신 n번째 원소를 찾으려면 처음부터 링크를 따라가야 함.

이 두 전략은 서로의 정확한 트레이드오프 반대편에 있다: **배열은 접근이 싸고 삽입/삭제가 비싸며, 연결 리스트는 그 반대**. Java의 `ArrayList`/`LinkedList`는 각각의 교과서적 구현이다.

## List 인터페이스 계층 (Java)

```
Collection
  └─ List (인덱스 기반 순서, 중복 허용)
       ├─ ArrayList             — 동적 배열
       ├─ LinkedList             — 이중 연결 리스트 (Deque도 구현)
       ├─ Vector                  — ArrayList + synchronized (레거시, 거의 안 씀)
       └─ CopyOnWriteArrayList — 쓰기 시 배열 복사 (동시성 안전 버전)
```

## ArrayList — 동작 방식

내부적으로 `Object[] elementData` 배열 하나를 들고 있고, `size`(실제 원소 수)와 `capacity`(배열 길이)를 분리해서 관리한다.

- **용량 증가**: 꽉 차면 새 배열을 `capacity × 1.5`(OpenJDK 기준 `oldCapacity + (oldCapacity >> 1)`)로 만들고 `Arrays.copyOf`로 기존 원소를 통째로 복사한 뒤 교체. 이 복사가 O(n)이지만, 매번 발생하는 게 아니라 용량이 찰 때만 발생하므로 `add` 전체를 상각(amortized)하면 O(1).
- **`get(index)` — O(1)**: 배열 인덱스 접근이라 즉시 계산.
- **`add(element)` (끝에 추가) — 상각 O(1)**.
- **`add(index, element)` / `remove(index)` (중간) — O(n)**: 뒤 원소들을 한 칸씩 밀거나 당김 (`System.arraycopy`).
- **`RandomAccess` 마커 인터페이스**: `ArrayList`는 이 빈 인터페이스를 구현해 "나는 인덱스 접근이 O(1)"이라고 알고리즘에 알린다. 예를 들어 `Collections.binarySearch`는 이 마커를 보고 인덱스 기반 이진 탐색을 쓰지만, `LinkedList`처럼 이게 없으면 순차 탐색으로 전략을 바꾼다.
- **fail-fast iterator**: 순회 중 구조가 바뀌면(`add`/`remove`) `modCount`가 달라져 다음 `next()` 호출에서 `ConcurrentModificationException`을 던진다. 동시성 보장이 아니라 버그 조기 발견용 안전장치.

## LinkedList — 동작 방식

각 원소를 `Node { prev, item, next }`로 감싸 체인으로 연결한 **이중 연결 리스트**. `first`/`last` 포인터를 따로 유지하며, `List`뿐 아니라 `Deque`(양방향 큐)도 구현한다.

- **`get(index)` — O(n)**: 무작정 head부터 따라가지 않고, `index < size/2`면 head에서, 아니면 tail에서 순회를 시작하는 최적화가 되어 있다 (최악 O(n/2)). 그래도 점근적으로는 O(n).
- **`first()`/`last()`, `addFirst`/`addLast`/`removeFirst`/`removeLast` — O(1)**: 포인터만 갈아끼우면 됨. `Deque`로서 스택/큐 용도에 적합한 이유.
- **`Iterator`로 위치를 이미 알고 있는 상태에서 `add`/`remove` — O(1)**: 탐색 없이 링크 교체만. (인덱스로 임의 위치에 삽입하는 `add(index, e)`는 그 위치까지 순회해야 하므로 여전히 O(n).)

## 선택 기준

| 상황 | 선택 |
|---|---|
| 인덱스로 랜덤 접근이 잦다 (`get(i)`) | `ArrayList` |
| 순회만 하고 조회는 안 한다 | `ArrayList` (캐시 지역성 우위 — 이유는 [부록: 메모리·캐시 관점](#부록-메모리캐시-관점-os-레벨) 참고) |
| 양 끝에서 추가/삭제가 잦다 (큐, 스택 용도) | `LinkedList` (또는 `ArrayDeque`가 더 빠른 경우가 많음) |
| 중간 삽입/삭제가 잦다 | 둘 다 위치 탐색에 O(n)이 필요해 큰 차이 없음 — `Iterator`로 위치를 유지한 채 삭제/삽입한다면 `LinkedList`가 유리 |

실무 기본값은 대부분 `ArrayList`다. "삽입/삭제가 잦으니 이론상 LinkedList가 유리하다"는 결론은 캐시 미스 비용을 빼먹은 것이라 실측하면 뒤집히는 경우가 흔하다 — 프로파일링 없이 단정하지 않는다.

## 동시성

`ArrayList`, `LinkedList` 모두 스레드 안전하지 않다. 여러 스레드가 동시에 수정하면 `ConcurrentModificationException`(fail-fast iterator)이나 데이터 손상이 발생할 수 있다. 동시성이 필요하면:

- 읽기가 압도적으로 많고 쓰기가 드물다 → `CopyOnWriteArrayList`
- 범용 동시성 리스트가 필요하다 → `Collections.synchronizedList(new ArrayList<>())` 또는 명시적 락

동시성 프리미티브 전반은 [Java 개요](/java) 참고.

---

## 부록: 메모리·캐시 관점 (OS 레벨)

"LinkedList가 이론상 O(1) 삽입인데도 실측하면 ArrayList보다 느린 경우가 많다"는 현상은 알고리즘 복잡도 표만 봐서는 설명이 안 된다. 원인은 메모리 배치와 하드웨어 캐시 동작에 있다.

### 메모리 배치

- **ArrayList**: 힙에 연속된 배열 블록 하나. JVM 배열 헤더(약 16바이트, 객체 헤더 12B + length 4B)가 전체 배열에 **한 번만** 붙는다. 원소 100만 개짜리 `ArrayList<Integer>`는 사실상 `int[]` 하나에 가까운 공간(오토박싱 캐시를 벗어나면 Integer 객체 참조 배열)만 차지.
- **LinkedList**: 원소마다 별도 `Node` 객체가 생긴다. 객체 헤더(12~16B) + `prev`/`next`/`item` 참조 3개(compressed oops면 4B×3=12B, 아니면 8B×3=24B) — 원소 하나당 최소 32~40바이트의 순수 오버헤드가 원소 자체 데이터와 별개로 붙는다. 100만 개면 오버헤드만 수십 MB.

### CPU 캐시와 지역성 (Locality)

CPU는 메모리를 한 번에 1바이트가 아니라 **캐시라인(보통 64바이트) 단위**로 가져온다.

- **ArrayList 순회**: 인접 원소가 물리적으로 같은 캐시라인 또는 바로 다음 라인에 있다. 하드웨어 프리페처가 순차 접근 패턴을 감지해 다음 라인을 미리 읽어두므로, 실제로는 캐시 미스가 거의 없이 순회된다.
- **LinkedList 순회**: 각 `Node`가 할당된 시점·순서에 따라 힙 여기저기 흩어진다. `next`를 따라갈 때마다 완전히 다른 메모리 주소를 참조할 가능성이 높다 — **포인터 체이싱(pointer chasing)**. 캐시 히트(L1, ~1ns)와 캐시 미스(메인 메모리, ~100ns)의 차이는 약 100배 수준이라, 원소 하나 방문할 때마다 이 미스 비용이 누적된다.

이것이 "삽입은 O(1)로 이론상 유리해 보이는 LinkedList가 실측 벤치마크에서는 ArrayList/ArrayDeque에 밀리는" 현상의 핵심 원인이다. Big-O는 "연산 횟수"만 세지, 그 연산이 캐시 히트인지 미스인지는 세지 않는다.

### 가상 메모리·페이징

- **ArrayList**: 용량이 부족해지면 더 큰 연속 블록을 요청하고 기존 데이터를 복사(`System.arraycopy`)한다. JVM 힙(가상 주소 공간)이 이미 확보한 영역 안이면 순수 메모리 연산이지만, 힙 자체를 늘려야 하면 OS에 추가 페이지(보통 4KB 단위)를 요청하는 시스템 콜과 페이지 폴트 비용이 발생한다. 다만 이후의 순차 접근은 TLB(가상→물리 주소 변환 캐시) 히트율이 높아 이 비용은 상각된다.
- **LinkedList**: 각 `Node`가 서로 다른 시점에 개별 할당되므로 여러 메모리 페이지에 걸쳐 흩어지기 쉽다. 순회할 때마다 다른 페이지를 오갈 확률이 ArrayList보다 높아 TLB 미스가 잦아진다 — 캐시 미스에 페이지 테이블 워크 비용까지 더해지는 셈.

### GC(가비지 컬렉션) 관점

- **ArrayList**: GC가 추적(mark)해야 할 객체가 backing array 1개(+원소 자체)로 적다.
- **LinkedList**: 원소 수만큼 `Node` 객체가 늘어나 GC의 mark 대상 객체 수가 원소 수에 비례해 증가한다. 객체 수가 많을수록 GC의 stop-the-world 일시정지 시간에 영향을 줄 여지가 커진다.

### 부록 요약

| 관점 | ArrayList | LinkedList |
|---|---|---|
| 메모리 배치 | 연속 블록 1개 | 원소마다 흩어진 Node |
| 순회 시 캐시 | 프리페처 친화적 (히트율 높음) | 포인터 체이싱 (미스 잦음) |
| 페이징/TLB | 순차 접근이라 상각됨 | 페이지 이동 잦아 TLB 미스↑ |
| GC 부담 | 객체 수 적음 | 원소 수만큼 객체 증가 |

**결론**: 알고리즘 교과서의 Big-O만으로 자료구조를 고르면 틀리기 쉽다. 실제 성능은 하드웨어 캐시·가상 메모리·GC까지 내려가서 봐야 설명된다 — 그래서 실무 기본값이 거의 항상 `ArrayList`인 것.

## Related

- [CountDownLatch](/java/countdownlatch) — 같은 `java.util` 계열의 동기화 도구
- [JPA N+1 문제](/spring/jpa-n-plus-one) — `@OneToMany`에서 컬렉션 타입으로 `List`를 쓸 때 흔히 만나는 함정
- [Operating System](/operating-system) — 캐시 지역성·가상 메모리·페이징의 OS 기본 개념
- [프로세스·스레드와 동기화](/operating-system/process-thread-synchronization) — 컨텍스트 스위칭과 메모리 계층 기초
