---
title: Java
---

# Java

Java 언어·표준 라이브러리 학습 노트. 컬렉션 프레임워크, `java.util.concurrent`(JUC) 동시성 프리미티브 등을 다룬다.

## Topics

- [List (ArrayList vs LinkedList)](/java/list-data-structures) — 동적 배열 vs 연결 리스트, 선택 기준과 시간복잡도 (부록: 캐시·가상 메모리·GC 관점 OS 레벨 deep dive)
- [CountDownLatch](/java/countdownlatch) — N개 스레드를 한 지점에서 일제히 출발/대기시키는 1회용 동기화 래치

## 앞으로 채울 주제 (학습 로드맵)

**Collections**
- `HashMap` 내부 구조 (버킷, 트리화, 리사이징)
- `Set` 계열 (`HashSet` vs `TreeSet` vs `LinkedHashSet`)
- `ArrayDeque` vs `LinkedList` (큐/스택 용도 비교)

**Concurrency**
- `ExecutorService` / 스레드 풀 (`ThreadPoolExecutor`, `newFixedThreadPool` vs `newVirtualThreadPerTaskExecutor`)
- `CyclicBarrier` / `Semaphore` / `Phaser` (다른 synchronizer 비교)
- `AtomicLong` / CAS / `LongAdder`
- `ReentrantLock` / `ReadWriteLock` / `StampedLock`
- `ConcurrentHashMap` / `BlockingQueue`
- `CompletableFuture`
- 가상 스레드(Virtual Threads, Java 21) 심화

## Related

- [Spring](/spring) — 동시성 테스트, 트랜잭션, JPA 컬렉션 매핑
- [Backend Architecture](/backend-architecture) — 동시성 제어 설계
