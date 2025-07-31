---
sidebar: false
---

# 第一个SpringWeb应用

​	　首先，创建一个工程名为 `spring-web` 的`maven`项目，并新建如下项目目录结构：

```
--src
----main
------java
--------commons
----------SpringContext.java		SpringWeb组件
--------controller
----------UserController			User
--------service
----------impl
------------UserServiceImpl.java	 User服务实现类
----------UserService.java            User服务类
------resources
--------spring-context.xml			spring配置文件
------resources
--------spring-context.xml			spring配置文件
----test
--pom.xml						   pom配置文件
```

​	　接着，在`pom.xml`文件中引入Spring所需的`spring-context`包。

```xml
 <dependencies>
     <!--spring-->
     <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-context</artifactId>
         <version>4.3.17.RELEASE</version>
     </dependency>
     <!--spring-web-->
	 <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-web</artifactId>
         <version>4.3.17.RELEASE</version>
     </dependency>
     <!--servlet-->
     <dependency>
         <groupId>javax.servlet</groupId>
         <artifactId>javax.servlet-api</artifactId>
         <version>3.1.0</version>
         <scope>provided</scope>
     </dependency>
</dependencies>
```

​	　然后，在编写`UserService.java`和`UserServiceImpl.java`，实现一个简单的`sayHi()`方法。

```java
//接口，UserService.java
public interface UserService {
    public void sayHi();
}

// 实现类，UserServiceImpl.java
public class UserServiceImpl implements UserService {
    public void sayHi() {
        System.out.println("Hello Spring");
    }
}
```

​	　代码编写完成后，还需要在Spring的配置文件`spring-context.xml`中，将类的实例化工作交给 Spring 容器管理（`IoC`）。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="userService" class="service.impl.UserServiceImpl" />
</beans>
```

​	　`<bean/>`元素用于定义一个实例对象，**一个实例对应一个 bean 元素**；`id`属性是 Bean 实例的**唯一标识**，程序通过 id 属性访问 Bean，Bean 与 Bean 间的依赖关系也是通过 id 属性关联的；`class`属性指定该 Bean 所属的类，注意这里**只能是类**，不能是接口。

​	　由于项目中包含`Spring`配置，还需要在`Project Settings` 中配置Spring的xml配置文件的位置。

![1601133761833](./images/1601133761833.png)

​	　最后，在 `MyTest` 测试类中，测试对象是否能够通过 Spring 来创建。

```java
 public static void main(String[] args) {
     // 获取 Spring 容器
     ApplicationContext applicationContext = 
         new ClassPathXmlApplicationContext("spring-context.xml");

     // 从 Spring 容器中获取对象
     UserService userService = 
         (UserService) applicationContext.getBean("userService");
     userService.sayHi();
 }
```

