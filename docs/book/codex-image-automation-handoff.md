# Claude Code -> Codex 이미지 생성 자동화 인수인계 문서

이 문서는 `약속된 데이터` 책의 삽화/웹툰 이미지를 Claude Code가 기획하고, Codex가 이어 받아 실제 이미지 파일 생성과 본문 삽입까지 처리하기 위한 공유 프로토콜이다.

## 결론

가능하다. 다만 Claude Code가 문서를 만든 순간 Codex 세션이 자동으로 깨어나는 것은 아니다.

자동화를 위해서는 아래 셋 중 하나가 필요하다.

1. 사용자가 Codex에게 "pending 작업 처리해줘"라고 요청한다.
2. Codex 자동화/모니터가 `docs/book/image-jobs/pending/`을 주기적으로 확인한다.
3. 별도 스크립트나 CLI가 Codex/API를 호출해 pending 작업을 처리한다.

즉, Claude Code와 Codex가 같은 세션 기억을 공유하는 방식이 아니라, `작업 요청서 파일`을 통해 이어 받는 방식으로 자동화한다.

## 현재 권장 구조

Claude Code는 아래 폴더에 이미지 생성 요청서를 만든다.

```text
docs/book/image-jobs/pending/
```

Codex는 pending 요청서를 읽고 아래 작업을 수행한다.

1. 원문 장 파일을 읽는다.
2. `docs/book/style-guide.md`와 `docs/book/illustration-prompts.md`를 확인한다.
3. 요청서의 레이아웃/스타일/저장 경로를 따른다.
4. 이미지를 생성한다.
5. 지정 경로에 저장한다.
6. 본문 마크다운의 삽화 주석을 이미지 링크로 교체한다.
7. 처리한 요청서를 `docs/book/image-jobs/done/`으로 옮기거나 완료 체크를 남긴다.

## 중요한 제약

- Codex 내장 `$imagegen`을 사용할 수 있으면 가장 자연스럽다.
- 현재 환경에서 `$imagegen`이 `403 Forbidden`으로 막히면 OpenAI Image API 방식이 필요하다.
- OpenAI Image API 방식은 `OPENAI_API_KEY`가 필요하고 API 과금이 적용된다.
- Midjourney는 Codex가 직접 안정적으로 제어하기 어렵다. 이 경우 Codex는 프롬프트/저장 경로/본문 삽입만 자동화하고, 실제 생성은 사람이 Midjourney에서 수행한다.
- 사용자가 원하는 최종 경로에 저장하는 것은 가능하다. 단, Codex의 파일 권한 밖 경로는 승인 또는 실행 권한 설정이 필요하다.

## 책 삽입용 웹툰 이미지 규칙

이미지는 세로 스크롤 웹툰처럼 길게 만들지 않는다.

- 한 이미지 안에서 가로 최대 3컷
- 세로 최대 5컷
- 책 본문 중간에 들어가는 요약 삽화처럼 읽히게 구성
- 도식보다 인물 중심
- 현규, 루나, 모코, 버기의 얼굴과 표정이 컷의 중심에 보여야 함
- 기술 개념은 배경 소품, 상황, 은유로 설명
- 말풍선 텍스트는 최소화하거나 후편집 가능하게 처리
- 이미지 내부 글자는 되도록 피함

## Claude Code가 작성할 요청서 형식

요청서는 Markdown으로 작성한다. 파일명은 아래 형식을 따른다.

```text
docs/book/image-jobs/pending/transaction-<chapter>-<slug>.md
```

예시:

```text
docs/book/image-jobs/pending/transaction-01-ledger-accountant.md
```

요청서에는 반드시 아래 필드를 넣는다.

```md
---
book: transaction
chapter: "01"
slug: ledger-accountant
source: content/books/transaction/01-ledger-accountant.md
output: public/images/books/transaction/01/webtoon.webp
insert_mode: replace_illustration_comment
layout: book_webtoon_grid
status: pending
---

# 이미지 생성 요청

## 목표

1장의 내용을 책 삽입용 인물 중심 웹툰 이미지로 만든다.

## 필수 규칙

- 가로 최대 3컷
- 세로 최대 5컷
- 전체 6~8컷 권장
- 세로로 긴 스크롤 웹툰 금지
- 실제 웹툰 캐릭터처럼 얼굴과 표정이 보여야 함
- 현규, 루나, 모코, 버기 캐릭터 유지
- 본문 삽화 주석 위치에 삽입

## 내용 요약

여기에 Claude Code가 장 내용을 5~10줄로 요약한다.

## 컷 구성

1. 컷별 장면
2. 컷별 감정
3. 컷별 핵심 은유

## 스타일 기준

- `docs/book/style-guide.md` 기준
- 책 전체 캐릭터/화풍 일관성 유지
- 필요하면 `docs/book/illustration-prompts.md`의 기존 장별 프롬프트와 충돌하지 않게 조정

## Codex 처리 지시

- 이미지를 `output` 경로에 생성한다.
- 생성 후 `source` 문서의 삽화 주석을 아래 형식으로 교체한다.

```md
![alt text](/images/books/transaction/01/webtoon.webp)
```

- 완료 후 이 요청서의 `status`를 `done`으로 바꾸거나 `done/` 폴더로 이동한다.
```

## Codex에게 보낼 실행 프롬프트

사용자가 Codex에게 아래처럼 말하면 된다.

```text
/Users/jinhyeongyu/wiki/docs/book/image-jobs/pending 안의 이미지 생성 요청서를 처리해줘.
각 요청서의 source를 읽고, output 경로에 이미지를 만들고, 본문 삽화 주석을 이미지 링크로 교체해줘.
책 삽입용 웹툰은 가로 최대 3컷, 세로 최대 5컷, 인물 중심으로 만들어줘.
```

## 완전 자동화로 가려면

완전 자동화는 아래 중 하나로 구현한다.

### A. Codex 자동화/모니터

Codex가 `docs/book/image-jobs/pending/`을 주기적으로 확인하도록 자동화를 만든다.
새 요청서가 있으면 처리한다.

### B. 로컬 스크립트

Node/Python 스크립트가 pending 요청서를 읽고 OpenAI Image API를 호출한다.
Codex는 이 스크립트 작성과 유지보수를 맡는다.

### C. 반자동 권장안

Claude Code가 pending 요청서를 만들고, 사용자가 Codex에 "pending 처리"라고 말한다.
현재로서는 이 방식이 가장 안정적이다.

## 추천 운영 방식

초기에는 C 방식으로 시작한다.
이미지 품질, 저장 경로, 삽입 위치가 안정되면 B 또는 A 방식으로 확장한다.

이유:

- 웹툰 이미지 품질은 초반에 사람의 피드백이 많이 필요하다.
- 캐릭터 일관성 기준이 아직 고정 중이다.
- `$imagegen`, OpenAI Image API, Midjourney 중 어떤 생성 경로를 쓸지 최종 결정이 필요하다.

## Created Codex Skill

Codex Skill name:

```text
$webtoon-book-image
```

Installed location:

```text
/Users/jinhyeongyu/.codex/skills/webtoon-book-image
```

Recommended Codex prompt after Claude Code finishes a chapter:

```text
Use $webtoon-book-image to process this chapter:
/Users/jinhyeongyu/wiki/content/books/transaction/01-ledger-accountant.md

Create the compact character-driven book webtoon image, save it to the inferred public image path, and replace the chapter's illustration placeholder with the image link.
```

Recommended Codex prompt for pending queue processing:

```text
Use $webtoon-book-image to process all pending image jobs under:
/Users/jinhyeongyu/wiki/docs/book/image-jobs/pending
```
