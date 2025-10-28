---
sidebar: auto
---

# JSP页面

## 快速开始

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
        <title>HelloWord</title>
    </head>
    <body>
        HelloWord
    </body>
</html>
```



## JSTL标准标签库

```xml
<!-- 需要引入JSTL的Jar包 -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
```



（1）if标签

```xml
<!-- 引入JSTL的core标签库 -->
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
 
<!-- 使用案例 -->
<c:if test="${message != null}">
   ${message}
</c:if>
```



（2）格式化标签

```xml
<!-- 引入JSTL的fmt标签库 -->
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!-- 使用案例： 指定时间格式 -->
<fmt:formatDate value="${user.createTime}" pattern="yyyy-MM-dd HH:mm:ss"/>
```


