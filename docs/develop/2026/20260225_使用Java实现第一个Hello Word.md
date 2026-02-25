# 使用Java实现Hello Word

![image-20260226000154173](images/image-20260226000154173.png)

## 一、开发环境

### JDK

​	　首先，在[Oracle官网](https://www.oracle.com/java/technologies/downloads/#jdk25-windows)下载最新的`LTS版`的JDK，并将其解压到目录`D:\program\`下。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225201403116.8z72a9lrlw.png"/>

​	　然后，新建`JAVA_HOME`环境变量，并配置`%JAVA_HOME%\bin`至`Path`变量值，以便在任意位置都可以使用`java`、`javac`等命令。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225202806314.64ee4h7hnq.webp"/>

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225203031475.5trkbbsosh.webp"/>

​	　配置完成后，关闭配置页面，并打开一个新的`cmd命令提示窗`页面，执行命令`java -version`即可打印出当前Java版本。

```
C:\Users\Administrator>java -version
java version "25.0.2" 2026-01-20 LTS
Java(TM) SE Runtime Environment (build 25.0.2+10-LTS-69)
Java HotSpot(TM) 64-Bit Server VM (build 25.0.2+10-LTS-69, mixed mode, sharing)
```



### Maven

**1、安装Maven**

​	　首先，点击[此处](https://maven.apache.org/download.cgi)下载Maven的压缩文件，并将其解压到目录`D:\program\`下。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225205423721.7axpd3md4a.webp"/>

​	　然后，新建`MAVEN_HOME`环境变量，并配置`%MAVEN_HOME%\bin`至`Path`变量值。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225210252598.5xb692bqhu.webp"/>

​	　配置完成后，关闭配置页面，并打开一个新的`cmd命令提示窗`页面，执行命令`mvn -v`即可打印出当前Maven版本。

```
C:\Users\Administrator>mvn -v
Apache Maven 3.9.12 (848fbb4bf2d427b72bdb2471c22fced7ebd9a7a1)
Maven home: D:\program\apache-maven-3.9.12
Java version:25.0.2, vendor: Oracle Corporation, runtime: D:\program\jdk-25.0.2
Default locale: zh_CN, platform encoding: UTF-8
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```



**2、设置自定义仓库位置**

​	　打开`apache-maven-3.9.12\conf\settings.xml`配置文件，搜索`localRepository`即可定位。

```xml
  <!-- localRepository
   | The path to the local repository maven will use to store artifacts.
   |
   | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->

  <!--设置自定义仓库位置 -->
  <localRepository>D:\program\repository\</localRepository>
```



**3、修改镜像地址**

```xml
  <mirrors>
    <mirror>
      <id>aliyun-maven</id>
      <name>阿里云公共仓库</name>

      <!-- 只镜像中央仓库 -->
      <mirrorOf>central</mirrorOf>
      <url>https://maven.aliyun.com/repository/central</url>

      <!-- 镜像所有仓库 -->
      <!--<mirrorOf>*</mirrorOf>-->
      <!--<url>https://maven.aliyun.com/repository/public</url>-->
    </mirror>
  </mirrors>
```



## 二、集成开发平台

### IntelliJ IDEA

​	　`IntelliJ IDEA`是开发Java项目的集成开发平台。点击[下载](https://www.jetbrains.com/idea/download/?section=windows)安装文件，按要求安装完成后，可以参照[这里](https://www.exception.site/article/13122)破解。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225222109529.64ee4n8za3.png"/>

### IDEA配置

**1、IDEA设置全局JDK配置**

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225223851029.6iktvii8z7.webp"/>



**2、IDEA设置全局MAVEN设置**

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image.1e9569q6ft.webp"/>



**3、IDEA设置全局编码格式为UTF-8**

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225224519531.1zissjdtuh.webp"/>



## 三、项目开发

### 新建一个项目

​	　点击`New Project`，侧边栏选择`Spring Boot`，按下图所示新建一个测试项目。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225232817037.3ns5pq4g5n.webp"/>

​	　项目创建完成后，还需刷新`maven`以下载项目所需依赖。等依赖都下载完成后，即可启动项目，若项目正常启动，则表明全部配置成功。

### 编写Hello Word

​	　新建`Hello.java`，并编写代码在控制台中输出`Hello Word`字样。

<Img src="https://github.com/sh086/picx-images-hosting/raw/master/20260225/image-20260225233439764.8dxeo4wawc.webp"/>