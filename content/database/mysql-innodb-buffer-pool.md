---
title: InnoDB Buffer Pool — OS 레벨까지
---

# InnoDB Buffer Pool — OS 레벨까지

> **한 줄 요약**: InnoDB는 테이블의 모든 row를 통째로 캐싱하는 게 아니라, **실제 접근된 16KB 페이지만** 메모리(buffer pool)에 적재하고, 메모리가 부족하면 **개량된 LRU**로 cold 페이지를 evict한다. 그 아래 OS는 가상메모리·페이지·TLB로 이 메모리를 관리한다.

발표용 흐름: **(1) 흔한 오해 → (2) 페이지 단위 캐싱 → (3) 개량 LRU → (4) OS 레벨(가상메모리/페이지캐시/Huge Page) → (5) 모니터링**.

---

## 1. 흔한 오해부터 깨기

| 오해 | 실제 |
|------|------|
| "테이블 전체 row를 메모리에 캐싱한다" | 접근된 **16KB 페이지**만 캐싱 |
| "데이터가 전부 메모리에 올라간다" | buffer pool 크기만큼만, **LRU로 hot working set만** 상주 |
| "단순 LRU로 관리한다" | **Young/Old 분리 LRU** (풀스캔 저항성) |
| "MySQL이 알아서 디스크에서 빨리 읽는다" | hit이면 메모리 접근, miss면 **디스크 random I/O**(수십~수백 µs ~ ms) |

`payment` 원장이 100GB인데 buffer pool이 8GB라면 전부 못 올린다. **자주 조회되는 부분(hot set)**만 메모리에 상주한다.

---

## 2. 캐싱 단위는 row가 아니라 page (16KB)

InnoDB는 디스크 데이터를 **페이지(기본 16KB)** 단위로 읽어 buffer pool에 올린다.

- 클러스터드 인덱스(테이블 본체), 세컨더리 인덱스, undo log — 전부 페이지 단위.
- `payment` row **하나**를 읽어도, 그 row가 들어있는 **16KB 페이지 전체**가 메모리에 올라온다.
- 따라서 한 페이지에 인접 row들이 같이 올라옴 → **정렬된 PK 순차 접근**이 유리(같은 페이지 재사용).

```
payment 원장 (디스크, 100GB)
        │  접근된 페이지만 ↑ (16KB씩)
   ┌────┴───────────────────────┐
   │   Buffer Pool (RAM, 8GB)    │
   │   - 최근 조회된 결제 페이지   │ ← Hot (상주)
   │   - 자주 쓰는 인덱스 페이지   │
   │   - dirty page (변경됐으나    │
   │     아직 디스크 미반영)       │
   └────────────────────────────┘
```

**페이지 상태 3가지** (발표 포인트):
- **Free**: 비어있는 페이지 프레임
- **Clean**: 디스크와 동일한 내용 (그냥 버려도 됨)
- **Dirty**: 메모리에서 변경됨 → 나중에 **flush**(background, checkpoint) 후에야 evict 가능

---

## 3. 왜 단순 LRU가 아닌가 — Young/Old 분리 LRU

순수 LRU면 **대용량 풀스캔/배치 쿼리 한 번**에 hot 페이지가 전부 밀려난다(*cache pollution*). InnoDB는 LRU 리스트를 둘로 나눠 이를 방어한다.

```
[ LRU List ]
 head                                        tail
 ┌─────────── Young (New) ~5/8 ───┬── Old ~3/8 ──┐
 │  자주 재접근되는 hot 페이지       │ 막 읽은 신규 페이지 │
 └────────────────────────────────┴───────────────┘
                                    ▲ 신규 진입       ▲ evict
```

1. 새로 읽은 페이지는 **Old sublist의 head**로 진입 (Young 아님!)
2. `innodb_old_blocks_time`(기본 1000ms) **이후에 또 접근**되어야 Young으로 승격
3. evict는 **tail(Old의 끝)**에서 발생

**효과**: 1회성 풀스캔 페이지는 Old에 잠깐 머물다 그대로 빠져나가고, hot 페이지(Young)는 보호된다 → **scan resistance**.

> 관련 파라미터: `innodb_old_blocks_pct`(Old 비율, 기본 37), `innodb_old_blocks_time`(승격 지연).

---

## 4. OS 레벨 — 이 메모리는 어떻게 관리되는가

buffer pool은 결국 **프로세스(mysqld)가 할당한 거대한 가상 메모리 영역**이다. 그 아래 OS 동작을 알아야 발표가 깊어진다.

