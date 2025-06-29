# 获取泛型的T.class类型



**参考资料：**

- [【Type】类型 ParameterizedType](https://www.cnblogs.com/baiqiantao/p/7460580.html)



## Type接口

### Type接口简介

​	　`Type接口`是 Java 编程语言中`所有类型`的公共高级接口，包括基本类型、原始类型、参数化类型(泛型)、泛型数组类型、类型变量类型。

（1）基本类型，对应Class实现类

```
如int、long
```

（2）原始类型，对应Class实现类

```
如Array、List、String、Enums、Interface
```

（3）参数化类型（泛型），对应`ParameterizedType`子接口

```
如List<T>、Map<Integer, String>、List<? extends Number>。
```

（4）类型变量类型，对应`TypeVariable<D>`子接口

```
如参数化类型中的E、K等类型变量，表示泛指任何类
```

（5）泛型数组类型，对应`GenericArrayType`子接口

```
指元素类型是参数化类型或者类型变量的的数组类型，如List<ArrayList<String>[]> 
```

（6）泛型表达式（非Java类型），对应`WildcardType`子接口，又称通配符表达式

```
如[?]、[? super T]、[? extends T]
```



### 获取泛型类型

​	　对于`class<String>`这种**已明确声明泛型类型**的**匿名类**，可以通过`继承+反射`的方式获取定义的泛型类型。

```java
Type type = ((ParameterizedType)object.getClass()
                 .getGenericSuperclass()).getActualTypeArguments()[0];
```



## 测试用例

### 获取T.class

（1）`T.class`定义时明确声明

```java
@Test
public void test(){
    // 定义明确声明泛型类型的匿名类
    val arrayList = new ArrayList<String>(){};
    Type type = ((ParameterizedType)arrayList.getClass()
                 .getGenericSuperclass()).getActualTypeArguments()[0];
    log.info("获取class：{}",arrayList.getClass());
    log.info("获取T.class：{}",type.getTypeName());
}
```

​	　运行结果如下，发现可以正确获取`T.class`。

```
获取class：class com.shooter.springboot.GetTClass$1
获取T.class：java.lang.String
```



（2）`T.class`定义时不明确声明

```java
public class Student<T> {

}

@Test
public void testStudent(){
    // T.class定义时不明确声明
    val student = new Student<>();
    Type type = ((ParameterizedType)student.getClass()
                 .getGenericSuperclass()).getActualTypeArguments()[0];
}
```

​	　运行结果出错，因为`Student`类没有继承，所以，`getGenericSuperclass()`获取的是`java.lang.Object`类型，该类型无法强转为`ParameterizedType`。

```
java.lang.ClassCastException: 
		java.lang.Class cannot be cast to java.lang.reflect.ParameterizedType
```



### 若T.class有继承

```java
//T.class继承已声明的泛型
public class Student<T> extends People<String>{

}

@Test
public void testStudent(){
    val student = new Student<>();
    Type type = ((ParameterizedType)student.getClass()
                 .getGenericSuperclass()).getActualTypeArguments()[0];
    log.info("获取class：{}",student.getClass());
    log.info("获取T.class：{}",type.getTypeName());
}
```

​	　运行结果如下，获取的是`T.class`继承类中已经声明的泛型。

```
获取class：class modal.Student
获取T.class：java.lang.String
```

