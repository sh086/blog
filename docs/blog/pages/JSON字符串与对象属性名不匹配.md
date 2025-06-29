# JSON字符串与对象属性名不匹配

​	　若使用的是`jackson`，可以通过`@JsonProperty`注解来设定序列化属性名；若是`fastjson`，可以通过`@JSONField`来设定序列化属性名。另外，也可以通过原生的新增的`set方法`和`get方法`设定。

## jackson中指定序列化属性名

### @JsonProperty

​	　首先，引入`pom.xml`依赖。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.11.3</version>
</dependency>
```

​	　接着，使用`@JsonProperty`注解

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
	@JsonProperty("JsonPropertyName")
	private String name;
}
```

### 测试用例

```java
//将实体类转换成字符串
val jsonStr = new ObjectMapper().writeValueAsString(user)
//将字符串转换成实体类
val user = new ObjectMapper().readValue(jsonStr, User.class)
```



## fastjson中指定序列化属性名

### @JSONField

​	　首先，引入`pom.xml`依赖。

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.49</.version>
</dependency>
```

​	　接着，使用`@JSONField`注解

```java
import com.alibaba.fastjson.annotation.JSONField;

public class User {
	@JSONField(name="JSONFieldName")
	private String name;
}
```

### 测试用例

```java
//将实体类转换成字符串
val jsonStr = JSON.toJSONString(user);
//将字符串转换成实体类
val user = JSON.parseObject(str, User.class);
```



## 原生方法

### getter和setter

```java
public class User {
    
	private String name;

    // 一定要是public
    public String getJsonPropertyName(){
        return name;
    }

    // 一定要是public
    public void setJsonPropertyName(String jsonPropertyName){
        this.name = jsonPropertyName;
    }
}
```

### 测试用例

```java
//将实体类转换成字符串
val jsonStr = JSON.toJSONString(user);
//将字符串转换成实体类
val user = JSON.parseObject(str, User.class);
```

