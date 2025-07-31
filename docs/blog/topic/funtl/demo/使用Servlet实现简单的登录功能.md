---
sidebar: false
---

# 使用Servlet实现简单的登录功能

​	　采用**MVC+三层架构**的方式创建一个**Maven项目**，用于实现简单的登录功能。

## 项目基本配置

### 新建Maven项目

​	　在`File` -> `New Project`中选择`Maven`，然后根据提示新建Maven项目，并完成如下文件结构的建立。

```text
----.idea：idea配置文件
----target：可执行的CLASS文件
----src：源码目录
--------main
-------------java：Java代码
-------------------com.shooter.test.mvc
------------------------entiry  数据实体
------------------------dao 	数据访问层
----------------------------UserDao.java
----------------------------impl
-------------------------------UserDaoImpl.java
------------------------service 业务逻辑层
----------------------------UserService.java
----------------------------impl
-------------------------------UserServiceImpl.java
------------------------web	前端控制层
----------------------------controller
-------------------------------LoginController.java
-------------resources：资源目录
-------------webapp			视图层
-------------------WEB-INF
-----------------------web.xml	请求路径映射
-------------------index.jsp	登录页面
-------------------fail.jsp		登录失败页面
-------------------index.jsp	登录成功页面
--------test
-------------java：测试用例
----pom.xml：pom配置文件
----.gitignore：git忽略名单
----mvc.iml		mvc项目配置文件
```



::: tip 提示

不要忘记自定义`Maven Home`和`Repository`的位置哦

:::



### Project Struct

​	　对于**Servlet项目**或者**前后端未分离**的项目，资源是部署在`webapp`目录下的，此时，还需要点击`mvc`下的`Web`，在`Deployment Descriptors`中配置 `web.xml` 的位置 和 在`Web Resource Directories`中配置webapp资源目录位置、资源部署的根目录为 `/`才能正常加载资源 。

![1601133488003](../images/30_demo_01.png)



### POM对象

​	　修改 `pom.xml` 配置，添加开发Servlet项目需要使用的`javax.servlet-api`依赖和打印日志所需的`log4j-over-slf4j`依赖。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.shooter.test</groupId>
    <artifactId>mvc</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

</project>
```



## 编写业务代码

​	　首先，在**User类**中，增加`loginId`（登录ID）、`loginPwd`（登录密码）、`userName`（用户名）三个属性，来描述用户信息。

```java
public class User {
    private String loginId;
    private String loginPwd;
    private String userName;
    //Set 和 Get方法略
}
```



### 数据访问层

**1、UserDao**

```java
public interface UserDao {
    User login(String loginId, String loginPwd);
}
```

**2、UserDaoImpl**

```java
public class UserDaoImpl implements UserDao {
    public User login(String loginId, String loginPwd) {
        User user = null;
        //先根据loginId查询出用户信息，再比对loginPwd
        //不可直接根据loginId和loginPwd直接查询，防止SQL注入
        if("admin".equals(loginId)){
            if("admin".equals(loginPwd)){
                user = new User();
                user.setLoginId("admin");
                user.setLoginPwd("admin");
                user.setUserName("TEST");
            }
        }
        return user;
    }
}
```



### 业务逻辑层

**1、UserService**

```java
public interface UserService {
    User login(String loginId, String loginPwd);
}
```

**2、UserServiceImpl**

```java
public class UserServiceImpl implements UserService {
    private UserDao userDao = new UserDaoImpl();
    //调用数据访问层中login的实现
    public User login(String loginId, String loginPwd) {
        return userDao.login(loginId,loginPwd);
    }
}
```



### 前端控制层

**1、LoginController**

```java
public class LoginController extends HttpServlet {

    private UserService userService = new UserServiceImpl();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
        			throws ServletException, IOException {
        String loginId = req.getParameter("loginId");
        String loginPwd = req.getParameter("loginPwd");
		//验证用户名、密码是否正确
        User user = userService.login(loginId, loginPwd);
        //登录失败的处理
        if(user == null){
            req.getRequestDispatcher("/fail.jsp").forward(req,resp);
        }
        //登录成功的处理
        else {
            req.getRequestDispatcher("/success.jsp").forward(req,resp);
        }
    }
}
```

**2、配置web.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <display-name>login-demo</display-name>

    <servlet>
        <servlet-name>LoginController</servlet-name>
        <servlet-class>
            com.shooter.test.mvc.web.controller.LoginController
        </servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginController</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>
</web-app>
```



### 视图层

**1、index.jsp登录页面**

​	　`index.jsp`是Servlet项目默认的欢迎页面，无需在`web.xml`中显示配置，项目部署成功后，访问根路径会直接跳转到`index.jsp`页面。

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登录</title>
</head>
<body>
    <form action="/login" method="post">
        <input name="loginId" type="text"/>
        <input name="loginPwd" type="password"/>
        <input type="submit" value="登录"/>
    </form>
</body>
</html>
```

**2、success.jsp 和 fail.jsp登录跳转页面**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登录</title>
</head>
<body>
    登录成功
</body>
</html>
```

> 登录失败的页面和这个是一样的，这里略过



## 测试运行

​	　配置完 `Tomcat` 后直接运行，打开浏览器访问 http://localhost:8080 显示如下：

![1600517007919](../images/30_demo_02.png)