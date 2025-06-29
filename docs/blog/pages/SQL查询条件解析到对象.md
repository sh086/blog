# SQL查询条件解析到对象

​	　首先，需要在`pom.xm`l文件中引入`jar`包。

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.10</version>
</dependency>
```



## 解析Where

​	　在`SqlUtils`工具类中，编写`resolveWhere`方法，用于解析`SQL语句`中的`where过滤条件`到`模型`中。

```java
import com.alibaba.druid.sql.SQLUtils;
import com.alibaba.druid.sql.ast.SQLStatement;
import com.alibaba.druid.sql.dialect.sqlserver.visitor.SQLServerSchemaStatVisitor;
import com.alibaba.druid.stat.TableStat;
import com.alibaba.druid.util.JdbcConstants;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Component;
import java.lang.reflect.Field;
import java.util.*;

@Component
@Slf4j
public class SqlUtils {

    /**
     * 解析Where过滤条件
     * */
    public static <T> T resolveWhere(String sql, Class<T> valueType) {

        T domain;
        Map<String,Object> whereMap = Maps.newHashMap();
        String dbType = JdbcConstants.MYSQL;
        String formatSql = SQLUtils.format(sql, dbType);
        try{
            //实例化
            domain = valueType.newInstance();
            //解析where条件到whereMap中
            List<SQLStatement> stmtList = SQLUtils.parseStatements(formatSql, dbType);
            for (SQLStatement stmt : stmtList) {
                //添加visitor
                SQLServerSchemaStatVisitor visitor = new SQLServerSchemaStatVisitor();
                stmt.accept(visitor);
                //解析表名
                String tableName;
                try {
                    tableName = visitor.getTables().keySet().toArray()[0].toString();
                }catch (Exception e){
                    throw new RuntimeException("表名解析失败:"+e.getMessage());
                }
                //解析参数
                List<TableStat.Condition> list = visitor.getConditions();
                for (val obj : list) {
                    val name = obj.getColumn().toString().replaceAll(tableName+".","");
                    val value = obj.getValues().toArray()[0];
                    whereMap.put(name,value);
                }
            }
            //生成Class类型
            Field[] fields = valueType.getDeclaredFields();
            for (Field field : fields) {
                //私有变量必须先设置Accessible为true
                field.setAccessible(true);
                String name = field.getName();
                String type = field.getType().toString();
                val value = whereMap.get(name);
                field.set(domain, value);
            }
        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("SQL语句解析异常:"+e.getMessage());
        }
        return domain;
    }
}
```



## 测试运行

​	　首先，需要根据SQL中的where条件，新建`SqlModal`数据模型，用于

```java
import lombok.Data;

@Data
public class SqlModal {
	private String name;
	private Integer age;
	private String address;
	private Integer status;
	private String startDate;
	private String endDate;
}
```

​	　然后，编写测试用例。

```java
@Test
public void resolveWhere(){
    String sql = "select* from (SELECT * from user where name = '小明' and age = 6 and address = '地址' and status =0 and startDate >'2019-02-28' and endDate >'2019-02-28') temp";
    SqlModal vo = SqlUtils.resolveWhere(sql, SqlModal.class);
    log.info("解析结果：{}",vo);
}
```

​	　运行结果如下，发现SQL中的where条件是可以被正常解析了。

```
解析结果：SqlModal(name=小明, age=6, address=地址, status=0, startDate=2019-02-28, endDate=2019-02-28)
```

