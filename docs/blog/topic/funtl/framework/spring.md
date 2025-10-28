---
sidebar: auto
---

# Spring

​	　Spring 是一个分层的 `Java SE/EE full-stack`(一站式)轻量级开源框架，主要作用就是降低企业应用开发的复杂性问题（**解耦**）。Spring 的核心是**控制反转**（`IoC`）和**面向切面编程**（`AOP`）。



## Spring简介

​	　Spring 由 20 多个模块组成，它们可以分为 **数据访问/集成**（Data Access/Integration）、**Web**、**面向切面编程**（AOP, Aspects）、**应用服务器设备管理**（Instrumentation）、**消息发送**（Messaging）、**核心容器**（Core Container）和**测试**（Test）。

![2_spring_01](./images/2_spring_01.png)

​	　Spring具有**非侵入式**的特性，Spring 框架的 API 不会在业务逻辑上出现，即业务逻辑是 POJO。由于业务逻辑中没有 Spring 的 API，所以**业务逻辑可以从 Spring 框架快速的移植到其他框架**， 即与环境无关。

​	　Spring 作为一个**容器**，可以管理对象的生命周期、对象与对象之间的依赖关系。可以通过配置文件，来定义对象，以及设置与其他对象的依赖关系。



### 面向切面编程AOP

​	　**面向切面编程**（`AOP`，`Aspect Orient Programming`），是对面向对象编程思想 `OOP`的补充。Spring 提供了面向切面编程的丰富支持，允许通过分离应用的 **业务逻辑** 与**系统级服务** 进行开发。**应用对象只完成业务逻辑**，并不负责系统级服务。

​	　根据功能的不同，系统中的代码可以分为 **主业务逻辑** 与 **系统级业务逻辑** 两类。`主业务代码`间逻辑联系紧密，有具体的专业业务应用场景，复用性相对较低；`系统级业务`相对功能独立，没有具体的专业业务应用场景，主要是为主业务提供系统级服务，如日志、安全、事务、数据库连接等，**复用性强**。

```
如：JDBC来链接数据库：
	1、加载JDBC驱动程序（系统级业务逻辑）
	2、创建连接（系统级业务逻辑）
	3、创建Statement对象（系统级业务逻辑）
	4、执行SQL语句 （主业务逻辑：银行业务、保险业务、电商业务、物流业务）
	5、处理sql的返回结果（系统级业务逻辑）
	6、释放连接（系统级业务逻辑）
```

​	　我们可以把日志、安全、事务管理、数据库连接等服务理解成一个“**切面**”，那么以前这些服务一直是直接写在业务逻辑的代码当中的，这有两点不好：首先**业务逻辑不纯净**；其次这些服务被很多**业务逻辑反复使用**，完全可以剥离出来做到复用。

​	　 **AOP 可以把这些服务剥离出来形成一个“切面”**，然后将“切面”由 Spring 容器统一动态的“织入”到业务逻辑中，让业务逻辑能够享受到此“切面”的服务。



### 控制反转IoC

​	　**控制反转**（`IoC`，`Inversion of Control`）就是将**对象控制权**由`程序代码`**反转**到`外部容器`，创建被调用者的实例不是由调用者（程序代码）完成，而是由 `外部容器` 实现对对象的统一装配和管理。IoC 思想实现方式有 **依赖注入**和 **依赖查找** 两种。

​	　**依赖查找**（Dependency Lookup，`DL`），容器提供回调接口和上下文环境给组件，程序代码则需要提供具体的查找方式。比较典型的是依赖于 JNDI 系统的查找。

​	　**依赖注入** (Dependency Injection，`DI`) 是指在对象初始化时不等对象请求，Spring容器就主动创建对象实例，并将依赖注入到调用者中。

​	　依赖注入和 依赖查找 两种方法都是将对象控制权交于外部容器统一装配和管理，区别在于当对象初始化时，依赖查找需要**程序主动调用**容器提供的回调接口，从容器中查找所需要的依赖。而依赖注入在对象初始化时不等对象请求，Spring容器就主动创建对象实例，并将依赖注入到调用者中。

​	　**Spring 依赖注入对调用者与被调用者几乎没有任何要求**，完全支持 POJO 之间依赖关系的管理。**依赖注入是目前最优秀的解耦方式**。



## 整合Spring

### 引入Jar包

​	　首先，在`pom.xml`文件中引入Spring所需的`spring-context`包。

```xml
<!--Spring-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```



### 编写业务代码

​	　然后，在编写`UserService.java`和`UserServiceImpl.java`，实现一个简单的`sayHi()`方法。

```java
//接口，UserService.java
public interface UserService {
    void sayHi();
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
    <bean id="userService" class="com.shooter.funtl.service.impl.UserServiceImpl" />
</beans>
```

​	　`<bean/>`元素用于定义一个实例对象，**一个实例对应一个 bean 元素**；`id`属性是 Bean 实例的**唯一标识**，程序通过 id 属性访问 Bean，Bean 与 Bean 间的依赖关系也是通过 id 属性关联的；`class`属性指定该 Bean 所属的类，注意这里**只能是类**，不能是接口。

​	　最后，在 `SpringTest` 测试类中，测试对象是否能够通过 Spring 来创建。

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

