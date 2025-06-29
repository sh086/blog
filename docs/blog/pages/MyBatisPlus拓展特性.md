# MyBatis-Plus拓展

## 自动填充功能

（1）编写MetaObjectHandler，自动填充创建时间更新时间

```java
package com.shooter.springboot.common.mybatis;

import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class MetaObjectHandler implements com.baomidou.mybatisplus.core.handlers.MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

（2）在`User类`的 `createTime` 和 `updateTime` 字段上，加上`FieldFill`声明执行场景。

```java
@TableField(fill = FieldFill.INSERT)
private LocalDateTime createTime;
    
@TableField(fill = FieldFill.INSERT_UPDATE)
private LocalDateTime updateTime;
```

（3）编写测试用例，新增`User`数据，但不设置`createTime`和`updateTime`

```java
@Test
public void testInsert() {
    User user = new User();
    user.setAge(21);
    user.setMoney(21.00);
    user.setName("小黄");
    user.setEmail("wer@qq.com");
    userMapper.save(user);
}
```

​	　测试用例执行完成后，可在`tb_user`表中查看`createTime`和`updateTime`已有默认值。

```
1	小黄	21	wer@qq.com	21.00	2021-12-09 15:49:34	2021-12-09 15:49:34
```

