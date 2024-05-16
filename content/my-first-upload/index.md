---
emoji: 🧢
title: Swagger vs Spring REST Docs
date: '2024-05-14 00:00:00'
author: 신승민
tags: blog gatsby 
categories: API
---

### 앞서서

저희 회사에서 api 개발하는 것을 보며, 저도 언젠가 저렇게 멋진 API를 만들겠다고 다짐했습니다. 그러기 위해서 RESTful API에 대해서 공부를 시작했습니다. 먼저 API 명세서를 작성하는 방법에 대해서 알아보았습니다. 찾아본 여러 방법 중에서 가장 자료가 많았던 것은 **Swagger**와 **Spring REST Docs**입니다. 둘이 어떻게 다르고 어떤 특징이 있는지 알아보겠습니다.

> 그 전에! OAS가 뭔지는 알아야 합니다.
블로그를 볼 때마다 나와서 찾아봐야 했거든요..

### OAS(Open API Specification)
OAS는 "개발자가 **RESTful API**를 쉽게 관리하고 사용할 수 있게 도와주는 표준 명세 작성 방식"이라고 이해하면 됩니다.   
JSON, YAML 형식으로 작성된다는 것을 알고 다음 코드를 봅시다.   
```json
openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9

servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        '200':    # status code
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string

```
자세한 형식은 [공식 문서](https://swagger.io/resources/open-api/)를 참고해주세요.
   
## Swagger
![alt text](image.png)
Swagger는 Controller에 몇 가지의 어노테이션을 달기만 해도 API 문서가 만들어집니다.
```java
@ApiOperation(value = "", notes = "")
@PostMapping("/home")
public String home() {
    return "home";
}
```
> 어떄요? 쉽지 않나요?  
 하지만... 이렇게 계속 소스코드에 작성하게 된다면 코드가 너무 지저분해지지는 않을까요...?   

![](https://velog.velcdn.com/images/gimminjae/post/e990daf7-d3f8-41c6-a792-dfadfc70c057/image.png)   

http://localhost:8080/swager-ui/로 접속하게 되면 위와 같은 UI를 볼 수 있습니다.   
또한 API 명세 확인 및 요청 테스트도 진행할 수 있습니다.

그럼 정리해봅시다.   
     
**장점**
* 깔끔한 UI   
* 어노테이션으로 편리한 작성법
* API Test 기능 지원

**단점**
* 더러워지는 소스코드
* API스펙과 일치 보장하지 않음


## Spring REST Docs
테스트 기반으로 Asciidoc 스티펫을 생성하고 이를 조합하여 Asciidoctor 문서 생성


### 참고
[TossPayments-개발자센터](https://docs.tosspayments.com/resources/glossary/oas)   
[kakaopay tech](https://tech.kakaopay.com/post/openapi-documentation/)   
[Swagger-UI란? 왜 사용해야 할까?](https://velog.io/@gimminjae/Swagger-UI%EB%9E%80-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C)   
[내가 만든 API를 널리 알리기 - Spring REST Docs 가이드편](https://helloworld.kurly.com/blog/spring-rest-docs-guide/?gad_source=1&gclid=CjwKCAjw9IayBhBJEiwAVuc3fvKMFcJfnfd-4aiqlmgUVHp3k6fUoi2BGJCjj4nVJ6phAI4EILieUxoCorYQAvD_BwE)
```toc

```