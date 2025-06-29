# 动态化开启定时任务

​	　在部署多个实例的时候，为了避免多个定时任务同步执行时造成的数据库死锁、数据一致性等问题，可以使用SpringBoot中提供的条件注解`@Conditional`，来实现只有单个实例执行定时任务。

**参考文献**：

- [动态控制定时任务开启和关闭](https://blog.csdn.net/weixin_28873283/article/details/112833287)



## @Conditional注解

​	　首先，需要将启动类上面的 `@EnableScheduling` 注解需要去掉。

```java{2}
@SpringBootApplication
//@EnableScheduling
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

​	　然后，在`application.yml`中添加是否启用定时任务的属性，其中`true`表示启用，`false`表示不启用。

```yml
#是否启用定时任务
enable:
  scheduled: true
```

​	　接着，新建`ScheduledCondition`类，根据`enable.scheduled`属性值，完成动态条件的设定。

```java
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;
import org.springframework.stereotype.Component;

@Component
public class ScheduledCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        //读取配置中的属性
        return Boolean.parseBoolean(context.getEnvironment().getProperty("enable.scheduled"));
    }
}
```



## 启用条件注解

​	　SpringBoot中`@Scheduled`注解，是被一个叫做 `ScheduledAnnotationBeanPostProcessor` 的类所拦截的，所以，我们可以通过条件注解`@Conditional`来判断`ScheduledCondition`条件是否成立，来决定是否创建这个 `bean`，如果没有这个 `bean`，`@Scheduled` 就不会被拦截，那么定时任务肯定不会执行了。

```java{8-12}
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.ScheduledAnnotationBeanPostProcessor;

@Configuration
public class ScheduleConfig {
    @Bean
    @Conditional(ScheduledCondition.class)
    public ScheduledAnnotationBeanPostProcessor processor() {
        return new ScheduledAnnotationBeanPostProcessor();
    }
}
```

​	　至此，对于**所有**通过`@Scheduled`实现的定时任务已经可以实现动态控制了。但是，如果定时任务是通过`while循环`实现的，可以直接将`@Conditional`注解置于该`定时任务类`上即可。



## 测试运行

​	　首先，新建`@Scheduled`注解的定时任务，若该定时任务启用，则会在控制台上打印`@Scheduled定时任务运行`日志。

```java
@Component
@Slf4j
public class Task {
    @Scheduled(cron = "0/2 * * * * ?")
    public void doTask() {
        log.info("@Scheduled定时任务运行");
    }
}
```

​	　然后，新建`while循环`实现的定时任务，若该定时任务启用，则会在控制台上打印`while定时任务运行`日志。

```java{8}
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Conditional(ScheduledCondition.class)
public class whileTask implements Runnable, InitializingBean {
	
	@Override
	public void run() {
		while (true) {
			// 间隔10秒扫描一次
			DateTimeHelper.sleep(10);
			try {
				log.info("while定时任务运行");
			}
			catch (Exception e) {
				log.error(e.toString());
				e.printStackTrace();
				//睡眠30s
				DateTimeHelper.sleep(30);
			}
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Thread th = new Thread(this);
		th.start();
	}
}
```

​	　启动项目的时候，可以通过设定`enable.scheduled`的值，实现对实例中定时任务的开启和关闭进行动态控制，其中，`true`表示启用，`false`表示不启用。

```shell
docker run -d  -e JAVA_OPTS='-Denable.scheduled=true' projectName
```

