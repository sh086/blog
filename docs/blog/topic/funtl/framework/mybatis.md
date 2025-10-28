---
sidebar: auto
---

# Mybatis

​	　MyBatis是基于 Java 的**数据持久层框架**，内部封装了 `JDBC`，开发者只需关注 `SQL` 语句本身，而不用再花费精力去处理诸如注册驱动、创建 Connection、配置 Statement 等繁杂过程。

​	　MyBatis 是 **半自动ORM**，通过 **SQL 语句映射文件**，实现了 `POJO 类` 和 `SQL语句` 之间的映射关系。不仅可以将**SQL 语句与代码的分离**，还可以**结合数据库自身的特点灵活控制 SQL 语句**，因此能够实现比 Hibernate 等全自动 ORM 框架**更高的查询效率**，能够完成**复杂查询**。

​	　Hibernate 是提供了全面的数据库封装机制的 **全自动ORM**，通过**HQL语言**，实现了 `POJO类` 和 `数据库表` 之间的映射，以及 SQL 的**自动生成和执行**。



## Spring整合Druid

​	　Druid 是阿里巴巴开源平台上的一个项目，主要是为了扩展 JDBC 的一些限制，如向密钥服务请求凭证、统计 SQL 信息、SQL 性能收集、SQL 注入检查、SQL 翻译等。

### 引入Jar包

```xml
<!--引入Druid包-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.6</version>
</dependency>
<!--引入Mysql包-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.46</version>
</dependency>
```



### 数据库连接配置

​	　在`myshop.properties`中引入数据库连接配置。

```properties
# JDBC
# MySQL 8.x: com.mysql.cj.jdbc.Driver
jdbc.driverClass=com.mysql.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://数据库IP:3306/数据库名称?useUnicode=true&characterEncoding=utf-8&useSSL=false
jdbc.username=用户名
jdbc.password=密码

# JDBC Pool
jdbc.pool.init=1
jdbc.pool.minIdle=3
jdbc.pool.maxActive=20

# JDBC Test
jdbc.testSql=SELECT 'x' FROM DUAL
```



### spring-context-druid.xml

​	　新建`spring-context-druid.xml`配置文件，完成`Spring`和`druid`的整合。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 加载配置属性文件 -->
    <context:property-placeholder ignore-unresolvable="true" location="classpath:myshop.properties"/>

    <!-- 数据源配置, 使用 Druid 数据库连接池 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
        <!-- 数据源驱动类可不写，Druid默认会自动根据URL识别DriverClass -->
        <property name="driverClassName" value="${jdbc.driverClass}"/>

        <!-- 基本属性 url、user、password -->
        <property name="url" value="${jdbc.connectionURL}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>

        <!-- 配置初始化大小、最小、最大 -->
        <property name="initialSize" value="${jdbc.pool.init}"/>
        <property name="minIdle" value="${jdbc.pool.minIdle}"/>
        <property name="maxActive" value="${jdbc.pool.maxActive}"/>

        <!-- 配置获取连接等待超时的时间 -->
        <property name="maxWait" value="60000"/>

        <!-- 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒 -->
        <property name="timeBetweenEvictionRunsMillis" value="60000"/>

        <!-- 配置一个连接在池中最小生存的时间，单位是毫秒 -->
        <property name="minEvictableIdleTimeMillis" value="300000"/>

        <property name="validationQuery" value="${jdbc.testSql}"/>
        <property name="testWhileIdle" value="true"/>
        <property name="testOnBorrow" value="false"/>
        <property name="testOnReturn" value="false"/>

        <!-- 配置监控统计拦截的filters -->
        <property name="filters" value="stat"/>
    </bean>
