---
sidebar: auto
---

# SpringWeb

​	　Spring中装配`JavaBean`的方式有两类，第一类通过**Spring在JavaSE容器中装配JavaBean**，这一类不常用（参见[这里](./spring.md#整合spring)）；第二类是通过**SpringWeb在Web容器中装配JavaBean**，该类型有两种方法，第一种是通过**XML配置**的方式，第二种是通过**注解**的方式，目流行的是**通过SpringWeb注解的方式装配JavaBean**。

​	　注解方式 **配置方便、直观**，但以硬编码的方式写入到了 Java 代码中，其修改是需要重新编译代码的，而XML 配置方式的最大好处是对其所做修改**无需编译代码**可立即生效。若注解与 XML 同用，**XML 的优先级要高于注解**。特别的，项目通过`SpringWeb`修改了Bean的装配方式后，原先`new`的方式就不能正常使用了的。



## Spring整合Web

### 引入Jar包

```xml
<!-- Spring Web -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```



### ApplicationContext

​	　在JavaSE中，是通过`main`方法`new`完成`ApplicationContext`初始化的。但是在Web容器中，入口是`web.xml`，所以，要将`ApplicationContext`的初始化工作交于`web.xml`。

```xml
<!--spring-context*.xml配置了JavaBean与Class的对应关系-->
<context-param>
   <param-name>contextConfigLocation</param-name>
   <param-value>classpath:spring-context*.xml</param-value>
</context-param>
<!--Spring提供的ContextLoaderListener在启动容器时，可以自动装配ApplicationContext-->
<listener>
      <listener-class>
          org.springframework.web.context.ContextLoaderListener
      </listener-class>
</listener>
```

​	　在启动Web容器时，首先会运行`web.xml`中配置的`listener`对象`ContextLoaderListener`，其会根据`spring-context*.xml`中配置的**JavaBean与Class的对应关系** 以及  **Bean的作用域**，适时**调用 Bean 类的无参构造器**，创建空值的实例对象，**自动装配**`ApplicationContext`。



## 基于配置装配

### spring-context.xml

​	　在Spring的配置文件`spring-context.xml`中配置`bean`与`class`之间的对应关系，将类的实例化工作交给 Spring 容器管理（`IoC`）。特别的，class不能是抽象类或者接口。

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
    
</beans>
```

​	　`<bean/>`元素用于定义一个实例对象，**一个实例对应一个 bean 元素**；`id`属性是 Bean 实例的**唯一标识**，程序通过 id 属性访问 Bean，Bean 与 Bean 间的依赖关系也是通过 id 属性关联的；`class`属性指定该 Bean 所属的类，注意这里**只能是类**，不能是接口。

### SpringContext

​	　`SpringContext`工具类通过实现`ApplicationContextAware`接口的`setApplicationContext`方法获取已经初始化完成的`ApplicationContext`对象；以及通过实现`DisposableBean`接口的`destroy`方法可以销毁该`ApplicationContext`对象。 

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



### bean实例注入

​	　Bean 的装配方式可以通过`类名`或者`beanId`调用`getBean`的方式从容器获取指定的 Bean 实例。示例代码如下：

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



## 基于注解装配

### spring-context.xml

​	　采用`SpringWeb`注解的方式装配`JavaBean`，无需每次当Class新增的时候就在`spring-context.xml`中新增一个bean的XML配置，而是采用了**自动扫描目录下注解**的方式装配`JavaBean`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd 
       http://www.springframework.org/schema/context 
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!--开始Spring注解-->
    <context:annotation-config />
    <!--配置组件扫描器，用于在指定的基本包中扫描注解-->
    <context:component-scan base-package="com.shooter.funtl"/>

</beans>
```



### Bean标注注解

​	　SpringWeb通过在类上声明如下四个注解，来指定`class`与`bean`之间关系的注解， `value` 属性用于指定该 `bean` 的 `id` 值，同样的这些`class`不能是抽象类或者接口。

```
- @Component：用于 Component 或者 class 实现类进行注解
- @Repository：用于对 DAO 实现类进行注解
- @Service：用于对 Service 实现类进行注解
- @Controller：用于对 Controller 实现类进行注解
```

​	　`@Controller`注解后续`SpringMvc`会对其单独做处理；其他的三个注解，除语义外功能上是等效注解（只有例如`SpringDataJpa`等会对不同的注解做出区别），但是建议不同的注解要标注在相应的类上。

```java
/**
* 相当于（建议）
* <bean id = "userDao" class="com.shooter.funtl.module.dao.impl.UserDaoImpl"/>
* */
@Repository
public class UserDaoImpl implements UserDao {}

/**
* 相当于
* <bean id = "userDaoTest" class="com.shooter.funtl.module.dao.impl.UserDaoImpl"/>
* */
@Repository(value = "userDaoTest")
public class UserDaoImpl implements UserDao {}
```



### bean实例注入

```java
- @Autowired: 按类型自动装配Bean，可用于属性、方法或者构造器。
- @Resource: 按beanId(可由name属性指定)自动装配，可用于属性、方法或者构造器。
- @Value：该注解的 value 属性用于指定要注入的值，可用于属性、方法或者构造器。
- @PostConstruct：在方法上使用 @PostConstruct 相当于初始化，会在构造器之前调用。
```

​	　`@Autowired`和`@Resource`多用于**对象的自动装配**，`@Value`和`@PostConstruct`多用于**属性的初始化**。示例代码如下：

```java
/**
* @Autowired根据类型装配
* 方式一：使用该注解完成属性注入时，类中无需 setter
* 说明：Student类已经使用@Component注解进行标注了
*/
@Autowired
private Student student;

/**
* 方式二：若属性有 setter，则也可将其加到 setter 上
*/
@Autowired
public void setStudent(Student student) {
    this.student = student;
}
=======================================
/**
* @Resource根据beanId装配
*/
@Resource(name="student")
private Student student;
=======================================
/**
* @Value初始化入参passWd值为：passWd
* 方式一：使用 @Value 注解完成属性注入时，类中无需 setter
*/
@Value("passWd")
private String passWd;

/**
* 方式二：若属性有 setter，则也可将其加到 setter 上
*/
@Value("passWd")
public void setPassWd(String passWd) {
    this.passWd = passWd;
}
=======================================
/**
* 在方法上使用 @PostConstruct 相当于初始化
*/
@PostConstruct
public void setPassWd() {
    this.passWd = "passWd";
}
```



## Bean的作用域

​	　当通过 Spring 容器创建一个 Bean 实例时，不仅可以完成 Bean 的实例化，还可以通过 `scope` 属性，为 Bean 指定特定的作用域。

### Bean 5 种作用域

- `singleton`：**单态模式（默认）**，Bean 实例在容器被创建时即被装配好了。
- `prototype`：**原型模式**，Bean 实例在代码中使用该 Bean 实例时才进行装配的。
- `request`：对于每次 HTTP 请求，都将会产生一个不同的 Bean 实例。
- `session`：对于每个不同的 HTTP session，都将产生一个不同的 Bean 实例。
- `global session`：每个全局的 HTTP session 对应一个 Bean 实例。典型情况下，仅在使用 portlet 集群时有效，多个 Web 应用共享一个 session。一般应用中，global-session 与 session 是等同的。

**注意事项**：对于 scope 的值 `request`、`session` 与 `global session`，**只有在 Web 应用中使用 Spring 时**，该作用域才有效。



### 作用域实现方式

​	　需要在类上使用 `@Scope` 注解 或者 在`spring-context.xml`中使用`scope` 属性，其 value 属性用于指定作用域，默认为 `singleton`。

```java
/**
* 方式一 ：基于配置的装配方式可以通过 scope属性 指定
*/
<bean id = "userDao" 
    class="com.shooter.funtl.module.dao.impl.UserDaoImpl" scope="prototype"/>

/**
* 方式二 ：基于注解的装配方式可以通过 @Scope注解 指定
*/
@Scope("singleton")
public class Student{
}
```

