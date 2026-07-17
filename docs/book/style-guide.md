# 『약속된 데이터』 삽화 스타일 가이드

> 이 문서는 렌더 대상이 아닌 **소스 문서**다. 모든 장의 삽화 프롬프트는 여기 정의된
> 프리픽스·캐릭터·팔레트를 참조해 만든다. 목표는 단 하나 — **18장에 걸쳐 화풍·캐릭터·색감이
> 한 사람이 그린 것처럼 일관되게** 나오는 것.

작성: 토스·카카오페이 20년차 시각디자이너 관점
대상 툴: **Midjourney (확정, 2026-07-17)** — 프롬프트는 영어, 파라미터는 §5 참조
hero 종횡비: **16:9 (확정)**
연결 경로: `public/images/books/transaction/{장번호}/` → 마크다운에서 `/images/books/transaction/{장번호}/...`

---

## 0. 이 책 삽화의 정체성 (한 줄)

**"기술서의 품격을 지킨, 토스식 편집 일러스트."** 만화(컷·말풍선)가 아니라,
개념을 은유 하나로 압축한 **플랫 에디토리얼 일러스트**. 장식이 아니라 **설명의 일부**다.

---

## 1. 아트 디렉션 — 5원칙 (북극성)

1. **은유 하나, 초점 하나 (One metaphor, one focal point).**
   한 컷은 개념 하나만 그림으로 번역한다. "촛불이 꺼지며 반쯤 적힌 장부" = 부분 실패.
   화면에 요소를 더하고 싶을 때마다 뺀다. 여백이 품질감이다.

2. **플랫 & 미니멀, 절제된 색 (Flat, minimal, disciplined color).**
   벡터 플랫 일러스트. 그라데이션 남발·사진 질감·네온 금지. 잉크 라인이 형태를 잡고,
   색은 **의미 있는 곳에만** 쓴다. 토스 블루는 "지금 중요한 것"을 가리키는 신호지 배경이 아니다.

3. **개념의 은유화 (Metaphor over literal).**
   `SELECT`·코드창을 그대로 그리지 않는다. 락은 자물쇠, MVCC는 반투명하게 겹친 시간의 층,
   WAL은 먼저 새겨두는 돌판/로그북, 데드락은 서로의 발목을 붙든 두 사람. **추상 개념 →
   손에 잡히는 사물**로 번역하는 게 이 책 삽화의 핵심 노동이다.

4. **차분한 지성의 무드 (Calm, intelligent, never cute).**
   과장된 카툰·이모지 감성 배제. 편안하지만 진지하다. 표정은 미니멀, 몸짓으로 감정을 전한다.
   유머는 상황(은유)에서 나오지 캐릭터의 과장에서 나오지 않는다.

5. **다크모드에서도 떠 보이게 (Float on dark).**
   삽화는 항상 **불투명한 밝은 배경(off-white)** 위에 그린다. 투명 PNG·순수 검정 배경 금지.
   사이트가 이미지에 `border-radius:16px` + 1px 라인을 씌우므로(`.book-reading img`),
   삽화 자체 배경이 밝으면 라이트/다크 양쪽에서 카드처럼 떠 보인다.

---

## 2. 컬러 팔레트 (구체 hex)

사이트 토스 토큰과 **충돌하지 않도록** 파생했다. 삽화는 아래 9색 안에서만 논다(±약간의 명도 변주 허용).

### 공통 코어 (전 장 고정)
| 역할 | Hex | 메모 |
|---|---|---|
| Paper (base, 밝은 배경) | `#F4F1EA` (역사) / `#F2F4F6` (현대) | 사이트 neutral bg와 형제. 다크모드 대비용 밝은 판 |
| Ink outline | `#2B2F36` | 순수 검정 대신 살짝 푼 먹선. 사이트 잉크 `#191f28`과 조화 |
| Toss Blue (primary accent) | `#3182F6` | 사이트 accent 그대로. "약속·확정·지금 중요" 신호 |
| Deep Blue | `#1B64DA` | 블루의 그림자·강조 |
| Neutral shadow | `#8B95A1` | 회색 음영. 사이트 tertiary ink 그대로 |

