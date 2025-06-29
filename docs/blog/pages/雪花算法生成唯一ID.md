# 雪花算法



## IdUtils

```java
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

/**
 * 雪花算法生成唯一ID
 * */
@Component
public class IdUtils {

    private final static long twepoch = 12888349746579L;
    // 机器标识位数
    private final static long workerIdBits = 5L;
    // 数据中心标识位数
    private final static long datacenterIdBits = 5L;

    // 毫秒内自增位数
    private final static long sequenceBits = 12L;
    // 机器ID偏左移12位
    private final static long workerIdShift = sequenceBits;
    // 数据中心ID左移17位
    private final static long datacenterIdShift = sequenceBits + workerIdBits;
    // 时间毫秒左移22位
    private final static long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;
    //sequence掩码，确保sequnce不会超出上限
    private final static long sequenceMask = -1L ^ (-1L << sequenceBits);
    //上次时间戳
    private static long lastTimestamp = -1L;
    //序列
    private long sequence = 0L;
    //服务器ID
    private long workerId = 1L;
    private static long workerMask= -1L ^ (-1L << workerIdBits);
    //进程编码
    private long processId = 1L;
    private static long processMask=-1L ^ (-1L << datacenterIdBits);

    private IdUtils() {
        //获取机器编码
        this.workerId=this.getMachineNum();
        //获取进程编码
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        this.processId=Long.valueOf(runtimeMXBean.getName().split("@")[0]).longValue();
        //避免编码超出最大值
        this.workerId=workerId & workerMask;
        this.processId=processId & processMask;
    }

    /**
     * 获取主键入口方法
     * */
    public long getNextId() {
        //获取时间戳
        long timestamp = timeGen();
        //如果时间戳小于上次时间戳则报错
        if (timestamp < lastTimestamp) {
                try {
                        throw new Exception("Clock moved backwards.  Refusing to generate id for " + (lastTimestamp - timestamp) + " milliseconds");
                } catch (Exception e) {
                        e.printStackTrace();
                }
        }
        //如果时间戳与上次时间戳相同
        if (lastTimestamp == timestamp) {
                // 当前毫秒内，则+1，与sequenceMask确保sequence不会超出上限
                sequence = (sequence + 1) & sequenceMask;
                if (sequence == 0) {
                        // 当前毫秒内计数满了，则等待下一秒
                        timestamp = tilNextMillis(lastTimestamp);
                }
        } else {
                sequence = 0;
        }
        lastTimestamp = timestamp;
        // ID偏移组合生成最终的ID，并返回ID
        return ((timestamp - twepoch) << timestampLeftShift) | (processId << datacenterIdShift) | (workerId << workerIdShift) | sequence;
    }

    /**
     * 再次获取时间戳直到获取的时间戳与现有的不同
     * @param lastTimestamp
     * @return 下一个时间戳
     */
    private long tilNextMillis(final long lastTimestamp) {
        long timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
                timestamp = this.timeGen();
        }
        return timestamp;
    }

    private long timeGen() {
        return System.currentTimeMillis();
    }

    /**
     * 获取机器编码
     */
    private long getMachineNum(){
        long machinePiece;
        StringBuilder sb = new StringBuilder();
        Enumeration<NetworkInterface> e = null;
        try {
                e = NetworkInterface.getNetworkInterfaces();
        } catch (SocketException e1) {
                e1.printStackTrace();
        }
        while (e != null && e.hasMoreElements()) {
                NetworkInterface ni = e.nextElement();
                sb.append(ni.toString());
        }
        machinePiece = sb.toString().hashCode();
        return machinePiece;
    }
}
```



## 测试运行

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@Slf4j
public class UtilsTest {

    @Autowired
    private IdUtils idUtils;
    
    /**
     * 使用雪花算法获取唯一主键
     * */
    @Test
    public void testIdUtils(){
        Long id = idUtils.getNextId();
        log.info("获取主键：{}",id);
    }
}
```

