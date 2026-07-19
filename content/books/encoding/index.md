---
title: "깨지지 않는 글자 — 문자 인코딩은 왜 이렇게 만들어졌는가"
book: "깨지지 않는 글자"
description: "봉화와 모스 부호부터 ASCII, EUC-KR, 유니코드, UTF-8, 그리고 이모지까지. 문자 인코딩을 역사와 원리, 현장의 버그로 풀어낸 그림이 있는 전자책."
status: "집필 중"
---

# 깨지지 않는 글자

### 문자 인코딩은 왜 이렇게 만들어졌는가

> 화면에 뜬 `???`, 메일함의 `ì•ˆë…•`, 저장하려다 사라진 이모지 —
> 이 모든 깨짐 뒤에는 100년이 넘는 부호의 역사와, 서로 다른 약속들의 충돌이 있다.
> 이 책은 글자가 어떻게 0과 1이 되는지를 처음부터 끝까지 보여준다.

이 책은 인코딩을 "그냥 `UTF-8`로 두면 되는 것"으로만 알고 있던 예비·주니어
개발자를 위해 썼다. 정답을 외우는 대신, 글자가 *깨지던* 세계의 고통에서 출발해 —
봉화와 전신, 나라마다 제각각이던 코드표, 그리고 세상의 모든 문자에 번호를 붙이려던
시도까지 — 왜 오늘의 인코딩이 그 순서로 태어났는지를 이야기로 따라간다.

각 장은 **배경 → 스토리 → 핵심** 세 걸음으로 나아가고, 개념마다 실행 가능한
코드(바이트를 직접 들여다보는 예제)와 그 장을 한 컷으로 요약한 삽화가 함께한다.

## 목차

**제1부 · 글자를 나르는 법**
1. [봉화와 깃발 — 신호로 말을 나르다](/books/encoding/01-signals-flags)
2. [모스, 점과 선으로 쪼개다](/books/encoding/02-morse)
3. [보도 코드와 5비트의 기계](/books/encoding/03-baudot)

**제2부 · ASCII, 미국이 정한 128칸**
4. [왜 하필 7비트였나 — ASCII의 탄생](/books/encoding/04-ascii)
5. [남은 한 비트의 유혹 — 확장 ASCII와 코드페이지](/books/encoding/05-extended-ascii)

**제3부 · 사투리 전쟁 — 인코딩 난립**
6. [2바이트의 세계 — 한자와 한글을 담다](/books/encoding/06-multibyte)
7. [EUC-KR, 완성형과 조합형 — 한국의 선택](/books/encoding/07-euc-kr)
8. [CP949 — 통합 완성형의 확장](/books/encoding/08-cp949)
9. [Shift-JIS와 바다 건너의 혼란](/books/encoding/09-shift-jis)
10. [???의 정체 — 모지바케는 왜 생기나](/books/encoding/10-mojibake)

**제4부 · 유니코드 — 하나의 표로 세상을 담다**
11. [모든 문자에 번호를 — 유니코드와 코드포인트](/books/encoding/11-unicode-codepoint)
12. [표만으로는 부족하다 — UTF-16과 서로게이트](/books/encoding/12-utf16-surrogate)

**제5부 · UTF-8, 인터넷을 정복한 인코딩**
13. [가변 길이의 우아함 — UTF-8은 어떻게 동작하나](/books/encoding/13-utf8-variable)
14. [ASCII와의 약속 — 하위 호환성이라는 승부수](/books/encoding/14-ascii-compat)
15. [BOM과 이모지 — 눈에 안 보이는 바이트들](/books/encoding/15-bom-emoji)

**제6부 · 현장의 인코딩**
16. [String.length가 거짓말할 때 — 이모지는 왜 2인가](/books/encoding/16-string-length)
17. [utf8은 진짜 UTF-8이 아니다 — MySQL utf8 vs utf8mb4](/books/encoding/17-utf8mb4)
18. [깨진 글자를 디버깅하다 — 인코딩 버그 현장](/books/encoding/18-debugging)

[닫는 글 — 다시, 글자 앞에서](/books/encoding/99-closing)

---

▶ [여는 글부터 읽기 — ???만 남은 이력서](/books/encoding/00-opening)
