---
sidebar: auto
---
# 简单的登录功能


## v1.0 项目初始化

### 新建Maven项目

#### 目录结构

​	　在IDEA中选择`File` -> `New Project`中选择`Maven`，然后根据提示，新建Maven项目，并完成如下文件结构的建立：

```text
src\main 目录
--java：Java代码
----com.shooter.funtl                           _
------common                 ---公共组件          |
------config                 ---配置模块          |-→ 代码目录
------module                 ---业务逻辑         _⌋
--------entity                        ---数据实体
----------User.java
--------dao                            ---数据访问层
----------UserDao.java
----------impl
------------UserDaoImpl.java
--------service                        ---业务逻辑层
----------UserService.java
----------impl
------------UserServiceImpl.java
--------web                            ---前端控制层
----------controller
------------LoginController.java
----------interceptor
------------LoginInterceptor.java

--webapp： 视图层
----WEB-INF
------web.xml         ---请求路径映射
----index.jsp         ---登录页面
----fail.jsp          ---登录失败页面
----success.jsp       ---登录成功页面
```



#### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.shooter.funtl</groupId>
    <artifactId>myshop</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>
 
    <dependencies>
        <!--引入servlet包-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <!--引入lombok包-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
            <version>1.16.18</version>
        </dependency>
    </dependencies>
</project>
```



### log4j日志

#### 引入Jar包

```xml
<!--Log4j-->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.25</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.25</version>
</dependency>
```



#### log4j.properties

​	　在`resources`资源目录下，新建`log4j.properties`日志配置文件，并指定`log4j.appender.file.File`的位置，特别的，指定的目录可以是`绝对目录`，也可以是`相对于主目录`的目录。

```properties
log4j.rootLogger=INFO, console, file

log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=%d %p [%c] - %m%n

