# SkyWalking部署

​	　`SkyWalking` 是应用程序性能监控（Application Performance Monitoring，即APM）工具，用于从服务和云原生 等基础设施中收集、分析、聚合以及可视化数据的一体化解决方案。可以通过`SkyWalking` 的[在线 Demo](http://demo.skywalking.apache.org/)（用户 名：skywalking 密码: skywalking）来预览。



**参考资料：**

- [Linux下安装Docker](https://juejin.cn/post/6844903974567428110)
- [基于docker部署skywalking实现全链路监控 ](https://cloud.tencent.com/developer/article/1695427)
- [SkyWalking报警发送到钉钉群](http://skywalking.apache.org/zh/2020-12-13-skywalking-alarm/)



## elasticsearch

​	　首先，我们需要部署`elasticsearch`数据库用于持久化存储`SkyWalking`的监控数据。 

1、修改系统参数 

```shell
vi /etc/sysctl.conf
# 修改参数
vm.max_map_count=262144
# 使得配置生效
sysctl -p
```

2、创建持久化目录 

```shell
mkdir -p /home/elasticsearch
```

3、运行`elasticsearch` 

```shell
docker run --name elasticsearch \
--restart=always \
-p 9200:9200 -p 9300:9300 \
-v /data/elasticsearch/data:/home/elasticsearch/data \
-v /data/elasticsearch/logs:/home/elasticsearch/logs \
-e "discovery.type=single-node" \
-e ES_JAVA_OPTS="-Xms1024m -Xmx2048m" \
-d elasticsearch:7.5.1
```

​	　配置中elasticsearch暴露的端口9200，启动完成后，输入如下命令：

```shell
curl http://localhost:9200
```

​	　若出现如下信息，则表明`elasticsearch`已经启动完成。

```json
{
    "name" : "96951bf8001f",
    "cluster_name" : "docker-cluster",
    "cluster_uuid" : "Epg5fVxwTv2Bb6On-DgmkA",
    "version" : {
    "number" : "7.5.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "3ae9ac9a93c95bd0cdc054951cf95d88e1e18d96",
    "build_date" : "2019-12-16T22:57:37.835892Z",
    "build_snapshot" : false,
    "lucene_version" : "8.3.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
    },
    "tagline" : "You Know, for Search"
}
```

**特别说明：**

```
① 使用最新版本的elasticsearch和skywalking-oap-server镜像，启动会有问题的
② -e "discovery.type=single-node" ：设置为单节点
③ 测试环境下建议设置ES的初始内存和最大内存，否则导致过大启动不了
```



## skywalking-oap

​	　接下来，需要部署`skywalking-oap`服务，用于接收`agent`上报的监控数据，并保存到`elasticsearch`数据库中。

```shell
docker run --name skywalking-oap --restart always \
-p 1234:1234 -p 11800:11800 -p 12800:12800 -d \
--link elasticsearch:elasticsearch \
-e TZ=Asia/Shanghai \
-e SW_STORAGE=elasticsearch \
-e SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200 \
apache/skywalking-oap-server:6.6.0-es7
```

​	　若希望允许远程传输，则还需要开放`11800`（gRPC）和`12800`（rest）端口，远程`agent`将通过该端口传输收集的 数据：

```shell
firewall-cmd --zone=public --add-port=11800/tcp --permanen
firewall-cmd --zone=public --add-port=12800/tcp --permanen
firewall-cmd --reload
firewall-cmd --zone=public --query-port=11800/tcp
firewall-cmd --zone=public --query-port=12800/tcp
```



## skywalking-ui

​	　然后，需要部署 `skywalking-ui` 服务，用于通过 skywalking-oap 服务查询 agent 上报的各个系统的监控数据，并 展示在页面中。

```shell
docker run --name skywalking-ui -d \
-p 8080:8080 --restart always \
--link skywalking-oap:skywalking-oap \
-e TZ=Asia/Shanghai \
-e SW_OAP_ADDRESS=skywalking-oap:12800 \
apache/skywalking-ui:6.6.0
```

​	　运行完成后，即可打开 http://IP:8080 ，在浏览器中访问`SkyWalking`。



## 应用接入

​	　在官网中下载 `skywalking` 的完整`tar包`解压，把里面的 `agent`文件夹 整个传到被监控应用所在的服务器上，并配置 被监控应用的启动参数，如：

```shell
# -javaagent: 指定agent包位置
# -Dskywalking.agent.service_name: 指定服务名
# -Dskywalking.collector.backend_service: 指定skywalking oap地址
-javaagent:/home/project/agent/skywalking-agent.jar -Dskywalking.agent.service_name=项目测试 -
Dskywalking.collector.backend_service=100.26.205.117:11800
```

（1）若项目采用jar部署，需要采用如下示例命令：

```shell
java -javaagent:/home/project/agent/skywalking-agent.jar -Dskywalking.agent.service_name=project
-Dskywalking.collector.backend_service=100.26.205.117:11800 -jar spring-boot.jar
```

（2）若项目采用`Tomcat`部署，需要修改`catalina.sh`，新增如下启动参数：

```shell
CATALINA_OPTS="$CATALINA_OPTS -javaagent:/home/project/agent/skywalking-agent.jar -
Dskywalking.agent.service_name=项目测试 -Dskywalking.collector.backend_service=100.26.205.117:11800"
export CATALINA_OPTS
```

## 验证安装

​	　再次打开 http://IP:8080 ，因为机制为懒加载，所以当只有你调用该java接口时，页面上才有显示。所以第一次访 问时，数据是没有的。需要选择 自动 刷新页面，然后访问接入的应用的接口，最多稍等1分钟，即可观测到数据 了。具体的SkyWalking指标说明可以参加这里。

![image-20211104111817731](./images/image-20211104111817731.png)