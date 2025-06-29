# Mybatis拦截器实战



## 字段加密解密



## 数据脱敏



## 打印可执行SQL





## 附录

 原来在DefaultSqlSession的insert，delete方法也是调用了update方法。

```
@Intercepts({  
        @Signature(type = Executor.class, method = "update", args = {  
                MappedStatement.class, Object.class }),  
        @Signature(type = Executor.class, method = "query", args = {  
                MappedStatement.class, Object.class, RowBounds.class,  
                ResultHandler.class }) })  
public class MyInterceptor implements Interceptor {  
  
    private static final String R_FEMALE = "女";  
  
    private static final String R_MALE = "男";  
  
    private static final String FEMALE = "female";  
  
    private static final String MALE = "male";  
    private Properties properties;  
  
    /* 
     * (non-Javadoc) 
     *  
     * @see 
     * org.apache.ibatis.plugin.Interceptor#intercept(org.apache.ibatis.plugin 
     * .Invocation) 
     */  
    public Object intercept(Invocation invocation) throws Throwable {  
    
```