log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=./log/log.log
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.A3.MaxFileSize=1024KB
log4j.appender.A3.MaxBackupIndex=10
log4j.appender.file.layout.ConversionPattern=%d %p [%c] - %m%n
```



### 编写业务代码

#### 数据模型

```java
@Data
public class User {
    private String userName;
    private String passWd;
    private String email;
}
```



#### 数据访问层

（1）UserDao

```java
public interface UserDao {
    User getUser(String email, String passWord);
}
```

（2）UserDaoImpl

```java
public class UserDaoImpl implements UserDao {
     public User getUser(String email, String passWord) {
        //先根据loginId查询出用户信息，再比对loginPwd
        //不可直接根据loginId和loginPwd直接查询，防止SQL注入
        if("admin@qq.com".equals(email)){
            if("admin".equals(passWord)){
                User user = new User();
                user.setEmail("admin@qq.com");
                user.setPassWd("admin");
                user.setUserName("admin");
                return user;
            }
        }
        return null;
    }
}
```



#### 业务逻辑层

（1）UserService

```java
public interface UserService {
    User login(String loginId, String loginPwd);
}
```

（2）UserServiceImpl

```java
public class UserServiceImpl implements UserService {
    private UserDao userDao = new UserDaoImpl();
    //调用数据访问层中login的实现
     public User login(String loginId, String loginPwd) {
        return userDao.getUser(loginId,loginPwd);
    }
}
```



#### 前端控制层

（1）LoginController

```java
public class LoginController extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
        			throws ServletException, IOException {
        //获取参数
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



（2）配置web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <display-name>myshop</display-name>

    <servlet>
        <servlet-name>LoginController</servlet-name>
        <servlet-class>
            com.shooter.funtl.module.web.controller.LoginController
        </servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginController</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>
</web-app>
```

​	　**特别注意**：配置`web.xml`完成后，还需要再指定`Web Resource Directory`（参考<a href="../framework/idea.html#modules" target="_blank">这里</a>的`Modules`中的第(2)点）中`webapp`和`web.xml`的位置。



### JSP登录页面

#### 欢迎页面

​	　`index.jsp`是Servlet项目默认的欢迎页面，无需在`web.xml`中进行配置，项目部署成功后，访问根路径会直接跳转到`index.jsp`页面。

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登录</title>
</head>
<body>
    <form action="/login" method="post">
        用户名：<input name="loginId" type="text"/><br/>
        密码：<input name="loginPwd" type="password"/><br/>
        <input type="submit" value="登录"/>
    </form>
</body>
</html>
```



#### 调转页面

​	　`success.jsp` 和 `fail.jsp`登录跳转页面，登录失败的页面和这个是一样的，这里略过。

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



### 测试运行

​	　最后，参考[Tomcat部署](../framework/idea.md#tomcat部署)笔记，完成Tomcat的项目配置后，即可打开浏览器访问 <a href ="http://localhost:8080" target="view_window"> http://localhost:8080</a>

![login_1](./images/login_1.png)



## v1.1 登录页面

### 引入AdminLTE模板

​	　**AdminLTE**是一个基于BootStrap的管理模板，首先[下载](https://github.com/ColorlibHQ/AdminLTE/releases)`AdminLTE-2.4.18`版本，下载完成后解压文件，得到如下目录：

```
bower_components 浏览器组件(需引入到项目）
dist 源码
-----css(需引入到项目）
-----img(需引入到项目）
-----js (需引入到项目）
documentation 文档
pages demo 示例
plugins 插件(需引入到项目）
```

​	　接着在`webapp`目录下新建`assets`目录，然后将`AdminLTE`需引入到项目的5个目录，全部复制到项目的`assets`目录下。此时，`AdminLTE`模板已经引入成功了。

```
webapp/assets目录
--bower_components 浏览器组件
--css
--img
--js
--plugins 插件
```



### 编写业务代码

#### 登录页面

​	　首先，我们需要模仿AdminLTE模板中`pages\examples\login.html`页面，重写登录页面`index.jsp` ，特别的，修改`Google Font`的地址请参考[这里](https://sb.sb/blog/css-cdn/)。

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>我的商城 | 登录</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.7 -->
    <link rel="stylesheet" href="assets/bower_components/bootstrap/dist/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="assets/bower_components/font-awesome/css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="assets/bower_components/Ionicons/css/ionicons.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="assets/css/AdminLTE.min.css">
    <!-- iCheck checkbox样式-->
    <link rel="stylesheet" href="assets/plugins/iCheck/square/blue.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Google Font -->
    <link rel="stylesheet" href="https://fonts.loli.net/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
</head>
<body class="hold-transition login-page">
<div class="login-box">
    <div class="login-logo">
        <a href="">我的商城</a>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
        <p class="login-box-msg">欢迎管理员登录</p>

        <form action="/login" method="post">
            <div class="form-group has-feedback">
                <input type="email" class="form-control" name="loginId" placeholder="邮箱">
                <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <input type="password" class="form-control" name="loginPwd" placeholder="密码">
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div class="row">
                <div class="col-xs-8">
                    <div class="checkbox icheck">
                        <label>
                            <input type="checkbox"> 记住我
                        </label>
                    </div>
                </div>
                <!-- /.col -->
                <div class="col-xs-4">
                    <button type="submit" class="btn btn-primary btn-block btn-flat">登入</button>
                </div>
                <!-- /.col -->
            </div>
        </form>
        <a href="#">忘记密码？</a><br>

    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<!-- jQuery 3 -->
<script src="assets/bower_components/jquery/dist/jquery.min.js"></script>
<!-- Bootstrap 3.3.7 -->
<script src="assets/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- iCheck -->
<script src="assets/plugins/iCheck/icheck.min.js"></script>
<script>
    $(function () {
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        });
    });
</script>
</body>
</html>
```



#### 登录错误信息

​	　然后，加入登录错误信息的展示，实现的方法有两种，具体方式如下：

（1）方法一 ： 通过修改style样式的方式实现

```html
<!-- 在 [欢迎管理员登录] 下一行加入代码 -->
<div class="alert alert-danger alert-dismissible"
     ${message == null ? "style='display:none'": ""}>
        <button type="button" class="close" 
                data-dismiss="alert" aria-hidden="true">&times;</button>
            ${message}
 </div>
```

（2）方法二：通过JSTL表达式实现

```xml
<!-- 第一步： 需要引入JSTL的Jar包 -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>

<!-- 第二步： 需要在index.jsp的头部引入jstl表达式的支持。 -->
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    
<!-- 第三步： 就可以使用JSTL表达式了（在 [欢迎管理员登录] 下一行加入代码） -->
<c:if test="${message != null}">
   <div class="alert alert-danger alert-dismissible">
       <button type="button" class="close" 
               data-dismiss="alert" aria-hidden="true">&times;</button>
           ${message}
     </div>
</c:if>
```



#### 前端控制器

​	　首先修改页面跳转逻辑，将登录失败跳转为`index.jsp`页面(`fail.jsp`可以删除了)并显示错误信息。此外，还需打印登陆使用的`loginId`和`loginPwd`。

```java{32,33,37,38}
package com.shooter.funtl.module.web.controller;

import com.shooter.funtl.module.entity.User;
import com.shooter.funtl.module.service.UserService;
import com.shooter.funtl.module.service.impl.UserServiceImpl;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoginController extends HttpServlet{

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    private UserService userService = new UserServiceImpl();
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        //获取参数
        String loginId = req.getParameter("loginId");
        String loginPwd = req.getParameter("loginPwd");
        logger.info("email：{} passWord：{}",loginId,loginPwd);
         
        //查询用户信息
        User user = userService.login(loginId, loginPwd);
        //登录失败的处理
        if(user == null){
            req.setAttribute("message","用户名或密码错误！");
            req.getRequestDispatcher("/index.jsp").forward(req,resp);
        }
        //登录成功的处理
        else {
            req.setAttribute("message","登陆成功！");
            req.getRequestDispatcher("/success.jsp").forward(req,resp);
        }
    }
}
```



### 测试运行

（1）欢迎页面

![login_2](./images/login_2.png)



（2）登录失败页面

![login_3](./images/login_3.png)



## v1.2 Spring

### 引入Jar包

```xml
<!--引入Spring所需的spring-context包-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
<!--Junit-->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>
```



### 编写测试用例

#### spring-context.xml

​	　在`resource`目录下新建Spring的配置文件`spring-context.xml`，将类的实例化工作交给 Spring 容器管理（`IoC`）。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <!--Service-->
    <bean id = "userService" class="com.shooter.funtl.module.service.impl.UserServiceImpl"/>
    
</beans>
```



#### 测试运行

​	　新建`SpringContextTest`测试类，测试`UserService`对象是否能够通过 Spring 来创建。

```java
import com.shooter.funtl.module.entity.User;
import com.shooter.funtl.module.service.UserService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SpringContextTest {

    /**
    * 输出结果：Email：admin@qq.com
    */
    @Test
    public void login() {
        // 获取 Spring 容器
        ApplicationContext applicationContext =
                new ClassPathXmlApplicationContext("spring-context.xml");
        // 从 Spring 容器中获取对象
        UserService userService =
                (UserService) applicationContext.getBean("userService");
        User user = userService.login("admin@qq.com","admin");
        System.out.println("Email："+user.getEmail());
    }
    
}
```



## v1.3 SpringWeb

### Spring整合Web

#### 引入Jar包

```xml
<!-- Spring Web -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
<!-- 工具类 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.5</version>
</dependency>
```

#### web.xml

​	　`web.xml`配置中新增如下配置信息：

```xml
<!--JavaBean的配置信息-->
<context-param>
   <param-name>contextConfigLocation</param-name>
   <param-value>classpath:spring-context*.xml</param-value>
</context-param>
<!--自动装配ApplicationContext的配置信息-->
<listener>
   <listener-class>
       org.springframework.web.context.ContextLoaderListener
    </listener-class>
</listener>
```



### 基于配置的装配方式

#### spring-context.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--SpringContext必须在第一行，否则调用getBean时，applicationContext仍为空-->
    <bean id = "springContext" class="com.shooter.funtl.common.context.SpringContext"/>

    <!--DAO-->
    <bean id = "userDao" class="com.shooter.funtl.module.dao.impl.UserDaoImpl"/>

    <!--Service-->
    <bean id = "userService" class="com.shooter.funtl.module.service.impl.UserServiceImpl"/>

</beans>
```



#### SpringContext工具类

```java
package com.shooter.funtl.common.context;

import org.apache.commons.lang3.Validate;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringContext implements ApplicationContextAware,DisposableBean{
    
    private static ApplicationContext applicationContext;

    /**
     * 容器停止时调用
     * */
    public void destroy() throws Exception {
        applicationContext = null;
    }

    /**
     * 将web.xml生成的ApplicationContext实例装载到applicationContext中
     * */
    public void setApplicationContext(ApplicationContext applicationContext) 
        							throws BeansException {
        SpringContext.applicationContext = applicationContext;
    }

    /**
     * 根据类获取实例
     * */
    public static <T> T getBean(Class<T> clazz){
        Validate.validState(applicationContext != null,"ApplicationContext 未被成功加载！");
        return applicationContext.getBean(clazz);
    }

    /**
     * 根据beanId获取实例
     * */
    public static <T> T getBean(String beanId){
        Validate.validState(applicationContext != null,"ApplicationContext 未被成功加载！");
        return (T)applicationContext.getBean(beanId);
    }
}
```



#### 修改Bean装载方式

​	　接着，需要采用`SpringContext.getBean`方法，修改`LoginController`和`UserServiceImpl`中实例化对象的方式。

```java
/**
* 根据类获取实例
* */
public class LoginController extends HttpServlet
    private UserService userService = SpringContext.getBean(UserServiceImpl.class);
}

