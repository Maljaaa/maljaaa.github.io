---
emoji: 🍫
title: 3장 함수
date: '2024-08-30 00:00:00'
author: 신승민
tags: blog gatsby 
categories: Clean_Code
---

## Intro
추상화 수준이 너무 다양하고 코드가 길다.  
두 겹으로 중첩된 if문은 이상한 플래그를 확인하고, 이상한 문자열을 사용하며, 이상한 함수를 호출한다.  
코드를 이해하기가 어렵다.  
하지만 매서드 몇 개를 추출하고, 이름 몇 개를 변경하고, 구조를 조금 변경하면 파악하기 어려웠던 정보가 쉽게 드러난다.  

### 작게 만들어라
100줄 ~ 300줄 함수도 있고 20줄 ~ 30줄 함수도 있다.  
최대한 작으면 작을 수록 좋다.  
심지어 2줄 ~ 4줄인 함수도 있다.  
줄일 수 있다면 줄이는게 좋다.  
* 블록과 들여쓰기
    * if문 / else문 / while 문 등에 들어가는 블록은 한 줄이어야 한다. -> 대개 여기서 함수를 호출한다
    * 함수에서 들여쓰기 수준은 1단이나 2단을 넘어서면 안 된다.  

### 한 가지만 해라!
```
"함수는 한 가지를 해야 한다. 그 한 가지를 잘 해야 한다. 그 한 가지만을 해야 한다."
```
우리가 함수를 만드는 이유는 큰 개념을 다음 추상화 수준에서 여러 단계로 나눠 수행하기 위해서이다.  
그렇기 때문에 단순히 다른 표현이 아니라 의미 있는 이름으로 **다른 함수**를 추출할 수 있다면,  
그 함수는 **여러 작업**을 하는 셈이다.  

### 함수당 추상화 수준은 하나로!
함수가 확실히 '한 가지' 작업만 하려면 함수 내 모든 문장의 추상화 수준이 동일해야 한다.  
* 위에서 아래로 코드 읽기 : **내려가기** 규칙  
    * 위에서 아래로 프로그램을 읽으면 함수 추상화 수준이 한 번에 한 단계씩 낮아진다.    

추상화 수준이 하나인 함수를 구현하는게 쉽지 않겠지만 매우 중요한 규칙이다.  


### Switch문
5가지 문제가 있다.  
1. 함수가 길다.  
2. '한 가지' 작업만 수행하지 않는다.  
3. SRP(Single Responsibility Principle) - 코드를 변경할 이유가 여럿이기 때문  
4. OCP(Open Closed Principle) - 새 직원을 추가할 때마다 코드를 변경하기 때문  
5. 구조가 동일한 함수가 무한정 존재  
  
**[ 해결 방법 ]**

다형성을 이용하여 switch문을 저차원 클래스에 숨기고 절대로 반복하지 않는 방법이 있다.  
switch문을 추상 팩토리에 숨기고, 팩토리는 switch문을 사용해 적절한 파생 클래스의 인스턴스를 생성한다.  
다른 함수들은 인터페이스를 거쳐서 호출된다.  
그러면 다형성으로 인해 실제 파생 클래스의 함수가 실행된다.  
```java
public abstract class Employee {
    public abstract boolean isPayday();
    public abstract Money calculatePay();
    public abstract void deliverPay(Money pay);    
}
----------------------------------------------------------------
public interface EmployeeFactory {
    public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType;
}
----------------------------------------------------------------
public class EmployeeFactoryImpl implements EmployeeFactory {
    public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
        switch (r.type) {
            case COMMISIONED:
                return new CommisionedEmployee(r);
            case HOURLY:
                return new HourlyEmployee(r);
            case SALARIED:
                return new SalariedEmployee(r);
            default:
                throw new InvalidEmployeeType(r.type);
        }
    }
}
```

### 서술적인 이름을 사용하라!
```
"코드를 읽으면서 짐작했던 기능을 각 루틴이 그대로 수행한다면 깨끗한 코드라 불러도 되겠다."
```

이름이 길어도 괜찮다.  
길고 서술적인 이름이 짧고 어려운 이름보다 좋다.  
길고 서술적인 이름이 길고 서술적인 주석보다 좋다.  

### 함수 인수
😊 0개 -------------------------------- 4개 이상 😞  
인수가 있으면 함수 이름과 인수 사이에 추상화 수준이 다르기 때문에  
코드를 읽는 사람이 이해하기 어렵다.  
* 많이 쓰는 단항 형식
    * 인수에 질문을 던지는 경우(boolean fileExists("MyFile"))
    * 인수를 뭔가로 변환해 결과를 반환하는 경우(InputStream fileOpen("MyFile"))
