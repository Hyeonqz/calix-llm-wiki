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
- [ ] 저장: `public/images/books/transaction/00/webtoon.webp`
- 연결 스니펫(주석 대체):
  `![새벽 ATM, 화면이 반으로 갈라져 왼쪽엔 멈춘 지폐·오른쪽엔 줄어든 잔고](/images/books/transaction/00/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, sparing cyan pop, tense midnight-blue mood. Scene: a lone ATM at night, its screen split vertically into two halves — on the left, banknotes frozen half-dispensed from the slot; on the right, a bank-balance bar visibly shorter than before, a small clock stopped mid-tick between them. Cold fluorescent light, one anxious Toss-blue glow marking the vanished amount. Empty, quiet, unsettling. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, relaxed but thoughtful posture, simplified flat features) stands small before it, back to viewer, shoulders tense. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 1장 · 장부 앞의 회계사  (hero, 16:9, 역사 · ACCOUNTANT)
- [ ] 저장: `public/images/books/transaction/01/webtoon.webp`
- 연결 스니펫: `![촛불 아래 회계사의 두 손이 양쪽 장부에 동시에 펜을 얹어 저울처럼 균형 잡힌 순간](/images/books/transaction/01/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit scene, amber and honey accents (#E0983A, glow #F6CE7B), aged-paper and wood tones, clay skin (#C97C5A). Scene: an old wooden desk under a single candle; two open ledgers side by side; the accountant's two hands each rest a quill on one ledger at the same instant, mirrored like the two pans of a balance scale in perfect equilibrium — if one hand stops, the balance collapses. Warm focused candlelight, deep calm shadows. THE ACCOUNTANT (a calm middle-aged Renaissance-era bookkeeper, warm olive skin, short dark beard lightly streaked with grey, deep-burgundy woolen robe with a plain white collar, sleeves rolled to the forearm; kind focused eyes, simplified flat face). Focal metaphor slightly left of center. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 2장 · 파일과 씨름하던 프로그래머들  (hero, 16:9, 역사 · PIONEER)
- [ ] 저장: `public/images/books/transaction/02/webtoon.webp`
- 연결 스니펫: `![정전 순간 릴 테이프에 데이터가 반쯤 기록되다 끊겨 조각이 흩어지고, 굳어버린 초기 프로그래머](/images/books/transaction/02/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit-to-neutral scene, amber accents (#E0983A) fading toward cool, aged machine tones. Scene: a 1960s-70s computer room; a reel of magnetic tape mid-recording where the data trail abruptly breaks at a power cut — the last fragments scatter and dissolve into the air, half-written and lost. A dead console, its light gone. THE PIONEER (a 1970s computer researcher, late-30s, short brown hair, thick square glasses, pale-blue short-sleeve dress shirt with a thin dark tie; earnest, weary expression, simplified flat features) stands frozen before it. One faint alert-red glow (#E03131) marks the broken fragment. Focal metaphor slightly left of center. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 3장 · System R과 하나의 단어  (hero, 16:9, 역사→전환 · PIONEER)
- [ ] 저장: `public/images/books/transaction/03/webtoon.webp`
- 연결 스니펫: `![연구소 화이트보드에 처음 적히는 BEGIN…COMMIT, 흩어진 자물쇠·로그북·저울이 하나의 원으로 묶이는 순간](/images/books/transaction/03/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical turning to modern, warm light cooling toward steel-blue, a research-lab feel. Scene: a whiteboard in a 1970s research lab; scattered simple icons of a padlock, a logbook, and a balance scale are being drawn together and bound inside a single clean circle — separate parts becoming one unit (a word being born, shown as a wrapping ring, NOT as letters). A Toss-blue arc completes the circle. THE PIONEER (a 1970s researcher, late-30s, short brown hair, thick square glasses, pale-blue short-sleeve shirt with thin dark tie, simplified flat features) stands with a marker, turned toward the viewer. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 4장 · SQL 표준이 세운 약속  (hero, 16:9, 전환 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/04/webtoon.webp`
- 연결 스니펫: `![제각각 다른 모양의 데이터베이스들이 가운데 한 장의 SQL 표준 계약서에 같은 서명 라인으로 묶이는 장면](/images/books/transaction/04/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical turning to modern, warm amber cooling toward steel-blue. Scene: several differently-shaped database cylinders, each speaking a different scattered symbol, are gathered around a single sheet of paper at the center — a contract — and joined to it by one shared signature line, becoming one common language. Dialect turning into a shared tongue. One Toss-blue accent on the unifying line. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 5장 · 전부 아니면 전무 — 원자성  (hero, 16:9, 현대 톤 · DEVELOPER)
- [ ] 저장: `public/images/books/transaction/05/webtoon.webp`
- 연결 스니펫: `![이커머스 주문이 재고·결제·쿠폰 세 조각으로 맞물려 조립되다 한 조각이 빠지자 전체가 통째로 사라지는 장면](/images/books/transaction/05/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette, sparing cyan pop. Scene: an online order forming from three interlocking rounded blocks — labeled by simple icons of a box (stock), a card (payment), a ticket (coupon) — assembling into one whole; but one block is missing, so the entire assembly is collapsing and dissolving back to nothing at once — all-or-nothing. A single alert-red glow (#E03131) marks the missing block. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, simplified flat features) watches from the side. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 6장 · 규칙은 깨지지 않는다 — 일관성  (hero, 16:9, 현대 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/06/webtoon.webp`
- 연결 스니펫: `![데이터 블록들이 '규칙 검문소' 문을 통과하는데, 규칙을 어긴 음수 상태 블록만 통과하지 못하고 되돌려보내지는 장면](/images/books/transaction/06/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: rounded data blocks moving through a clean gateway marked as a rule checkpoint; valid blocks pass through glowing calm Toss-blue, while one rule-breaking block (a broken/negative shape) is stopped at the gate and turned back, faintly marked alert-red (#E03131). A checkpoint that only lets 'states that make sense' through. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 7장 · 서로를 방해하지 않는 척 — 격리성  (hero, 16:9, 현대 톤 · 인물 여럿 실루엣)
- [ ] 저장: `public/images/books/transaction/07/webtoon.webp`
- 연결 스니펫: `![반투명 유리 부스 안의 여러 사람이 같은 '마지막 좌석 하나' 문서를 동시에 읽고 쓰는, 서로 안 보이는 척하지만 결과는 하나여야 하는 긴장](/images/books/transaction/07/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: several simplified people, each inside their own translucent glass booth, all simultaneously reaching to read and mark the SAME single document at the center representing 'the last remaining seat' — each pretends to be alone, yet they overlap on the same spot; a quiet tension. One overlap point marked faint alert-red (#E03131) where two touch the same seat. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 8장 · 한번 약속하면 영원히 — 지속성  (hero, 16:9, 현대 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/08/webtoon.webp`
- 연결 스니펫: `![결제 완료 도장이 찍힌 데이터가 디스크에 깊이 새겨져, 옆에서 정전·불꽃이 닥쳐도 먼저 적어둔 로그 덕에 지워지지 않는 장면](/images/books/transaction/08/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: a 'completed' stamp of data engraved deeply into a disk platter, staying intact while a power-outage darkness and small flames threaten from the side — surviving because a simple sequential logbook was written first, off to the left. A small calm commit-green (#12B886) mark on the sealed stamp; faint alert-red (#E03131) on the threat. Permanence against disaster. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 9장 · 유령과 오염 — 동시성 괴현상  (hero, 16:9, 현대 톤 · 은유적 인물 없음)
- [ ] 저장: `public/images/books/transaction/09/webtoon.webp`
- 연결 스니펫: `![데이터베이스라는 저택 안에 서로 다른 세 종류의 유령 — 더러운 얼룩(오염), 열 때마다 다른 방(반복불가), 없던 그림자가 나타남(팬텀) — 이 떠 있는 장면](/images/books/transaction/09/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), quiet eerie mood, restrained. Scene: inside a stylized 'database mansion', three distinct simple ghost shapes float, each embodying one anomaly — one is a dirty smudge over a document (dirty read), one is a single door that shows a different room each time it opens (non-repeatable read), one is an extra shadow row appearing out of nowhere in a list (phantom). Spooky but restrained and minimal. Faint alert-red (#E03131) touches on the ghosts. No real people. Focal metaphor: three ghosts, one clear each. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 10장 · 네 개의 문 — 격리 수준  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/10/webtoon.webp`
- 연결 스니펫: `![낮은 문에서 높은 문으로 이어지는 4단 계단, 위로 갈수록 세 유령이 하나씩 차단되고 맨 위 문은 완전 봉쇄지만 통로가 좁아 줄 서 기다리는 장면](/images/books/transaction/10/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a four-step staircase of doorways rising from a low wide-open gate to a high narrow gate; at each higher door, one more small ghost is blocked out — the lowest gate lets all three ghosts through, the highest gate blocks them all but its passage is so narrow that simplified figures queue and wait (safe but slow). Passing-through marked calm Toss-blue, blocked ghosts faint grey. Focal metaphor: the ascending gated staircase. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 11장 · 표준이 말하지 않은 것 — 스냅샷 격리  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/11/webtoon.webp`
- 연결 스니펫: `![표준 지도와 실제 지형이 어긋난 두 겹 지도 — 같은 문 이름표지만 문 뒤 통로가 다르고, 개발자가 그 간극에 발이 빠질 뻔하는 장면](/images/books/transaction/11/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: two translucent maps overlaid but misaligned — a 'standard map' and a 'real terrain' — same door label on top, but the actual passage behind each door has a different shape; a simplified developer figure is about to step into the gap between the two layers. A faint alert-red (#E03131) marks the misaligned seam. Focal metaphor: the mismatched double map and the gap. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 12장 · 자물쇠를 채우다 — 락  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/12/webtoon.webp`
- 연결 스니펫: `![데이터 레코드마다 자물쇠가 걸리고, 열쇠를 든 트랜잭션들이 한 줄로 서서 자기 차례를 기다리는 장면 — 한 명이 쥐면 나머지는 대기](/images/books/transaction/12/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: rounded data record cards each sealed with a small padlock; simplified key-holding transaction figures stand in a single orderly queue waiting their turn — one figure currently holds a key and opens one card (marked calm Toss-blue), the rest wait behind (steel grey). Safe but the line is long. Focal metaphor: locked records and a waiting queue. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 13장 · 시간을 여러 겹으로 — MVCC  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/13/webtoon.webp`
- 연결 스니펫: `![하나의 데이터가 시간축을 따라 반투명 여러 겹의 버전(사진)으로 쌓이고, 서로 다른 시점의 트랜잭션들이 각자 자기 시점 버전을 보며 아무도 안 막는 장면](/images/books/transaction/13/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a single data card stacked into several translucent layered versions along a horizontal time axis, like photos of the same thing at different moments; simplified reader figures at different points each look at their own time-slice version without blocking one another. The current/newest version glows calm Toss-blue, older layers fade to grey. Focal metaphor: layered versions across time. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 14장 · 믿음의 문제 — 낙관적 제어  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/14/webtoon.webp`
- 연결 스니펫: `![두 트랜잭션이 각자 외줄을 건너가고, 끝의 충돌 검사관이 버전 도장을 확인해 먼저 온 쪽은 통과·늦게 온 쪽은 되돌려보내는 장면](/images/books/transaction/14/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: two simplified transaction figures each cross their own tightrope without locking anything; at the far end a 'conflict inspector' checks a version stamp — the one who arrived first passes through (calm commit-green #12B886), the later one is gently turned back with a 'it changed already' gesture (faint alert-red #E03131). No locking, only an end-of-line check. Focal metaphor: two crossings, one inspector at the finish. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 15장 · 재난 후의 복구 — WAL  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/15/webtoon.webp`
- 연결 스니펫: `![불길·정전이 덮친 데이터센터 옆에서 먼저 적어둔 로그 일기장을 펼쳐, 순서대로 재생(redo)해 복원하고 미완성 페이지는 지우며(undo) 데이터를 되살리는 장면](/images/books/transaction/15/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: beside a data center struck by a power-outage darkness and small flames (faint alert-red #E03131), a calm hand opens a pre-written 'log journal' and restores the data by replaying its ordered entries (redo) while erasing the half-finished last page (undo). Restoration succeeding marked calm commit-green (#12B886). Metaphor: the journal written first is what saves the data. No real people beyond a hand. Focal metaphor: the log journal restoring order after disaster. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 16장 · 서로를 붙든 채 멈추다 — 데드락  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/16/webtoon.webp`
- 연결 스니펫: `![두 사람이 각자 자물쇠 하나를 쥔 채 서로의 손목을 붙잡고 상대가 먼저 놓기를 기다리며 굳어버린 원형 교착, 뒤엔 밀린 대기열](/images/books/transaction/16/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: two simplified figures each holding one padlock, gripping each other's wrist in a frozen circular standoff — each waits for the other to let go first, staring at the lock the other holds; a deadlock loop. Behind them a queue of others piles up, blocked. The deadlock knot marked faint alert-red (#E03131). Focal metaphor: the mutual-hold circular standoff. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 17장 · 프레임워크가 숨긴 트랜잭션 경계  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/17/webtoon.webp`
- 연결 스니펫: `![@Transactional 한 줄 뒤에 숨은 프록시 '문지기'가 트랜잭션을 열고 닫는데, 안에서 부른 호출은 문지기를 건너뛰고 외부 API 호출이 커넥션을 인질로 잡는 장면](/images/books/transaction/17/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a proxy 'gatekeeper' figure standing at a doorway opening and closing a transaction boundary line; one call sneaks in through a side path bypassing the gatekeeper (self-invocation), and a long thread to an external API cog holds a shared connection token hostage while others wait — a quietly draining pool. The trouble points marked faint alert-red (#E03131), the boundary line calm Toss-blue. Focal metaphor: the gatekeeper at the transaction boundary and what slips past it. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 18장 · 경계를 넘는 약속 — 분산 트랜잭션  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/transaction/18/webtoon.webp`
- 연결 스니펫: `![여러 도시(서비스)를 잇는 하나의 계약서가 붉은 실로 묶이고, 실이 한 곳에서 끊기면 전체가 흔들리는 분산 트랜잭션의 지도 — 마지막에 1장 회계사의 손과 오버랩](/images/books/transaction/18/webtoon.webp)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), restrained tech palette. Scene: a stylized map where several separate service cities (each a small database node) are bound together by a single contract thread; the thread is tied through all of them, and where it frays at one point the whole binding trembles — one promise across many DBs. The binding thread glows calm Toss-blue, the fraying point faint alert-red (#E03131). Focal metaphor: one contract thread binding many cities. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 닫는 글 · 다시, 커밋 앞에서  (hero, 16:9, 현대 톤 · DEVELOPER, 여는 글과 동일 --cref/시드)
- [ ] 저장: `public/images/books/transaction/99/webtoon.webp`
- 연결 스니펫: `![여는 글의 그 ATM 앞에 다시 선 개발자, 이번엔 화면 뒤에서 돌아가는 트랜잭션 메커니즘(자물쇠·로그·네 약속)이 투명하게 비쳐 보이고 안심한 표정 — 수미상관](/images/books/transaction/99/webtoon.webp)`

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

## 3장 · 보도 코드와 5비트의 기계  (hero, 16:9, 역사→기계 전환 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/03/webtoon.png`
- 연결 스니펫: `![텔레타이프 기계가 고정 폭 5칸짜리 구멍 테이프를 드르륵 자동으로 읽어 글자를 찍어내고, 모든 글자가 똑같은 5칸 폭이라 기계가 헤매지 않는 장면. 한쪽엔 문자/숫자 전환 레버](/images/books/encoding/03/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: transition from historical to machine age, warm amber workshop light (#E0983A, glow #F6CE7B) cooling toward steel grey, aged brass and iron machinery. Scene: a teleprinter / teletype machine automatically feeding a long punched paper tape; the tape is divided into uniform fixed-width columns of five holes each, every character the same 5-slot width, so the machine reads it smoothly without hesitation and stamps out letters. On the side, a small labeled lever for switching between letters-mode and figures-mode (shift). The steady flow of the tape through the machine marked a faint calm Toss-blue (#3182F6). No modern computer screens. Focal metaphor: a machine reading fixed-width 5-slot tape effortlessly, five holes per character. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 4장 · 왜 하필 7비트였나 — ASCII의 탄생  (hero, 16:9, 현대 초입 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/04/webtoon.png`
- 연결 스니펫: `![정확히 128칸이 반듯하게 라벨링된 미국식 서류 캐비닛에 숫자·영문 대문자·소문자가 순서대로 꽉 들어찼고, 옆에는 라벨 없는 텅 빈 8번째 서랍 하나가 열린 채 남아 있는 장면](/images/books/encoding/04/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: early modern / mid-century American standards office, cooled steel and paper tones with a faint warm memory of amber (#E0983A), clean institutional order. Scene: a neat American filing cabinet whose drawers are exactly, orderly labeled into 128 uniform slots — digits, uppercase and lowercase English letters lined up in sequence, filling the cabinet snugly with English only. Beside it, one unlabeled 'eighth' drawer stands open and completely empty, a quietly ominous blank space (foreshadowing). Contrast: the crisp order of a standard vs the empty unknown slot. The open empty drawer's shadow marked a faint calm Toss-blue (#3182F6). No modern computer screens. Focal metaphor: an orderly 128-slot English-only cabinet next to one empty unclaimed drawer. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 5장 · 남은 한 비트의 유혹 — 확장 ASCII와 코드페이지  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/05/webtoon.png`
- 연결 스니펫: `![겉모양과 번호표가 똑같은 서랍장이 나라별로 늘어서 있는데 속에 든 글자들은 제각각이고, 편지 한 통이 엉뚱한 나라의 서랍에 꽂혀 물음표 그림자가 지는 장면](/images/books/encoding/05/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern institutional, cool paper and steel tones, quiet international-office atmosphere. Scene: a row of identical filing cabinets standing side by side, each representing a different country — the cabinets and their small number plates look exactly the same, but the abstract letter-shapes filling each one differ (accented latin forms, cyrillic-like forms, greek-like forms, box-drawing motifs), rendered as simple geometric glyph silhouettes, no real text. In the center, a single letter/envelope has been slotted into the wrong country's cabinet, casting a soft question-mark-shaped shadow. Contrast: identical exteriors, mismatched interiors. The misdelivered envelope and its shadow marked a faint calm Toss-blue (#3182F6). Focal metaphor: identical numbered drawers holding different alphabets, one letter delivered to the wrong drawer. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 6장 · 2바이트의 세계 — 한자와 한글을 담다  (hero, 16:9, 현대·동아시아 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/06/webtoon.png`
- 연결 스니펫: `![한 줄에 영문은 한 칸짜리 작은 블록으로, 한자·한글은 두 칸을 이어 붙인 긴 블록으로 섞여 늘어서 있고, 두 칸 블록의 첫 칸에는 '여기서부터 두 칸' 깃발 표식이 달린 장면. 한쪽에서 두 칸 블록 한가운데를 가위로 자르려다 반쪽만 남아 깨진 조각](/images/books/encoding/06/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern East-Asian computing, clean cool tones with a subtle warm paper base. Scene: a single horizontal row of blocks — small single-width blocks (representing ASCII letters, one slot each) interspersed with longer double-width blocks (representing CJK characters, two slots joined into one). Each double-width block carries a small flag marker on its FIRST slot meaning "a two-slot character starts here" (the lead byte / high bit). To one side, a pair of scissors is cutting a double-width block right through its middle, leaving a broken half-block fragment — a visual of slicing a character in half. Simple geometric glyph silhouettes only, no real readable text. The joints between paired slots and the broken cut marked a faint calm Toss-blue (#3182F6). Focal metaphor: single-slot vs double-slot blocks in one row, a flag on the first slot, one block sliced in half. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 7장 · EUC-KR, 완성형과 조합형 — 한국의 선택  (hero, 16:9, 현대·한국 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/07/webtoon.png`
- 연결 스니펫: `![갈림길에서 한 사람이 고민하는 장면. 왼쪽 길엔 완성된 한글 음절 블록을 사전처럼 통째로 진열한 거대한 진열장인데 군데군데 빈 칸에 '품절' 딱지가 붙어 있고, 오른쪽 길엔 자음·모음 조각을 레고처럼 조립해 어떤 음절이든 만들어내는 작업대가 있다](/images/books/encoding/07/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern Korean computing, clean cool tones with warm paper base. Scene: a forked road seen from behind a single contemplative figure choosing between two paths. LEFT path: a huge display cabinet of pre-assembled complete syllable-blocks arranged like a dictionary (the 'completed form' / lookup table), but with several empty gaps bearing small 'sold out' tags (the 2,350-character limit — missing syllables). RIGHT path: a workbench where small consonant and vowel pieces are assembled like lego into any syllable on demand (the 'combining form'). Contrast between two philosophies: memorize-whole vs assemble-from-parts. Use simple geometric glyph silhouettes, no real readable text. The fork junction and the empty 'sold out' gaps marked a faint calm Toss-blue (#3182F6). Focal metaphor: a person at a fork choosing between a gap-riddled cabinet of whole blocks and a workbench that assembles parts. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 8장 · CP949 — 통합 완성형의 확장  (hero, 16:9, 현대·한국 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/08/webtoon.png`
- 연결 스니펫: `![7장의 품절 딱지 붙은 진열장에, 누군가 기존 칸은 하나도 건드리지 않고 옆 빈 선반에 나머지 음절 블록을 채워 넣어 11,172칸을 꽉 채우는 장면. 그런데 새로 채운 블록 몇 개의 뒷면에 하필 알파벳 라벨이 찍혀 있어 살짝 불안한 기운](/images/books/encoding/08/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern Korean computing, clean cool tones with warm paper base. Scene: the same display cabinet of syllable-blocks from chapter 7, previously gap-riddled with 'sold out' tags, is now being completed — a figure (implying a large software vendor) adds the remaining syllable-blocks onto the adjacent empty shelves WITHOUT touching any of the existing filled slots (backward compatibility), so the whole cabinet reaches a full, satisfying set. But a few of the newly added blocks have, on their back faces, a small latin-alphabet label peeking out (the ASCII byte collision), giving a subtle uneasy undertone. Contrast: the relief of a filled, compatible set vs a hidden trap on some new pieces. Use simple geometric glyph silhouettes, no real readable text. The newly filled shelves and the peeking alphabet labels marked a faint calm Toss-blue (#3182F6). Focal metaphor: an existing cabinet completed by adding new blocks on empty shelves, a few new blocks hiding an alphabet label on the back. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 9장 · Shift-JIS와 바다 건너의 혼란  (hero, 16:9, 현대·일본 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/09/webtoon.png`
- 연결 스니펫: `![두 칸짜리 한자 블록의 두 번째 칸에 하필 역슬래시 모양이 박혀 있고, 그 역슬래시가 칼처럼 작동해 뒤따르는 코드와 파일 경로를 엉뚱한 데서 잘라 깨뜨리는 장면. 같은 역슬래시 자리가 다른 화면에선 엔화(¥) 기호로 보이는 한 바이트 두 얼굴의 분열](/images/books/encoding/09/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern Japanese computing, cool paper and steel tones. Scene: a two-slot CJK character block whose SECOND slot contains a backslash shape. That backslash acts like a blade, slicing through a following line of code and a file path so they break apart at the wrong place (a character bleeding into syntax). To the side, the very same backslash slot is shown twice — one screen renders it as a backslash, another renders it as a yen sign (one byte, two faces / split identity). Uneasy sense of a hidden character corrupting structure. Use simple geometric glyph silhouettes, no real readable text. The break lines and the split backslash/yen slot marked a faint calm Toss-blue (#3182F6). Focal metaphor: a backslash hidden inside a kanji block cutting code and paths, the same slot showing as backslash or yen. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 10장 · ???의 정체 — 모지바케는 왜 생기나  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/10/webtoon.png`
- 연결 스니펫: `![글자 하나가 '인코딩(글자→바이트)' 문을 지나 바이트 꾸러미가 되고 다시 '디코딩(바이트→글자)' 문을 지나 글자로 복원되는 왕복 파이프라인. 입구 문과 출구 문에 붙은 약속표가 서로 달라서 출구에서 나온 글자가 ???와 교체문자로 깨져 나오는 장면](/images/books/encoding/10/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, timeless diagram-like clarity. Scene: a left-to-right round-trip pipeline — a single clean glyph enters a labeled door marked 'encode (glyph to bytes)', becomes a little bundle of byte-cards, travels along, then enters a second labeled door marked 'decode (bytes to glyph)'. But the small reference chart pinned to the entry door and the chart pinned to the exit door are visibly DIFFERENT tables, so the glyph that emerges from the exit is broken — coming out as a garbled placeholder shape and a replacement-character diamond. The mismatch between the two charts is the clear culprit. Use simple geometric glyph and card silhouettes, no real readable text. The two mismatched charts and the broken output marked a faint calm Toss-blue (#3182F6). Focal metaphor: a byte round-trip pipeline breaking because the encode-door chart and decode-door chart don't match. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 11장 · 모든 문자에 번호를 — 유니코드와 코드포인트  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/11/webtoon.png`
- 연결 스니펫: `![지구상 온갖 문자(라틴·한글·한자·아랍·이모지)가 하나의 거대한 통합 서가에 저마다 고유한 U+ 번호표를 달고 정연히 꽂혀 있고, 나라별로 갈라져 싸우던 작은 표들이 하나의 목록으로 합쳐지는 장면. 단 이 서가는 번호만 매긴 목록일 뿐 배송 상자(바이트)는 아직 따로 비어 있다](/images/books/encoding/11/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, hopeful and unifying tone. Scene: a single vast unified library shelf where glyphs from many of the world's scripts (latin, hangul, han/kanji, arabic, plus an emoji-like face — all as simple geometric silhouettes, no real readable text) are neatly filed, each carrying its own unique little number tag shaped like 'U+____'. Several small separate national code-tables in the foreground are shown merging into this one unified catalog. Importantly, the shelf only assigns NUMBERS — beside it sit empty shipping boxes (bytes) not yet packed, making clear the catalog decides the number but not yet how to box it. Calm sense of order after chaos. The unified catalog and the U+ tags marked a faint calm Toss-blue (#3182F6). Focal metaphor: one unified numbered catalog of all scripts, with byte-boxes still empty and separate. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 12장 · 표만으로는 부족하다 — UTF-16과 서로게이트  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/12/webtoon.png`
- 연결 스니펫: `![16칸짜리 상자(2바이트)에 대부분의 글자는 쏙 들어가는데 이모지 하나가 너무 커서 안 들어가, 상위 절반과 하위 절반 두 조각으로 쪼개 미리 비워둔 특별한 두 칸(서로게이트)에 나눠 담아 하나의 글자로 재조립하는 장면](/images/books/encoding/12/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, timeless diagram-like clarity. Scene: a row of uniform two-byte boxes where ordinary glyphs (as simple geometric silhouettes) each slot in neatly, but one oversized emoji-like glyph is too big to fit a single box. It is split into an upper half and a lower half, and those two halves are placed into two specially reserved empty slots (the surrogate pair) that were left blank ahead of time, then joined back into one character. The idea that two bytes are not enough so two boxes are paired. No real readable text. The reserved empty surrogate slots and the split-and-rejoin marked a faint calm Toss-blue (#3182F6). Focal metaphor: an oversized glyph split into two halves filling two reserved paired slots. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 13장 · 가변 길이의 우아함 — UTF-8은 어떻게 동작하나  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/13/webtoon.png`
- 연결 스니펫: `![바이트 조각마다 맨 앞에 깃발 표식이 달려 자기 역할을 스스로 알리는 장면 — '0' 깃발은 혼자 서는 1바이트(ASCII), '110/1110/11110' 깃발은 뒤로 몇 조각이 따라온다는 리더, '10' 깃발은 따라가는 조각. 아무 데서 끊겨도 조각들이 스스로 제자리를 찾아 재정렬되는 우아한 질서](/images/books/encoding/13/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, elegant diagram-like clarity. Scene: a row of byte-tiles where each tile carries a small flag marker at its front announcing its own role — a '0' flag tile stands alone as a single (ASCII) byte, tiles with '110 / 1110 / 11110' flags are leaders declaring how many tiles follow them, and '10' flag tiles wear a little badge marking them as continuation pieces. Because every continuation piece is self-labeled, even when the row is cut at a random point the tiles can realign themselves and find their boundaries again (self-synchronization), conveyed as pieces snapping back into correct groups. Simple geometric tile silhouettes, no real readable text. The flag markers and the self-realigning boundaries marked a faint calm Toss-blue (#3182F6). Focal metaphor: self-labeling byte-tiles with leader/continuation flags that re-align after being cut. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 14장 · ASCII와의 약속 — 하위 호환성이라는 승부수  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/14/webtoon.png`
- 연결 스니펫: `![경쟁하는 두 인코딩 대비 — 한쪽(UTF-16)은 이미 깔린 ASCII 문서·시스템 무리를 새 규격으로 갈아엎으려다 저항에 부딪히고, 다른 쪽(UTF-8)은 같은 ASCII 무리를 '너희는 이미 UTF-8이야'라며 그대로 끌어안아 자연스레 흡수하는 장면](/images/books/encoding/14/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, strategic and calm. Scene: a side-by-side contrast of two competing approaches toward a large crowd of existing document/file tiles (representing the huge installed base of ASCII files and systems). On one side, one approach tries to force the crowd to convert to a brand-new format and meets friction and resistance (tiles pushing back). On the other side, the winning approach simply embraces the very same crowd as-is, welcoming them ('you are already compatible') and absorbing them smoothly without changing them. The contrast is winning by inclusion rather than by fighting. Simple geometric tile and figure silhouettes, no real readable text. The smooth absorbing flow marked a faint calm Toss-blue (#3182F6). Focal metaphor: one approach fighting the installed base, the other embracing it unchanged. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 15장 · BOM과 이모지 — 눈에 안 보이는 바이트들  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/15/webtoon.png`
- 연결 스니펫: `![화면엔 깔끔한 텍스트 한 줄과 이모지 하나만 보이는데, 밑을 들추면 맨 앞에 투명한 유령 바이트 세 개(BOM)가 숨어 코드 첫 줄을 걸어 넘어뜨리고, 이모지 하나는 속을 열어보니 여러 개의 작은 조각(코드포인트)이 보이지 않는 접착제(ZWJ)로 이어 붙어 있는 장면](/images/books/encoding/15/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, clean with a subtle uncanny undertone. Scene: on the surface a tidy single line of text and one emoji-like glyph appear; but the illustration lifts a corner to reveal what is hidden underneath. At the very front, three faint translucent 'ghost' byte-tiles (a BOM) hide and trip up the first line of code like an invisible tripwire. The single emoji glyph, when opened up, is revealed to be several small separate pieces (code points) held together by an invisible glue connector (a zero-width joiner). Theme: what looks like one thing on screen is actually many hidden pieces underneath — visible one vs hidden many. Simple geometric tile and glyph silhouettes, no real readable text. The ghost BOM tiles and the hidden joiner glue marked a faint calm Toss-blue (#3182F6). Focal metaphor: hidden ghost bytes tripping code, and one emoji secretly made of joined pieces. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 16장 · String.length가 거짓말할 때 — 이모지는 왜 2인가  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/16/webtoon.png`
- 연결 스니펫: `![개발자가 이모지 하나를 자로 재는데 눈금이 1이 아니라 2를 가리키고, 한쪽에선 문자열을 가위로 자르다 이모지 한가운데가 잘려 반쪽짜리 깨진 조각이 떨어진다. 그런데 올바른 코드포인트 자와 자소 자로 바꿔 재니 제대로 1이 나오는 장면](/images/books/encoding/16/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, clean and diagrammatic. Scene: a developer figure measures a single emoji-like glyph with a ruler, but the ruler wrongly reads '2' instead of '1'. To one side, a pair of scissors cuts a string of tiles and slices right through the middle of an emoji glyph, dropping a broken half-piece (a mojibake fragment). Then, using a correct 'code point ruler' and a 'grapheme ruler', the same glyph is measured properly as '1'. Contrast between a wrong measuring tool and the right one. Simple geometric glyph and tile silhouettes, no real readable text. The correct ruler markings and the accurate measurement marked a faint calm Toss-blue (#3182F6). Focal metaphor: measuring one emoji — a wrong ruler says two and cuts it in half, the right ruler says one. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 17장 · utf8은 진짜 UTF-8이 아니다 — MySQL utf8 vs utf8mb4  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/17/webtoon.png`
- 연결 스니펫: `![utf8 간판이 붙은 데이터베이스 창고 입구가 3칸짜리 좁은 문이라 3칸 손님(한글·한자, BMP)은 통과하는데 4칸을 차지하는 이모지 손님이 문틀에 걸려 'Incorrect string value' 팻말과 함께 입장 거부당하고, 옆에는 4칸까지 받는 넓은 utf8mb4 문이 있는 장면](/images/books/encoding/17/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, clean and slightly wry. Scene: a database warehouse entrance with a sign reading like a false label ('utf8'), but its doorway is a narrow slot only three units wide. Three-unit-wide guests (representing BMP characters like hangul and han) pass through fine, but a four-unit-wide emoji guest gets stuck in the doorframe and is turned away, beside a small rejection placard (an 'incorrect value' sign). Next to it stands a wider, correctly sized door labeled to accept four units ('utf8mb4'), through which the emoji guest fits. Theme: the sign lied about the real capacity. Simple geometric figure and door silhouettes, no real readable text. The blocked doorway and the rejection marked a faint calm Toss-blue (#3182F6). Focal metaphor: a mislabeled three-wide door rejecting a four-wide emoji guest while a proper four-wide door accepts it. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 18장 · 깨진 글자를 디버깅하다 — 인코딩 버그 현장  (hero, 16:9, 현대 톤 · 은유적)
- [ ] 저장: `public/images/books/encoding/18/webtoon.png`
- 연결 스니펫: `![탐정이 된 개발자가 깨진 글자(???·ë°¸ë¦°·�) 앞에서 돋보기로 겉 글자가 아니라 그 아래 진짜 바이트(16진수 조각)를 들여다보고, 입력→앱→DB→출력 파이프라인 위에서 딱 한 구간의 약속표 라벨이 어긋나 범인으로 지목되는 장면](/images/books/encoding/18/webtoon.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: modern, calm and methodical detective mood. Scene: a developer as a detective examines a broken/garbled glyph with a magnifying glass, but instead of looking at the surface broken character, the lens reveals the true underlying bytes (little hexadecimal tiles) beneath it. Behind, a left-to-right pipeline of gateways labeled input, app, database, output is drawn; at exactly one gateway the small encoding-table label is mismatched and highlighted as the culprit, while the others match. Theme: open the bytes, trace the stage, find where the agreement broke. Simple geometric glyph, tile, and figure silhouettes, no real readable text. The magnified true bytes and the single mismatched gateway marked a faint calm Toss-blue (#3182F6). Focal metaphor: a detective reading the real bytes under a broken glyph and pinpointing the one mismatched gateway in the pipeline. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

> 닫는 글(99)은 별도로 집필한다. 이후 새 장은 이 아래에 같은 형식으로 추가된다.
