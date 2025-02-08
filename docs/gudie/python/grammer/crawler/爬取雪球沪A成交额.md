# 爬取雪球沪A成交额

## 概要

### 业务需求

​    　爬取[雪球沪A成交额](https://xueqiu.com/hq/detail?order=desc&orderBy=amount&type=sha&market=CN&first_name=0&second_name=3)的股票代码、股票名称、当前价、成交额等信息到CVS表格中，并将数据在图表中展示。

![image-20240616153027510](.\images\爬取雪球沪A成交额_01.png)

### 抓包分析

​    　 对网页进行分析可得，数据可由此[接口](https://stock.xueqiu.com/v5/stock/screener/quote/list.json?page=1&size=30&order=desc&order_by=amount&market=CN&type=sha)通过`GET`方式获取，然后传入不同的`page参数`即可获取不同页数的数据。数据导出完成后，可以通过`jupyter`展示数据图表。

![image-20240619231557401](.\images\爬取雪球沪A成交额_00.png)

## 表格

### 准备

（1）开发环境

```
解释器：Python 3.11.4
IDE版本：PyCharm 2023.1.3 (Professional Edition)
```

（2）安装第三方模块

```shell
# 用于发送HTTP请求
pip install requests
```

### 编码

```python
import datetime
import time
import requests
import csv

# 设置导出结果文件名
data_str = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
cvs_file_name = f"雪球股票数据{data_str}.csv"

# 中文需要设置成utf-8-sig格式,否则可能乱码
f = open(cvs_file_name, mode='a', encoding='utf-8-sig', newline='')
# fieldnames 表头
csv_writer = csv.DictWriter(f, fieldnames=[
    '股票代码', '股票名称', '当前价', '涨跌额', '涨跌幅', '年初至今',
    '成交量', '成交额', '换手率', '市盈率(TTM)', '股息率', '市值'
]) 
# 写入表头
csv_writer.writeheader()

# get_count : 已拉取的数据量
get_count = 0
# data_count: 从接口中获取的总数据量，默认是1 后续会取接口返回的count更新
data_count = 1
# page: 当前页数
page = 1
while get_count < data_count:
    print(f"正在爬取第{page}页数据...")
    time.sleep(1)
    url = f"https://stock.xueqiu.com/v5/stock/screener/quote/list.json?page={page}&size=30&order=desc&order_by=amount&market=CN&type=sha"
    # 发送请求时 需携带请求头参数
    headers = {
        # Cookie 必须携带，否则提示400
        "Cookie": "cookiesu=571714897654873; device_id=733ee1d7fe8da245213165381b536440; s=by14bxjsz5; xq_a_token=0518d12486f7876b2f98097d9ec9214afa97c2a0; xqat=0518d12486f7876b2f98097d9ec9214afa97c2a0; xq_r_token=fc7d679707be09bbf6da361632fe9a5facb99f94; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTcyMDE0MDcyMCwiY3RtIjoxNzE4NDkzODY5NTY5LCJjaWQiOiJkOWQwbjRBWnVwIn0.k-fZkm_0h9EwdIytspO-M9UIxW0e8XxIn2KCOGYnbWrfsAUZvdlJ8wgjCPx8L4peQPTwjx95ScPcOYFgja3kivwhveYiAS0ueVDnzVanoGzwCoy8J3o7BE_9A4Ay8SOn8jvyZnZ4thkiIIwUtZF8I1cCvf1GQoXpOTi02mdbyCLaJP_Ywm8lkBeLjOl4znD8JcgHKmAn-yEuzQ1HVADLH8GvgJ8PwYJWRAelOcJtDy_2NVSh9Iw5Kvdv0dPsIqZfEnRxvKC-p0uocpZ5JzL6RKk7UCIbe8GRMTaw0_ghV23RyVPT0i1oEZhWdzi3UOL-WPUCiNBxL1OwAvryClp1qQ; u=571714897654873; Hm_lvt_1db88642e346389874251b5a1eded6e3=1718461949,1718493882; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1718494389",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    }

    # response 表示请求返回对象, 状态码200 表示请求成功
    response = requests.get(url=url, headers=headers)
    if response.status_code != 200:
        print(f"爬取第{page}页数据时失败:", response)
        continue

    # 更新总数据量
    data_count = response.json()['data']['count']
    # 解析返回数据
    data_list = response.json()['data']['list']
    if data_list is []:
        break
    for data in data_list:
        percent = str(data['percent']) + '%' \
            if data['percent'] is not None else "-"
        current_year_percent = str(data['current_year_percent']) + '%' \
            if data['current_year_percent'] is not None else "-"
        volume = data['volume']
        amount = str(round(data['amount'] / (10000 * 10000), 2)) + '亿' \
            if data['amount'] is not None else "-"
        turnover_rate = str(data['turnover_rate']) + '%' \
            if data['turnover_rate'] is not None else "-"
        pe_ttm = round(data['pe_ttm'], 2) \
            if data['pe_ttm'] is not None else "-"
        dividend_yield = str(round(data['dividend_yield'], 2)) + '%' \
            if data['dividend_yield'] is not None else "-"
        market_capital = str(round(data['market_capital'] / (10000 * 10000), 2)) + '亿' \
            if data['market_capital'] is not None else "-"
        # 映射Excel标题与对应数据
        dit = {
            '股票代码': data['symbol'],
            '股票名称': data['name'],
            '当前价': data['current'],
            '涨跌额': data['chg'],
            '涨跌幅': percent,
            '年初至今': current_year_percent,
            '成交量': volume,
            '成交额': amount,
            '换手率': turnover_rate,
            '市盈率(TTM)': pe_ttm,
            '股息率': dividend_yield,
            '市值': market_capital
        }
        csv_writer.writerow(dit)
        # 拉取的数据+1
        get_count += 1
    # 准备获取下一页数据
    page += 1
# 关闭文件
f.close()
print("爬取数据完毕！")
```



### Excel表格

```python
# 拓展：保存表格文件的方式
# csv -> csv模块
# Excel -> pandas模块

import pandas

content_list = []

.....
for data in data_list:
    .....
     # 把字典添加到空列表中
        content_list.append(dit)

# 保存到Excel
pandas.DataFrame(content_list).to_excel('股票.xlsx',index=False)
```



## 数据图表

​    　首先，安装第三方模块。

```shell
# 用于处理数据
pip install pandas
# 用于绘制图标
pip install pyecharts
```

### Html

​    　运行后，即可得到`data.html`，在浏览器中打开即可获得数据图表。

```python
# 导入股票名称+成交量
import pandas as pd
from pyecharts.charts import Bar
from pyecharts import options as opts

df = pd.read_csv('雪球股票数据20240624235619.csv')

x = list(df['股票名称'].values)
y = list(map(float, df['成交量'].values))

c = (
    Bar()
    .add_xaxis(x[:10])
    .add_yaxis('股票成交量情况', y[:10])
    .set_global_opts(
        title_opts=opts.TitleOpts(title='成交量图表'),
        datazoom_opts=opts.DataZoomOpts()
    )
    # 将结果生成到data.html
    .render('data.html')
)

```



### Jupyter Lab

​    　首先，安装`Jupyter Lab`，参考[这里](https://jupyter.org/install)。

```shell
# 安装JupyterLab
pip install jupyterlab
# 启动
jupyter lab
```

​    　启动后，在`Jupyter Lab`上编写如下代码，注意，`pyecharts`在`jupyterlab`的用法示例可参考[这里](https://github.com/pyecharts/pyecharts)。

```python{2,3,27}
# 高亮的2、3、27行代码是为了使得c.render_notebook()生效
from pyecharts.globals import CurrentConfig, NotebookType
CurrentConfig.NOTEBOOK_TYPE = NotebookType.JUPYTER_LAB

# 导入股票名称+成交量
import pandas as pd
df = pd.read_csv('雪球股票数据20240616102057.csv')

from pyecharts.charts import Bar
from pyecharts import options as opts
x = list(df['股票名称'].values)
y = list(map(int,df['成交量'].values))

c = (
    Bar()
    .add_xaxis(x[:10])
    .add_yaxis('股票成交量情况',y[:10])
    .set_global_opts(
        title_opts=opts.TitleOpts(title='成交量图表'),
        datazoom_opts=opts.DataZoomOpts()
    ) 
)

# 将结果生成到data.html
#c.render('data.html')

# 用于在当前页面上渲染结果
c.load_javascript()
c.render_notebook()
```

​    　运行结果如下：

![image-20240616155321887](.\images\爬取雪球沪A成交额_02.png)