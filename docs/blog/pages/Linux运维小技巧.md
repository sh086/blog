# Linux运维小技巧

## 根据进程号查找程序路径

```shell
# 查看进程PID
ps -ef | grep java
# 进入/proc相应进程PID的文件夹
cd /proc/11712
# 查看对应的程序路径
ls –ail
```

## 防火墙开放端口

```shell
firewall-cmd --zone=public --add-port=11111/tcp --permanen
firewall-cmd --reload
firewall-cmd --zone=public --query-port=11111/tcp
```