* 플래그 인수
    * 함수로 부울 값을 넘기는 관례는 정말 끔찍하다.  
* 이항 함수
    * 인수가 1개인 함수보다 이해하기 어렵다.  
    * Point p = new Point(0, 0); 이런 경우엔 적절하다.
* 삼항 함수
    * 인수가 2개인 함수보다 이해하기 어렵다. 
    * 매번 함수를 볼 때마다 주춤해진다.
* 인수 객체
    * 객체를 생성해 인수를 줄이는 방법 (Circle makeCircle(double x, double y, double radius) && Circle makeCircle(Point center, double radius))
* 인수 목록
    * 인수 개수가 가변적인 함수도 필요하다.
    * String.format("%s worked %.2f hours.", name, hours);
* 동사와 키워드
    * 함수의 의도나 인수의 순서와 의도를 제대로 표현하려면 좋은 함수 이름은 필수.
    * 인수가 동사/명사 쌍을 이뤄야 한다.
    * 함수 이름에 키워드를 추가하는 방법도 있다.
### 부수 효과를 일으키지 마라!
부수 효과는 거짓말이다.  
시간적인 결합(temporal coupling) 이나 순서 종속성(order dependency)을 초래한다.  
  
`public boolean checkPassword(String userName, String password){}`이라는 함수가 있다.  
함수 이름만 봐서는 암호를 확인하는 함수다.  
하지만 Session.initialize() 호출이 있다.  
이름만 봐서는 세션을 초기화한다는 사실이 드러나지 않는다.  

* 출력 인수  
    `appendFooter(s);`  
    이 함수에서 인수 s는 입력일까 출력일까?  
    함수 선언부를 찾아보면 분명해진다.  
    `public void appendFooter(StringBuffer report)`  
    인수 s는 출력 인수지만, 이렇게 찾아보는 것은 인지적으로 거슬린다는 것이기에 피해야한다.  
    `report.appendFooter()`  
    출력 인수로 사용하라고 설계한 `this`를 활용하여 이렇게 작성하도록 하자.
### 명령과 조회를 분리하라!
함수는 뭔가를 수행하거나 뭔가에 답하거나 둘 중 **하나**만 해야 한다.  
```java
public boolean set(String attribute, String value)
```
이 함수를
```java
if(set("username", "unclebob"))...
```
이렇게 사용하면 어색하다.  
set이 00속성이 ㅁㅁ으로 설정되어 있다면...으로 읽힌다.  
명령과 조회를 분리해 혼란을 뿌리뽑자.  
```java
if(attributeExists("username")) {
    setAttribute("username", "unclebob");
    ...
}
```
### 오류 코드보다 예외를 사용하라!
오류 코드를 반환하면 호출자는 곧바로 처리해야한다.  
if문을 엄청 쓰게 되는 것이다.  
하지만 예외 처리를 해주면 try-catch로 코드가 깔끔해진다.  

* Try/Catch 블록 뽑아내기
try-catch 블록은 원래 추하다.  
블록을 별도 함수로 뽑아내는 편이 좋다.  

* 오류 처리도 한 가지 작업이다.  
함수에 키워드 try가 있다면 함수는 try문으로 시작해 catch/finally문으로 끝나야 한다.

* Error.java 의존성 자석
오류 코드를 반환한다는 것은 오류코드를 어딘가에 정의해둔다는 것이다.  
오류 코드 대신 예외를 사용하면 새 예외는 Exceptoin 클래스에서 파생된다.  
따라서 재컴파일/재배치 없이도 새 예외 클래스를 추가할 수 있다.  

### 반복하지 마라!
중복은 소프트웨어에서 모든 악의 근원이다.  
구조적 프로그래밍, AOP, COP 등 모두 어떤 면에서는 중복 제거 전략이다.  
include를 활용하여 제거하는 방법도 있다.  

### 구조적 프로그래밍
함수 내의 모든 블록에 입구와 출구는 하나만 존재해야 한다.  
**goto**는 절대로!! 안 된다.
함수가 작을 때 간혹 return, break, continue는 괜찮다.  

### 함수를 어떻게 짜죠?
1. 초안을 짠다.
2. 코드를 다듬는다.
3. 함수를 만든다.
4. 이름을 바꾼다. 
5. 중복을 제거한다. 
6. 메서드를 줄이고 순서를 바꾼다.
> 이 와중에도 코드는 항상 단위 테스트를 통과한다.

### 결론
```
"내가 작성하는 함수가 분명하고 정확한 언어로 깔끔하게 같이 맞아떨어져야 
이야기를 풀어가긱가 쉬워진다는 사실을 기억하자.
```

```toc

```