### 4-1. 가상 메모리 · 페이지 · 페이지 폴트
- mysqld가 buffer pool 8GB를 잡으면 OS는 **가상 주소 공간**에 매핑할 뿐, 물리 RAM은 **실제 접근(touch) 시점**에 페이지 단위(보통 4KB)로 할당된다 → **demand paging**.
- InnoDB **16KB 페이지 1개 = OS 4KB 페이지 4개**로 구성됨에 유의.
- 처음 접근하는 가상 페이지 → **page fault** → 커널이 물리 프레임 할당. (DB의 "buffer pool miss → 디스크 read"와 OS의 "page fault"는 다른 계층의 사건임을 구분)

### 4-2. TLB와 주소 변환
- CPU는 가상→물리 주소 변환 결과를 **TLB(Translation Lookaside Buffer)**에 캐싱한다.
- buffer pool이 수십 GB로 커지면 4KB 페이지가 **수백만 개** → TLB miss 증가 → 변환 위해 page table walk → 성능 저하.
- 해결: **Huge Pages (2MB)**. `innodb_large_prefix`가 아니라 `large-pages=ON` + 리눅스 `vm.nr_hugepages` 설정. 페이지 수가 1/512로 줄어 **TLB 적중률↑**. 대용량 buffer pool 운영의 핵심 튜닝 포인트.

### 4-3. InnoDB는 왜 OS page cache를 안 믿고 자기 buffer pool을 두는가 (중요)
리눅스는 파일 I/O를 자동으로 **page cache**에 캐싱한다. 그런데 InnoDB는 **자체 buffer pool**을 또 둔다. 이유:

- **이중 버퍼링(double buffering) 회피**: 같은 데이터가 OS page cache + InnoDB buffer pool에 **2번** 올라가면 RAM 낭비. → InnoDB는 보통 **`O_DIRECT`**(`innodb_flush_method=O_DIRECT`)로 OS page cache를 우회하고 자기 buffer pool만 신뢰.
- **DB 특화 정책**: OS는 DB의 접근 패턴(인덱스 hot/cold, dirty page checkpoint)을 모른다. InnoDB가 직접 관리해야 Young/Old LRU·flush 타이밍을 최적화할 수 있다.
- **결론**: "OS도 캐싱, InnoDB도 캐싱" → 둘 다 켜면 메모리 중복. 그래서 **buffer pool을 크게(물리 RAM의 50~75%) + O_DIRECT**가 정석.

### 4-4. Swap — DB의 적
- buffer pool 페이지가 OS에 의해 **swap-out**(디스크로 내려감)되면, 메모리인 줄 알고 접근했다가 **디스크 I/O** 발생 → 최악의 지연.
- 대응: `vm.swappiness=1`(거의 0), buffer pool 크기를 RAM 한도 내로, 필요 시 `memlock`으로 페이지 고정.
- NUMA 장비에서는 한쪽 노드 메모리만 차서 swap이 도는 "**swap insanity**" 주의 → `innodb_numa_interleave=ON`.

---

## 5. 모니터링 — Buffer Pool Hit Rate

핵심 지표: **요청 대비 디스크 실제 read 비율**.

```sql
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';
-- Innodb_buffer_pool_read_requests : 논리 읽기 요청 총량 (메모리 포함)
-- Innodb_buffer_pool_reads         : 그 중 디스크에서 실제로 읽은 수 (miss)
```

```
Hit Rate = (1 - Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests) × 100
```

- 일반적으로 **99% 이상**을 목표. (OLTP 결제계 기준)
- 낮을 때 대응 순서: **(1) buffer pool 크기 상향** → (2) 인덱스/쿼리 튜닝으로 읽는 페이지 수 감소 → (3) Huge Page/O_DIRECT 등 OS 레벨 튜닝 → (4) `innodb_buffer_pool_instances`로 mutex 경합 분산.
- 워밍업: 재기동 시 hit rate가 뚝 떨어짐 → `innodb_buffer_pool_dump_at_shutdown` / `load_at_startup`로 페이지 목록 저장·복원.

---

## 발표 시 예상 꼬리질문 (대비용)

- "16KB 페이지에 row가 안 들어가면?" → 큰 row/BLOB은 **off-page(overflow) 저장**, 페이지엔 포인터만.
- "dirty page는 언제 디스크로?" → background flush + **checkpoint**(redo log 공간 확보), `innodb_io_capacity`로 속도 제어.
- "buffer pool vs redo log buffer?" → 전자는 데이터 페이지 캐시, 후자는 변경 로그(WAL)용 버퍼. 다른 메모리 영역.
- "OS page fault와 buffer pool miss 차이?" → 4-1 참고. 계층이 다른 사건.

## Related

- [MySQL DATETIME vs TIMESTAMP](/database/mysql-datetime-timestamp) — 같은 MySQL/InnoDB 스토리지 엔진 컨텍스트
- [Database](/database) — 도메인 인덱스