/**
* 根据beanId获取实例
* */
public class UserServiceImpl implements UserService {
    private UserDao userDao = SpringContext.getBean("userDao");
}
```



### 基于注解的装配方式

#### spring-context.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--开始Spring注解-->
    <context:annotation-config />
    <!--设置扫描目录-->
    <context:component-scan base-package="com.shooter.funtl"/>

</beans>
```



#### 修改Bean装载方式

（1）DAO层的装配

```java
@Repository
public class UserDaoImpl implements UserDao {}

@Autowired
private UserDao userDao
```



（2）Service层的装配

​	　由于目前项目**还没有整合SpringMVC，所以在Controller中无法使用`@Autowired`获取UserService实例**，只能先使用`SpringContext`的`getBean`方法。

```java
@Service
public class UserServiceImpl implements UserService {}

@Component
public class SpringContext implements ApplicationContextAware,DisposableBean{}

/**
* 根据类获取实例
* */
public class LoginController extends HttpServlet
    private UserService userService = SpringContext.getBean(UserServiceImpl.class);
}
```



## v1.4 记住我

### CooickUtils

​	　在`common`中新建`utils`目录，并添加 Cookie 工具类`CookieUtils` 。

```java
package com.shooter.funtl.common.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

/**
 * Cookie 工具类
 */
public final class CookieUtils {

    /**
     * 得到Cookie的值, 不编码
     */
    public static String getCookieValue(HttpServletRequest request, String cookieName) {
        return getCookieValue(request, cookieName, false);
    }

    /**
     * 得到Cookie的值
     */
    public static String getCookieValue(HttpServletRequest request, String cookieName, boolean isDecoder) {
        Cookie[] cookieList = request.getCookies();
        if (cookieList == null || cookieName == null) {
            return null;
        }
        String retValue = null;
        try {
            for (int i = 0; i < cookieList.length; i++) {
                if (cookieList[i].getName().equals(cookieName)) {
                    if (isDecoder) {
                        retValue = URLDecoder.decode(cookieList[i].getValue(), "UTF-8");
                    } else {
                        retValue = cookieList[i].getValue();
                    }
                    break;
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return retValue;
    }

    /**
     * 得到Cookie的值
     */
    public static String getCookieValue(HttpServletRequest request, String cookieName, String encodeString) {
        Cookie[] cookieList = request.getCookies();
        if (cookieList == null || cookieName == null) {
            return null;
        }
        String retValue = null;
        try {
            for (int i = 0; i < cookieList.length; i++) {
                if (cookieList[i].getName().equals(cookieName)) {
                    retValue = URLDecoder.decode(cookieList[i].getValue(), encodeString);
                    break;
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return retValue;
    }

    /**
     * 设置Cookie的值 不设置生效时间默认浏览器关闭即失效,也不编码
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse response, String cookieName,
                                 String cookieValue) {
        setCookie(request, response, cookieName, cookieValue, -1);
    }

    /**
     * 设置Cookie的值 在指定时间内生效,但不编码
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse response, String cookieName,
                                 String cookieValue, int cookieMaxage) {
        setCookie(request, response, cookieName, cookieValue, cookieMaxage, false);
    }

    /**
     * 设置Cookie的值 不设置生效时间,但编码
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse response, String cookieName,
                                 String cookieValue, boolean isEncode) {
        setCookie(request, response, cookieName, cookieValue, -1, isEncode);
    }

    /**
     * 设置Cookie的值 在指定时间内生效, 编码参数
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse response, String cookieName,
                                 String cookieValue, int cookieMaxage, boolean isEncode) {
        doSetCookie(request, response, cookieName, cookieValue, cookieMaxage, isEncode);
    }

    /**
     * 设置Cookie的值 在指定时间内生效, 编码参数(指定编码)
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse response, String cookieName,
                                 String cookieValue, int cookieMaxage, String encodeString) {
        doSetCookie(request, response, cookieName, cookieValue, cookieMaxage, encodeString);
    }

    /**
     * 删除Cookie带cookie域名
     */
    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response,
                                    String cookieName) {
        doSetCookie(request, response, cookieName, "", -1, false);
    }

    /**
     * 设置Cookie的值，并使其在指定时间内生效
     *
     * @param cookieMaxage cookie生效的最大秒数
     */
    private static final void doSetCookie(HttpServletRequest request, HttpServletResponse response,
                                          String cookieName, String cookieValue, int cookieMaxage, boolean isEncode) {
        try {
            if (cookieValue == null) {
                cookieValue = "";
            } else if (isEncode) {
                cookieValue = URLEncoder.encode(cookieValue, "utf-8");
            }
            Cookie cookie = new Cookie(cookieName, cookieValue);
            if (cookieMaxage > 0){
                cookie.setMaxAge(cookieMaxage);
            }
            // 设置域名的cookie
            if (null != request) {
                String domainName = getDomainName(request);
                if (!"localhost".equals(domainName)) {
                    cookie.setDomain(domainName);
                }
            }
            cookie.setPath("/");
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 设置Cookie的值，并使其在指定时间内生效
     *
     * @param cookieMaxage cookie生效的最大秒数
     */
    private static final void doSetCookie(HttpServletRequest request, HttpServletResponse response,
                                          String cookieName, String cookieValue, int cookieMaxage, String encodeString) {
        try {
            if (cookieValue == null) {
                cookieValue = "";
            } else {
                cookieValue = URLEncoder.encode(cookieValue, encodeString);
            }
            Cookie cookie = new Cookie(cookieName, cookieValue);
            if (cookieMaxage > 0){
                cookie.setMaxAge(cookieMaxage);
            }
            // 设置域名的cookie
            if (null != request) {
                String domainName = getDomainName(request);
                if (!"localhost".equals(domainName)) {
                    cookie.setDomain(domainName);
                }
            }
            cookie.setPath("/");
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 得到cookie的域名
     */
    private static final String getDomainName(HttpServletRequest request) {
        String domainName = null;

        String serverName = request.getRequestURL().toString();
        if (serverName == null || serverName.equals("")) {
            domainName = "";
        } else {
            serverName = serverName.toLowerCase();
            serverName = serverName.substring(7);
            final int end = serverName.indexOf("/");
            serverName = serverName.substring(0, end);
            final String[] domains = serverName.split("\\.");
            int len = domains.length;
            if (len > 3) {
                // www.xxx.com.cn
                domainName = "." + domains[len - 3] + "." + domains[len - 2] + "." + domains[len - 1];
            } else if (len <= 3 && len > 1) {
                // xxx.com or xxx.cn
                domainName = "." + domains[len - 2] + "." + domains[len - 1];
            } else {
                domainName = serverName;
            }
        }

        if (domainName != null && domainName.indexOf(":") > 0) {
            String[] ary = domainName.split("\\:");
            domainName = ary[0];
        }
        return domainName;
    }

}
```



