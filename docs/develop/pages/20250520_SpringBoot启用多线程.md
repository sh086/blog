# SpringBoot启用多线程

​	　Spring的定时任务**默认是单线程**的，不仅效率不高，而且在某些场景下会导致定时任务堵塞，可以使用`@Async`注解实现多线程的任务执行。在默认不做配置的情况下，**`@Async`所使用的线程池容量为`100`**，每次需要的时候都会从中拿出一条，直到用完，才会等待之前的线程释放，不会再自己扩容。



## @Async异步执行

### @Async注解

​	　首先，在`SpringBoot`项目的`Application`入口类中，加入`@EnableAsync`注解。

```java{6}
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```

​	　然后，就可以在方法上使用`@Async`注解了。

```java{1}
 @Async
 public void doAsync() throws InterruptedException {
     log.info(Thread.currentThread().getName()+"===Async run");
     Thread.sleep(6*1_000);
     log.info(Thread.currentThread().getName()+"===Async end");
 }
```



### 测试运行

​	　编写测试用例，用于测试`doAsyn()`方法。

```java
@Test
public void testAsync() throws InterruptedException {
    do {
        //doAsyn已经被 @Async注释
        asyncService.doAsync();
        Thread.sleep(2*1_000);
    }while (true);
}
```

​	　运行后发现，`doAsync()`已经可以被多线程执行了。

```properties
2021-10-12 14:25:05.476 INFO 9768---[task-1] com.AsyncService: task-1===Async run
2021-10-12 14:25:07.481 INFO 9768---[task-2] com.AsyncService: task-2===Async run
2021-10-12 14:25:09.483 INFO 9768---[task-3] com.AsyncService: task-3===Async run
2021-10-12 14:25:11.479 INFO 9768---[task-1] com.AsyncService: task-1===Async end
2021-10-12 14:25:11.494 INFO 9768---[task-4] com.AsyncService: task-4===Async run
2021-10-12 14:25:13.494 INFO 9768---[task-2] com.AsyncService: task-2===Async end
2021-10-12 14:25:13.510 INFO 9768---[task-5] com.AsyncService: task-5===Async run
```



## 默认线程池

### TaskExecutePool

​	　可以通过重写`AsyncConfigurer`中的方法，自定义配置**默认的线程池**，实现指定线程池大小、线程前缀名称等。

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import java.util.concurrent.Executor;

@Configuration
@Slf4j
public class TaskExecutePool implements AsyncConfigurer{

    @Override
    @Bean
    public Executor getAsyncExecutor()  {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("task-");
        scheduler.setAwaitTerminationSeconds(60);
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        return scheduler;
    }

    /**
     *  异步任务中异常处理
     */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (arg0, arg1, arg2) -> {
            log.error("方法{}- 错误提示{}",arg1.getName(),arg0.getMessage());
        };
    }
}
```



### 测试运行

​	　再次运行后发现，设置的线程池大小为`2`，已经生效了。

```properties
2021-10-12 14:48:35.043 INFO 12196---[task-1] com.AsyncService: task-1===Async run
2021-10-12 14:48:35.043 INFO 12196---[task-1] com.AsyncService: task-2===Async run
2021-10-12 14:48:37.053 INFO 12196---[task-2] com.AsyncService: task-1===Async end
2021-10-12 14:48:37.053 INFO 12196---[task-2] com.AsyncService: task-1===Async run
2021-10-12 14:48:37.053 INFO 12196---[task-2] com.AsyncService: task-2===Async end
```



## 自定义线程池

### TaskExecutePool

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@Slf4j
public class TaskExecutePool{

    // 自定义线程池名字,默认是方法名taskAsyncPool
    // @Bean("myAsyncPool")
    @Bean
    public Executor taskAsyncPool()  {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //核心线程池大小
        executor.setCorePoolSize(2);
        //最大线程数
        executor.setMaxPoolSize(2);
        //队列容量
        executor.setQueueCapacity(300);
        //活跃时间
        executor.setKeepAliveSeconds(50);
        //线程名字前缀
        executor.setThreadNamePrefix("task-");

        // setRejectedExecutionHandler：当pool已经达到max size的时候，如何处理新任务
        // CallerRunsPolicy：不在新线程中执行任务，而是由调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}
```



### @Async引用

​	　重写`spring`默认线程池时，只需要加`@Async`注解就可以，不用去声明线程池类；但是，使用自定义线程池时，需要为`@Async`注解添加`value属性`来制定所用的线程池，若未配置自定义线程池的方法名，则会使用默认的线程池。

```java{1}
@Async("taskAsyncPool")
public void doAsync() throws InterruptedException {
    log.info(Thread.currentThread().getName()+"===Async run");
    Thread.sleep(6*1_000);
    log.info(Thread.currentThread().getName()+"===Async end");
}
```



### 测试运行

​	　再次运行后发现，设置的线程池大小为`2`，已经生效了。

```properties
2021-10-12 15:06:57.372 INFO 17844---[task-1] com.AsyncService: task-1===Async run
2021-10-12 15:06:59.363 INFO 17844---[task-2] com.AsyncService: task-2===Async run
2021-10-12 15:07:03.381 INFO 17844---[task-1] com.AsyncService: task-1===Async end
2021-10-12 15:07:03.381 INFO 17844---[task-1] com.AsyncService: task-1===Async run
2021-10-12 15:07:05.366 INFO 17844---[task-2] com.AsyncService: task-2===Async end
```

