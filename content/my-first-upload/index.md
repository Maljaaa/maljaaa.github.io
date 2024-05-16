---
emoji: 🍲🍚
title: Swagger vs Spring REST Docs
date: '2024-05-16 00:00:00'
author: 신승민
tags: blog gatsby 
categories: API
---

## 앞서서

저희 회사에서 api 개발하는 것을 보며, 저도 언젠가 저렇게 멋진 API를 만들겠다고 다짐했습니다. 그러기 위해서 RESTful API에 대해서 공부를 시작했습니다. 먼저 API 명세서를 작성하는 방법에 대해서 알아보았습니다. 찾아본 여러 방법 중에서 가장 자료가 많았던 것은 **Swagger**와 **Spring REST Docs**입니다. 둘이 어떻게 다르고 어떤 특징이 있는지 알아보겠습니다.

> 그 전에! OAS가 뭔지는 알아야 합니다.
> 블로그를 볼 때마다 나와서 찾아봐야 했거든요..

## OAS(Open API Specification)
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
**테스트** 기반으로 **아스키닥(Asciidoc) 스니펫(snippet, 코드 조각; 재사용 가능한 소스 코드)** 을 생성하고 이를 조합하여 **아스키닥터(Asciidoctor)** 플러그인을 이용해서 HTML 문서 생성

![](https://helloworld.kurly.com/post-img/spring-rest-docs-guide/06-spring-rest-docs-example.png)
> [Spring REST Docs 가이드 예제](https://github.com/thefarmersfront/spring-rest-docs-guide)

* build.gradel : asciidcotor 플러그인 및 asciidoctor 태스크 관련 스크립트 확인
* OrderRestControllerDocTest : 스테펫을 생성하기 위한 테스트 코드
* index.adoc : API 문서 생성시 기준이 되는 최상위 아스키닥(asciidoc) 문서입니다.
* 사용자 정의 스니펫 : "Spring REST Docs"에서 제공하느 ㄴ스니펫 형식을 구미에 맞게 변경
   
또 다른 방법으로는 Spring REST Docs로 OAS 문서를 만들어 Swagger UI로 호출하는 것입니다. 다시 말하자면, "Spring REST Docs API Specification Integration"을 이용하면 OAS문서를 JSON 혹은 YAML 형식으로 생성할 수 있습니다.   

> OAS 문서 Swagger-UI, Postman 등 다양하게 활용 가능!
  
그럼 정리해봅시다.  
  
**장점**
 * 테스트를 통해 스니펫을 생성함으로써, API에 대한 신뢰감 제공
 * 코드 변경에 대해 즉각적인 확인이 가능하다.

**단점**
 * 준비해야할 것이 많다(Spring Web, Test Framework, Spring REST Docs 작성, asciidoc, gradle...)
 * 개발자의 노력 정도에 따라 품질 편차가 심하다. 

  
**결론**
```
코드에 문서화를 위해 어노테이션이 붙게 되면 복잡하게 보일 수 있겠지만,  
내가 생각했을 때에는 문서화마저도 코드로 작성할 수 있다는 것은 큰 이점이라고 판단이 된다.  
여러 작업을 통해 하지 않고, 하나의 작업으로 여러 작업을 해결할 수 있기 때문이다.  
그래서 나는 Spring REST Docs보다 Swagger 활용이 더 효율적이라고 생각한다.
```

### 참고
[TossPayments-개발자센터](https://docs.tosspayments.com/resources/glossary/oas)   
[kakaopay tech](https://tech.kakaopay.com/post/openapi-documentation/)   
[Swagger-UI란? 왜 사용해야 할까?](https://velog.io/@gimminjae/Swagger-UI%EB%9E%80-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C)   
[내가 만든 API를 널리 알리기 - Spring REST Docs 가이드편](https://helloworld.kurly.com/blog/spring-rest-docs-guide/?gad_source=1&gclid=CjwKCAjw9IayBhBJEiwAVuc3fvKMFcJfnfd-4aiqlmgUVHp3k6fUoi2BGJCjj4nVJ6phAI4EILieUxoCorYQAvD_BwE)
```toc

```