### 시대별 액센트 (톤 스위치)
| 시대 | 액센트 | Hex | 무드 |
|---|---|---|---|
| **역사 (1~4장)** | Warm amber | `#E0983A` | 촛불·양피지·목재 |
| | Candle glow | `#F6CE7B` | 하이라이트·온기 |
| | Clay/brick | `#C97C5A` | 피부톤·나무·가죽 |
| **현대 (5장~)** | Steel blue | `#4E5968` | 차가운 실내·서버·금속 |
| | Cyan pop | `#22B8CF` | 데이터 흐름·화면광 (아주 드물게) |

### 특수 신호색 (전 장 공통, 아주 아껴서)
- **Commit green** `#12B886` — "약속이 지켜짐 / COMMIT 성공" 단 한 곳에만. 남용 금지.
- **Alert red** `#E03131` — "부분 실패 / ROLLBACK / 데드락" 위험 신호에만.

> 원칙: 한 컷에 액센트는 **1~2개**만. 코어(먹선+페이퍼+회색)로 90%를 그리고,
> 블루 또는 시대 액센트로 초점을 찍는다.

---

## 3. 반복 캐릭터 & 시대 톤 (수미상관 설계)

이 책은 **역사(따뜻) → 현대(차가움)** 로 톤이 이동하고, 마지막에 여는 글의 "사라진 잔고"로
돌아온다. 캐릭터가 이 곡선을 실어 나른다. 아래 3인은 등장할 때 **블록을 토씨 그대로 복붙**한다.

### 👤 THE ACCOUNTANT — 회계사 (1~4장, 따뜻)
```
THE ACCOUNTANT: a calm middle-aged Renaissance-era bookkeeper, warm olive skin,
short dark beard lightly streaked with grey, deep-burgundy woolen robe with a plain
white collar, sleeves rolled to the forearm, a quill in one hand; kind focused eyes,
simplified flat-shape face with minimal features; lit by warm candlelight.
```
- 등장: 1장(복식부기), 회귀 카메오 가능. 무드: 온기, 규율, 손으로 지켜온 정확함.

### 👤 THE PIONEER — 초기 프로그래머 (2~4장, 따뜻→중립)
```
THE PIONEER: a 1970s computer researcher, late-30s, short brown hair, thick square
glasses, pale-blue short-sleeve dress shirt with a thin dark tie; holding a punch card
or a reel of magnetic tape; earnest, slightly weary expression; simplified flat features.
```
- 등장: 2장(초기 DBMS 씨름), 3장(System R), 4장(SQL 표준). 시대가 전기·기계로 넘어오는 다리.
- 톤: 아직 따뜻한 조명이지만 배경이 종이→기계로 바뀐다(양피지 → 천공카드·테이프).

### 👤 THE DEVELOPER — 현대 개발자 (5장~ 및 닫는 글, 차가움)
```
THE DEVELOPER: a young present-day engineer, androgynous, warm medium skin, short tidy
black hair, charcoal hoodie over a white tee, a thin blue lanyard; relaxed but thoughtful
posture; simplified flat features; lit by cool screen-glow and daylight. This is the
reader's stand-in — appears in the opening ATM scene and returns in the finale.
```
- 등장: 여는 글(ATM 앞), ACID·동시성·실무 장의 인간 앵커, 닫는 글(다시 커밋 앞에서).
- **수미상관 장치**: 여는 글의 ATM 앞 개발자 = 닫는 글의 개발자. 같은 블록·같은 시드로 생성해
  "돌아왔다"는 느낌을 준다.

