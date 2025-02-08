# 爬取腾讯TV视频

## 概述

### 业务需求

​	　爬取 [腾讯视频](https://v.qq.com/) 首页的任意一个视频到本地，这里选择的是[玫瑰的故事](https://v.qq.com/x/cover/mzc002002s2ark5/j4100uwn8lx.html?j_vid=s3554hb5dn1&j_cut_vid=c41009rcckb&j_is_win_vid=1&j_start=0)。

### 抓包分析

​	　首先，按`F12`打开网络抓包工具，**等广告播放完毕并进入正片播放后**，再搜索`m3u8`，获得的`proxyhttp`请求响应体里面的`vinfo`就是`ts片段地址`列表。

![image-20240621003109237](.\images\爬取腾讯TV视频_02.png)

​	　此外，再通过`ts片段`的请求URL即可获取对应的请求前缀，最后，循环遍历`vinfo`里面的`m3u8地址`并拼接该请求前缀，即可下载该影片。

![image-20240621003318667](.\images\爬取腾讯TV视频_01.png)

## 开发

### 准备

（1）开发环境

```
解释器：Python 3.11.4
IDE版本：PyCharm 2023.1.3 (Professional Edition)
```



（2）安装第三方模块

```shell
# 用于HTTP请求
pip install requests
# 用于显示下载进度
pip install tqdm
```



### 编码

​	　需要按实际情况更新`Cookie`、`User-Agent`、请求参数`data`、请求地址`url`、以及ts片段前缀`ts_prefix_url` ，甚至是 `m3u8`链接地址的提取方式。

```python
import re
import requests
from tqdm import tqdm

# 请求头 从F12中的proxyhttp获取
headers = {
    "Cookie": "qq_domain_video_guid_verify=5ab24010c6c90bf2; vversion_name=8.2.95; video_omgid=5ab24010c6c90bf2; _qimei_uuid42=18614170b3510003b1dd3efbe81c76a65d02a14cd6; pgv_pvid=0896790157; _qimei_fingerprint=eeeb0e512f0e7cf16c696e0da0ace777; _qimei_q36=; _qimei_h38=a97e0f47b1dd3efbe81c76a602000006118614; o_minduid=5C6RqvLPUjNRTPQFpsL39hBz1im3wpCD; appuser=E29F5B5C29C12C36; pgv_info=ssid=s4114192440; cm_cookie=V1,110064&35QDs0MgfWsC&AQEBGLnNvY488XL5ZwGXzSbRNFkraDw9K4FT&240620&240620; reduplicate_cookie=110064&35QDs0MgfWsC&1718896316; Lturn=803; LKBturn=445; LPVLturn=286; LZTturn=273; LZCturn=674; LPSJturn=12; LBSturn=440; LVINturn=994; LPHLSturn=320; LDERturn=286",
    "Origin": "https://v.qq.com",
    "Referer": "https://v.qq.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
}
# 请求参数 从F12中的proxyhttp的payload获取，注意需要将sspAdParam节点去除
data = '{"buid": "vinfoad","vinfoparam": "charge=0&otype=ojson&defnpayver=3&spau=1&spaudio=0&spwm=1&sphls=2&host=v.qq.com&refer=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc002002s2ark5%2Fj4100uwn8lx.html&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc002002s2ark5%2Fj4100uwn8lx.html&sphttps=1&encryptVer=9.2&cKey=ZNsrgcD5Ax61Ic1Orq2-LnCjnpb8Ocr0cPTfsIoNzEul_f4uOWcoUWJLR8Gy67M9PRZE2ExT3mr5Cp7VHCeQghpmp7rG5tiHjLv_PnnatnPaZfOXktuBpd_Iyv1p9pae3F3r-IIK4YQhFjOj-NmZhE-NjjawCzIdF66cdsFdzz5jk70UOmynTHDptaxqIemxrSlkg-M_BbDaBoWwiX7uSsBkDK_qlv9BvC71ChrA2gKogC-Pt8O57nCcynqx0Guf2MPBftXrjbMVuSD1peojv-V_mC_aaUS0kOHa7FV8BMVsJufzmp6-sOuwl7W96tlGKIoknsNiqoS2Pr6xyMl307xHzJTucu9ZdbexbqxY2JGA5FYOLyYXmeoaETQAnQJ9XuxlPuZCOro_ib05hp4uwanhNofBuJzptVbK0Ndyt5oLgpaZMgaVhKHztij_46YWcLXopHOYIZwAQA4woDzPyBVM--iI5WkqDNDiSImmJp2fC7Thy0hP1JU2Xd1ig526cU49jT0DAwMI39jH&clip=4&guid=5ab24010c6c90bf2&flowid=d2698bdedb7f9f6b9c26119fd64866f8&platform=10201&sdtfrom=v1010&appVer=1.33.5&unid=&auth_from=&auth_ext=&vid=j4100uwn8lx&defn=&fhdswitch=0&dtype=3&spsrt=2&tm=1718896607&lang_code=0&logintoken=&spvvpay=1&spadseg=3&spav1=15&hevclv=28&spsfrhdr=0&spvideo=0&spm3u8tag=67&spmasterm3u8=3&drm=40","adparam": "adType=preAd&vid=j4100uwn8lx&sspKey=bqbh"}'
# 请求地址 从F12中获取
url = 'https://vd6.l.qq.com/proxyhttp'
# ts片段请求前缀 从F12中获取
ts_prefix_url = 'https://apd-vlive.apdcdn.tc.qq.com/moviets.tc.qq.com/ANiLD12oZmRf9p-Cm8z_gH1-JxfOUmYF5NCLlDq5Q1dk/B_JxNyiJmktHRgresXhfyMei7-4-JPAQUJcILWZjgZp3UzHeM2P7YeMGJzNgrX75Fz/svp_50112/CL7HFFAoUGtO5qDR-POu8ev6S7KjwkMMtB4obdNos6QChcQRIg6OBtZzwaMK139VLhO7rMLDe0lxQgY4z3F9jQTTcrApkMCc5wLAF5kGcoTcx9QXr5GV__-qw_aZfDqAUPrF-conaZnyvCVC51vICTNrvFSAfUJnwmdMWST19xE4kcNZI3dRXrs7QrD9PF9nfkK0skw2ZrSebHVtO2moS0UcXU3Popv5ObwyICAobeHXicMOBSsh9w/'

# 发送请求
response = requests.post(url=url, headers=headers, data=data)
print(response.text)

# 获取数据
vinfo = response.json()['vinfo']
# 将输出json在线解析,确认m3u8解析路径
print(vinfo)
# eval解析不了null，此处先替换一下
vinfo = re.sub(r'null', '0', vinfo)

# 将m3u8链接地址提取出来
# eval(vinfo) 字符串转字典
m3u8 = eval(vinfo)['vl']['vi'][0]['ul']['m3u8']
# 去除干扰数据
ts_list = re.sub(r'#E.*', '', m3u8)
ts_list = re.sub(r'#http.*', '', ts_list).split()

# 拼接真实的链接地址
for ts in tqdm(ts_list):
    ts_url = ts_prefix_url + ts
    # response.json 获取json数据
    # response.text 获取文本数据，返回字符串类型 多用于网页源代码
    # response.content 获取二进制数据，多用于保存图片、音视频或者文件数据
    video_content = requests.get(ts_url).content
    with open('玫瑰的爱情.mp4', mode='ab') as f:
        f.write(video_content)
```



### 测试

![image-20240620232620775](.\images\爬取腾讯TV视频_03.png)

（1）验证点

```
【验证通过】--下载的视频不能是广告 
【验证通过】--下载的视频时长必须完整 
```



（2）常见错误

```
1、SSLError错误
错误描述：requests.exceptions.SSLError: HTTPSConnectionPool
(host='vd6.l.qq.com', port=443): Max retries exceeded with url: 
/proxyhttp (Caused by SSLError(SSLError(1, '[SSL: WRONG_VERSION_NUMBER]
wrong version number (_ssl.c:1002)')))
解决方法：关闭电脑以及浏览器代理

2、视频被外星人劫走
错误描述：{"msg":"这个视频被外星人劫走，暂时看不了","type":-3,"code":"85.-3"}
解决方法：Cookie失效了，需更换Cookie以及data

3、无效的cgi
错误描述：{"errCode":-7610, "retMsg":"无效的cgi"}
解决方法：接口配置信息错误，可能是抓包结果不对，如
https://vd6.l.qq.com/proxshiyhttp 是错误的抓包
https://vd6.l.qq.com/proxyhttp 这样才是正确的抓包

4、下载的视频时不完整，只有几分钟
不完整的一般都是ts片段前缀错误或者ts地址列表错误，需要找到正确的proxyhttp和ts地址前缀
```



