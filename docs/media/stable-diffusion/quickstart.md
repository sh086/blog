

# 快速开始

> [安装教程](https://github.com/AUTOMATIC1111/stable-diffusion-webui?tab=readme-ov-file#installation-and-running) | [谷歌硬盘安装](https://github.com/camenduru/stable-diffusion-webui-colab/tree/drive)

## 安装

### WebUI

​	　首先，安装 [Python 3.10.6](https://www.python.org/downloads/release/python-3106/) 和 [Git](https://git-scm.com/download/win) ，并配置环境变量。然后，新建 `stable-diffusion-webui` 文件夹，并执行如下命令。

```shell
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

​	　`git clone`成功后，打开 `stable-diffusion-webui` 文件夹，双击 `webui-user.bat`，即可启动 `webui` 。在第一次启动时，它将下载大量文件。在所有文件正确下载和安装完成后，应该会看到一条消息：

```
Running on local URL:  http://127.0.0.1:7860
```

​	　在浏览器里打开上面的链接，就可以看到 `webui` 的界面。选择默认的大模型，若没有可以点击刷新按钮自动下载（控制台可以看到下载进度），输入简单的提示词`sky`后，点击`Generate`按钮即可生成第一张图片。

![image-20240705231618935](.\images\image-20240705231618935.png)

​	　说明，`stable-diffusion-webui`的文件目录结构如下：

```
# checkpoint安装路径
D:\workplace\stable-diffusion-webui\models\Stable-diffusion\
# Lora安装路径
D:\workplace\stable-diffusion-webui\models\Lora\
```



### Extensions

​	　为了使`WebUI`更好的使用，还需要为`WebUI`安装一些扩展，常用的扩展安装地址如下：

```shell
# Civitai-Helper 【必选】
https://github.com/butaixianran/Stable-Diffusion-Webui-Civitai-Helper
# ControlNet 【必选】
https://github.com/Mikubill/sd-webui-controlnet.git
# 语言包 【可选】
https://github.com/VinsonLaro/stable-diffusion-webui-chinese
```

​	　以`Civitai-Helper`为例，首先，在`Extensions`选项卡中选择`Install from URL`，然后，填入仓库地址，并点击`Install`按钮。

![image-20240706122932933](.\images\image-20240706122932933.png)

​	　等待几秒后，底部将会出现`Installed into xxx. Use Installed tab to restart`的提示信息，此时表明拓展已安装成功。然后，选择`Installed`选项卡，点击`Apply and restart UI` 重启后，拓展即可生效。

![image-20240705232455954](.\images\image-20240705232455954.png)



## Model

### CheckPoint

​	　`CheckPoint`就是生图的大模型，包含了大量的场景素材，体积较大，其它模型都是在它基础上做一些细节的定制。默认的模型生成的图片质量不高，我们可以下载一个高质量的大模型。

​	　在下载之前，需要在[C站](https://civitai.com/)注册一个账号，完成后点击[这里](https://civitai.com/user/account)找到`API Keys`设置，点击`Add API Key` 按钮生成一个`API key`，并复制到`Settings`的`Civitai Helper`，接着，点击`Apply settings`应用此设置并点击`Reload UI`重启`SD WebUI`即可完成配置。[参考](https://github.com/butaixianran/Stable-Diffusion-Webui-Civitai-Helper?tab=readme-ov-file#civitai-api-key)

​	　然后，在C站选择一个`CheckPoint`(大模型)，如[这个](https://civitai.com/models/6424/chilloutmix)，接着按下图所标顺序执行即可完成大模型的下载与安装。

![image-20240706151037708](.\images\image-20240706151037708.png)

​	　安装完成后，点击模型刷新按钮并选择刚才下载的大模型，输入示例的正向提示词和反向提示词，即可生成类似的图片。

![image-20240706153107268](.\images\image-20240706153107268.png)

### Lora

​	　 `Lora`模型可以是某种特定风格或元素特征，就是辅助大模型生图的插件。

​	　首先，在`Civitai-Helper`中安装[墨心 MoXin](https://civitai.com/models/12597/moxin)这个`Lora`，安装完成后，如下图点击刷新按钮即可显示。注意，若没有显示，可以 切换模型 或者 检查模型的存储路径是否正确。

![image-20240706162216811](.\images\image-20240706162216811.png)

​	　 `Lora`模型的使用语法格式如下：

```
 # 权重可按Lora模型介绍页建议的配置
 <lora:模型名:权重>
 
  # 示例
 <lora:shuimobysimV3:1>
```





### ControlNet

​	　首先，参考[这里](https://github.com/Mikubill/sd-webui-controlnet.git)安装`ControlNet`拓展，然后，在Settings->ControlNet，完成后，



## 附录

（1）常用模型

```
https://civitai.com/models/6424/chilloutmix
```



### 语言包

​	　安装汉化插件后，还需在重启后，在`Settings`中点击`User Interface`，并在`Localization`中选择刚才安装的语言包，然后，点击`Apply settings`应用此设置，再点击`Reload UI`即可生效。

![image-20240705233819115](.\images\image-20240705233819115.png)
