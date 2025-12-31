# xxl-job分布式任务调度平台

​	　XXL-JOB是一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。

> **Ref**：[Git](https://gitee.com/xuxueli0323/xxl-job) | [DockerHub](https://hub.docker.com/r/xuxueli/xxl-job-admin/)



**参考文献：**

- [XXL-JOB开源社区](https://www.xuxueli.com/xxl-job/)

  

## 简介



## 快速开始

```shell
# 环境准备

mysql:
xxl-job: 2.3.1
```

​	　首先，在

```shell
docker run --name xxl-job-admin  \
  -p 9001:8080  \
  --restart always  \
  -e PARAMS="--spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?characterEncoding=utf8&useSSL=false --spring.datasource.username=root --spring.datasource.password=root"  \
  -v /tmp:/data/applogs  \
  -d xuxueli/xxl-job-admin:2.3.1
```