### 시대 톤 스위치 요약
| | 조명 | 액센트 | 배경 소품 |
|---|---|---|---|
| 역사 1~4장 | 촛불·따뜻 | amber/glow/clay | 양피지, 깃펜, 저울, 천공카드 |
| 현대 5장~ | 차가운 스크린광·주광 | steel blue/cyan/toss blue | 노트북, 서버 랙, 자물쇠, 로그북 |

### 캐릭터 일관성 유지 팁 (필수)
- **블록을 절대 바꾸지 않는다.** 의상·머리·안경·피부톤은 위 문장 그대로 매 프롬프트에 붙인다.
- **인물 이름을 프롬프트에 쓰지 않는다.** "Luca Pacioli" 같은 실존 인물명은 모델이 제멋대로
  얼굴을 만든다. 항상 위의 일반 서술(THE ACCOUNTANT)로 지칭.
- **최초 1회 캐릭터 시트를 만들고 그걸 레퍼런스로 재사용**(§5, §6 참조).

---

## 4. 구도·포맷 규칙

### A. 장 상단 요약 1컷 (hero)
- **종횡비: 16:9** (예: 1600×900 또는 1536×864). 읽기 컬럼(`max-width:48rem ≈ 768px`)의
  문(門) 역할. 모바일에서 너무 세로로 길지 않게 16:9 고정.
- **여백**: 상하좌우 안전 여백 8% 이상. 초점 은유는 중앙~좌측 1/3에 배치(모바일 크롭 대비).
- **이미지 안 글자 절대 금지.** AI가 글자를 깨뜨린다. 제목·라벨·숫자·말풍선 텍스트 전부 negative에.
  개념 라벨이 꼭 필요하면 삽화가 아니라 마크다운 캡션/alt로 처리.
- **배경**: 불투명 off-white(`#F4F1EA`/`#F2F4F6`). 가장자리까지 꽉 채우되 모서리는 사이트가 둥글린다.

### B. 본문 개념 삽화 (inline)
- **종횡비: 4:3 또는 1:1** (예: 1200×900 / 1200×1200). hero보다 작고 다이어그램에 가깝다.
- 인물 없이 **사물·은유 중심**이어도 좋다(오히려 일관성 리스크 ↓). 락=자물쇠, MVCC=겹친 반투명 층 등.
- 스타일 프리픽스는 hero와 100% 동일 — 크기·구도만 다르다.
- alt 텍스트 필수(접근성). 파일명 `concept-{키워드}.png`.

### C. 공통
- 라인 두께 일정, 코너 라운드, 소프트 섀도우 약하게. 질감은 미세한 그레인만.
- 한 컷당 색 액센트 1~2개. 인물 최대 1~2명.

---

## 5. 재사용 프롬프트 프리픽스 (★ 핵심 산출물)

매 장 프롬프트는 **`[STYLE PREFIX] + [ERA ACCENT] + [SCENE] + [CHARACTER block(있으면)] + [NEGATIVE]`**
형태로 조립한다. 아래를 복붙해서 쓴다.

### STYLE PREFIX (전 장 고정 — 그대로 복붙)
```
Flat vector editorial illustration, minimal and clean, modern fintech explainer style
(Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background,
charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep
blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous
negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows,
subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low
visual noise, opaque light background so the image floats on both light and dark pages.
```

### ERA ACCENT (둘 중 하나 선택해 이어붙임)
- 역사(1~4장):
```
Era: historical, warm candlelit scene, amber and honey accents (#E0983A, glow #F6CE7B),
aged-paper and wood tones, clay skin (#C97C5A).
```
- 현대(5장~):
```
Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow,
restrained tech palette, sparing cyan pop (#22B8CF).
```

### NEGATIVE (전 장 고정 — 그대로 복붙)
```
--no text, letters, words, numbers, captions, speech bubbles, watermark, signature,
logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon,
heavy gradients, cluttered background, busy details, extra fingers, deformed hands,
distorted face, cartoon mascot, chibi, meme style
```
> (DALL·E 등 `--no`를 안 받는 툴이면 negative를 "Avoid: ..." 자연어 문장으로 덧붙인다.)

