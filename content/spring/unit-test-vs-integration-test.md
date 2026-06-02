---
title: "단위 테스트 vs 통합 테스트 — 선택 기준과 작성 전략"
category: "spring"
tags: [unit-test, integration-test, mockito, junit5, spring-boot, test-strategy]
created: 2026-06-01
updated: 2026-06-01
---

# 단위 테스트 vs 통합 테스트 — 선택 기준과 작성 전략

## 개요

둘 중 하나만 선택해야 한다면 **단위 테스트**를 먼저 작성한다.
통합 테스트는 DB, Vault, Kafka, 외부 API 등 환경이 갖춰져야 실행된다.
폐쇄망처럼 외부 환경 접근이 제한된 상황에서는 단위 테스트가 유일하게 어디서든 실행 가능한 테스트다.

---

## 단위 테스트의 실질적 장점

| 항목 | 내용 |
|------|------|
| **속도** | 외부 의존성 없이 ms 단위 실행. 수백 개도 수 초 |
| **격리성** | 실패 원인이 명확. "이 메서드의 이 조건이 잘못됨"을 즉시 특정 |
| **설계 피드백** | 테스트하기 어려운 코드 = 의존성이 강한 코드. 테스트가 리팩토링을 유도 |
| **회귀 방지** | 로직 수정 시 즉각 깨짐. 실수를 PR 전에 잡음 |
| **문서화** | 테스트 이름이 스펙. `should_throw_exception_when_vault_returns_null` |
| **CI/CD 친화** | 환경 셋업 없이 파이프라인에서 바로 실행 가능 |

---

## 이 프로젝트 기준 — 테스트 대상 선택

```
단위 테스트 대상:
  - Service, Strategy, Client 클래스의 분기 로직
  - 예외 발생 조건 (null 체크, 상태 검증)
  - 헤더/메시지 조합 로직 (HMAC 서명 등)

통합 테스트는 나중에:
  - DB + Service 전체 흐름 확인
  - Kafka 메시지 발행/소비 검증
  - 외부 API Mock 서버 연동
```

---

## 단위 테스트를 쉽게 짜는 4가지 원칙

### 1. 의존성은 생성자 주입으로만

```java
// 테스트하기 어려운 코드 — 직접 생성 → mock 불가
@Component
public class SomeService {
    private final Repo repo = new RepoImpl();
}

// 테스트하기 쉬운 코드 — 생성자 주입 → mock 가능
@Component
public class SomeService {
    private final Repo repo;
    public SomeService(Repo repo) { this.repo = repo; }
}
```

이 프로젝트의 `MoreTaPayOutboundClient`는 생성자 주입으로 `RestClient`, `ObjectMapper`, `VaultService`를 받기 때문에 단위 테스트에서 전부 mock으로 교체할 수 있다.

### 2. 메서드가 하나의 일만 하도록

```java
// 테스트 케이스가 폭발하는 코드
public void processPayment(Request req) {
    validate(req);
    callExternalApi(req);
    saveDb(req);
    sendKafka(req);
    sendCallback(req);
}

// 각 단계를 메서드로 분리 → 각각 단위 테스트 가능
public void processPayment(Request req) {
    validate(req);
    PaymentResult result = callExternalApi(req);
    saveResult(result);
    // ...
}
```

### 3. given / when / then 구조

```java
@Test
void should_throw_exception_when_vault_returns_null() {
    // given
    given(vaultService.getSecretData(any())).willReturn(null);

    // when
    ThrowableAssert.ThrowingCallable action = () -> client.send(request);

    // then
    assertThatThrownBy(action)
        .isInstanceOf(QRBankAppException.class);
}
```

### 4. 테스트 이름에 조건과 결과를 포함

```
// 나쁜 이름
test1(), sendTest(), testSuccess()

// 좋은 이름
should_return_outbound_result_when_request_succeeds()
should_throw_QRBankAppException_when_vault_returns_null()
should_log_warning_when_response_is_4xx()
```

---

## 실제 코드 예시 — MoreTaPayOutboundClient 단위 테스트

