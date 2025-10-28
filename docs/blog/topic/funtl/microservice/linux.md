---
sidebar: auto
---

# Linux

​	　Linux 是一种自由和开放源码的类 UNIX 操作系统。Linux 本身只表示 Linux 内核，但广义上Linux 指整个基于 Linux 内核，并且使用 GNU 工程各种工具和数据库的操作系统。

​	　常见的Linux发行版有 `Ubuntu`（社区产物，更新频繁，多用于个人）、`CentOS`（有公司背景，稳定，更新缓慢，多用于互联网公司）、`RedHat`（多用于政府部门）。

## Linux简介

### 安装Ubuntu

​	　首先，需要在[Ubuntu官网](https://ubuntu.com/download/server)选择`Ubuntu Server LTS`版本下载（**LTS**指长期支持版本），然后可以参照[此处](https://www.bilibili.com/video/av27095828/)在VMware上安装Ubuntu。安装完成后记得**开启root远程登录Linux的权限** 以及  **修改软件安装包数据源**。

```shell
# 安装时需要注意事项如下：
- 建议安装English版本
- 安装Ubuntu时需要联网，否则会少安装一些依赖
- 磁盘分区时一定要选择LVM（磁盘扩容技术）的方式
- 仅选择安装SSH服务，其余的无需安装
- 设置交换空间大小一般等于内存大小或者内存大小的一半（云服务器没有有交换空间）
- 关闭自动更新
```

​	　交换空间大小一般**等于**`内存大小`或者`内存大小的一半`，可以让开发者在内存溢出时候，仍可以进行处理，但是开启交换空间会影响服务器性能，所以在**云服务器没有有交换空间**的。

> **Ref**：[Linux LVM 磁盘扩容](https://www.funtl.com/zh/linux/Linux-LVM-%E7%A3%81%E7%9B%98%E6%89%A9%E5%AE%B9.html#lvm-%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)



### Linux远程控制管理 

（1） 开启root远程登录Linux的权限

​	　管理员用户是安装的时候创建的用户，是超级管理员root的代理用户，但是SSH默认是不允许直接使用root账号登录Linux服务的，需要通过修改`PasswordAuthentication`值才能使用root账号登录。特别的：阿里云的默认是可以通过root账户登录的。

```shell
#打开SSH配置文件
vi /etc/ssh/sshd_configs
#将PasswordAuthentication选项的原值no，改为yes，然后正常保存退出
PasswordAuthentication yes
#重启SSH服务，即可使用root远程登录Linux
/etc/init.d/ssh restart（或者 service ssh restart）
```



（2）远程登录工具

​	　传统的网络服务程序(**FTP**、POP、**telnet** )本质上都是不安全的，因为它们在网络上通过**明文**传送口令和数据，这些数据非常容易被截获。**SSH** (Secure Shell)可以把传输数据进行**加密**（预防攻击） 和 **压缩**（加快传输速度），但由于SSH受到版权和加密算法限制，现在很多人都使用免费的替代软件 **OpenSSH** 或者 **Xshell**。

​	　OpenSSH 由**客户端**和**服务端**组成，有基于口令和基于密钥的两种安全验证方式。OpenSSH 多用于Linux系统中。基于**口令**的安全验证：知道服务器的帐号密码即可远程登录，口令和数据在传输过程中都会被加密。基于**密钥**的安全验证：此时需要在创建一对密钥，把公有密钥放到远程服务器上自己的宿主目录中，而私有密钥则由自己保存。

```shell
# 检查软件是否安装
apt-cache policy openssh-client openssh-server
# 安装服务端
apt-get install openssh-server
# 安装客户端
apt-get install openssh-client
# 安装完成后，可通过/etc/ssh/sshd\_config查询OpenSSH的配置信息
```

​	　XShell 是Microsoft Windows 端一个强大的安全终端模拟软件，支持 SSH1, SSH2, TELNET 协议，具体图形化页面，简单易用。



### Linux文件目录

​	　安装Linux成功后，可以看到在主目录 `/` 挂载的目录结构如下：

![200_linux_file_patch](./images/1_linix_01.png)

**各目录的含义如下：**

```
- home：存放所有用户文件的根目录
- usr：用于存放系统应用程序，比较重要的目录/usr/local 本地管理员软件安装目录
- var：用于存放运行时需要改变数据的文件
- etc：存放系统配置文件
- sbin：存放二进制可执行文件，只有root才能访问
- bin：存放二进制可执行文件(ls,cat,mkdir等)
- boot：存放用于系统引导时使用的各种文件
- dev：存放用于系统引导时使用的各种文件
- lib:：存放跟文件系统中的程序运行所需要的共享库及内核模块
- mnt：系统管理员安装临时文件系统的安装点
- opt：额外安装的可选应用程序包所放置的位置
- proc：虚拟文件系统，存放当前内存的映射
- root：超级用户目录
- tmp：用于存放各种临时文件
```



### 软件包管理

​	　Linux系统分为`RedHat系列`（Redhat、Centos、Fedora等）和`Debian系列`（Debian、Ubuntu等）两种，RedHat系列的包管理工具是`yum`，Debian系列的包管理工具是`apt-get`。我们以Ubuntu吸引为例。

```
# 可以通过如下命令查看系统版本
cat /proc/version
```

（1）修改数据源

​	　由于国内的网络环境问题，我们需要将 Ubuntu 的数据源修改为国内数据源，具体操作步骤如下：

① 首先需要查询Linux系统名称

```shell
lsb_release -a
```

输出结果为

```text
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 16.04 LTS
Release:	16.04
Codename:	xenial  - [xenial]为 Ubuntu 系统的名称，修改数据源需要用到该名称
```



② 接着需要编辑数据源

```shell
# APT 的源文件为 /etc/apt/sources.list 文件
vi /etc/apt/sources.list
```

删除全部内容并修改为

```shell
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
```



③ 更新数据源

```shell
apt-get update
```



（2） APT 命令

```shell
# 搜索
apt-cache search package
# 获取包信息
apt-cache show package
# 删除包及配置文件
apt-get remove package --purge
# 了解使用依赖
apt-cache depends package
# 查看被哪些包依赖
apt-cache rdepends package
# 安装相关的编译环境
apt-get build-dep package
# 下载源代码
apt-get source package
# 清理无用的包
apt-get clean && apt-get autoclean
# 检查是否有损坏的依赖
apt-get check
# 升级有可用更新的系统（慎用）
apt-get upgrade
```



## Linux操作命令

### 操作文件目录

| 命令  | 说明                               | 语法                                            | 参数说明                                                     |
| :---- | :--------------------------------- | :---------------------------------------------- | :----------------------------------------------------------- |
| ls    | 显示文件和目录列表                 | ls [-alrtAFR] [name...]                         | -1 : 列出文件的详细信息<br />-a：列出当前目录所有文件，包含隐藏文件 |
| mkdir | 创建目录                           | mkdir [-p] dirName                              | -p : 父目录不存在情况下先生成父目录                          |
| cd    | 切换目录                           | cd [dirName]                                    |                                                              |
| touch | 生成一个空文件                     | touch [fileName]                                |                                                              |
| echo  | 生成一个带内容文件                 | echo abcd > 1.txt<br />echo 1234 >> 1.txt       | `>` 追加   `>>` 覆盖                                         |
| cat   | 显示文本文件内容                   | cat [-AbeEnstTuv] [--help] [--version] fileName |                                                              |
| cp    | 复制文件或目录                     | cp [options] source dest                        |                                                              |
| rm    | 删除文件                           | rm [options] name...                            | -f : 强制删除文件或目录<br />-r : 同时删除该目录下的所有文件 |
| mv    | 移动文件或目录                     | mv [options] source dest                        | 变更目录名：`mv` dir1 dir2<br />移动目录：`mv` dir1/ dir2/   |
| find  | 在文件系统中查找指定的文件         |                                                 | -name：文件名                                                |
| grep  | 在指定的文本文件中查找指定的字符串 |                                                 |                                                              |
| tree  | 用于以树状图列出目录的内容         |                                                 |                                                              |
| pwd   | 显示当前工作目录                   |                                                 |                                                              |
| ln    | 建立软链接                         |                                                 |                                                              |
| more  | 分页显示文本文件内容               |                                                 |                                                              |
| head  | 显示文件开头内容                   |                                                 |                                                              |
| tail  | 显示文件结尾内容                   | touch [-f] [fileName]                           | -f : 跟踪输出                                                |



###  系统命令

（1）系统管理命令

```
- stat	显示指定文件的相关信息,比ls命令显示内容更多
- who	显示在线登录用户
- hostname	显示主机名称
- uname	显示系统信息
- top	显示当前系统中耗费资源最多的进程
- ps	显示瞬间的进程状态
- du	显示指定的文件（目录）已使用的磁盘空间的总量
- df	显示文件系统磁盘空间的使用情况
- free	显示当前内存和交换空间的使用情况
- ifconfig	显示网络接口信息
- ping	测试网络的连通性
- netstat	显示网络状态信息
- clear	清屏
- kill	杀死一个进程
```



（2）开关机命令

```shell
shutdown [-t seconds] [-rkhncfF] time [message]
```

① 参数说明：

```
-t seconds	设定在几秒钟之后进行关机程序
-k	并不会真的关机，只是将警告讯息传送给所有只用者
-r	关机后重新开机（重启）
-h	关机后停机
-n	不采用正常程序来关机，用强迫的方式杀掉所有执行中的程序后自行关机
-c	取消目前已经进行中的关机动作
-f	关机时，不做 fcsk 动作(检查 Linux 档系统)
-F	关机时，强迫进行 fsck 动作
time	设定关机的时间
message	传送给所有使用者的警告讯息
```

② 使用实例：

```shell
# 重启
reboot
shutdown -r now
# 关机
shutdown -h now
```



### 解压缩命令

（1）tar命令 -- 后缀是 `.tar.gz`

```shell
tar [-cxzjvf] 压缩打包文档的名称 欲打包目录
```

① 参数说明：

```
-c	建立一个归档文件的参数指令
-x	解开一个归档文件的参数指令
-z	是否需要用 gzip 压缩
-j	是否需要用 bzip2 压缩
-v	压缩的过程中显示文件
-f	使用档名，在 f 之后要立即接档名
-tf	查看归档文件里面的文件
```

② 使用实例：

```shell
# 压缩文件夹
tar -zcvf test.tar.gz test\
# 解压文件夹
tar -zxvf test.tar.gz
```



（2）gzip命令  -- 后缀是 `.gz`

```shell
gzip [选项] 压缩（解压缩）的文件名
```

参数说明：

```
-d	解压缩
-l	对每个压缩文件，显示压缩文件的大小，未压缩文件的大小，压缩比，未压缩文件的名字
-v	对每一个压缩和解压的文件，显示文件名和压缩比
-num	用指定的数字num调整压缩的速度，系统缺省值为6
		-1或--fast表示最快压缩方法（低压缩比）
		-9或--best表示最慢压缩方法（高压缩比）
```



（3）bzip2命令  -- 后缀是 `.bz2`

```shell
bzip2 [-cdz]
```

参数说明：

```
-d	解压缩
-z	压缩参数
-num	用指定的数字num调整压缩的速度，系统缺省值为6
		-1或--fast表示最快压缩方法（低压缩比）
		-9或--best表示最慢压缩方法（高压缩比）
```



## 权限管理

### 用户和组管理

​	　Linux用户分为 `root`、`系统用户` 和 `普通用户`。`root` 是**超级管理员账户**，可以对普通用户和整个系统进行管理；`系统用户`是指 `admin 组`中的用户，admin 组中的用户默认是可以使用 `sudo 命令`来执行只有管理员才能执行的命令的，特别的，安装时创建的系统用户会自动被添加到 admin 组中的；如果不使用 sudo 就是一个普通用户， 普通用户在Linux中仅可以进行普通操作。

​	　Linux**组账户**分为 `私有组` 和 `标准组`。**私有组**是指当创建一个用户时没有指定属于哪个组，Linux 就会建立一个与用户同名的私有组，此私有组只含有该用户。**标准组**是指当创建一个用户时可以选定一个标准组，如果一个用户同时属于多个组时，**登录后所属的组为主组**，其他的为附加组。

（1）增加用户

```shell
useradd 用户名
useradd -u (UID号)
useradd -p (口令)
useradd -g (分组)
useradd -s (SHELL)
useradd -d (用户目录)
```

（2）修改用户

```shell
usermod -u (新UID)
usermod -d (用户目录)
usermod -g (组名)
usermod -s (SHELL)
usermod -p (新口令)
usermod -l (新登录名)
usermod -L (锁定用户账号密码)
usermod -U (解锁用户账号)
```

（3）删除用户

```shell
userdel 用户名 (删除用户账号)
userdel -r 删除账号时同时删除目录
```

（4）组账户维护

```
groupadd 组账户名 (创建新组)
groupadd -g 指定组GID
groupmod -g 更改组的GID
groupmod -n 更改组账户名
groupdel 组账户名 (删除指定组账户)
```

（5）口令维护

```shell
passwd 用户账户名 (设置用户口令)
passwd -l 用户账户名 (锁定用户账户)
passwd -u 用户账户名 (解锁用户账户)
passwd -d 用户账户名 (删除账户口令)
gpasswd -a 用户账户名 组账户名 (将指定用户添加到指定组)
gpasswd -d 用户账户名 组账户名 (将用户从指定组中删除)
gpasswd -A 用户账户名 组账户名 (将用户指定为组的管理员)
```

（6）用户和组状态

```shell
su 用户名(切换用户账户)
id 用户名(显示用户的UID，GID)
whoami (显示当前用户名称)
groups (显示用户所属组)
```



### 文件权限管理

​	　`ls -l 文件名` 可以显示文件或目录的详细信息，包括**文件类型**、**文件权限** 、**文件所属用户**、**文件的所属组**、文件的大小（bytes）、文档最后被修改日期 和 文件的名称。

```shell
# profile是一个文件
# user用户拥有可读的权限
# user组拥有可读、可写权限，因user用户属于user组，故user用户也拥有可读、可写权限
# 其他用户拥有可读的权限
-r--rw-r-- 1 user user 675 Oct 26 17:20 .profile
```

​	　权限信息共有`10位`组成，第1位表示**文档类型** (`d` 目录，`-` 普通文件，`l` 链接文件，`c` 表示串行端口字符设备文件，`b` 表示可供存储的块设备文件)，余下的字符 **3 个字符为一组**。**r 只读，w 可写，x 可执行，- 表示无此权限**。



（1）chown改变文件或者目录所有者（用户和用户组）

```shell
# -R：进行递归式的权限更改，将目录下的所有文件、子目录更新为指定用户组权限
chown [-R] 用户名称 用户组名称 文件或目录
```



（2）chmod改变访问权限

```shell
chmod [who] [+ | - | =] [mode] 文件名
```

​	　`who`表示**操作对象**可以是以下字母的**一个或者组合**（`u` 用户 user、`g` 用户组 group、`o` 表示其他用户、`a` 表示所有用户是系统默认的）；**操作符号**（`+` 表示添加某个权限、`-` 表示取消某个权限、`=` 赋予给定的权限，取消文档以前的所有权限）；`mode`表示**可执行的权限**（r 可读、w 可写、x 可执行）；

```shell
# 对所属用户赋予可读、可写、可执行的权限
# 对所属组组添加可读权限
# 对其他用户添加可读权限
chmod u=rwx,g+r,o+r test.txt 
```

​	　此外，也可以通过**数字设定法**，使用数字来表示权限。

```
0 表示没有任何权限
1 表示有可执行权限 = x
2 表示有可写权限 = w
4 表示有可读权限 = r
```



## 应用部署

### 安装Java

​	　首先，需要在[官网](https://www.oracle.com/java/technologies/javase-downloads.html)上下载JDK安装程序，然后根据如下步骤进行安装即可。安装完成后，还需要配置`JAVA_HOME`环境变量，特别的，如果既配置了系统环境变量，又配置了用户环境变量，最终会以用户环境变量的配置为准。

（1）安装JDK

```shell
# 解压缩
tar -zxvf jdk-8u152-linux-x64.tar.gz
# 创建目录
mkdir -p /usr/local/java
# 移动安装目录
mv jdk1.8.0_152/ /usr/local/java/
# 设置所有者
chown -R root:root /usr/local/java/
```

（2）配置环境变量

```shell
# 配置系统环境变量
vi /etc/environment
# 配置用户环境变量
vi /etc/profile
# 添加如下语句
export JAVA_HOME=/usr/local/java/jdk1.8.0_152
export JRE_HOME=/usr/local/java/jdk1.8.0_152/jre
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH:$HOME/bin
# 使环境变量生效
source 文件名
```

​	　安装成功后，可以输入`java -version`，验证是否安装成功。



### 安装Tomcat

​	　首先，需要在[官网](https://tomcat.apache.org/)上下载Tomcat 安装程序，然后根据如下步骤进行安装即可。

```shell
# 解压缩
tar -zxvf apache-tomcat-8.5.23.tar.gz 
# 变更目录名
mv apache-tomcat-8.5.23 tomcat
# 移动目录
mv tomcat/ /usr/local/
```

​	　安装成功后，可以通过`startup.sh`命令启动Tomcat，如果可以访问http://IP:8080端口，即可表示Tomcat是成功安装。

```shell
# 启动
/usr/local/tomcat/bin/startup.sh
# 停止
/usr/local/tomcat/bin/shutdown.sh
# 目录内执行脚本
./startup.sh
```



### 安装MySQL

（1）安装MySql

```shell
# 更新数据源
apt-get update
# 安装MySql
apt-get install mysql-server
# 运行附带的安全脚本，更改一些不太安全的默认选项
mysql_secure_installation
```

​	　按上边方式安装完成后，MySQL 应该已经开始自动运行了。要测试它，请检查其状态。

```shell
# 检查MySql运行状态
systemctl status mysql.service
# 查看安装Mysql的版本
mysqladmin -p -u root version
```



（2）修改MySql配置文件

```shell
vi /etc/mysql/mysql.conf.d/mysqld.cnf
# 配置远程访问，注释掉如下配置(语句前面加上 # 即可)
bind-address = 127.0.0.1
# 配置默认字符集
default-character-set=utf8
default-storage-engine=INNODB
character-set-server=utf8
collation-server=utf8_general_ci
# 配置忽略数据库大小写敏感
lower-case-table-names = 1
# 重启MySql使得配置生效
service mysql restart
```



（3）用户登陆授权

```shell
# 授权 root 用户允许所有人连接
grant all privileges on *.* to 'root'@'%' identified by '你的 mysql root 账户密码';

# 如因弱口令无法成功授权解决步骤：
# ① 查看和设置密码安全级别
select @@validate_password_policy;
set global validate_password_policy=0;
#②  查看和设置密码长度限制
select @@validate_password_length;
set global validate_password_length=1;
```



