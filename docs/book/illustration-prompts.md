# 『약속된 데이터』 삽화 프롬프트 큐 (복붙용)

> 반자동 워크플로우. 스타일 가이드(`docs/book/style-guide.md`) 기준으로 **조립 완료된**
> Midjourney 프롬프트 모음. 장이 하나 완성될 때마다 아래에 블록이 추가된다.

## 사용법
1. 아래 장별 블록의 프롬프트를 **통째로 복사** → Midjourney에 붙여넣기(`/imagine`).
2. 마음에 드는 컷을 고르면, **저장 경로**에 지정 파일명으로 내려받아 넣는다.
3. 본문 마크다운의 삽화 주석을 아래 **연결 스니펫**으로 교체(alt 텍스트 포함).
4. 완료하면 체크박스에 `x`.

## 캐릭터 일관성 (한 번만 먼저)
반복 인물은 **최초 1회 캐릭터 시트를 뽑아 그 URL을 `--cref <url> --cw 80`** 으로 이후 장에 물린다.
화풍은 최초 hero URL을 `--sref <url>` 로 물려 전 장 톤 고정. 책 전체를 **한 버전(`--v 6` 등)** 으로 완주.
- ACCOUNTANT 시트: 1장 hero 뽑기 전에 turnaround 1컷 먼저.
- DEVELOPER 시트: 여는 글에서 뽑은 걸 닫는 글까지 **같은 --cref** 로 재사용(수미상관).

---

