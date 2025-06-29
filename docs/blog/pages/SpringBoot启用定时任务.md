# @Scheduled定时任务

## 快速开始

​	　首先，在`SpringBoot`项目的`Application`入口类中，加入`@EnableScheduling`注解。

```java{6}
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```

​	　然后，就可以新建定时任务类。完成后，再启动SpringBoot后，定时任务即可运行。

```java{8-11}
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Task {
    @Scheduled(cron = "0/2 * * * * ?")
    public void doTask() {
        log.info(Thread.currentThread().getName()+"===task run");
    }
}
```



## @Scheduled注解

​	　如果是强调**任务间隔**的定时任务，建议使用`fixedRate`和`fixedDelay`，如果是强调任务在**某时某分某刻**执行的定时任务，建议使用`cron表达式`。

### fixedRate

​	　`fixedRate`设置的是**上一个任务的开始时间**到**下一个任务开始时间**的间隔，每次任务都会执行。当到达任务的开始执行时间，但上一个任务却没有完成时，`spring`会等待上一个任务执行完后，并立即开始执行本次任务。

```java
@Scheduled(initialDelay = 3000,fixedRate = 3000)
public void doTask() throws InterruptedException  {
    log.info(Thread.currentThread().getName()+"===task run");
    Thread.sleep(6*1_000);
    log.info(Thread.currentThread().getName()+"===task end");
}
```

​	　上述代码执行效果如下：

```properties
2021-10-12 23:06:39.544 INFO 23704---[scheduling-1] com.Task: scheduling-1===task run
2021-10-12 23:06:45.556 INFO 23704---[scheduling-1] com.Task: scheduling-1===task end
# 第二个任务立即执行了
2021-10-12 23:06:45.557 INFO 23704---[scheduling-1] com.Task: scheduling-1===task run
```



### fixedDelay

​	　`fixedDelay`设置的是**上一个任务的结束时间**到**下一个任务开始时间**的间隔，每次任务都会执行。当上一个任务结束后，需要在等配置的间格时间，才会执行下一个任务。

```java
@Scheduled(initialDelay = 3000,fixedDelay = 3000)
public void doTask() throws InterruptedException  {
    log.info(Thread.currentThread().getName()+"===task run");
    Thread.sleep(6*1_000);
    log.info(Thread.currentThread().getName()+"===task end");
}
```

​	　上述代码执行效果如下：

```properties
2021-10-12 23:11:07.798 INFO 17172---[scheduling-1] com.Task: scheduling-1===task run
2021-10-12 23:11:13.817 INFO 17172---[scheduling-1] com.Task: scheduling-1===task end
# 第二个任务等待了3s才执行
2021-10-12 23:11:16.824 INFO 17172---[scheduling-1] com.Task: scheduling-1===task run
```



### cron参数

​	　`cron表达式`配置了在哪一刻执行任务，会在配置的任务开始时间判断任务是否可以执行，如果能则执行，不能则会跳过本次执行。

```java
//cron表达式可以在程序中写入，也可以从配置中读取
//@Scheduled(cron = "${config-task.inactiveCustomerTask}")
@Scheduled(cron = "*/3 * * * * ?")
public void doTask() throws InterruptedException  {
    log.info(Thread.currentThread().getName()+"===task run");
    Thread.sleep(7*1_000);
    log.info(Thread.currentThread().getName()+"===task end");
}
```

​	　上述代码执行效果如下：

```properties
2021-10-12 23:17:57.005 INFO 3272---[scheduling-1] com.Task: scheduling-1===task run
2021-10-12 23:18:04.021 INFO 3272---[scheduling-1] com.Task: scheduling-1===task end
# 在23:18:00、23:18:03、23:18:06判断任务是否可以执行，否则跳过
2021-10-12 23:18:06.011 INFO 3272---[scheduling-1] com.Task: scheduling-1===task run
```



## corn表达式

​	　一个`cron表达式`有至少`6个`（也可能`7个`）有空格分隔的时间元素，按顺序依次为：`秒（0~59）`、`分钟（0~59）`、`小时（0~23）`、`天（0~31）`、`月（0~11）`、`星期（1~7 1=SUN 或 SUN，MON，TUE，WED，THU，FRI，SAT）`、`年份（1970－2099）`。其中，每个元素可以是一个值(如6)、一个连续区间(9-12)、一个间隔时间(8-18/4)、一个列表(1,3,5),通配符。

|    字段    |      允许值       | 允许的特殊字符  |
| :--------: | :---------------: | :-------------: |
|     秒     |       0-59        |     , - * /     |
|     分     |       0-59        |     , - * /     |
|    小时    |       0-23        |     , - * /     |
|    日期    |       1-31        | , - * ? / L W C |
|    月份    | 1-12 或者 JAN-DEC |     , - * /     |
|    星期    | 1-7 或者 SUN-SAT  | , - * ? / L C # |
| 年（可选） |  留空, 1970-2099  |     , - * /     |



### 子表达式解析

​	　`*`字符代表所有可能的值；  `/`字符用来指定数值的增量，如在子表达式（分钟）里的`0/15`表示从第0分钟开始，每15分钟 。

