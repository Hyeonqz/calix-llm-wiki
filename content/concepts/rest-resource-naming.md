---
title: "REST API Resource Naming 규칙"
category: "api"
tags: [REST, API, naming, URI, best-practice]
created: 2026-05-21
updated: 2026-05-21
---

# REST API Resource Naming 규칙

## 개요

REST API에서 리소스는 **명사(nouns)로 표현**하고, HTTP 메서드(GET, POST, PUT, DELETE)가 동작(동사)을 담당한다. URI는 리소스의 위치와 계층 구조를 나타내는 역할만 한다.

## 리소스 유형 (4가지)

### 1. Document (단일 리소스)

데이터베이스의 단일 레코드와 유사. **단수형** 사용.

```
/users/{id}
/device-management/managed-devices/{device-id}
```

### 2. Collection (컬렉션)

서버가 관리하는 리소스 모음. **복수형** 사용.

```
/users
/device-management/managed-devices
```

### 3. Store (저장소)

클라이언트가 관리하는 리소스 저장소. **복수형** 사용.

```
/users/{id}/playlists
/users/{id}/favorites
```

### 4. Controller (컨트롤러)

CRUD로 매핑되지 않는 동작. 예외적으로 **동사** 허용.

```
/users/{id}/cart/checkout
/alerts/resend
```

## URI 네이밍 규칙

| 규칙 | Good | Bad |
|------|------|-----|
| 하이픈(`-`) 사용 | `/device-management` | `/devicemanagement` |
| 소문자만 사용 | `/users` | `/Users` |
| 후행 슬래시 제거 | `/users` | `/users/` |
| 언더스코어(`_`) 미사용 | `/managed-devices` | `/managed_devices` |
| 파일 확장자 제거 | `/users` | `/users.json` |
| URI에 동사 금지 | `GET /users` | `/getUsers` |
| 계층 구조로 관계 표현 | `/users/{id}/accounts` | `/user-accounts` |

## HTTP 메서드와 조합

```
GET    /users              -- 전체 조회
POST   /users              -- 생성
GET    /users/{id}         -- 단건 조회
PUT    /users/{id}         -- 전체 수정
PATCH  /users/{id}         -- 부분 수정
DELETE /users/{id}         -- 삭제
```

리소스 URI는 동일하게 유지하고, HTTP 메서드로 행위를 구분한다.

## 필터링 / 정렬 / 검색

쿼리 파라미터를 사용한다. URI 경로에 필터 조건을 넣지 않는다.

```
GET /devices?region=USA&brand=XYZ          -- 필터링
GET /devices?sort=created_at&order=desc    -- 정렬
GET /users?q=john                          -- 검색
GET /users?page=2&size=20                  -- 페이징
```

## 안티패턴

```
/getAllUsers              -- URI에 동사 사용
/createNewUser           -- CRUD 함수명
/user_management         -- 언더스코어
/Users                   -- 대문자
/users/                  -- 후행 슬래시
/users.xml               -- 파일 확장자
/deleteUser/{id}         -- 동사 + 리소스
```

## 실무 예시

```
-- 결제 시스템
GET    /payments                           -- 결제 목록
POST   /payments                           -- 결제 생성
GET    /payments/{transaction-no}          -- 결제 단건 조회
POST   /payments/{transaction-no}/refund   -- 환불 (controller)

-- 가맹점 관리
GET    /merchants                          -- 가맹점 목록
GET    /merchants/{id}/terminals           -- 가맹점의 단말기 목록
GET    /merchants/{id}/transactions        -- 가맹점의 거래 내역
```

## 참고

- [REST Resource Naming Guide](https://restfulapi.net/resource-naming/)
