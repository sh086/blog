# 动态调整Application参数值

## 知识点

​	　可以使用`ApplicationContext`动态加载`application.yml`配置，**实现不重启服务，也可更新参数信息的效果**。注意，这个只能用于**Nacos配置服务** 或者 **远程服务器Tomcat部署** 中。



## 测试用例

​	　首先，新建定时任务类`ConfigTask`。

```java
package com.shooter.funtl.task;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ConfigTask {

    @Autowired
    private ApplicationContext applicationContext;

    @Scheduled(cron = "0/2 * * * * ?")
    public void doTask() {
        String port = applicationContext.getEnvironment().getProperty("server.port");
        System.out.println(port);
    }
}
```

​	　然后，新建`application.yml`配置类。

```yaml
server:
  port: 8081
```

​	　启动项目，运行一会，然后修改`server.port`为`8082`，日志级别改为`debug`。

```shell
# 修改前打印如下信息
8081

# 修改后打印如下信息
8082
```