​	　`？`字符仅被用于天（月）和天（星期）两个子表达式，表示不指定值。由于`月份中的日期`和`星期中的日期`这两个元素互斥的，当两个子表达式其中之一被指定了值以后，为了避免冲突，必须要将另一个子表达式的值设为 `？` 。

​	　`L` 字符仅被用于天（月）和天（星期）两个子表达式，它是单词`last`的缩写，如果在`L`前有具体的内容，它就具有其他的含义了，如，`6L`表示这个月的倒数第６天， 注意，在使用`L`参数时，不要指定列表或范围，因为这会导致问题。

​	　`W` 字符代表着平日(`Mon-Fri`)，并且仅能用于日域中。它用来指定离指定日的最近的一个平日。大部分的商业处理都是基于工作周的，所以 `W 字符`可能是非常重要的。如，日域中的 `15W` 意味着 "离该月15号的最近一个平日"， 假如15号是星期六，那么 任务会在14号(星期五)触发，因为星期四比星期一离15号更近。

​	　`C`字符代表计划所关联的日期，如果日期没有被关联，则相当于日历中所有日期。如，`5C`在日期字段中就相当于日历5日以后的第一天、`1C`在星期字段中相当于星期日后的第一天。



### 使用实例

```text
0 0 10,14,16 * * ? 			每天上午10点，下午2点，4点
0 0/30 9-17 * * ?   		朝九晚五工作时间内每半小时
0 0 12 ? * WED 				表示每个星期三中午12点
0 0 12 * * ? 				每天中午12点触发 
0 15 10 ? * * 				每天上午10:15触发 
0 15 10 * * ? 				每天上午10:15触发 
0 15 10 * * ? * 			每天上午10:15触发 
0 15 10 * * ? 2005 			2005年的每天上午10:15触发 
0 * 14 * * ? 				在每天下午2点到下午2:59期间的每1分钟触发 
0 0/5 14 * * ? 				在每天下午2点到下午2:55期间的每5分钟触发 
0 0/5 14,18 * * ? 			在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发 
0 0-5 14 * * ? 				在每天下午2点到下午2:05期间的每1分钟触发 
0 10,44 14 ? 3 WED 			每年三月的星期三的下午2:10和2:44触发 
0 15 10 ? * MON-FRI			周一至周五的上午10:15触发 
0 15 10 15 * ? 				每月15日上午10:15触发 
0 15 10 L * ? 				每月最后一日的上午10:15触发 
0 15 10 ? * 6L 				每月的最后一个星期五上午10:15触发 
0 15 10 ? * 6L 2002-2005 	2002年至2005年的每月的最后一个星期五上午10:15触发 
0 15 10 ? * 6#3 			每月的第三个星期五上午10:15触发 
```



## 多线程执行

​	　Spring**默认是单线程**的，实现定时任务多线程执行可以直接采用`@Async`注解（不建议），本文采用的是重写 `SchedulingConfigurer`和 `AsyncConfigurer`中的方法，来**自定义配置默认的线程池**的方法，实现指定线程池大小、线程前缀名称等。

### ScheduleConfig

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import java.util.concurrent.Executor;

/**
 * 默认线程池配置
 */
@Configuration
@Slf4j
public class ScheduleConfig implements SchedulingConfigurer, AsyncConfigurer
{
    /**
     * 定时任务以多线程的形式进行
     * */
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar)
    {
        TaskScheduler taskScheduler = taskScheduler();
        taskRegistrar.setTaskScheduler(taskScheduler);
    }

     /**
     * 配置默认线程池
     * */
    @Bean(destroyMethod="shutdown")
    public ThreadPoolTaskScheduler taskScheduler()
    {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("task-");
        scheduler.setAwaitTerminationSeconds(60);
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        return scheduler;
    }

    @Override
    public Executor getAsyncExecutor()
    {
        Executor executor = taskScheduler();
        return executor;
    }

    /**
     * 异步任务中异常处理
     * */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler()
    {
        return (arg0, arg1, arg2) -> {
            log.error("方法{}- 错误提示{}",arg1.getName(),arg0.getMessage());
        };
    }
}
```



### 测试运行

​	　首先，编写测试用例，用于测试自定义的默认线程池是否生效。

```java
 @Scheduled(cron = "0/2 * * * * ?")
 @Async
 public void doTask() throws InterruptedException {
     log.info(Thread.currentThread().getName()+"===task run");
     Thread.sleep(6*1_000);
     log.info(Thread.currentThread().getName()+"===task end");
 }
```

​	　运行后发现，**下一个任务并没有等待上一个任务结束，而是在任务开始时间直接开启了一条新的线程进行执行**，并且设置的线程池大小为`2`已经生效了。

```properties
2021-10-12 11:49:46.027 INFO 17448---[task-1] com.module.task.Task: task-1===task run
2021-10-12 11:49:48.013 INFO 17448---[task-2] com.module.task.Task: task-2===task run
2021-10-12 11:49:52.042 INFO 17448---[task-1] com.module.task.Task: task-1===task end
2021-10-12 11:49:52.042 INFO 17448---[task-1] com.module.task.Task: task-1===task run
2021-10-12 11:49:54.020 INFO 17448---[task-2] com.module.task.Task: task-2===task end
```

