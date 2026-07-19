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
- [ ] 저장: `public/images/books/transaction/00/summary.png`
- 연결 스니펫(주석 대체):
  `![새벽 ATM, 화면이 반으로 갈라져 왼쪽엔 멈춘 지폐·오른쪽엔 줄어든 잔고](/images/books/transaction/00/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, sparing cyan pop, tense midnight-blue mood. Scene: a lone ATM at night, its screen split vertically into two halves — on the left, banknotes frozen half-dispensed from the slot; on the right, a bank-balance bar visibly shorter than before, a small clock stopped mid-tick between them. Cold fluorescent light, one anxious Toss-blue glow marking the vanished amount. Empty, quiet, unsettling. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, relaxed but thoughtful posture, simplified flat features) stands small before it, back to viewer, shoulders tense. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 1장 · 장부 앞의 회계사  (hero, 16:9, 역사 · ACCOUNTANT)
- [ ] 저장: `public/images/books/transaction/01/summary.png`
- 연결 스니펫: `![촛불 아래 회계사의 두 손이 양쪽 장부에 동시에 펜을 얹어 저울처럼 균형 잡힌 순간](/images/books/transaction/01/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit scene, amber and honey accents (#E0983A, glow #F6CE7B), aged-paper and wood tones, clay skin (#C97C5A). Scene: an old wooden desk under a single candle; two open ledgers side by side; the accountant's two hands each rest a quill on one ledger at the same instant, mirrored like the two pans of a balance scale in perfect equilibrium — if one hand stops, the balance collapses. Warm focused candlelight, deep calm shadows. THE ACCOUNTANT (a calm middle-aged Renaissance-era bookkeeper, warm olive skin, short dark beard lightly streaked with grey, deep-burgundy woolen robe with a plain white collar, sleeves rolled to the forearm; kind focused eyes, simplified flat face). Focal metaphor slightly left of center. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 2장 · 파일과 씨름하던 프로그래머들  (hero, 16:9, 역사 · PIONEER)
- [ ] 저장: `public/images/books/transaction/02/summary.png`
- 연결 스니펫: `![정전 순간 릴 테이프에 데이터가 반쯤 기록되다 끊겨 조각이 흩어지고, 굳어버린 초기 프로그래머](/images/books/transaction/02/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical, warm candlelit-to-neutral scene, amber accents (#E0983A) fading toward cool, aged machine tones. Scene: a 1960s-70s computer room; a reel of magnetic tape mid-recording where the data trail abruptly breaks at a power cut — the last fragments scatter and dissolve into the air, half-written and lost. A dead console, its light gone. THE PIONEER (a 1970s computer researcher, late-30s, short brown hair, thick square glasses, pale-blue short-sleeve dress shirt with a thin dark tie; earnest, weary expression, simplified flat features) stands frozen before it. One faint alert-red glow (#E03131) marks the broken fragment. Focal metaphor slightly left of center. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 3장 · System R과 하나의 단어  (hero, 16:9, 역사→전환 · PIONEER)
- [ ] 저장: `public/images/books/transaction/03/summary.png`
- 연결 스니펫: `![연구소 화이트보드에 처음 적히는 BEGIN…COMMIT, 흩어진 자물쇠·로그북·저울이 하나의 원으로 묶이는 순간](/images/books/transaction/03/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical turning to modern, warm light cooling toward steel-blue, a research-lab feel. Scene: a whiteboard in a 1970s research lab; scattered simple icons of a padlock, a logbook, and a balance scale are being drawn together and bound inside a single clean circle — separate parts becoming one unit (a word being born, shown as a wrapping ring, NOT as letters). A Toss-blue arc completes the circle. THE PIONEER (a 1970s researcher, late-30s, short brown hair, thick square glasses, pale-blue short-sleeve shirt with thin dark tie, simplified flat features) stands with a marker, turned toward the viewer. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 4장 · SQL 표준이 세운 약속  (hero, 16:9, 전환 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/04/summary.png`
- 연결 스니펫: `![제각각 다른 모양의 데이터베이스들이 가운데 한 장의 SQL 표준 계약서에 같은 서명 라인으로 묶이는 장면](/images/books/transaction/04/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: historical turning to modern, warm amber cooling toward steel-blue. Scene: several differently-shaped database cylinders, each speaking a different scattered symbol, are gathered around a single sheet of paper at the center — a contract — and joined to it by one shared signature line, becoming one common language. Dialect turning into a shared tongue. One Toss-blue accent on the unifying line. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 5장 · 전부 아니면 전무 — 원자성  (hero, 16:9, 현대 톤 · DEVELOPER)
- [ ] 저장: `public/images/books/transaction/05/summary.png`
- 연결 스니펫: `![이커머스 주문이 재고·결제·쿠폰 세 조각으로 맞물려 조립되다 한 조각이 빠지자 전체가 통째로 사라지는 장면](/images/books/transaction/05/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette, sparing cyan pop. Scene: an online order forming from three interlocking rounded blocks — labeled by simple icons of a box (stock), a card (payment), a ticket (coupon) — assembling into one whole; but one block is missing, so the entire assembly is collapsing and dissolving back to nothing at once — all-or-nothing. A single alert-red glow (#E03131) marks the missing block. THE DEVELOPER (a young present-day engineer, androgynous, warm medium skin, short tidy black hair, charcoal hoodie over a white tee, thin blue lanyard, simplified flat features) watches from the side. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 6장 · 규칙은 깨지지 않는다 — 일관성  (hero, 16:9, 현대 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/06/summary.png`
- 연결 스니펫: `![데이터 블록들이 '규칙 검문소' 문을 통과하는데, 규칙을 어긴 음수 상태 블록만 통과하지 못하고 되돌려보내지는 장면](/images/books/transaction/06/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: rounded data blocks moving through a clean gateway marked as a rule checkpoint; valid blocks pass through glowing calm Toss-blue, while one rule-breaking block (a broken/negative shape) is stopped at the gate and turned back, faintly marked alert-red (#E03131). A checkpoint that only lets 'states that make sense' through. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 7장 · 서로를 방해하지 않는 척 — 격리성  (hero, 16:9, 현대 톤 · 인물 여럿 실루엣)
- [ ] 저장: `public/images/books/transaction/07/summary.png`
- 연결 스니펫: `![반투명 유리 부스 안의 여러 사람이 같은 '마지막 좌석 하나' 문서를 동시에 읽고 쓰는, 서로 안 보이는 척하지만 결과는 하나여야 하는 긴장](/images/books/transaction/07/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: several simplified people, each inside their own translucent glass booth, all simultaneously reaching to read and mark the SAME single document at the center representing 'the last remaining seat' — each pretends to be alone, yet they overlap on the same spot; a quiet tension. One overlap point marked faint alert-red (#E03131) where two touch the same seat. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 8장 · 한번 약속하면 영원히 — 지속성  (hero, 16:9, 현대 톤 · 인물 없음)
- [ ] 저장: `public/images/books/transaction/08/summary.png`
- 연결 스니펫: `![결제 완료 도장이 찍힌 데이터가 디스크에 깊이 새겨져, 옆에서 정전·불꽃이 닥쳐도 먼저 적어둔 로그 덕에 지워지지 않는 장면](/images/books/transaction/08/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), crisp screen glow, restrained tech palette. Scene: a 'completed' stamp of data engraved deeply into a disk platter, staying intact while a power-outage darkness and small flames threaten from the side — surviving because a simple sequential logbook was written first, off to the left. A small calm commit-green (#12B886) mark on the sealed stamp; faint alert-red (#E03131) on the threat. Permanence against disaster. No people, objects and metaphor only. Focal metaphor centered. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

## 9장 · 유령과 오염 — 동시성 괴현상  (hero, 16:9, 현대 톤 · 은유적 인물 없음)
- [ ] 저장: `public/images/books/transaction/09/summary.png`
- 연결 스니펫: `![데이터베이스라는 저택 안에 서로 다른 세 종류의 유령 — 더러운 얼룩(오염), 열 때마다 다른 방(반복불가), 없던 그림자가 나타남(팬텀) — 이 떠 있는 장면](/images/books/transaction/09/summary.png)`

```
/imagine prompt: Flat vector editorial illustration, minimal and clean, modern fintech explainer style (Toss / Kakao aesthetic). Limited harmonious palette: soft off-white paper background, charcoal ink outlines (#2B2F36), one primary accent of Toss blue (#3182F6) with deep blue (#1B64DA), neutral grey shadows (#8B95A1). Single clear focal metaphor, generous negative space, uncluttered composition, rounded geometric shapes, gentle soft shadows, subtle paper grain, calm and intelligent mood, muted tones, high shape clarity, low visual noise, opaque light background so the image floats on both light and dark pages. Era: present day, cool clean interior, steel-blue accents (#4E5968), quiet eerie mood, restrained. Scene: inside a stylized 'database mansion', three distinct simple ghost shapes float, each embodying one anomaly — one is a dirty smudge over a document (dirty read), one is a single door that shows a different room each time it opens (non-repeatable read), one is an extra shadow row appearing out of nowhere in a list (phantom). Spooky but restrained and minimal. Faint alert-red (#E03131) touches on the ghosts. No real people. Focal metaphor: three ghosts, one clear each. --ar 16:9 --style raw --no text, letters, words, numbers, captions, speech bubbles, watermark, signature, logo, UI mockup, code editor screenshot, photorealism, 3D render, harsh contrast, neon, heavy gradients, cluttered background, busy details, extra fingers, deformed hands, distorted face, cartoon mascot, chibi, meme style
```

---

> 이후 장(10장~)은 집필 사이클마다 이 아래에 같은 형식으로 추가된다.
