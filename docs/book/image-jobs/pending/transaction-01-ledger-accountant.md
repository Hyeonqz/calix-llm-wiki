---
book: transaction
chapter: "01"
slug: ledger-accountant
source: content/books/transaction/01-ledger-accountant.md
output: public/images/books/transaction/01/webtoon.png
insert_mode: replace_illustration_comment
layout: book_webtoon_grid
status: pending
---

# 이미지 생성 요청

## 목표

`1장. 장부 앞의 회계사` 내용을 책 삽입용 인물 중심 웹툰 이미지로 만든다.

## 필수 규칙

- 가로 최대 3컷
- 세로 최대 5컷
- 전체 6~8컷 권장
- 세로로 긴 스크롤 웹툰 금지
- 도식보다 인물 중심
- 실제 웹툰 캐릭터처럼 얼굴과 표정이 보여야 함
- 현규, 루나, 모코, 버기 캐릭터 유지
- 회계사는 15세기 베네치아 회계사로 표현
- 기술 개념은 배경 소품과 상황 은유로 설명
- 본문의 삽화 주석 위치에 삽입

## 내용 요약

트랜잭션의 핵심 아이디어는 컴퓨터보다 오래전 복식부기에서 이미 살아 있었다.
15세기 베네치아 상인들은 거래를 장부 양쪽에 두 번 적어 균형을 맞췄다.
한쪽만 적히면 장부가 어긋나고, 이것이 오늘날의 부분 실패와 닮아 있다.
좋은 회계사는 한 거래의 두 기록을 반드시 한 묶음으로 끝냈다.
이 규율은 현대 트랜잭션의 원자성과 일관성으로 이어진다.
결론은 둘 다 되거나, 둘 다 안 되거나. 그래야 데이터는 말이 된다.

## 컷 구성

1. 현대 사무실에서 현규가 사라진 돈을 보고 당황한다.
2. 루나가 문제를 코드 한 줄이 아니라 작업 묶음으로 보라고 질문한다. 모코는 기초 질문을 한다.
3. 루나가 현규와 모코를 컴퓨터 이전의 장부방으로 데려간다.
4. 회계사가 두 장부에 동시에 기록한다. 두 장부는 저울처럼 균형 잡혀 있다.
5. 촛불이 꺼지고 한쪽만 기록된다. 버기가 한쪽 저울을 잡아당긴다.
6. 루나가 두 장부를 하나의 빛나는 끈으로 묶는다. 현규와 모코가 깨닫는다.
7. 현대 사무실로 돌아와 현규가 두 계좌 작업을 하나의 보호막 안에 넣는다.
8. 오래된 장부와 현대 계좌 블록이 나란히 놓이고, 세 인물이 트랜잭션은 오래된 약속임을 이해한다.

## 스타일 기준

- `docs/book/style-guide.md`를 기준으로 한다.
- 단, 이번 요청은 hero 1컷이 아니라 책 삽입용 인물 중심 웹툰이다.
- `docs/book/illustration-prompts.md`의 1장 hero 프롬프트와 같은 주제를 다루지만 별도 산출물이다.
- 색감은 역사 장면에서 warm amber, 현대 장면에서 cool screen blue를 사용한다.
- 이미지 내부 글자는 되도록 넣지 않는다. 말풍선이 필요하면 짧고 선명하게 한다.

## Codex 처리 지시

- 이미지를 `public/images/books/transaction/01/webtoon.png`에 생성한다.
- 생성 후 `content/books/transaction/01-ledger-accountant.md` 상단 삽화 주석을 아래 스니펫으로 교체한다.

```md
![트랜잭션의 원자성과 일관성을 복식부기 이야기로 설명하는 인물 중심 웹툰](/images/books/transaction/01/webtoon.png)
```

- 완료 후 이 요청서를 `docs/book/image-jobs/done/transaction-01-ledger-accountant.md`로 이동하거나 `status: done`으로 바꾼다.