```java
@ExtendWith(MockitoExtension.class)
class MoreTaPayOutboundClientTest {

    @Mock RestClient restClient;
    @Mock ObjectMapper objectMapper;
    @Mock VaultService vaultService;

    @InjectMocks MoreTaPayOutboundClient client;

    @BeforeEach
    void setUp() {
        // @Value 필드 직접 주입
        ReflectionTestUtils.setField(client, "moreTaPayOutboundUrl",
            "https://moretapay.example.com/api/callback");
    }

    // 테스트 케이스 1: Vault null → 예외
    @Test
    void should_throw_exception_when_vault_returns_null() {
        given(vaultService.getSecretData(any())).willReturn(null);

        assertThatThrownBy(() -> client.send(buildRequest()))
            .isInstanceOf(QRBankAppException.class);
    }

    // 테스트 케이스 2: JSON 직렬화 실패 → 예외
    @Test
    void should_throw_exception_when_serialization_fails() throws Exception {
        given(vaultService.getSecretData(any()))
            .willReturn(Map.of("authentication", "secret-key"));
        given(objectMapper.writeValueAsString(any()))
            .willThrow(new JsonProcessingException("fail") {});

        assertThatThrownBy(() -> client.send(buildRequest()))
            .isInstanceOf(QRBankAppException.class);
    }

    // 테스트 케이스 3: 정상 2xx 응답
    @Test
    void should_return_outbound_result_when_response_is_2xx() throws Exception {
        // Vault, ObjectMapper 정상 mock 설정
        setupNormalMocks();

        // RestClient fluent chain mock (RequestBodyUriSpec → ... → exchange)
        // exchange 람다를 직접 캡처하여 호출하는 방식
        MoreTaPayOutboundClient.OutboundResult result = client.send(buildRequest());

        assertThat(result.httpStatus()).isEqualTo(200);
    }
}
```

---

## RestClient fluent chain mock의 어려움

`RestClient`의 fluent API는 체이닝 구조이기 때문에 mock이 번거롭다.

```java
restClient.post()        // → RequestBodyUriSpec
    .uri(...)            // → RequestBodySpec
    .contentType(...)    // → RequestBodySpec
    .header(...)         // → RequestBodySpec (N번 반복)
    .body(...)           // → RequestHeadersSpec
    .exchange(...)       // → 최종 결과
```

각 단계의 반환 타입이 달라서 mock 체이닝을 전부 설정해야 한다.

```java
// mock 체이닝 패턴
RestClient.RequestBodyUriSpec uriSpec = mock(...);
RestClient.RequestBodySpec bodySpec = mock(...);
RestClient.RequestHeadersSpec<?> headersSpec = mock(...);

given(restClient.post()).willReturn(uriSpec);
given(uriSpec.uri(anyString())).willReturn(bodySpec);
given(bodySpec.contentType(any())).willReturn(bodySpec);
given(bodySpec.header(anyString(), anyString())).willReturn(bodySpec);
given(bodySpec.body(anyString())).willReturn(headersSpec);

// exchange는 람다이므로 ArgumentCaptor 또는 직접 invocation으로 호출
given(headersSpec.exchange(any())).willAnswer(invocation -> {
    RestClient.RequestHeadersSpec.ExchangeFunction<MoreTaPayOutboundClient.OutboundResult> fn
        = invocation.getArgument(0);
    return fn.exchange(mockRequest, mockResponse);
});
```

> 이처럼 복잡한 경우에는 통합 테스트에서 WireMock(Mock HTTP 서버)으로 검증하는 것이 더 현실적이다.

---

## AppQrPaymentServiceImpl 단위 테스트 패턴

```java
@ExtendWith(MockitoExtension.class)
class AppQrPaymentServiceImplTest {

    @Mock AppPaymentRepository paymentRepository;
    @Mock AppOutboundPaymentStrategyRegistry strategyRegistry;
    @Mock AppOutboundPaymentStrategy strategy;

    @InjectMocks AppQrPaymentServiceImpl service;

    @Test
    void should_throw_exception_when_payment_not_found() {
        given(paymentRepository.findByTransactionNo(any()))
            .willReturn(Optional.empty());

        assertThatThrownBy(() -> service.processPayment(command))
            .isInstanceOf(QRBankAppException.class);
    }

    @Test
    void should_delegate_to_correct_strategy_based_on_payment_method() {
        // given
        AppPayment payment = buildPayment(AppPaymentMethod.MORETA_PAY);
        given(paymentRepository.findByTransactionNo(any()))
            .willReturn(Optional.of(payment));
        given(strategyRegistry.getStrategy(AppPaymentMethod.MORETA_PAY))
            .willReturn(strategy);

        // when
        service.processPayment(command);

        // then
        verify(strategy).execute(any());
    }
}
```

---

## 테스트 작성 체크리스트

```
[ ] 클래스의 public 메서드마다 happy path 1개
[ ] 예외 발생 조건마다 1개 (null, empty, 상태 불일치)
[ ] 분기(if/switch) 마다 각 경로 1개
[ ] 외부 의존성은 전부 mock — 실제 DB/API 호출 없음
[ ] 테스트 이름: should_{결과}_when_{조건}
[ ] given/when/then 구조 유지
```

---

## 참고

- [JUnit 5 공식 문서](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito 공식 문서](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- 관련 코드: `module-api/src/test/java/kr/co/qrbank/api/app/moretapay/`
