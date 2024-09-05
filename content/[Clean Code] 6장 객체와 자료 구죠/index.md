---
emoji: 🤖
title: 6장 객체와 자료 구조
date: '2024-09-04 00:00:00'
author: 신승민
tags: blog gatsby 
categories: Clean_Code
---

## Intro
변수를 `private`으로 정의하는 이유가 있다.  
남들이 변수에 의존하지 않게 만들기 위해서다.  
그렇다면 왜 많은 개발자들이 `get`함수와 `set`함수를 당연하게 `public`해 `private`변수를 외부에 노출할까?  

### 자료 추상화
```java
public class Point {
    public double x;
    public double y;
}
```
```java
public interface Point {
    double getX();
    double getY();
    void setCadrtesian(double x, double y);
    double getX();
    double getTheta();
    void setPolar(double r, double theta);
}
```
> 더 나은 예시  

변수를 **privat**e으로 선언하더라도 각 값마다 **get**함수와 **set**함수를 제공한다면 구현을 외부로 노출하는 셈이다.  
구현을 감추려면 **추상화**가 필요하다.  
```java
public interface Vehicle {
    double getFuelTankCapacityInGallons();
    double getGallonsOfGasoline();
}
```
```java
public interface Vehicle {
    double getPercentFuelRemaining();
}
```
> 더 나은 예시  

인터페이스나 조회/설정 함수만으로는 추상화가 이뤄지지 않는다.  
객체가 포함하는 자료를 표현할 가장 좋은 방법을 심각하게 고민해야 한다.

### 자료/객체 비대칭
객체는 추상화 뒤로 자료를 숨긴 채 자료를 다루는 함수만 제공한다.  
자료 구조는 자료를 그대로 공개하며 별다른 함수는 제공하지 않는다.  

* 절차 지향 코드의 장단점
```
(자료 구조를 사용하는) 절차적인 코드는 기존 자료구조를 변경하지 않으면서
새 함수를 추가하기 쉽다. 반면, 객체 지향 코드는 기존 함수를 변경하지 않으면서
새 클래스를 추가하기 쉽다.
```

* 객체 지향 코드의 장단점
```
절차적인 코드는 새로운 자료 구조를 추가하기 어렵다. 그러려면 모든 함수를
고쳐야 한다. 객체 지향 코드는 새로운 함수를 추가하기 어렵다.
그러려면 모든 클래스를 고쳐야 한다.
```
**객체 지향 코드**에서 어려운 변경은 절차 지향 코드에서 쉬우며,  
**절차 지향 코드**에서 어려운 변경은 객체 지향 코드에서 쉽다!

### 디미터 법칙
**디미터 법칙**은 잘 알려진 **휴리스틱**으로,  
모듈은 자신이 조작하는 객체의 속사정을 몰라야 한다는 법칙이다.  
  
디미터 법칙은 `"클래스 C의 매서드 f는 다음과 같은 객체의 매서드만 호출해야 한다"`고 주장한다.  
* 클래스 C
* f가 생성한 객체
* f 인수로 넘어온 객체
* C 인스턴스 변수에 저장된 객체   

위 객체에서 허용된 매서드가 `반환`하는 객체의 매서드는 호출하면 안 된다.

#### 기차 충돌
* 기차 충돌의 예
```java
final String outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
```

* 해결
```java
Options opts = ctxt.getOptions()
File scratchDir = opts.getScratchDir();
final String outputDir = scratchDir.getAbsolutePath();
```

* 더 나은 방법
```java
final String outputDir = ctxt.options.scratchDir.absolutePath;
```

자료 구조는 무조건 함수 없이 공개 변수만 포함하고  
객체는 비공개 변수와 공개 함수를 포함한다면, 문제는 간단하다.

#### 잡종 구조
절반은 객체, 절반은 자료 구조인 잡종 구조가 있다.  
함수나 타입을 보호할지 공개할지 확신하지 못해 어중간하게 내놓은 설계에 불과하다.

#### 구조체 감추기
```java
ctxt.getAbsolutePathOfScratchDirectoryOption();     // 1
ctxt.getScratchDirectoryOption().getAbsolutePath(); // 2
```
1번은 객체에 공개해야 하는 매서드가 너무 많아진다.  
2번은 객체가 아니라 자료 구조를 반환한다고 가정해도 별로다.  

ctxt가 객체라면 `뭔가를 하라고` 말해야지 속을 드러내라고 말하면 안된다.  
```java
String outFile = outputDir + "/" + className.replace('.', '/') + ".class";
FileOutputStream fout = new FileOutputStream(outFile);
BufferedOutputstream bos = new BufferedOutputStream(fout);
```
점, 슬래시, 파일확장자, File 객체를 부주의하게 마구 뒤섞으면 안된다.  
그럼에도 코드를 보면, 임시 파일을 생성하기 위해 임시 디렉터리의 절대 경로를 얻으려고 하는 것을 알 수 있다.  
그렇다면 ctxt 객체에 임시 파일을 생성하라고 한다면?  

```java
BufferedOutputStream bos = ctxt.createScratchFileStream(classFileName);
```

객체에 맡기기에 적당한 임무로 보인다.  
ctxt는 내부 구조를 드러내지 않으며, 모듈에서 해당 함수는 자신이 몰라야 하는 여러 객체를 탐색할 필요가 없다.  
따라서 디미터 법칙을 위반하지 않는다.  

### 자료 전달 객체
자료 전달 객체는 `DTO(Data Transfer Object)`이다.  
공개 변수만 있고 함수가 없는 클래스다.  
DB에 저장된 가공되지 않은 정보를 
애플리케이션 코드에서 사용할 객체로 변환하는 일련의 단계에서   
가장 처음으로 사용하는 구조체다.  
좀 더 일반적인 형태는 `빈(Bean)`구조다.  

#### 활성 레코드
활성 레코드는 DTO의 특수한 형태다.  
공개 변수가 있거나 비공개 변수에 조회/설정 함수가 있는 자료 구조지만,  
대개 save나 find와 같은 탐색 함수도 제공한다.  
  
활성 레코드에 비즈니스 규칙 메서드를 추가해, 이런 자료 구조를 객체로 취급하는 것은  
바람직하지 않다.  
  
활성 레코드를 자료 구조로 취급하고,  
비즈니스 규칙을 담으면서 내부 자료를 숨기는 객체는 따로 생성한다.  
(여기서 내부 자료는 활성 레코드의 인스턴스일 가능성이 높다.)

### 결론
* **객체**
1) 동작을 공개하고 자료를 숨긴다.
2) 기존 동작을 변경하지 않으면서 새 객체 타입을 추가하기는 쉽다.  
3) 기존 객체에 새 동작을 추가하기는 어렵다. 

* **자료 구조**
1) 별다른 동작 없이 자료를 노출한다. 
2) 새 동작을 추가하기 쉽다.
3) 기존 함수에 새 자료 구조를 추가하기 어렵다. 

```toc

```