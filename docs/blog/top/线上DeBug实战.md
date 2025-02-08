# 线上DeBug实战



## 经典案例



## 2024年





## 归档案例

### 不换行空格

​	　在代码中，通过`trim()`方法去空格发现无法去除。经测试发现，改空格字符是**不换行空格**（no-break space，NBSP），用途是禁止自动换行，HTML页面显示时会自动合并多个连续的空白字符，但该字符是禁止合并的，因此该字符也称作`硬空格`。

```java
public static void main(String[] args) {
    // 此处是不可换行空格NBSP
    String str = "str ";
    // 打印结果是：【str 】，不可换行空格NBSP不会被trim()去掉
    System.out.println(str.trim());
    // 解决方案：将不可换行空格NBSP去掉
    System.out.println(str.trim().replaceAll(" ",""));
}
```

 

### kill内存过载进程

（1）问题描述

​	　今天项目突然404了，立马执行`cat catalina.out`命令检查日志，但发现日志里面并没有错误信息。然后执行`ps -ef | grep 项目名`命令，**发现项目的进程已被kill**。



（2）解决方案

​	　首先使用`history`命令，排查是否是人为`kill`，发现没有关闭项目的相关命令被执行。接着通过如下三种方法确认了**项目是因为内存过载而被Linux操作系统Kill掉了**。

① 执行`grep "Out of memory" /var/log/messages`，结果如下：

```
Jul 30 15:39:07 localhost Kernel: Out of memory: Kill process 23817 (java) score 473 or sacrifice child
Jul 30 15:39:07 localhost Kernel: Killed process 23817 (java) total-vm:8162620kB, anon-rss:3341684kB, file-rss:0kB, shmem-rss:0kB
```

② 运行 `egrep -i -r 'killed process' /var/log`查看系统日志，结果如下：

```
/var/log/messages-20200803:Jul 30 15:39:07 localhost kernel: Killed process 23817 (java) total-vm:8162620kB, anon-rss:3341684kB, file-rss:0kB, shmem-rss:0kB
```

③ 运行`dmesg`命令，结果如下：

```
[7909674.569288] Out of memory: Kill process 23817 (java) score 473 or sacrifice child
[7909674.569337] Killed process 23817 (java) total-vm:8162620kB, anon-rss:3341684kB, file-rss:0kB, shmem-rss:0kB
```

​	　最后，通过增加Linux内存（临时方案）和 搭建OOM检测工具，检测项目中内存溢出的地方，然后进行优化解决掉了。



### SSLHandshake异常

（1）问题描述

​	　在本地启动Tomcat项目的时候，console中报如下错误，但是，使用Navicat连接MySQL数据库是可以连接上的。

```properties
2020-11-24 13:51:29.976 ERROR 6336 --- [reate-204484400] com.alibaba.druid.pool.DruidDataSource   : create connection SQLException, url: jdbc:mysql://56.56.56.165:3306/customerinfo?characterEncoding=utf8&useSSL=true, errorCode 0, state 08S01
com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure
The last packet successfully received from the server was 137 milliseconds ago.  The last packet sent successfully to the server was 128 milliseconds ago.

Caused by: javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```



（2）解决方案

​	　这个是因为是运维将MySQL从5.7.2升级到了5.7.3 ，只需将`&useSSL=true`去掉，重启Tomcat即可

```properties
# url: jdbc:mysql://100.56.1.165:3306/mysql?characterEncoding=utf8&useSSL=true
url: jdbc:mysql://100.56.1.165:3306/mysql?characterEncoding=utf8
```



### SSLSocketFactory不支持JDK9

（1）问题描述

​	　需要在新机器上部署预发布环境，首先使用`yum install java-1.8.0-openjdk*`命令自动安装JDK，安装成功后查询JDK版本：

```
[user@iZbp129lc2zntsce6uucvxZ ~]# java -version
openjdk version "1.8.0_262"
OpenJDK Runtime Environment (build 1.8.0_262-b10)
OpenJDK 64-Bit Server VM (build 25.262-b10, mixed mode)
```

