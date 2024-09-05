---
emoji: 🏭
title: 7장 오류 처리
date: '2024-09-05 00:00:00'
author: 신승민
tags: blog gatsby 
categories: Clean_Code
---

## Intro
깨끗한 코드와 오류 처리는 확실히 연관성이 있다.  
여기저기 흩어진 오류 처리 코드 때문에 실제 코드가 하는 일을 파악하기가 거의 불가능하다.  

### 오류 코드보다 예외를 사용하라
예전에는 **오류 플래그**를 설정하거나 호출자에게 오류 코드를 **반환**하는 방법이 전부였다.  
이런 방법을 사용하면 호출자 코드가 복잡해진다.  
그래서 오류가 발생하면 예외를 던지는 편이 낫다.  
논리가 오류 처리 코드와 뒤섞이지 않으니까 말이다.  
```java
public void sendShutDown() {
    try{
        tryToShutDown();
    } catch (DeviceShutDownError e) {
        logger.log(e);
    }
}

private void tryToShutDown() throws DeviceShutDownError {
    ...
}
```
뒤섞였던 개념을 알고리즘에 따라 분리함으로써 각 개념을 독립적으로 살펴보고 이해할 수 있다.  

### Try-Catch-Finally 문부터 작성하라
try 블록에서 무슨 일이 생기든지 호출자가 기대하는 상태를 정의하기 쉬워진다.  
```java
public List<RecordedGrip> retrieveSection(String sectionName) {
    try {
        FileInputStream stream = new FileInputStream(sectionName);
        stream.close();
    } catch (FileNotFoundException e) {
        throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
}
```
여기서 `FileInputStream` 생성자가 던지는 `FileNotFoundException`을 잡아낼 수 있다.
  
1) 강제로 예외를 일으키는 테스트 케이스 작성
2) 테스트를 통과하게 코드 작성  

-> try 블록의 트랜잭션 범위부터 구현하게 되므로 범위 내에서 트랜잭션 본질을 유지하기 쉬워진다.  

### 미확인(Unchecked) 예외를 사용하라
확인된 예외는 OCP(Open Closed Principle)를위반한다.  
하위 단계에서 코드를 변경하면 상위 단계 메서드 선언부를 전부 고쳐야 한다.  
모듈과 관련된 코드가 전혀 바뀌지 않았더라도 (선언부가 바뀌었으므로)  
모듈을 다시 빌드한 다음 배포해야 한다. 
  
연쇄적인 수정이 일어난다!  
Throws 경로에 위치하는 모든 함수가 최하위 함수에서 던지는 예외를 알아야 하므로 **캡슐화**가 깨진다.  

### 예외에 의미를 제공하라
전후 상황을 충분히 덧붙이면, 오류가 발생한 원인과 위치를 찾기 쉬워진다.  
실패한 연산 이름과 실패 유형도 언급한다.  
로깅 기능을 사용한다면 catch 블록에서 오류를 기록하도록 충분한 정보를 넘겨준다.  

### 호출자를 고려해 예외 클래스를 정의하라
`오류를 분류하는 방법`보다 `오류를 잡아내는 방법`에 관심을 두자.
```java
ACMEPort port = new ACMEPort(12);

try {
    port.open();
} catch (DeviceResponseException e) {
    reportPortError(e);
    logger.log("...", e);
} catch (ATM1212UnlockedException e) {
    reportPortError(e);
    logger.log("...", e);
} catch (GMXError e) {
    reportPortError(e);
    logger.log("...", e);
} finally {
    ...
}
```
중복이 심하다.  
호출하는 라이브러리 API를 감싸면서 예외 유형 하나를 반환하자.
```java
LocalPort port = new LocalPort(12);

try {
    port.open();
} catch (PortDeviceFailure e) {
    reportError(e);
    logger.log(e.getMessage(), e);
} finally {
    ...
}
```
여기서 LocalPort 클래스는 단순히 ACMEPort 클래스가 던지는 예외를 잡아 변환하는 `wrapper` 클래스다.  
```java
public class LocalPort {
    private ACMEPort innerPort;
    
    public LocalPort(int portNumber) {
        innerPort = new ACMEPort(portNumber);
    }

    public void open() {
        try {
            innerPort.open();
        } catch (DeviceResponseException e) {
            throw new PortDeviceFailure(e);
        } catch (ATM1212UnlockedException e) {
            throw new PortDeviceFailure(e);
        } catch (GMXError e) {
            throw new PortDeviceFailure(e);
        }
    }
    ...
}
```
외부 API를 감싸면 외부 라이브러리와 프로그램 사이에서 의존성이 크게 줄어든다.  
다른 라이브러리로 갈아타도 비용이 적다.  
테스트하기도 쉬워진다.  
특정 업체가 API를 설계한 방식에 발목 잡히지 않는다.  

### 정상 흐름을 정의하라
식비를 비용으로 청구했다면 직원이 청구한 식비를 총계에 더한다.  
식비를 비용으로 청구하지 않았다면 일일 기본 식비를 총계에 더한다.  
  
식비를 비용으로 청구하지 않았을 때 일일 기본 식비를 반환한다면?"  
예외처리를 해줄 필요가 없다.  
  
이를 특수 사례 패턴(special case pattern)이라 부른다.  
클래스를 만들거나 객체를 조작해 특수 사례를 처리하는 방식이다.

### null을 반환하지 마라
```java
if (item != null) {
    ...
}
```
누구 하나라도 null 확인을 빼먹는다면 통제 불능에 빠질지도 모른다.  
null을 반환하는 것보다 예외를 던지거나 특수 사례 객체를 반환하자.  
  
java에서 null을 반환하는 것보다 빈 리스트를 반환해보자.  
`Collections.emptyList()`가 있다.  
NullpointerException이 발생할 가능성도 줄어든다.  

### null을 전달하지 마라
정상적인 인수로 null을 기대하는 API가 아니라면 메서드로 null을 전달하는 코드는 최대한 피한다.  
대다수 프로그래밍 언어는 호출자가 실수로 넘기는 null을 적절히 처리하는 방법이 없다.  
애초에 null을 넘기지 못하도록 금지하는 정책이 합리적이다.  
인수로 null이 넘어오면 코드에 문제가 있다는 말이다.  

### 결론
오류 처리를 프로그램 논리와 분리해 독자적인 사안으로 고려하면 튼튼하고 깨끗한 코드를 작성할 수 있다.  
오류 처리를 프로그램 논리와 분리하면 독립적인 추론이 가능해지며 코드 유지보수성도 크게 높아진다.  

```toc

```