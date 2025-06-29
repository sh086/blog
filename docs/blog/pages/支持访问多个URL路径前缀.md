# 支持访问多个URL路径前缀

​	　在SpringBoot中，`server.servlet.context-path`只能配置**固定的**访问路径前缀。如果需要**同时支持多种访问路径前缀**，可以通过**过滤器**修改请求url访问地址。



**参考资料:**

- [SpringBoot 利用过滤器Filter修改请求url地址](https://www.cnblogs.com/hongdada/p/9046376.html)
- [如何修改请求的url地址](https://blog.csdn.net/silver9886/article/details/87625511)



## 自定义Filter过滤器

### UrlFilter

​	　`自定义的Filter`必须实现`javax.servlet.Filter`接口，这个是Servlet的规范。

```java
package com.shooter.springboot.common.filter;

import org.springframework.util.StringUtils;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class UrlFilter implements Filter {

    /**
    * 过滤器初始化
    */
    @Override
    public void init(FilterConfig filterConfig) {
    }

    /**
    * 过滤器销毁
    */
    @Override
    public void destroy() {
    }
   
    /**
    * 执行过滤操作
    */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // 获取HttpServletRequest
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        // 通过过滤器链完成请求的执行
        chain.doFilter(rewriteUrl(httpRequest), response);
    }

    /**
     * 重新请求路径，并转发参数
     * */
    private HttpServletRequestWrapper rewriteUrl(HttpServletRequest httpRequest) {
        return new HttpServletRequestWrapper(httpRequest) {

            @Override
            public String getRequestURI() {
                return getRewriteUrl(httpRequest.getRequestURI());
            }

            /**
            * 调用 getRequestURI()方法重新拼接RequestURL
            */
            @Override
            public StringBuffer getRequestURL() {
                return new StringBuffer(getScheme() + "://" + getServerName() + ":" + getServerPort() + getRequestURI());
            }

            @Override
            public String getServletPath() {
                String newPath = getRewriteUrl(httpRequest.getContextPath() + httpRequest.getServletPath());
                if (StringUtils.hasText(newPath)) {
                    return newPath.substring(httpRequest.getContextPath().length());
                }
                return httpRequest.getServletPath();
            }

            /**
             * 请求路径重写逻辑
             * @param  原请求路径
             * @return 重写后的请求路径
             * */
            private String getRewriteUrl(String requestURI) {
                if (requestURI.contains("/api/")) {
                    // 将包含/api的请求地址修改后，在进行转发
                    return requestURI.replace("/api", "");
                }
                return requestURI;
            }
        };
    }
}
```



### 注册UrlFilter

（1）通过 @Bean 注解来配置

```java
package com.shooter.springboot.common.config;

import com.shooter.springboot.common.filter.UrlFilter;
import lombok.val;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean registerFilter() {
        val registration = new FilterRegistrationBean();
        // 实例化Filter类
        registration.setFilter(new UrlFilter());
        // 指定url的匹配模式
        registration.addUrlPatterns("/*");
        // 过滤器名称
        registration.setName("UrlFilter");
        // 执行顺序
        registration.setOrder(1);
        return registration;
    }
}
```



（2）通过 @WebFilter 注解来配置

```java{1,2}
@Component
@WebFilter(urlPatterns = "/*", filterName = "UrlFilter")
public class UrlFilter implements Filter {

}
```

​	　注意，`@WebFilte`注解是`Servlet3.0`的规范，并不是SpringBoot提供的。所以，还需在配置类中加`@ServletComponetScan`注解来指定扫描的包。

```java{2}
@SpringBootApplication
@ServletComponentScan("com.shooter.springboot.common.filter")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

​	　另外，`@WebFilter`执行顺序是根据`Filter类名`字母顺序**倒序**执行，且`@WebFilter`指定的过滤器优先级都高于`FilterRegistrationBean`配置的过滤器。



## 测试用例

​	　首先，将`server.servlet.context-path`的值 **清空** 或者 设置为  `/` ，然后，编写`UserController`控制器。

```java
package com.shooter.springboot.module.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @GetMapping("/user")
    public String selectUser(@RequestParam String name){
        return name;
    }
}
```

### 浏览器测试

​	　启动项目后，即可访问接口进行测试。

```json
/* 通过http://127.0.0.1:8080/api/user访问结果 */
{"userName":"小米","age":12}

/* 通过http://127.0.0.1:8080/user访问结果 */
{"userName":"小米","age":12}
```



### SpringBootTest

```java
package com.shooter.springboot;

import lombok.val;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@EnableWebMvc
@AutoConfigureMockMvc
@SpringBootTest(classes = Application.class)
class SpringBootStartApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getUser() throws Exception {
        val resultStr  = mockMvc.perform(MockMvcRequestBuilders.get("/user?name={name}","mi")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk()).andDo(print())
                .andReturn().getResponse().getContentAsString();
        Assertions.assertEquals("mi",resultStr);
    }

    @Test
    public void getUserApi() throws Exception {
        val resultStr  = mockMvc.perform(MockMvcRequestBuilders.get("/api/user?name={name}","mi")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk()).andDo(print())
                .andReturn().getResponse().getContentAsString();
        Assertions.assertEquals("mi",resultStr);
    }

}
```





## 附录

### UrlFilter中直接修改Url

​	　说明，这种方式虽然可以通过浏览器测试成功，但是无法使用`MockMvc`在单元测试中进行测试，原因参考[这里](https://blog.csdn.net/silver9886/article/details/87625511) 或者 [这里](https://github.com/spring-projects/spring-framework/issues/18914)。

```java
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class UrlFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig)  {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest)request;
        String path = httpRequest.getRequestURI();
        if(path.contains("/api/")){
            // 将包含/api的请求地址修改后，在进行转发
            String newPath = path.replace("/api","");
            httpRequest.getRequestDispatcher(newPath).forward(request,response);
        } else {
            // 通过过滤器链完成请求的执行
            chain.doFilter(request,response);
        }
    }
}
```