### 编写业务代码

#### 设置Cooick

​	　在`LoginController`的`doPost`方法中，`icheck`在`选中时`，设置Cooick键值对生效时间为7天；若`未选中`，则删除原先的Cooick键值对。特别注意：**cookie不支持分号**。

```java{11,21,22,23,24,25,26,19,20}
public class LoginController extends HttpServlet{

    private UserService userService = SpringContext.getBean(UserServiceImpl.class);

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String loginId = req.getParameter("loginId");
        String loginPwd = req.getParameter("loginPwd");
        //icheck在选中时传值为：on ，未选中时传值为：null
        boolean isRemember = "on".equals(req.getParameter("isRemember"));
        
        User user = userService.login(loginId, loginPwd);
        if(user == null){
            req.setAttribute("message","用户名或密码错误！");
            req.getRequestDispatcher("/index.jsp").forward(req,resp);
        }
        else {
            if(isRemember){
                //设置Cookie键值对，以及生效时间为7天
                CookieUtils.setCookie(req,resp,
                        "userInfo",String.format("%s:%s",loginId,loginPwd),
                        7 * 24 * 60 * 60);
            }else {
                CookieUtils.deleteCookie(req,resp,"userInfo");
            }
            req.setAttribute("message","登陆成功！");
            req.getRequestDispatcher("/success.jsp").forward(req,resp);
        }
    }
}
```

​	　设置完成后，重启项目，按`F12`即可在console中看到设置的Cookies的键值对，如下示例：

![login_4](./images/login_4.png)



#### 获取Cooick

​	　由于**Cooick只能通过Get方法获取**，需要改成`/login`的  **`GET`  请求获取Cooick、`POST`设置Cooick**。所以再使用`index.jsp`作为登录页面已经不合适了（因为`index.jsp`是访问路径 `/` 请求的页面），此时，需要登录页面改名成`login.jsp`（代码中的相关跳转也需要修改），`index.jsp`仅作为一个跳转页面。

```html
<!--index.jsp页面-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
    <head>
        <!--不建议使用JS跳转，因为JS可能会被禁用-->
        <meta http-equiv="Refresh" content="0; url=/login">
    </head>
    <body></body>
</html>
```

​	　通过`index.jsp`的GET请求`/login`路径，会进入到`LoginController`的`doGet`方法，来获取`HttpServletRequest`中的Cooick保存的登录信息，然后在转发给`login.jsp`进行展示。

```java
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
    										throws ServletException, IOException {
    String userInfo = CookieUtils.getCookieValue(req, "userInfo");
    if(StringUtils.isNotBlank(userInfo)){
        String[] userInfoArray = userInfo.split(":");
        req.setAttribute("loginId",userInfoArray[0]);
        req.setAttribute("loginPwd",userInfoArray[1]);
        req.setAttribute("isRemember",true);
    }
    req.getRequestDispatcher("/login.jsp").forward(req,resp);
}
```

​	　在邮箱、密码和记住我组件上加入`value`属性，就可以展示保存的用户登录信息了。至此使用Cooick保存用户登录信息以及开发完毕了。

```html
<input type="email" 
       class="form-control" name="loginId" value="${loginId}" placeholder="邮箱">
<input type="password" 
       class="form-control" name="loginPwd" value="${loginPwd}" placeholder="密码">
<input type="checkbox" name="isRemember" ${isRemember == true ? "checked" :""}> 记住我
```



### 测试运行