</beans>
```



### 配置 Druid 监控中心

​	　在 `web.xml` 中配置 Druid 提供的 Servlet，可以通过[http://localhost:8080/druid/index.html](http://localhost:8080/druid/index.html) ，查看Druid 提供的监控数据。

```xml
<!--配置 Druid 监控中心 -->
<servlet>
    <servlet-name>DruidStatView</servlet-name>
    <servlet-class>com.alibaba.druid.support.http.StatViewServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>DruidStatView</servlet-name>
    <url-pattern>/druid/*</url-pattern>
</servlet-mapping>
```



## Spring整合Mybatis

### 引入Jar包

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.2.8</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>1.3.1</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```

### mybatis-config.xml

​	　新建`mybatis-config.xml`MyBatis 配置文件。特别的，配置文件中的`<setting name="logImpl" value="STDOUT_LOGGING" />`是用于打印SQL语句的，该**配置只能在开发环境中开启**。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 全局参数 -->
    <settings>
        <!-- 打印 SQL 语句 -->
        <setting name="logImpl" value="STDOUT_LOGGING" />

        <!-- 使全局的映射器启用或禁用缓存。 -->
        <setting name="cacheEnabled" value="false"/>

        <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载。 -->
        <setting name="lazyLoadingEnabled" value="true"/>

        <!-- 当启用时，有延迟加载属性的对象在被调用时将会完全加载任意属性。否则，每种属性将会按需要加载。 -->
        <setting name="aggressiveLazyLoading" value="true"/>

        <!-- 是否允许单条 SQL 返回多个数据集 (取决于驱动的兼容性) default:true -->
        <setting name="multipleResultSetsEnabled" value="true"/>

        <!-- 是否可以使用列的别名 (取决于驱动的兼容性) default:true -->
        <setting name="useColumnLabel" value="true"/>

        <!-- 允许 JDBC 生成主键。需要驱动器支持。如果设为了 true，这个设置将强制使用被生成的主键，有一些驱动器不兼容不过仍然可以执行。 default:false  -->
        <setting name="useGeneratedKeys" value="false"/>

        <!-- 指定 MyBatis 如何自动映射 数据基表的列 NONE：不映射 PARTIAL：部分 FULL:全部  -->
        <setting name="autoMappingBehavior" value="PARTIAL"/>

        <!-- 这是默认的执行类型 （SIMPLE: 简单； REUSE: 执行器可能重复使用prepared statements语句；BATCH: 执行器可以重复执行语句和批量更新） -->
        <setting name="defaultExecutorType" value="SIMPLE"/>

        <!-- 使用驼峰命名法转换字段。 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>

        <!-- 设置本地缓存范围 session:就会有数据的共享 statement:语句范围 (这样就不会有数据的共享 ) defalut:session -->
        <setting name="localCacheScope" value="SESSION"/>

        <!-- 设置 JDBC 类型为空时,某些驱动程序 要指定值, default:OTHER，插入空值时不需要指定类型 -->
        <setting name="jdbcTypeForNull" value="NULL"/>
    </settings>
</configuration>
```



### spring-context-mybatis.xml

​	　新建`spring-context-mybatis.xml`配置文件，完成`Spring`和`mybatis`的整合。`ref="dataSource"`指的是**mybatis实例是从druid获取**的。

```xml{7}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 配置 SqlSession -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!-- 用于配置对应实体类所在的包，多个 package 之间可以用 ',' 号分割 -->
        <property name="typeAliasesPackage" value="com.shooter.funtl.module.entity"/>
        <!-- 用于配置对象关系映射配置文件所在目录 -->
        <property name="mapperLocations" value="classpath:/mapper/**/*.xml"/>
        <property name="configLocation" value="classpath:/mybatis-config.xml"></property>
    </bean>

    <!-- 扫描 Mapper -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.shooter.funtl.module.dao" />
    </bean>
</beans>
```



## 动态SQL

​	　`Mybatis`提供**动态 SQL 标签**用于解决条件不确定的情况，可以编写**OGNL 表达式**对条件作出判断，以实现**动态拼接 SQL 语句**。在 `mapper` 的动态 SQL 中若出现大于号`>`、小于号`<`、大于等于号`>=`，小于等于号`<=`等符号，最好将其转换为**实体符号**。否则，XML 可能会出现解析出错问题。特别是对于小于号`<`，在 XML 中是绝对不能出现的。否则，一定出错。

| 原符号   | <    |  <=   |     >     |  >=  |  &   |  '   |  "   |
| -------- | :--: | :---: | :-------: | :--: | :--: | :--: | :--: |
| 转义字符 | `$lt;` | `&lt;=` | `$gt;` | `$gt;=` | `$amp` | `&apos` | `&quot` |



### if标签

​	　仅当`test 表达式`的值为 true 时，才会将 `if标签` 包含的 SQL 片断拼接到其所在的 SQL 语句中。特别的，`if标签`一般与`where标签`配合使用，若单独使用`if标签`时，需要通过`WHERE 1=1`防止`where`没有任何可拼接的条件的不完整 SQL 语句的情况。

```xml
<select id="selectUserById" resultType="User">
    SELECT user.* FROM tb_user as user
    WHERE 1=1
    <if test="id != null and id != ''">
        AND user.id =  #{id}
    </if>
    <if test="age != null and age > 0">
        AND user.age > #{age}
    </if>
</select>
```



### where标签

​	　首先，若`where标签`中全部的`if标签`的`test表达式`都为`false`时，**不会**添加`where关键字`；**至少存在一个表达式为true时，才会将where关键字加入到SQL语句中**；其次，第一个`AND`也会被`where标签`自动去掉。

```xmL
<select id="selectUserById" resultType="User">
    SELECT user.* FROM tb_user as user
    <where>
        <if test="id != null and id != ''">
            AND user.id =  #{id}
        </if>
    </where>
