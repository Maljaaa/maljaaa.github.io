---
emoji: ☕
title: Database의 책임
date: '2024-07-01 00:00:00'
author: 신승민
tags: blog gatsby 
categories: DB
---

## Intro
스마트해썹 공정 프로그램을 개발하다가 보고서 조회 속도가 너무 느리다는 걸 발견했다.
조회 조건을 `select` 해와서 그런가 싶었지만, 단순히 조회하려는 내용 자체를 가져오는데 오래 걸렸다.
`EXPLAIN ANAYLZE`로 분석한 결과 다음과 같았다. 
 
```sql
Sort  (cost=824979.95..824985.01 rows=2024 width=638) (actual time=2024.948..2024.954 rows=3 loops=1)

  ...

Planning Time: 0.765 ms
Execution Time: 2034.187 ms
```
 
> 쿼리 부분이 포함되어 있어서 중간은 생략했다. 
여기서 가장 중요하게 봐야할 부분은 `Execution Time: 2034.187 ms`이다. 
이렇게 때문에 조회 속도가 나오지 않았던 것이다. 
 
그래서 나는 서브쿼리를 조인으로 풀어가고, 필요없는 컬럼은 조회하지 않았다. 
또한 이미 걸려있는 인덱스를 적절히 활용했다. 
내가 쿼리를 수정하고 난 다음 성능을 분석한 결과는 다음과 같다. 
 
```sql
Sort  (cost=72696.13..72705.22 rows=3636 width=316) (actual time=118.811..119.340 rows=13 loops=1)
  
  ...

Planning Time: 0.286 ms
Execution Time: 119.416 ms
```
 
`Execution Time` 부분을 보면 어떤가? 
119.416 ms 정도 소요됐다. 
단순히 나누기 연산을 해봐도 17배 정도 빨라진 셈이다. 
여러번 성능 테스트를 해본 결과 약 20배 정도 빨라졌다는 것을 알 수 있었다. 
 
그러면서 의심이 들었다... 내가 잘 짰나..? 
SQL을 보니 연산 작업으로 인해 코드가 길고 복잡했다. 
이렇게 가져가면 너무나 유지보수가 힘들고, 확정성이 보장되지 않을 것 같았다. 
 
### DATABASE의 책임
그럼 DB에서는 최소한 어디까지 하고, 최대로는 어디까지 해야할까? 
정말 필요한 값을 최소한으로만 주고, 비즈니스 로직은 Controller? Service? Repository? DTO? Client? 도대체 어디서 처리해야 할까? 
아니면, CONCAT(), IF()와 같은 기능을 통해 데이터를 가공해서 보내주는 경우가 좋을까? 
한번에 데이터를 가공해서 보내주면 Client측에서 레코드 하나씩 선회하며 가공해야 하는 부담감을 덜 수 있다. 
판단하기 앞서서, 3계층 구조(Three-Tier Architecture)에 대해서 알아보자. 

### 3게층 구조(Three-Tier Architecture)
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbgODd7%2Fbtq7KmO52dz%2FRYOIlg9BSCyXKrOrxhy12K%2Fimg.png)
3계층 구조란, 어떠한 플랫폼을 3계층으로 나누어서 별도의 논/물리적 장치에 구축 및 운영하는 설계 구조를 말한다. 
 
* **프레젠테이션 계층(Presentation Tier)**
사용자가 마주하는 계층으로, `Front-End` 라고도 부른다. 
사용자 인터페이스와 관계없는 데이터를 처리하는 로직은 포함되지 않는다. 
주로 웹 서버를 예시로 들 수 있고, HTML / CSS / JavaScript 등이 이 계층에 해당된다. 
 
가공을 여기서 하면 여러 Client에서 각각의 요구사항에 맞게 데이터를 가공할 수 있다.
하지만 Layered Architecture를 사용하는 이유가 사라진다. 
추가적으로 하드웨어 성능이 발전함에 따라 Client에서 데이터 가공을 위임하는 것도 트렌드이다. 
 
* **어플리케이션 계층(Application Tier)**
동적인 데이터를 제공한다. 
비즈니스 로직 계층 또는 트랜잭션 계층 이라고도 한다.
`Middleware` 또는 `Back-End`라고도 불린다.
주로 PHP / Java 등이 이 계층에 해당된다. 
 
여기에 비즈니스 로직을 적용하지 않으면 다음과 같은 문제가 생긴다. 
1) 디버깅할 수 없다. 
2) SQL문이 복잡해진다. 
3) 분할, 결합 등 확장이 어렵다. 
4) 문제가 발생했을 때 오류 추적이 어렵다. 
 
즉, 무결성이나 일관성에 관련된 책임만이 DB에 존재해야한다. 
거기서 데이터를 필터링하고, 그룹핑해서 내려주는 것으로 충분하다. 
 
* **데이터 계층(Data Tier)**
DBMS가 이 계층에 해당된다. 
`Back-End`라고도 부른다. 
주로 MySQL / MongoDB / PostgreSQL 등이 이 계층에 해당된다. 
 

### 정리
Architecture에 따라서 DB에 로직을 태우고 데이터를 가공해도 괜찮다고 한다. 
하지만 오늘날 Layered Architecture를 사용하는 현재의 Structure에는 적합하지 않다. 
 
그러므로, DB는 데이터를 Filtering, Grouping, Sorting해서 내려주고, 
App Layer에서 로직을 계산하고, 
Presentation Layer에서 데이터를 가공해서 표시하게끔 책임을 분리하는 것이 설계와 유지보수 관점에서 바람직하다. 
 
그래서 나는 Filtering, Grouping, Sorting 정도만 해서 데이터를 내려줬고, 
성능 분석 결과는 별 차이 없이 비슷했다. 
오히려 SQL문을 보기에 더 수월해졌다. 
프로젝트 구조 상 Client에 계산 로직을 위임함으로써 요구사항 변경에 유연해졌고, 확장성이 좋아졌다. 
다른 프로젝트였다면, Service에서 비즈니스 로직을 담았을 것 같다. 
 
 #### 참고
[Database의 책임 - DB는 어디까지 해줘야 하는가? (+ 데이터 가공,...](https://jaehoney.tistory.com/183)
[3계층 구조(3 Tier- Architecture) 이해하기 [스마트인재개발원]](https://jaws-coding.tistory.com/9)
```toc

```