​	　使用正确的用户名、密码，并勾选记住我，登录成功后，再次访问http://localhost:8080/login，就可以展示已保存的用户登录信息了。不勾选记住我，登录成功后，也不会记录用户信息了。

![login_5](./images/login_5.png)



## v1.5 SpringMVC

### Spring整合MVC

#### 引入Jar包

```xml
<!--Spring MVC-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```

#### web.xml

​	　在`web.xml`中去除Servlet拦截器配置，并引入Spring MVC需要的`DispatcherServlet` 分发器 和 字符集过滤器`CharacterEncodingFilter`。

```xml {21-37,39-54}
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <display-name>myshop</display-name>

    <!--JavaBean的配置信息-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-context*.xml</param-value>
    </context-param>
    <!--自动装配ApplicationContext的配置信息-->
    <listener>
        <listener-class>
            org.springframework.web.context.ContextLoaderListener
        </listener-class>
    </listener>

    <!--配置字符集过滤器CharacterEncodingFilter，用于解决中文编码问题-->
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--配置 Spring 的 Servlet 分发器DispatcherServlet处理所有 HTTP 的请求和响应-->
    <servlet>
        <servlet-name>springServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath*:/spring-mvc*.xml</param-value>
        </init-param>
        <!--优先启动，设置优先级为1（最高） -->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--拦截所有请求，交于DispatchServlet处理 -->
    <servlet-mapping>
        <servlet-name>springServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```



#### spring-mvc.xml

​	　在`resource`目录下新建`sprin-mvc.xml`文件来配置 MVC。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <description>Spring MVC Configuration</description>

    <!-- 加载配置属性文件 -->
    <context:property-placeholder ignore-unresolvable="true" 
                                  location="classpath:myshop.properties"/>

    <!-- 使用 Annotation 自动注册 Bean,只扫描 @Controller -->
    <context:component-scan base-package="com.shooter.funtl" use-default-filters="false">
        <context:include-filter type="annotation" 
                                expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- 默认的注解映射的支持 -->
    <mvc:annotation-driven />

    <!-- 定义视图文件解析 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="${web.view.prefix}"/>
        <property name="suffix" value="${web.view.suffix}"/>
    </bean>

    <!-- 静态资源映射 -->
    <mvc:resources mapping="/static/**" location="/static/" cache-period="31536000"/>
</beans>
```



#### myshop.properties

​	　在`resource`目录下新建`myshop.properties`文件用于动态加载属性配置文件。

```properties
web.view.prefix=/WEB-INF/views/
web.view.suffix=.jsp
```



#### spring-context.xml

​	　`@Controller`已交于`spring-mvc.xml`管理，故需要将`spring-context.xml`中的 `@Controller` 注解的扫描配置排除。

```xml{3,4}
<context:component-scan base-package="com.shooter.funtl">
    <!--@Controller交于spring-mvc.xml管理，扫描配置在从spring-context.xml中排除-->
    <context:exclude-filter type="annotation" 
                            expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```



#### 页面静态资源

​	　首先，在`webapp/WEB-INF`目录下新建`views`目录作为JSP页面目录，在`webapp`目录下新建`static`目录，用于存放静态资源。接着，删除`index.jsp`、修改`success.jsp`为`main.jsp`、并将`login.jsp`和`main.jsp`移至`webapp/WEB-INF/views/`下、以及将`assets`目录移至`webapp/static/`下。最后，还需要修改`index.jsp`中静态资源的引用路径地址(略)。

![login_6](./images/login_6.png)



### SpringMVC控制器

​	　目前，项目中有`login.jsp`和`main.jsp`，对应`LoginController`和`MainController`。使用SpringMVC重写`记住我`的功能，并新增退出登录的功能。

#### SessionConstant

​	　新建`SessionConstant`类，并将常量`user`作为`SESSION_USER`。

```java
package com.shooter.funtl.common.constant;

public class SessionConstant {

    public static final String SESSION_USER = "user";

}
```



#### LoginController

```java{20,21,26,41-44,65,66,74-78}
package com.shooter.funtl.module.web.controller;
import com.shooter.funtl.common.constant.SessionConstant;
import com.shooter.funtl.common.utils.CookieUtils;
import com.shooter.funtl.module.entity.User;
import com.shooter.funtl.module.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    /**
     * 跳转登录页面
     * */
    @RequestMapping(value = {"", "login"}, method = RequestMethod.GET)
    public String login(HttpServletRequest req) {
        String userInfo = CookieUtils.getCookieValue(req,SessionConstant.SESSION_USER);
        if(StringUtils.isNotBlank(userInfo)){
            String[] userInfoArray = userInfo.split(":");
            req.setAttribute("loginId",userInfoArray[0]);
            req.setAttribute("loginPwd",userInfoArray[1]);
            req.setAttribute("isRemember",true);
        }
        return "login";
    }

    /**
     * 登录逻辑
     * */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public String login(@RequestParam(required = true) String loginId,
                        @RequestParam(required = true) String loginPwd,
                        String isRemember, HttpServletRequest req,HttpServletResponse resp) {

        boolean isCheck = "on".equals(isRemember);
        //查询用户信息
        User user = userService.login(loginId, loginPwd);
        //登录失败的处理
        if(user == null){
            req.setAttribute("message","用户名或密码错误！");
            return login(req);
        }
        //登录成功的处理
        else {
            if(isCheck){
                //设置Cookie键值对，以及生效时间为7天
                CookieUtils.setCookie(req,resp,
                        SessionConstant.SESSION_USER,String.format("%s:%s",loginId,loginPwd),
                        7 * 24 * 60 * 60);
            }else {
                CookieUtils.deleteCookie(req,resp,SessionConstant.SESSION_USER);
            }
            req.setAttribute("message","登陆成功！");
            //将登陆信息放入Session
            req.getSession().setAttribute(SessionConstant.SESSION_USER,user);
            return "redirect:/main";
        }
    }

     /**
     * 注销登录
     * */
    @RequestMapping(value = "logout",method = RequestMethod.GET)
    public String logout(HttpServletRequest req){
        req.getSession().invalidate();
        return login(req);
    }
}
```



#### MainController

```java
package com.shooter.funtl.module.web.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {

    /**
     * 跳转登陆页面
     * */
    @RequestMapping(value = "main", method = RequestMethod.GET)
    public String login() {
        return "main";
    }
}
```



### SpringMVC拦截器

​	　SpringMVC中不能使用Servlet过滤器，只能使用**SpringMVC拦截器**做日志记录、权限管理等。如实现  **未登陆的只能访问登录页**（登陆拦截器）和 **已经登陆的不能再访问登录页**（权限拦截器） 。

#### 登录拦截器

##### web.xml

```xml
<!-- 拦截器配置，拦截顺序：先执行后定义的，排在第一位的最后执行。-->
<mvc:interceptors>
   <!-- 登录拦截器：登陆和静态资源不做拦截-->
    <mvc:interceptor>
        <mvc:mapping path="/**"/>
        <mvc:exclude-mapping path="/static/**"/>
        <mvc:exclude-mapping path="/login"/>
        <bean class="com.shooter.funtl.module.web.interceptor.LoginInterceptor"/>
    </mvc:interceptor>