### Midjourney 파라미터 (확정 — 모든 프롬프트 끝에)
- **hero**: `--ar 16:9 --style raw` + NEGATIVE(`--no ...`)
- **개념 삽화**: `--ar 4:3 --style raw` (정사각이 나으면 `--ar 1:1`) + NEGATIVE
- **캐릭터 일관성**: 최초로 잘 나온 인물 컷의 URL을 다음 프롬프트에 `--cref <url> --cw 80` 로 물린다(의상·얼굴 승계, `--cw`는 80~100).
- **화풍 일관성**: 최초 hero의 URL을 이후 장들에 `--sref <url>` 로 물려 전 장 톤을 고정.
- **버전**: 책 전체를 **한 버전(예: `--v 6`)** 으로 완주. 중간에 바꾸면 화풍이 튄다.
- 조립: `[STYLE PREFIX] [ERA ACCENT] [SCENE] [CHARACTER block] --ar 16:9 --style raw --cref <url> --cw 80 --sref <url> --no <negatives>`

---

### 기존 프롬프트 리라이트 예시

**① 여는 글 — 사라진 잔고의 밤 (hero, 16:9)**
현재 초안(요약): *"새벽 ATM, 화면 세로 반분할, 왼쪽 현금 멈춤·오른쪽 잔고 감소, 형광등, 불안한 파랑."*
→ 프리픽스 정합 버전:
```
[STYLE PREFIX]
Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow,
sparing cyan pop, tense midnight-blue mood.
Scene: a lone ATM at night, its screen split vertically into two halves — on the left,
banknotes frozen half-dispensed from the slot; on the right, a bank-balance bar visibly
shorter than before, a small clock stopped mid-tick between them. Cold fluorescent light,
one anxious Toss-blue glow marking the vanished amount. Empty, quiet, unsettling.
THE DEVELOPER stands small before it, back to viewer, shoulders tense.
16:9, focal metaphor centered.
[NEGATIVE]
```

**② 1장 — 장부 앞의 회계사 (hero, 16:9)**
현재 초안(요약): *"촛불 아래 낡은 책상, 두 손이 양쪽 장부에 동시에 펜, 한 손 멈추면 무너지는 저울 균형."*
→ 프리픽스 정합 버전:
```
[STYLE PREFIX]
Era: historical, warm candlelit scene, amber and honey accents (#E0983A, glow #F6CE7B),
aged-paper and wood tones, clay skin.
Scene: an old wooden desk under a single candle; two open ledgers side by side; the
accountant's two hands each rest a quill on one ledger at the same instant, mirrored like
the two pans of a balance scale in perfect equilibrium — the visual hint that if one hand
stops, the balance collapses. Warm focused candlelight, deep calm shadows.
THE ACCOUNTANT: [paste ACCOUNTANT block].
16:9, focal metaphor slightly left of center.
[NEGATIVE]
```

**③ 1장 개념 삽화 예 — 부분 실패 (concept, 4:3, 인물 없음)**
```
[STYLE PREFIX]
Era: historical, warm candlelit, amber accents, aged paper.
Scene: a single open ledger, its left column filled in ink but the right column blank,
a just-extinguished candle with a curl of smoke beside it — one entry written, its pair
never made. A faint Alert-red (#E03131) glow marks the unbalanced half. Quiet dread.
4:3, minimal, no people.
[NEGATIVE]
```

---

## 6. 일관성 확보 실전 팁

1. **시드 고정.** 마음에 드는 렌더가 나오면 그 seed를 기록하고, 같은 캐릭터가 나오는 장은
   같은 seed 계열로 뽑는다(특히 여는 글↔닫는 글 개발자 = 같은 seed).
