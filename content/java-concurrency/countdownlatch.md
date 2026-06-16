---
title: CountDownLatch
---

# CountDownLatch

`java.util.concurrent.CountDownLatch` — **카운터가 0이 될 때까지 스레드를 대기**시키는 1회용(one-shot) 동기화 도구. "모두 준비되면 동시에 출발" 또는 "여러 작업이 끝날 때까지 기다림"에 쓴다.

## 핵심 API

```java
CountDownLatch latch = new CountDownLatch(N);  // N으로 초기화
latch.await();      // 카운터가 0이 될 때까지 블록 (대기 스레드)
latch.countDown();  // 카운터를 1 감소 (0이 되면 await 중인 스레드 전원 해제)
latch.getCount();   // 현재 카운터
latch.await(t, unit); // 타임아웃 버전 (무한 대기 회피)
```

- **단방향·1회용:** 카운터는 줄기만 하고 **리셋 불가**. 0이 되면 그 뒤 `await()`는 즉시 통과. 반복하려면 [CyclicBarrier](/java-concurrency/index)를 쓴다.
- `countDown()`은 **여러 스레드가 동시에 호출해도 안전**(원자적).

## 두 가지 대표 사용 패턴

### 1) "끝날 때까지 기다리기" (latch = N, 메인이 await)
N개 작업이 모두 끝나길 메인 스레드가 기다린다.
```java
CountDownLatch done = new CountDownLatch(N);
for (int i = 0; i < N; i++) {
  pool.submit(() -> { try { work(); } finally { done.countDown(); } });
}
done.await();   // N개 작업이 전부 countDown 할 때까지 대기
```
> `countDown()`은 **반드시 `finally`** 에. 작업이 예외로 죽어도 카운트가 줄어야 `await()`가 영원히 안 막힌다.

### 2) "일제히 출발" (start latch = 1, 워커가 await) — 동시성 테스트의 핵심
모든 워커를 한 줄에 세운 뒤 **동시에** 풀어 진짜 경합(race)을 만든다. 보통 래치 3개를 조합한다:

```java
CountDownLatch ready = new CountDownLatch(N);  // 전원 대기 진입 확인용
CountDownLatch start = new CountDownLatch(1);  // 출발 신호
CountDownLatch done  = new CountDownLatch(N);  // 전원 종료 확인용

for (int i = 0; i < N; i++) {
  executor.submit(() -> {
    ready.countDown();        // "나 준비됨"
    try {
      start.await();          // 출발 신호 대기 (전원 여기 모임)
      criticalSection();      // ← 모두 동시에 진입 = 진짜 경합
    } finally {
      done.countDown();
    }
  });
}
ready.await();      // 전원이 대기 진입할 때까지
start.countDown();  // 일제 출발!
done.await();       // 전원 종료 대기
```

**왜 이 패턴이어야 경합이 검증되나:** 그냥 N개를 submit하면 먼저 시작된 작업이 끝나버려 동시에 임계 구역에 있는 스레드가 적다. `start` 래치로 **전원을 같은 순간에 진입**시켜야 "10,000개가 동시에 같은 자원을 친다"는 상황이 재현된다.

## ⚠️ 함정 — 고정 스레드 풀 + await = 데드락

위 "일제 출발" 패턴을 **고정 크기 풀**로 돌리면 데드락이 난다:

```java
ExecutorService pool = Executors.newFixedThreadPool(64);  // ❌ 위험
// N = 10,000 태스크 제출
```
- 풀은 동시에 **64개만** 실행 → 그 64개가 전부 `start.await()`에서 블록.
- 나머지 9,936개는 **풀에 빈 스레드가 없어 실행조차 안 됨** → `ready.countDown()`을 못 부름.
- `ready`가 영원히 0이 안 됨 → `ready.await()`가 안 풀림 → `start.countDown()`도 호출 안 됨 → **영구 대기(데드락).**

**해결: 가상 스레드(Java 21)**
```java
ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor();  // ✅
```
- 가상 스레드는 `await()`로 블록되면 **캐리어(OS) 스레드를 점유하지 않고 양보(park)** → 10,000개를 전부 띄워도 OS 스레드 몇 개로 충분.
- 전원이 `ready`를 채우고 `start`에서 일제 출발 → 진짜 경합 성립.
- 대안(가상 스레드 없을 때): 플랫폼 스레드 10,000개 직접 생성 → 스레드당 스택 ~1MB × 1만 = **~10GB → OOM 위험**. 그래서 블로킹 동시성 테스트엔 가상 스레드가 적합.

> 교훈: **블로킹 동기화 패턴(latch)에서 "동시 진입 수 > 풀 크기"면 데드락.** 모든 태스크가 동시에 블록될 수 있어야 한다면 풀 크기가 태스크 수 이상이거나, 가상 스레드를 써야 한다.

## 실전 맥락 (쿠폰 발급 동시성 테스트)

선착순 쿠폰 발급에서 "10,000 동시 요청 → 정확히 1,000개만 발급"을 검증할 때 이 패턴을 썼다. `start` 래치로 1만 가상 스레드를 일제 출발시켜 Redis 원자 발급의 정확성을 실증. 동시성 제어 설계 맥락은 [Backend Architecture](/backend-architecture)와 연결된다.

## Related

- [Java Concurrency 개요](/java-concurrency) — JUC 학습 로드맵(CyclicBarrier·Semaphore·ExecutorService 등)
- [Backend Architecture](/backend-architecture) — 동시성 제어·직렬화 설계
- [Spring: 단위 테스트 vs 통합 테스트](/spring/unit-test-vs-integration-test) — 동시성/통합 테스트 전략
