---
emoji: 😴
title: PRG(Post-Redirect-Get)
date: '2024-06-04 00:00:00'
author: 신승민
tags: blog gatsby 
categories: Spring_MVC
---

## Intro
코드를 보다가 **Redirect Strategy** 부분의 코드를 보게 되었다. 평소에 알던 리다이렉트는 그저 서버가 어떤 URL로 강제로 View를 보여주는 것이라고만 생각해왔다. 하지만 이번 공부를 통해 조금 다른 부분까지 알게 되어서 정리해보고자 한다.
   
### 멱등성
**PRG패턴**을 이야기하는데 있어서 가장 먼저 이야기해야하는 것은 멱등성이다. 멱등성이란, **연산을 여러번 적용하더라도 결과가 달라지지 않는 성질**을 의미한다.   
그렇다면 웹에서는 `GET`, `HEAD`, `PUT`, `DELETE`는 멱등성을 가진다라고 말할 수 있다.   
하지만 `POST`는 멱등성을 가지지 않는다.   
   
예를 들어보면, `GET`은 얼마든지 자주 호출해도 같은 결과를 나타내지만, 게시글을 등록하는 `POST`를 연달아 호출하면 호출한 횟수만큼 게시글이 등록된다.   
   
하지만 REDIRECT가 아니라 FORWARD로 처리할 경우 새로고침 시 게시글 작성/주문이 중복해서 처리될 수 있다.
   
### PRG 패턴
위와 같은 이유로 PSG 패턴은 꼭 필요하다. 그렇다면 더 자세히 알아보자.   
   
`PSG 패턴`은 웹 개발 시 권장되는 디자인 패턴으로   
멱등성을 보장하고 POST에 대한 결과를 다른 사용자가 공유하기 위해 사용되는 패턴이다. `POST -> REDIRECT -> GET`을 줄여서 `PRG`라고 한다.   
   
`POST` 요청이 오면 해당 요청을 수행 후 `REDIRECT`를 시켜서 `GET` 요청으로 변환시키는 행위를 의미한다.

### 포워딩 vs 리다이렉트
1. **포워딩** : 서버 내부에서 일어나는 일   
    1️⃣ 웹 브라우저 URL 창에 /event을 입력하고 엔터

    2️⃣ 서버가 /event URL을 전달 받음

    3️⃣ 서버가 서버 내부에서 /event -> /new-event로 포워딩

    4️⃣ /new-event 결과를 내부에서 렌더링

    5️⃣ 클라이언트에게 렌더링 된 결과를 반환

    6️⃣ 웹 브라우저에 응답 결과가 보이고 URL 창은 처음 입력한 /event로 유지됨

2. **리다이렉트** : 웹 브라우저가 인식하고 URL 경로를 실제 변경   
    1️⃣ 웹 브라우저 URL 창에 /event을 입력하고 엔터

    2️⃣ 서버가 /event URL을 전달 받음

    3️⃣ 서버가 /event -> /new-event로 리다이렉트

    4️⃣ 서버는 /new-event로 리다이렉트 하라는 결과를 웹 브라우저에 반환

    5️⃣ 웹 브라우저는 URL 창에 자동으로 /new-event를 입력하고 엔터(자동으로 일어나고, 실제 URL 창에 입력 결과가 /new-event로 변경됨)

    6️⃣ 서버가 /new-event URL을 전달 받음

    7️⃣ /new-event 결과를 내부에서 렌더링

    8️⃣ 클라이언트에게 렌더링 된 결과를 반환

    9️⃣ 웹 브라우저에 응답 결과가 보이고 URL 창은 리다이렉트 된 /new-event로 유지됨

### 정리
지금까지 **REDIRECT**는 화면을 서버에서 정해주는 것이라고만 생각했다. 하지만 지금 공부를 하고나서는 달라졌다. **REDIRECT**는 멱등하지 않은 POST가 반복해서 요청하는 것을 방지하기 위해 사용한다. 그리고 클라이언트의 요청을 **REDIRECT**로 **다른 URL**을 보냄으로써 다시금 그 **URL** 요청을 받는다. 그 요청을 응답으로 내주면 된다.   

[인프런 질문](https://www.inflearn.com/questions/89530/redirect%EC%9D%B4%EC%9C%A0%EA%B0%80-%EA%B6%81%EA%B8%88%ED%95%A9%EB%8B%88%EB%8B%A4)   
[PRG 패턴 : Post → Redirect → Get](https://gofo-coding.tistory.com/entry/PRG-%ED%8C%A8%ED%84%B4-Post-%E2%86%92-Redirect-%E2%86%92-Get)
```toc

```