</mvc:interceptors>
```



##### LoginInterceptor

```java
package com.shooter.funtl.module.web.interceptor;

import com.shooter.funtl.common.constant.SessionConstant;
import com.shooter.funtl.module.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 登录拦截器
 * */
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        User user = (User)httpServletRequest.getSession().getAttribute(SessionConstant.SESSION_USER);
        //未登录
        if(user == null){
            // 用户未登录，重定向到登录页
            httpServletResponse.sendRedirect("/login");
            return false;
        }
        //放行
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
```



#### 权限拦截器

##### web.xml

```xml{10-14}
 <!-- 拦截器配置，拦截顺序：先执行后定义的，排在第一位的最后执行。-->
 <mvc:interceptors>
     <!-- 登录拦截器-->
     <mvc:interceptor>
         <mvc:mapping path="/**"/>
         <mvc:exclude-mapping path="/static/**"/>
         <mvc:exclude-mapping path="/login"/>
         <bean class="com.shooter.funtl.module.web.interceptor.LoginInterceptor"/>
     </mvc:interceptor>
     <!-- 权限拦截器-->
     <mvc:interceptor>
         <mvc:mapping path="/**"/>
         <bean class="com.shooter.funtl.module.web.interceptor.PermissionIterceptorterceptor"/>
     </mvc:interceptor>
 </mvc:interceptors>
```



##### PermissionInterceptor

```java
package com.shooter.funtl.module.web.interceptor;

import com.shooter.funtl.common.constant.SessionConstant;
import com.shooter.funtl.module.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 权限拦截器
 * */
public class PermissionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {

        //放行
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

