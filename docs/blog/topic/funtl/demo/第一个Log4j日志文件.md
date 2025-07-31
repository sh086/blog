---
sidebar: false
---

# 第一个Log4j日志文件

​	　首先，创建一个工程名为 `log4j-demo` 的`maven`项目，并新建如下项目目录结构：

```
log4j-demo
--src
----main
------java
------resources
--------log4j.properties		log4j.properties 配置文件
--pom.xml						pom配置文件
```

​	　接着，在`pom.xml`文件中引入log4j所需的`slf4j-log4j12`包。

```xml
 <dependency>
     <groupId>org.slf4j</groupId>
     <artifactId>slf4j-log4j12</artifactId>
     <version>1.7.25</version>
</dependency>
```

​	　然后，在`log4j.properties` 配置文件中新增Log4j配置。

```properties
log4j.rootLogger=INFO, console, file

log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=%d %p [%c] - %m%n

log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=logs/log.log
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.A3.MaxFileSize=1024KB
log4j.appender.A3.MaxBackupIndex=10
log4j.appender.file.layout.ConversionPattern=%d %p [%c] - %m%n
```

​	最后，创建一个测试类，并测试日志输出效果，代码如下：

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyTest {
	//采用饿汉式单例模式，再系统启动时，必须将所有类的日志全部初始化完成
    public static final Logger logger = LoggerFactory.getLogger(MyTest.class);

    public static void main(String[] args) {
        logger.info("slf4j for info");
        logger.debug("slf4j for debug");
        logger.error("slf4j for error");
        logger.warn("slf4j for warn");

        String message = "Hello SLF4J";
        logger.info("slf4j message is : {}", message);
    }
}
```

​	项目运行成功后，项目根目录下出现出 `logs/log.log` 文件，控制台显示为：

```
2020-09-26 23:52:21,570 INFO [MyTest] - slf4j for info
2020-09-26 23:52:21,570 ERROR [MyTest] - slf4j for error
2020-09-26 23:52:21,570 WARN [MyTest] - slf4j for warn
2020-09-26 23:52:21,570 INFO [MyTest] - slf4j message is : Hello SLF4J
```