</select>
```



### choose标签

​	　`choose标签`包含一个或多个 `<when/>` 和`<otherwise/>`标签，可以实现类似于Java 中开关语句`switch`的功能。

```xml
<select id="selectUserById" resultType="User">
    SELECT user.* FROM tb_user as user
    <where>
        <choose>
            <when test="name != null and name != ''">
                AND user.name LIKE concat('%', #{name}, '%')
            </when>
            <when test="age != null and age > 0">
                AND user.age > #{age}
            </when>
            <otherwise>
                AND 1 != 1
            </otherwise>
        </choose>
    </where>
</select>
```



### foreach标签

​	　`<foreach/>` 标签用于实现对于数组与集合的遍历。`collection` 表示要遍历的集合类型（`array`表示数组，`list`表示集合），`open`、`close`、`separator` 为对遍历内容的 SQL 拼接。

#### 遍历数组

```xml
<!-- foreach -->
<select id="selectByForeach" resultType="Student">
    <!-- select * from tb_user as user where user.id in (2, 4) -->
     SELECT user.* FROM tb_user as user
    <!-- OGNL 表达式中的数组使用 array 表示，数组长度使用 array.length 表示。 -->
    <if test="array != null and array.length > 0">
        WHERE user.id IN
        <foreach collection="array" open="(" close=")" item="id" separator=",">
            #{id}
        </foreach>
    </if>
</select>
```



#### 遍历集合

（1）基本类型的List

```java
public List<Student> selectByForeachWithListBase(List<Long> ids);
```

对应的Mapper：

```xml{9}
<!-- foreach -->
<select id="selectByForeachWithListBase" resultType="Student">
    <!-- select * from student where id in (2, 4) -->
    SELECT * FROM  student
    <!-- OGNL 表达式中的列表使用 list 表示，大小使用 list.size 表示。 -->
    <if test="list != null and list.size > 0">
        WHERE id IN
        <foreach collection="list" open="(" close=")" item="id" separator=",">
            #{id}
        </foreach>
    </if>
</select>
```



（2）自定义类型List

```java
public List<Student> selectByForeachWithListCustom(List<Student> students);
```

对应的Mapper：

```xml{9}
<!-- foreach -->
<select id="selectByForeachWithListCustom" resultType="Student">
    <!-- select * from student where id in (2, 4) -->
    SELECT * FROM  student
     <!-- OGNL 表达式中的列表使用 list 表示，大小使用 list.size 表示。 -->
    <if test="list != null and list.size > 0">
        WHERE id IN
        <foreach collection="list" open="(" close=")" item="student" separator=",">
            #{student.id}
        </foreach>
    </if>
</select>
```



### sql标签

​	　`<sql/>` 标签可以定义 SQL 语句中的任何部分为 **SQL 片断**，该SQL片段可以被`<include/>` 标签在动态 SQL 的任何位置**复用**。

#### 定义SQL片段

```xml
<sql id="userSelect">
    user.id,
    user.username as userName,
    user.password as passWord,
    user.phone
</sql>
```

#### 引用SQL片段

```xml
<select id="selectUserAll" resultType="User">
    SELECT
    	<include refid="userSelect" />
    FROM
    	tb_user AS user
</select>
```



## 单表CURD操作

### INSERT新增

```java
/**新增用户信息**/
void insert(User user);
```

对应的Mapper：

```xml
<insert id="insert">
    INSERT INTO tb_user (username, password) VALUES (#{username},#{password})
</insert>
```



### DELETE删除

```java
/**删除用户信息**/
void deleteById(Long id);
```

对应的Mapper：

```xml
<delete id="delete">
    DELETE FROM tb_user WHERE id = #{id}
</delete>
```



### SELECT查询

（1）按条件查询用户信息

```java
/**按条件查询用户信息**/
User selectUserById(Long id);
```

对应的Mapper：

```xml
<select id="selectUserById" resultType="User">
    SELECT
    	<include refid="userSelect" />
    FROM
    tb_user AS user
    <where>
        <if test="id != null and id != ''">
            AND user.id =  #{id}
        </if>
    </where>
</select>
```



（2）按条件模糊查询用户信息

```java
/**按条件模糊查询用户信息**/
List<User> selectUserByUserNameLike(String userNameLike);
```

对应的Mapper：

```xml
<select id="selectUserByUserNameLike" resultType="User">
    SELECT
    	<include refid="userSelect" />
    FROM
    tb_user AS user
    <where>
        <if test="id != null and id != ''">
           AND username LIKE CONCAT ('%', #{userNameLike}, '%')
        </if
    </where>
</select>
```

> 注意：`xml`中不能使用`+`完成字符连接，只能使用`CONCAT()函数`进字符串连接。



### UPDATE更新

```java
/**更新用户信息**/
void updateById(User user);
```

对应的Mapper：

```xml
<update id="updateById">
    UPDATE
   		tb_user
    SET
        username = #{userName},
        password = #{passWord}
    WHERE id = #{id}
</update>
```