        //当返回JSON数据时，modelAndView为空
         if(modelAndView != null && modelAndView.getViewName()!=null && modelAndView.getViewName().endsWith("login")){
            User user = (User)httpServletRequest.getSession().getAttribute(SessionConstant.SESSION_USER);
            if(user != null){
                httpServletResponse.sendRedirect("/main");
            }
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
```



### 测试运行

```
- 未登录状态，访问http://localhost:8080/main 会自动跳转到 http://localhost:8080/login
- 已登录状态，访问http://localhost:8080/login会自动跳转到 http://localhost:8080/main
- 已登录状态，访问http://localhost:8080/logout会退出登录
```



## v1.6 Mybatis

​	　**ORM**是指**对象关系映射**，可以将**数据库关系** 和 **Java原生对象** 关联起来。Mybatis具有**三级缓存**，具有**幂等性**的查询适合放缓存中，一级缓存空间最小，查询速度最快，三级最大，查询速度也最慢，若三级也查询不到，就会在数据库中查询。

```
L1 一级缓存 256K 内存缓存
L2 二级缓存 2MB	 磁盘缓存
L3 三级缓存 8MB  网络缓存
```



### Spring整合Druid

#### 引入Jar包

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.6</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.46</version>
</dependency>
```



#### 数据库连接配置

​	　在`myshop.properties`中引入数据库连接配置。

```properties{3-6,9-11,14}
# JDBC
# MySQL 8.x: com.mysql.cj.jdbc.Driver
jdbc.driverClass=com.mysql.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://数据库IP:3306/数据库名称?useUnicode=true&characterEncoding=utf-8&useSSL=false
jdbc.username=用户名
jdbc.password=密码

# JDBC Pool
jdbc.pool.init=1
jdbc.pool.minIdle=3
jdbc.pool.maxActive=20

# JDBC Test
jdbc.testSql=SELECT 'x' FROM DUAL

web.view.prefix=/WEB-INF/views/
web.view.suffix=.jsp
```



#### spring-context-druid.xml

​	　新建`spring-context-druid.xml`配置文件，完成Spring和druid的整合。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 加载配置属性文件 -->
    <context:property-placeholder ignore-unresolvable="true" location="classpath:myshop.properties"/>

    <!-- 数据源配置, 使用 Druid 数据库连接池 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
        <!-- 数据源驱动类可不写，Druid默认会自动根据URL识别DriverClass -->
        <property name="driverClassName" value="${jdbc.driverClass}"/>

        <!-- 基本属性 url、user、password -->
        <property name="url" value="${jdbc.connectionURL}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>

        <!-- 配置初始化大小、最小、最大 -->
        <property name="initialSize" value="${jdbc.pool.init}"/>
        <property name="minIdle" value="${jdbc.pool.minIdle}"/>
        <property name="maxActive" value="${jdbc.pool.maxActive}"/>

        <!-- 配置获取连接等待超时的时间 -->
        <property name="maxWait" value="60000"/>

        <!-- 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒 -->
        <property name="timeBetweenEvictionRunsMillis" value="60000"/>

        <!-- 配置一个连接在池中最小生存的时间，单位是毫秒 -->
        <property name="minEvictableIdleTimeMillis" value="300000"/>

        <property name="validationQuery" value="${jdbc.testSql}"/>
        <property name="testWhileIdle" value="true"/>
        <property name="testOnBorrow" value="false"/>
        <property name="testOnReturn" value="false"/>

        <!-- 配置监控统计拦截的filters -->
        <property name="filters" value="stat"/>
    </bean>
</beans>
```



#### 配置 Druid 监控中心

​	　在 `web.xml` 中配置 Druid 提供的 Servlet，可以通过[http://localhost:8080/druid/index.html](http://localhost:8080/druid/index.html) 查看Druid 提供的监控数据。

```xml
<!--配置 Druid 监控中心 -->
<servlet>
    <servlet-name>DruidStatView</servlet-name>
    <servlet-class>com.alibaba.druid.support.http.StatViewServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>DruidStatView</servlet-name>
    <url-pattern>/druid/*</url-pattern>
</servlet-mapping>
```



### Spring整合Mybatis

#### 引入Jar包

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.2.8</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>1.3.1</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```

#### mybatis-config.xml

​	　新建`mybatis-config.xml`MyBatis 配置文件。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 全局参数 -->
    <settings>
        <!-- 打印 SQL 语句，该配置只能在开发环境中开启 -->
        <setting name="logImpl" value="STDOUT_LOGGING" />

        <!-- 使全局的映射器启用或禁用缓存。 -->
        <setting name="cacheEnabled" value="false"/>

        <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载。 -->
        <setting name="lazyLoadingEnabled" value="true"/>

        <!-- 当启用时，有延迟加载属性的对象在被调用时将会完全加载任意属性。否则，每种属性将会按需要加载。 -->
        <setting name="aggressiveLazyLoading" value="true"/>

        <!-- 是否允许单条 SQL 返回多个数据集 (取决于驱动的兼容性) default:true -->
        <setting name="multipleResultSetsEnabled" value="true"/>

        <!-- 是否可以使用列的别名 (取决于驱动的兼容性) default:true -->
        <setting name="useColumnLabel" value="true"/>

        <!-- 允许 JDBC 生成主键。需要驱动器支持。如果设为了 true，这个设置将强制使用被生成的主键，有一些驱动器不兼容不过仍然可以执行。 default:false  -->
        <setting name="useGeneratedKeys" value="false"/>

        <!-- 指定 MyBatis 如何自动映射 数据基表的列 NONE：不映射 PARTIAL：部分 FULL:全部  -->
        <setting name="autoMappingBehavior" value="PARTIAL"/>

        <!-- 这是默认的执行类型 （SIMPLE: 简单； REUSE: 执行器可能重复使用prepared statements语句；BATCH: 执行器可以重复执行语句和批量更新） -->
        <setting name="defaultExecutorType" value="SIMPLE"/>

        <!-- 使用驼峰命名法转换字段。 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>

        <!-- 设置本地缓存范围 session:就会有数据的共享 statement:语句范围 (这样就不会有数据的共享 ) defalut:session -->
        <setting name="localCacheScope" value="SESSION"/>

        <!-- 设置 JDBC 类型为空时,某些驱动程序 要指定值, default:OTHER，插入空值时不需要指定类型 -->
        <setting name="jdbcTypeForNull" value="NULL"/>
    </settings>
</configuration>
```



#### spring-context-mybatis.xml

​	　新建`spring-context-mybatis.xml`配置文件，完成Spring和mybatis的整合。`ref="dataSource"`指的是**mybatis实例是从druid获取**的。

```xml{7}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 配置 SqlSession -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!-- 用于配置对应实体类所在的包，多个 package 之间可以用 ',' 号分割 -->
        <property name="typeAliasesPackage" value="com.shooter.funtl.module.entity"/>
        <!-- 用于配置对象关系映射配置文件所在目录 -->
        <property name="mapperLocations" value="classpath:/mapper/**/*.xml"/>
        <property name="configLocation" value="classpath:/mybatis-config.xml"></property>
    </bean>

    <!-- 扫描 Mapper -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.shooter.funtl.module.dao" />
    </bean>
</beans>
```



### 实现用户登陆

#### 定义实体类

```java
package com.shooter.funtl.module.entity;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class User implements Serializable{
    private Long id;
    private String userName;
    private String passWord;
    private String email;
    private Long phone;
    private Date createTime;
    private Date updateTime;
}
```



#### 业务逻辑接口

（1）UserService

```java
package com.shooter.funtl.module.service;

import com.shooter.funtl.module.entity.User;
import java.util.List;

public interface UserService {
    List<User> selectByUserLike(User user);
    User selectUserById(Long id);
    User selectUserByName(String userName);
    List<User> selectUserByNameLike(String userNameLike);
    User selectUserByEmail(String email);
    List<User> selectUserAll();
    void insert(User user);
    void updateById(User user);
    void deleteById(Long id);
    User login(String email, String passWord);
}
```



（2）UserServiceImpl

```java
package com.shooter.funtl.module.service.impl;

import com.shooter.funtl.module.dao.UserDao;
import com.shooter.funtl.module.entity.User;
import com.shooter.funtl.module.service.UserService;
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public User login(String email, String passWord) {
        val user = selectUserByEmail(email);
        if( user != null){
            // 名为密钥加盟
            String md5PassWd = DigestUtils.md5DigestAsHex(passWord.getBytes());
            if(md5PassWd.equals(user.getPassWord())){
                return user;
            }
        }
        return null;
    }

    @Override
    public User selectUserById(Long id) {
        val params = new User();
        params.setId(id);
        return userDao.selectUserByParams(params);
    }

    @Override
    public User selectUserByName(String userName) {
        val params = new User();
        params.setUserName(userName);
        return userDao.selectUserByParams(params);
    }

    @Override
    public List<User> selectUserByNameLike(String userNameLike) {
        return userDao.selectUserByUserNameLike(userNameLike);
    }

    @Override
    public User selectUserByEmail(String email) {
        val params = new User();
        params.setEmail(email);
        return userDao.selectUserByParams(params);
    }

    @Override
    public List<User> selectUserAll() {
        return userDao.selectUserAll();
    }

    @Override
    public void insert(User user) {
        userDao.insert(user);
    }

    @Override
    public void updateById(User user) {
        userDao.updateById(user);
    }

    @Override
    public void deleteById(Long id) {
        userDao.deleteById(id);
    }
    
     @Override
    public List<User> selectByUserLike(User user) {
        return userDao.selectByUserLike(user);
    }
}
```



#### 数据访问接口

​	　Spring 集成 MyBatis 后，不需要手动实现 DAO 层的接口，所有的 SQL 执行语句都写在对应的关系映射配置文件中。所以此次还需要删除`UserDaoImpl.java`文件。

```java
package com.shooter.funtl.module.dao;

import com.shooter.funtl.module.entity.User;
import java.util.List;

public interface UserDao {

