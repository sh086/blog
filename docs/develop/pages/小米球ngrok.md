# 小米球ngrok

​	　首先，打开小米球ngrok[主页](https://manager.xiaomiqiu.com/)，注册登录后即可下载客户端，并可以在`主页`的`系统管理`- `账户管理`- `我的账户` 中查看自己的小米球Token。然后，在配置文件`ngrok.conf`中配置启动隧道名称 和 小米球Token。

```yml
server_addr: "ngrok2.xiaomiqiu.cn:5432"
trust_host_root_certs: true
inspect_addr: disabled
auth_token: "你的小米球Token,需前往https://manager.xiaomiqiu.com/ 注册获得"

tunnels:
    myshop:
      remote_port: 80
      subdomain: myshop
      proto:
        http: 127.0.0.1:8080
```
​	　 接着，执行`startup.bat`文件运行小米球ngrok，启动成功后，输入需要启动的隧道名称并回车确认，如 `myshop`，若同时启动多个隧道请用空格分割，如 `httptun httpstun tcptun`。运行成功后，提示如下页面，表名`127.0.0.1:8080`已被成功映射到`http://myshop.ngrok2.xiaomiqiu.cn`上了。

```shell
Tunnel Status       online    
Version      		2.1/2.1
Forwarding      	http://myshop.xiaomiqiu.cn -> 127.0.0.1:8080                 
Web Interface      	disabled                                         
```

