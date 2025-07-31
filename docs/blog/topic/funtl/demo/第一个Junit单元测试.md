---
sidebar: false
---
# 第一个Junit单元测试

​	　首先，创建一个工程名为 `junit-demo` 的`maven`项目，并新建如下项目目录结构：

```
junit-demo
--src
----main
----test
------java
--------MyTest.java				Test测试类
--pom.xml						pom配置文件
```

​	　接着，在`pom.xml`文件中引入`junit`包。

```xml
<dependency>
     <groupId>junit</groupId>
     <artifactId>junit</artifactId>
     <version>4.12</version>
     <scope>test</scope>
</dependency>
```

​	　最后，在编写一个简单的测试方类，然后运行`testHelloLog4j()`方法。

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