    /**按条件查询用户信息**/
    User selectUserByParams(User params);
    
    /**根据用户信息进行模糊查询**/
    List<User> selectByUserLike(User params);

    /**按条件查询用户信息**/
    List<User> selectUserByUserNameLike(String userNameLike);

    /**查询全部用户信息**/
    List<User> selectUserAll();

    /**新增用户信息**/
    void insert(User user);

    /**更新用户信息**/
    void updateById(User user);

    /**删除用户信息**/
    void deleteById(Long id);
}
```



#### 映射文件

​	　在 `src/resources/mapper` 文件夹下新建`UserMapper.xml`映射文件用于完成 **DAO 层**中 **SQL 语句**的映射。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.shooter.funtl.module.dao.UserDao">

    <sql id="userSelect">
        user.id,
        user.username as userName,
        user.password as passWord,
        user.phone,
        user.email,
        user.created as createTime,
        user.updated as updateTime
    </sql>

    <select id="selectUserByParams" resultType="User">
        SELECT
            <include refid="userSelect" />
        FROM
            tb_user AS user
        <where>
            <if test="id != null and id != ''">
                AND user.id =  #{id}
            </if>
            <if test="userName != null and userName != ''">
                AND user.username =  #{userName}
            </if>
            <if test="email != null and email != ''">
                AND user.email =  #{email}
            </if>
            <if test="phone != null and phone != ''">
                AND user.phone =  #{phone}
            </if>
        </where>
    </select>
    
    <select id="selectByUserLike" resultType="User">
        SELECT
            <include refid="userSelect" />
        FROM
            tb_user AS user
        <where>
            <if test="userName != null and userName != ''">
                AND user.username LIKE CONCAT ('%', #{userName}, '%')
            </if>
            <if test="email != null and email != ''">
                AND user.email LIKE CONCAT ('%', #{email}, '%')
            </if>
            <if test="phone != null and phone != ''">
                AND user.phone LIKE CONCAT ('%', #{phone}, '%')
            </if>
        </where>
    </select>

    <select id="selectUserByUserNameLike" resultType="User">
        SELECT
            <include refid="userSelect" />
        FROM
            tb_user AS user
        <where>
            AND username LIKE CONCAT ('%', #{userNameLike}, '%')
        </where>
    </select>

    <select id="selectUserAll" resultType="User">
        SELECT
            <include refid="userSelect" />
        FROM
            tb_user AS user
    </select>

    <insert id="insert">
        INSERT INTO tb_user  (
            id,
            username,
            password,
            phone,
            email,
            created,
            updated
        )
        VALUES (
            #{id},
            #{userName},
            #{passWord},
            #{phone},
            #{email},
            now(),
            now()
        )
    </insert>


    <delete id="deleteById">
        DELETE FROM tb_user WHERE id = #{id}
    </delete>

    <update id="updateById">
        UPDATE
            tb_user
        SET
            username = #{userName},
            password = #{passWord},
            phone = #{phone},
            email = #{email},
            updated = now()
        WHERE id = #{id}
    </update>

</mapper>
```



### 测试运行

#### 引入Jar包

```xml
<!--引入spring-test测试包-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
<!--Junit的jar包已经引入过了-->
```



#### UserServiceTest

​	　在 `src/test/java` 文件夹下新建`UserServiceTest`测试用例，通过`@ContextConfiguration`注解引入所需的配置文件，测试的UserService的方法是否正确。

```java
import com.shooter.funtl.module.entity.User;
import com.shooter.funtl.module.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.DigestUtils;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:spring-context.xml", "classpath:spring-context-druid.xml", "classpath:spring-context-mybatis.xml"})
public class UserServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceTest.class);

    @Autowired
    private UserService userService;

    @Test
    public void testSelectUserById() {
        User user = userService.selectUserById(7L);
        logger.info("testSelectUserById : 用户名 {}",user.getUserName());
    }

    @Test
    public void testSelectUserByName() {
        User user = userService.selectUserByName("zhangsan1");
        logger.info("testSelectUserByName : 用户名 {}",user.getUserName());
    }

    @Test
    public void testSelectUserByNameLike() {
        List<User> users = userService.selectUserByNameLike("zhangsan");
        logger.info("testSelectUserByNameLike : 共计 {} 个",users.size());
    }

    @Test
    public void selectUserByEmail() {
        User user = userService.selectUserByEmail("admin@qq.com");
        logger.info("selectUserByEmail : 用户名 {}",user.getUserName());
    }

    @Test
    public void testSelectAll() {
        List<User> users = userService.selectUserAll();
        logger.info("testSelectAll : 共计 {} 个",users.size());
    }

    @Test
    public void testInsert() {
        User user = new User();
        user.setEmail("admin@qq.com");
        user.setPassWord(DigestUtils.md5DigestAsHex("123456".getBytes()));
        user.setPhone(15888888888L);
        user.setUserName("admin");
        userService.insert(user);
    }

    @Test
    public void testUpdateById() {
        User user = userService.selectUserById(37L);
        user.setUserName("adminTest");
        userService.updateById(user);
    }

    @Test
    public void testDeleteById() {
        userService.deleteById(37L);
    }

}
```



