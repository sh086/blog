---
sidebar: auto
---

# Junit

​	　`JUnit` 是用于编写和运行可重复的**自动化测试**的开源测试框架。`TDD`是**测试驱动**编程思想，提倡“**先编写测试用例，再完成编码**”，这样保证了代码质量，测试的覆盖率高，但是开发效率低。

​	　测试时**按照不同的场景**可以分为单元测试、压力测试、疲劳强度测试、冒烟测试、集成测试、回归测试等测试方式。

```
单元测试：分为白盒测试、黑盒测试、灰盒测试
压力测试：专门用于测试应用最大可以承载多少并发
疲劳强度测试：测试程序能否长期（72时 ~ 7天）稳定运行
冒烟测试：对主要流程(支付环节)进行频繁、高强度的测试
集成测试：对完整功能进行测试，最重要的是测试整体业务流程
回归测试：若测试完后，应用又新增了一个功能或BugFix，需要针对这个功能或BugFix进行回归测试
```



## 整合Junit

### JunitTest

（1）引入jar包

```xml
<dependency>
     <groupId>junit</groupId>
     <artifactId>junit</artifactId>
     <version>4.12</version>
     <scope>test</scope>
</dependency>
```

（2）编写单元测类

```java
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class MyTest {

    /**
     * 执行测试方法前执行
     */
    @Before
    public void before() {
        System.out.println("执行 before() 方法");
    }

    /**
     * 执行测试方法后执行
     */
    @After
    public void after() {
        System.out.println("执行 after() 方法");
    }

    /**
     * 测试方法建议采用test作为方法名的开头
     */
    @Test
    public void testHelloLog4j() {
        System.out.println("Hello Log4j");
    }
}
```

**运行结果如下：**

```
执行 before() 方法
Hello Log4j
执行 after() 方法
```



### SpringWebTest

（1）引入Jar包

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>
```



（2）编写单元测试类

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
}
```



### SpringBootTest

（1）引入Jar包

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```



（2）编写单元测试类

```java
import com.cmhb.Application;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@Slf4j
public class DateTest {
    //测试方法
}
```



## 单元测试

### Junit注解

（1）`@Test` 和 `@Ignore`

​	　`@Test`注解表明该方法是一个测试方法。当想暂时禁用特定的测试方法执行时，可以使用`@Ignore`注解。

```java
@Test
public void testLog4j() {
    System.out.println("Hello Log4j");
}
@Ignore
public void ignoreLog4j() {
    System.out.println("Hello IgnoreLog4j");
}
```

（2）`@Before` 和 `@After`

​	　	`@Before` 和 `@After` 注解 表明该方法必须在类中**每个测试方法**执行 `之前/之后` 执行。

```java
@Before
public void before() {
    System.out.println("执行 before() 方法");
}
@After
public void after() {
    System.out.println("执行 after() 方法");
}
```



（3）`@BeforeClass`和 `@AfterClass`

​	　`@BeforeClass` 和 `@AfterClass`注解只能在**测试用例类执行** `之前/之后` 执行**一次,** 方法必须声明为`public static`。多用于开启资源和关闭资源。

```java
@BeforeClass
public void static beforeClass() {
    System.out.println("执行 beforeClass() 方法");
}
@AfterClass
public void static afterClass() {
    System.out.println("执行 afterClass() 方法");
}
```



### Junit断言

​	　断言是指在可以**断定程序中的某个特定点的布尔表达式值**为true，则继续运行，若为false，则**中断**当前操作的话，可以使用断言。一般在 **测试** 或 **出现BUG**时**启用断言**，而在**部署时禁用断言**。使用断言可以创建更稳定、品质更好且 不易于出错的代码。

（1） 断言两个值相等

```java
/**
 * 断言两个变量相等
 * message : 可选的字符串,自定义抛出异常信息
 * 入参类型：int, short, long, byte, char, Object
 * */
void assertEquals([String message], expected value, actual value2)；
```



（2）断言一个条件为真/假

```java
/**
 * 断言条件为真
 * message : 可选的字符串,自定义抛出异常信息
 * condition：需要断言的条件
 * */
void assertTrue([String message], boolean condition);

/**
 * 断言条件为假
 * message : 可选的字符串,自定义抛出异常信息
 * condition：需要断言的条件
 * */
void assertFalse([String message],boolean condition)
```



（3）断言一个对象是否为空

```java
/**
 * 断言一个对象不为空(null)
 * */
void assertNotNull([String message], java.lang.Object object);

/**
 * 断言一个对象为空(null)
 * */
void assertNull([String message], java.lang.Object object)
```



（4）断言两个对象是否引用相同的对象

```java
/**
 * 断言两个对象引用相同的对象
 * */
void assertSame([String message], java.lang.Object expected, java.lang.Object actual)
    
/**
 * 断言两个对象不是引用同一个对象
 * */
void assertNotSame([String message], java.lang.Object unexpected, java.lang.Object actual)
```



（5）断言预期数组和结果数组相等

```java
/**
 * 断言预期数组和结果数组相等
 * 数组的类型： int, long, short, char, byte, Object
 * */
void assertArrayEquals([String message], expectedArray, resultArray)
```