​	　接着，继续安装Tomcat，然后启动Tomcat，发现项目可以正常启动，最后调用HTTPS接口进行测试时，报如下错误：

```
java.lang.RuntimeException: java.lang.UnsupportedOperationException: clientBuilder.sslSocketFactory(SSLSocketFactory) not supported on JDK 9+
```



（2）解决方案

​	　这个是因为代码中跳过HTTPS验证的语句在JDK9中已经不支持了，但是openjdk的8.0高版本会被错误的辨识为9.0，这个应该是openjdk8的一个BUG，所以造成了这个错误（但是JDK Oracle 8.x版本不会）。参考[这里](https://stackoverflow.com/questions/61458197/clientbuilder-sslsocketfactorysslsocketfactory-not-supported-on-jdk-9)。

```java{6}
public void init() {
		client = new OkHttpClient.Builder()
				.readTimeout(readTimeout, TimeUnit.SECONDS)
				.writeTimeout(writeTimeout, TimeUnit.SECONDS)
				.connectTimeout(connectTimeout, TimeUnit.SECONDS)
				.sslSocketFactory(SSLSocketClientUtils.getSSLSocketFactory())
				.hostnameVerifier(SSLSocketClientUtils.getHostnameVerifier())
				.build();
	}
```

​	　只需降**低安装的openjdk8.x版本号**或者**使用JDK Oracle 8.x版本**就可以了。

```
[user@iZbp129lc2zntsce6uucvxZ bin]# ./java -version
java version "1.8.0_181"
Java(TM) SE Runtime Environment (build 1.8.0_181-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.181-b13, mixed mode)
```



### 内网机器时间失真

（1）问题描述

​	　 记录插入mysql时的时间戳比本地笔记本的时间戳晚了三分钟，导致根据时间戳加签时，MQ服务器总是反馈Token验证失败，致使推送MQ失败。



（2）解决方案

​	　本地笔记本连接的是外网，时间可以及时与互联网进行同步，但是服务器部署在局域网中，时间戳不能实时与互联网的时间进行同步，只能依靠服务器的计数器进行计时，久而久之，内网服务器的时间戳必然会与互联网中的时间戳不相等，若相差较大的话，只能进行人工调整服务器当前时间戳。

```shell
#查看时间
date "+%Y_%m_%d  %H-%M-%S"
#设置时间
date -s "2020-05-17 09:51:50"
```



### 配置JAVA_OPTS

（1）问题分析

​	　查看后台日志，发现报错：**nested exception is java. lang.OutOfMemoryError: Java heap space**，重启Tomcat再次申报时，仍回报这个错误。



（2）解决方案

```java
//vi catalina.sh(旧的JAVA_OPTS配置)
JAVA_OPTS="-server -Xms2048m -Xmx4096m 
    -XX:PermSize=128M  -XX:MaxPermSize=1024m 
    -Djavax.servlet.request.encoding=UTF-8 
    -Dfile.encoding=UTF-8 -Duser.language=zh_CN -Dsun.jnu.encoding=UTF-8"
        
//springboot
nohup java -Xms512m -Xmx512m 
           -Dloader.path=lib/ -jar 
           -Dspring.profiles.active=pro 
           -Dserver.port=8090 ~/portal/cms-portal-*.jar 
           >~/portal/springboot.log 2>&1 &

//docker
docker run -d   \
-e TZ=Asia/Shanghai   \
--restart always   \
-v /home/project/logs:/usr/local/tomcat/logs  \
-e JAVA_OPTS='-server -Xms2000m -Xmx6000m' \
--name project   \
-p 8080:8080 project
```

​	　JVM初始分配的堆内存由`-Xms`指定，**默认是物理内存的1/64**；JVM最大分配的堆内存由`-Xmx`指定，按需分配。**默认是物理内存的1/4**。默认空余堆内存小于`40%`时，JVM就会增大堆直到`-Xmx`的最大限制；空余堆内存大于`70%`时，`JVM`会减少堆直到`-Xms`的最小限制。因此服务器一般设置`-Xms`、`-Xmx`相等以避免在每次`GC` 后调整堆的大小。

​	　如果`-Xmx` 不指定或者指定偏小，应用可能会导致`java.lang.OutOfMemory`错误，此错误来自`JVM`，不是`Throwable`的，无法用`try...catch`捕捉。 

### Git推送代码时认证失败

（1）问题描述

​	　在SourceTree推送代码的时候提示用户Authentication failed，错误信息如下：

```
remote: Permission to **/.git denied to **.
fatal: unable to access '**.git/':The requested URL returned error: 403
```



（2）解决方案

​	　这个是因为Git仓库的用户名密码已经被修改了，导致**原来的认证凭据失效，需要删除旧的认证凭据，然后重新进行认证**，操作步骤如下：

```
- win + R 打开 运行
- 输入 control keymgr.dll，然后确定，打开凭据管理器
- 选择windows凭据下，然后在window凭据下方的普通凭据中找到需要删除的凭据进行删除
- 重新拉取代码，会弹出用户名密码的输入页面，在此处输入正确的用户名密码即可
```



### Github链接超时的问题

（1）问题描述

​	　今天提交代码的时候，IDEA提示`github.com`**连接超时**，并且也无法更新项目代码；在sourcetree中也是这样的情况。但是**github.com网址确实可以通过浏览器正常访问**。

```
github.com[52.74.223.119:443] connect time out
```

​        在cmd中运行`ping  github.com`，提示连接超时。

```
正在 Ping github.com [52.74.223.119] 具有 32 字节的数据:
请求超时。
请求超时。
```



（2）解决方案

​	　首先，查询[github.com](https://github.com.ipaddress.com/)和[github.global.ssl.fastly.net](https://fastly.net.ipaddress.com/github.global.ssl.fastly.net)的IP，然后打开 `hosts`文件，并将这两个IP追加到文件末尾。

```shell
# C:\Windows\System32\drivers\etc\hosts
140.82.112.3     github.com
199.232.5.194     github.global.ssl.fastly.net
```

​	　然后保存hosts文件，执行如下命令刷新DNS缓存：

```shell
//Windows下终端执行 
ipconfig /flushdns
```

​	　完成后，`ping github.com`可以得到数据相应，在IDEA中也可以正常拉取代码了，**但是推送代码仍会报错**。

```shell
正在 Ping github.com [140.82.113.3] 具有 32 字节的数据:
来自 140.82.113.3 的回复: 字节=32 时间=389ms TTL=40
来自 140.82.113.3 的回复: 字节=32 时间=285ms TTL=40
```

​	　继续深究发现，应该是`C:\Users\用户名\.ssh`目录下的`known_hosts`文件中配置的`github.com`的IP有问题，`github.com`被固定执向了`52.74.223.119`，所以更改`hosts`中`github.com`中的`IP`，也无法正常的提交代码。

```
github.com,52.74.223.119 ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQE......UFFAaQ==
```

​	　接着，我**删除**`C:\Users\用户名\.ssh`目录下`known_hosts`、`id_rsa`、`id_rsa.pub`文件，然后运行`git-bash.exe`程序，并输入以下命令**重新生成了秘钥**。

```ssh
//重新生成秘钥(输入注册GitHub的邮箱)
ssh-keygen -t rsa -C "suheforvip@gmail.com"
```

​	　然后，在Github中`Settings -> SSH and GPG keys`中`New SSH key`，Title自定义，Key是刚才生成的公钥文件id_rsa.pub里面的内容。配置完成后在git bash里输入下面的命令，验证是否按照成功：

```shell
ssh -T git@github.com
```

​	　重新配置完成后，发现已经可以正常拉取、更新、推送项目代码了，known_hosts文件中github.com配置的IP也更新为140.82.113.3了。

```
github.com,140.82.113.3 ssh-rsa AAAAB3NzaC.........FFAaQ==
```

​	　后来发现，其实隔天后即使不做任何更改，拉取、更新、推送GitHub的代码也会正常了的，盲猜应该是当时**Github的DNS解析被污染造成的临时状况**。

