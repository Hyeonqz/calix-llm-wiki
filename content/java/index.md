---
title: Java Concurrency
---

# Java Concurrency

`java.util.concurrent`(JUC) 라이브러리와 동시성 프리미티브 학습 노트. 동기화 도구(synchronizer), 스레드 풀, 락, 원자 연산, 가상 스레드 등.

## Topics

- [CountDownLatch](/java-concurrency/countdownlatch) — N개 스레드를 한 지점에서 일제히 출발/대기시키는 1회용 동기화 래치

## 앞으로 채울 주제 (학습 로드맵)

- `ExecutorService` / 스레드 풀 (`ThreadPoolExecutor`, `newFixedThreadPool` vs `newVirtualThreadPerTaskExecutor`)
- `CyclicBarrier` / `Semaphore` / `Phaser` (다른 synchronizer 비교)
- `AtomicLong` / CAS / `LongAdder`
- `ReentrantLock` / `ReadWriteLock` / `StampedLock`
- `ConcurrentHashMap` / `BlockingQueue`
- `CompletableFuture`
- 가상 스레드(Virtual Threads, Java 21) 심화

## Related

- [Spring](/spring) — 동시성 테스트, 트랜잭션
- [Backend Architecture](/backend-architecture) — 동시성 제어 설계