## 여는 글 · 사라진 잔고의 밤  (hero, 16:9, 현대 · DEVELOPER)
- [ ] 저장: `public/images/books/transaction/00/webtoon.png`
- 연결 스니펫(주석 대체):
  `![새벽 ATM, 화면이 반으로 갈라져 왼쪽엔 멈춘 지폐·오른쪽엔 줄어든 잔고](/images/books/transaction/00/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, sparing cyan pop, tense midnight-blue mood. Scene: a lone ATM at night, its screen split vertically into two halves — on the left, banknotes frozen half-dispensed from the slot; on the right, a bank-balance bar visibly shorter than before, a small clock stopped mid-tick between them. Cold fluorescent light, one anxious Toss-blue glow marking the vanished amount. Empty, quiet, unsettling. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, relaxed but thoughtful posture, simplified flat features) stands small before it, back to viewer, shoulders tense. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 1장 · 장부 앞의 회계사  (hero, 16:9, 역사 · ACCOUNTANT)
- [ ] 저장: `public/images/books/transaction/01/webtoon.png`
- 연결 스니펫: `![촛불 아래 회계사의 두 손이 양쪽 장부에 동시에 펜을 얹어 저울처럼 균형 잡힌 순간](/images/books/transaction/01/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit scene, amber and honey accents (#E0983A, glow #F6CE7B), aged-paper and wood tones, clay skin (#C97C5A). Scene: an old wooden desk under a single candle; two open ledgers side by side; the accountant's two hands each rest a quill on one ledger at the same instant, mirrored like the two pans of a balance scale in perfect equilibrium — if one hand stops, the balance collapses. Warm focused candlelight, deep calm shadows. THE ACCOUNTANT (a calm middle-aged Renaissance-era bookkeeper, warm olive skin, short dark beard lightly streaked with grey, deep-burgundy woolen robe with a plain white collar, sleeves rolled to the forearm; kind focused eyes, simplified flat face). Focal metaphor slightly left of center. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 2장 · 파일과 씨름하던 프로그래머들  (hero, 16:9, 역사 · PIONEER)
- [ ] 저장: `public/images/books/transaction/02/webtoon.png`
- 연결 스니펫: `![정전 순간 릴 테이프에 데이터가 반쯤 기록되다 끊겨 조각이 흩어지고, 굳어버린 초기 프로그래머](/images/books/transaction/02/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit-to-neutral scene, amber accents (#E0983A) fading toward cool, aged machine tones. Scene: a 1960s-70s computer room; a reel of magnetic tape mid-recording where the data trail abruptly breaks at a power cut — the last fragments scatter and dissolve into the air, half-written and lost. A dead console, its light gone. THE PIONEER (a 1970s computer researcher, late-30s, short brown hair, thick square glasses, pale-blue short-sleeve dress shirt with a thin dark tie; earnest, weary expression, simplified flat features) stands frozen before it. One faint alert-red glow (#E03131) marks the broken fragment. Focal metaphor slightly left of center. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 3장 · System R과 하나의 단어  (hero, 16:9, 역사→전환 · PIONEER)
- [ ] 저장: `public/images/books/transaction/03/webtoon.png`
- 연결 스니펫: `![연구소 화이트보드에 처음 적히는 BEGIN…COMMIT, 흩어진 자물쇠·로그북·저울이 하나의 원으로 묶이는 순간](/images/books/transaction/03/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical turning to modern, warm light cooling toward steel-blue, a research-lab feel. Scene: a whiteboard in a 1970s research lab; scattered simple icons of a padlock, a logbook, and a balance scale are being drawn together and bound inside a single clean circle — separate parts becoming one unit (a word being born, shown as a wrapping ring, NOT as letters). A Toss-blue arc completes the circle. THE PIONEER (a 1970s researcher, late-30s, short brown hair, thick square glasses, pale-blue short-sleeve shirt with thin dark tie, simplified flat features) stands with a marker, turned toward the viewer. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 4장 · SQL 표준이 세운 약속  (hero, 16:9, 전환 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/04/webtoon.png`
- 연결 스니펫: `![제각각 다른 모양의 데이터베이스들이 가운데 한 장의 SQL 표준 계약서에 같은 서명 라인으로 묶이는 장면](/images/books/transaction/04/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical turning to modern, warm amber cooling toward steel-blue. Scene: several differently-shaped database cylinders, each speaking a different scattered symbol, are gathered around a single sheet of paper at the center — a contract — and joined to it by one shared signature line, becoming one common language. Dialect turning into a shared tongue. One Toss-blue accent on the unifying line. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 5장 · 전부 아니면 전무 — 원자성  (hero, 16:9, 현대 톤 · DEVELOPER)
- [ ] 저장: `public/images/books/transaction/05/webtoon.png`
- 연결 스니펫: `![이커머스 주문이 재고·결제·쿠폰 세 조각으로 맞물려 조립되다 한 조각이 빠지자 전체가 통째로 사라지는 장면](/images/books/transaction/05/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette, sparing cyan pop. Scene: an online order forming from three interlocking rounded blocks — labeled by simple icons of a box (stock), a card (payment), a ticket (coupon) — assembling into one whole; but one block is missing, so the entire assembly is collapsing and dissolving back to nothing at once — all-or-nothing. A single alert-red glow (#E03131) marks the missing block. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, simplified flat features) watches from the side. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 6장 · 규칙은 깨지지 않는다 — 일관성  (hero, 16:9, 현대 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/06/webtoon.png`
- 연결 스니펫: `![데이터 블록들이 '규칙 검문소' 문을 통과하는데, 규칙을 어긴 음수 상태 블록만 통과하지 못하고 되돌려보내지는 장면](/images/books/transaction/06/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: rounded data blocks moving through a clean gateway marked as a rule checkpoint; valid blocks pass through glowing calm Toss-blue, while one rule-breaking block (a broken/negative shape) is stopped at the gate and turned back, faintly marked alert-red (#E03131). A checkpoint that only lets 'states that make sense' through. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 7장 · 서로를 방해하지 않는 척 — 격리성  (hero, 16:9, 현대 톤 · 인물 여럿 실루엣)
- [ ] 저장: `public/images/books/transaction/07/webtoon.png`
- 연결 스니펫: `![반투명 유리 부스 안의 여러 사람이 같은 '마지막 좌석 하나' 문서를 동시에 읽고 쓰는, 서로 안 보이는 척하지만 결과는 하나여야 하는 긴장](/images/books/transaction/07/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: several simplified people, each inside their own translucent glass booth, all simultaneously reaching to read and mark the SAME single document at the center representing 'the last remaining seat' — each pretends to be alone, yet they overlap on the same spot; a quiet tension. One overlap point marked faint alert-red (#E03131) where two touch the same seat. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 8장 · 한번 약속하면 영원히 — 지속성  (hero, 16:9, 현대 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/08/webtoon.png`
- 연결 스니펫: `![결제 완료 도장이 찍힌 데이터가 디스크에 깊이 새겨져, 옆에서 정전·불꽃이 닥쳐도 먼저 적어둔 로그 덕에 지워지지 않는 장면](/images/books/transaction/08/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: a 'completed' stamp of data engraved deeply into a disk platter, staying intact while a power-outage darkness and small flames threaten from the side — surviving because a simple sequential logbook was written first, off to the left. A small calm commit-green (#12B886) mark on the sealed stamp; faint alert-red (#E03131) on the threat. Permanence against disaster. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 9장 · 유령과 오염 — 동시성 괴현상  (hero, 16:9, 현대 톤 · 은유적 인물 없음)
- [ ] 저장: `public/images/books/transaction/09/webtoon.png`
- 연결 스니펫: `![데이터베이스라는 저택 안에 서로 다른 세 종류의 유령 — 더러운 얼룩(오염), 열 때마다 다른 방(반복불가), 없던 그림자가 나타남(팬텀) — 이 떠 있는 장면](/images/books/transaction/09/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), quiet eerie mood, restrained. Scene: inside a stylized 'database mansion', three distinct simple ghost shapes float, each embodying one anomaly — one is a dirty smudge over a document (dirty read), one is a single door that shows a different room each time it opens (non-repeatable read), one is an extra shadow row appearing out of nowhere in a list (phantom). Spooky but restrained and minimal. Faint alert-red (#E03131) touches on the ghosts. No real people. Focal metaphor: three ghosts, one clear each. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 10장 · 네 개의 문 — 격리 수준  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/10/webtoon.png`
- 연결 스니펫: `![낮은 문에서 높은 문으로 이어지는 4단 계단, 위로 갈수록 세 유령이 하나씩 차단되고 맨 위 문은 완전 봉쇄지만 통로가 좁아 줄 서 기다리는 장면](/images/books/transaction/10/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a four-step staircase of doorways rising from a low wide-open gate to a high narrow gate; at each higher door, one more small ghost is blocked out — the lowest gate lets all three ghosts through, the highest gate blocks them all but its passage is so narrow that simplified figures queue and wait (safe but slow). Passing-through marked calm Toss-blue, blocked ghosts faint grey. Focal metaphor: the ascending gated staircase. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 11장 · 표준이 말하지 않은 것 — 스냅샷 격리  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/11/webtoon.png`
- 연결 스니펫: `![표준 지도와 실제 지형이 어긋난 두 겹 지도 — 같은 문 이름표지만 문 뒤 통로가 다르고, 개발자가 그 간극에 발이 빠질 뻔하는 장면](/images/books/transaction/11/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: two translucent maps overlaid but misaligned — a 'standard map' and a 'real terrain' — same door label on top, but the actual passage behind each door has a different shape; a simplified developer figure is about to step into the gap between the two layers. A faint alert-red (#E03131) marks the misaligned seam. Focal metaphor: the mismatched double map and the gap. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 12장 · 자물쇠를 채우다 — 락  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/12/webtoon.png`
- 연결 스니펫: `![데이터 레코드마다 자물쇠가 걸리고, 열쇠를 든 트랜잭션들이 한 줄로 서서 자기 차례를 기다리는 장면 — 한 명이 쥐면 나머지는 대기](/images/books/transaction/12/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: rounded data record cards each sealed with a small padlock; simplified key-holding transaction figures stand in a single orderly queue waiting their turn — one figure currently holds a key and opens one card (marked calm Toss-blue), the rest wait behind (steel grey). Safe but the line is long. Focal metaphor: locked records and a waiting queue. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 13장 · 시간을 여러 겹으로 — MVCC  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/13/webtoon.png`
- 연결 스니펫: `![하나의 데이터가 시간축을 따라 반투명 여러 겹의 버전(사진)으로 쌓이고, 서로 다른 시점의 트랜잭션들이 각자 자기 시점 버전을 보며 아무도 안 막는 장면](/images/books/transaction/13/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a single data card stacked into several translucent layered versions along a horizontal time axis, like photos of the same thing at different moments; simplified reader figures at different points each look at their own time-slice version without blocking one another. The current/newest version glows calm Toss-blue, older layers fade to grey. Focal metaphor: layered versions across time. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 14장 · 믿음의 문제 — 낙관적 제어  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/14/webtoon.png`
- 연결 스니펫: `![두 트랜잭션이 각자 외줄을 건너가고, 끝의 충돌 검사관이 버전 도장을 확인해 먼저 온 쪽은 통과·늦게 온 쪽은 되돌려보내는 장면](/images/books/transaction/14/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: two simplified transaction figures each cross their own tightrope without locking anything; at the far end a 'conflict inspector' checks a version stamp — the one who arrived first passes through (calm commit-green #12B886), the later one is gently turned back with a 'it changed already' gesture (faint alert-red #E03131). No locking, only an end-of-line check. Focal metaphor: two crossings, one inspector at the finish. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 15장 · 재난 후의 복구 — WAL  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/15/webtoon.png`
- 연결 스니펫: `![불길·정전이 덮친 데이터센터 옆에서 먼저 적어둔 로그 일기장을 펼쳐, 순서대로 재생(redo)해 복원하고 미완성 페이지는 지우며(undo) 데이터를 되살리는 장면](/images/books/transaction/15/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: beside a data center struck by a power-outage darkness and small flames (faint alert-red #E03131), a calm hand opens a pre-written 'log journal' and restores the data by replaying its ordered entries (redo) while erasing the half-finished last page (undo). Restoration succeeding marked calm commit-green (#12B886). Metaphor: the journal written first is what saves the data. No real people beyond a hand. Focal metaphor: the log journal restoring order after disaster. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 16장 · 서로를 붙든 채 멈추다 — 데드락  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/16/webtoon.png`
- 연결 스니펫: `![두 사람이 각자 자물쇠 하나를 쥔 채 서로의 손목을 붙잡고 상대가 먼저 놓기를 기다리며 굳어버린 원형 교착, 뒤엔 밀린 대기열](/images/books/transaction/16/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: two simplified figures each holding one padlock, gripping each other's wrist in a frozen circular standoff — each waits for the other to let go first, staring at the lock the other holds; a deadlock loop. Behind them a queue of others piles up, blocked. The deadlock knot marked faint alert-red (#E03131). Focal metaphor: the mutual-hold circular standoff. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 17장 · 프레임워크가 숨긴 트랜잭션 경계  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/17/webtoon.png`
- 연결 스니펫: `![@Transactional 한 줄 뒤에 숨은 프록시 '문지기'가 트랜잭션을 열고 닫는데, 안에서 부른 호출은 문지기를 건너뛰고 외부 API 호출이 커넥션을 인질로 잡는 장면](/images/books/transaction/17/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a proxy 'gatekeeper' figure standing at a doorway opening and closing a transaction boundary line; one call sneaks in through a side path bypassing the gatekeeper (self-invocation), and a long thread to an external API cog holds a shared connection token hostage while others wait — a quietly draining pool. The trouble points marked faint alert-red (#E03131), the boundary line calm Toss-blue. Focal metaphor: the gatekeeper at the transaction boundary and what slips past it. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 18장 · 경계를 넘는 약속 — 분산 트랜잭션  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/18/webtoon.png`
- 연결 스니펫: `![여러 도시(서비스)를 잇는 하나의 계약서가 붉은 실로 묶이고, 실이 한 곳에서 끊기면 전체가 흔들리는 분산 트랜잭션의 지도 — 마지막에 1장 회계사의 손과 오버랩](/images/books/transaction/18/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a stylized map where several separate service cities (each a small database node) are bound together by a single contract thread; the thread is tied through all of them, and where it frays at one point the whole binding trembles — one promise across many DBs. The binding thread glows calm Toss-blue, the fraying point faint alert-red (#E03131). Focal metaphor: one contract thread binding many cities. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 닫는 글 · 다시, 커밋 앞에서  (hero, 16:9, 현대 톤 · DEVELOPER, 여는 글과 동일 --cref/시드)
- [ ] 저장: `public/images/books/transaction/99/webtoon.png`
- 연결 스니펫: `![여는 글의 그 ATM 앞에 다시 선 개발자, 이번엔 화면 뒤에서 돌아가는 트랜잭션 메커니즘(자물쇠·로그·네 약속)이 투명하게 비쳐 보이고 안심한 표정 — 수미상관](/images/books/transaction/99/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow. Scene: THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, simplified flat features — SAME character as the opening ATM scene, reuse --cref) stands again before the same night ATM from the opening, but now the transaction machinery behind the screen is faintly transparent and visible: padlocks, a logbook, and the four promises working together, keeping the money safe. The developer looks calm and reassured. A gentle commit-green (#12B886) glow of safety. Bookend/full-circle mood. Focal metaphor: the reader standing again where they began, now seeing what protects them. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

🎉 **전체 삽화 프롬프트 완성 (여는 글 + 1~18장 + 닫는 글 = 20컷).**

---

# 『깨지지 않는 글자』 (문자 인코딩) 삽화 프롬프트 큐

> 두 번째 책. 같은 스타일 가이드(`docs/book/style-guide.md`) 프리픽스 사용. 저장 경로는
> `public/images/books/encoding/{장}/webtoon.png`. 캐릭터(THE DEVELOPER)는 트랜잭션 책과
> 같은 `--cref`로 물려 시리즈 일관성 유지.

## 여는 글 · ???만 남은 이력서  (hero, 16:9, 현대 톤 · DEVELOPER)
- [ ] 저장: `public/images/books/encoding/00/webtoon.png`
- 연결 스니펫: `![노트북 화면의 이력서가 이름·경력 자리까지 전부 깨진 글자로 뒤덮이고, 당황한 개발자가 화면을 보는 장면](/images/books/encoding/00/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow. Scene: a laptop screen showing a résumé document whose name, career, and intro fields are entirely overrun by broken/garbled glyph shapes (abstract corrupted-character blocks, NOT real letters) — the text has 'evaporated' into noise. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, simplified flat features — reuse the transaction book's opening character via --cref) stares at the screen, dismayed, one hand raised in confusion. The corrupted region marked faint alert-red (#E03131). Focal metaphor: a document whose letters have broken into noise. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 1장 · 봉화와 깃발 — 신호로 말을 나르다  (hero, 16:9, 역사 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/01/webtoon.png`
- 연결 스니펫: `![산봉우리마다 봉화가 릴레이로 이어지고, 언덕 위 두 사람이 각자 같은 코드북을 보며 깃발 신호를 주고받는 장면](/images/books/encoding/01/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit-to-daylight scene, amber and honey accents (#E0983A, glow #F6CE7B), aged-paper and wood tones, clay skin (#C97C5A). Scene: a chain of signal-fire beacons relaying across mountain peaks into the distance; in the foreground, two people on separate hills each hold up a flag while consulting the SAME small codebook — a shared agreement table is what makes the signal mean something. The signal-relay line marked a faint calm Toss-blue (#3182F6). No modern objects. Focal metaphor: beacon relay + two people reading the same codebook. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 2장 · 모스, 점과 선으로 쪼개다  (hero, 16:9, 역사 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/02/webtoon.png`
- 연결 스니펫: `![전신 키를 두드리는 손에서 전선을 타고 점(·)과 선(—)이 흐르고, 자주 쓰는 글자는 짧게 드문 글자는 길게 리듬처럼 이어지는 장면](/images/books/encoding/02/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm workshop light, amber and honey accents (#E0983A, glow #F6CE7B), aged brass and wood tones, clay skin (#C97C5A). Scene: a hand pressing a telegraph key; from it, a wire carries a stream of short dots and long dashes, some letters rendered short and some long (variable-length rhythm) flowing along the line into the distance. A subtle sense that frequent marks are shorter. The signal flow along the wire marked a faint calm Toss-blue (#3182F6). No modern screens. Focal metaphor: a telegraph key sending dots and dashes of varying length down a wire. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

> 이후 장(3장~)은 집필 사이클마다 이 아래에 같은 형식으로 추가된다.