2. **캐릭터 레퍼런스 재사용.** 최초로 잘 나온 인물 이미지를 **image reference / img2img /
   `--cref`(Midjourney character reference)** 로 다음 프롬프트에 물려 얼굴·의상을 승계한다.
3. **한 툴·한 모델로 완주.** 중간에 생성기를 바꾸면 화풍이 튄다. 책 전체를 한 모델로.
4. **장 단위 배치 생성.** 한 장의 hero+개념 3~4컷을 한 세션에서 연달아 뽑아 톤을 맞춘다.
5. **이름 대신 서술.** 실존 인물·특정 브랜드·특정 DB 로고를 프롬프트에 넣지 않는다(§3).
6. **팔레트 리마인드.** 색이 튀기 시작하면 프롬프트 끝에 핵심 hex를 한 번 더 반복해 못 박는다.
7. **Fallback — 화풍이 안 잡히면 축소.** 캐릭터 일관성이 끝내 안 나오면 **반복 인물을 포기**하고
   **사물·은유 중심 추상 개념 삽화**(저울·자물쇠·유령·로그북·겹친 시간층)로 스코프를 줄인다.
   스타일 프리픽스만으로도 책 전체 통일감은 유지된다. (인물 리스크 > 사물 리스크)

---

## 7. 1장 착수용 de-risk 체크 (18장 커밋 전 실증)

18장 전량에 프롬프트를 뿌리기 전에, **1장만으로 일관성을 먼저 증명**한다. 아래 5컷을 뽑아
한자리에 놓고 §아래 체크리스트로 판정한다.

**뽑을 5컷**
1. **캐릭터 시트** — THE ACCOUNTANT 정면/측면/손 클로즈업 turnaround 1장 (레퍼런스 원본이 됨).
2. **1장 hero** (16:9) — 두 장부·저울 균형 (§5 예시 ②).
3. **개념 삽화 A** — 복식부기 = 항상 같은 양쪽 합계 (저울/거울 대칭 은유).
4. **개념 삽화 B** — 부분 실패 = 꺼진 촛불·반만 적힌 장부 (§5 예시 ③).
5. **개념 삽화 C** — `BEGIN…COMMIT` = 두 기록을 한 묶음으로 감싼 매듭/보자기 (텍스트 없이 "묶음" 은유).

**통과 체크리스트 (5개 나란히 놓고 눈으로)**
- [ ] 회계사가 hero와 캐릭터 시트에서 **같은 사람**으로 보이는가(의상·수염·피부톤)?
- [ ] 5컷의 **먹선 두께·플랫 정도·그레인**이 한 손에서 나온 것 같은가?
- [ ] 팔레트가 코어+amber 안에 있는가(튀는 색 없음)?
- [ ] 라이트/다크 페이지에 얹었을 때 **밝은 배경으로 떠 보이는가**(투명·검정 배경 아님)?
- [ ] 이미지 안에 **글자가 없는가**?
- [ ] hero가 16:9, 개념이 4:3/1:1로 **포맷이 맞는가**?

3개 이상 어긋나면 프롬프트·시드·레퍼런스를 조정해 재생성. 인물이 끝내 안 맞으면 §6-7 Fallback.
5컷이 통과하면 **그 seed·레퍼런스·프리픽스를 확정**하고 2장부터 그대로 확장한다.
```

---

## 8. 저장·연결 규약 (실무)

- 저장: `public/images/books/transaction/{장번호 2자리}/`
  - hero: `summary.png` / 개념: `concept-{키워드}.png`
- 마크다운 연결: `![alt 텍스트로 내용 서술](/images/books/transaction/01/summary.png)`
- **alt 텍스트 필수** — 화면리더·이미지 로드 실패 대비. 장면을 한 문장으로 서술.
- 파일명은 영문 kebab-case, 한 장당 hero 1 + 개념 2~4컷 권장(과다 금지).
