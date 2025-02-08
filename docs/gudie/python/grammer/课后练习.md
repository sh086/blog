# 课后练习

## 入门案例

### 计算两数之和

```python
###
# 计算两数之和：1.5 + 2.3 = 3.8
###
number1 = 1.5
number2 = 2.3
print(f"{number1} + {number2} = {number1 + number2}")

# 输出
# 1.5 + 2.3 = 3.8
```

### 最值计算

```python
###
# 计算列表的最大值、最小值和平均值
###
number = [1, 4, 5, 76, 75, 81, 19, 10, 11, 12]
avg_value = round(sum(number) / len(number), 2)
print(f"最大值:{max(number)} 平均值:{min(number)} 平均值:{avg_value}")

# 输出
# 最大值:81 平均值:1 平均值:29.4
```

### 数字的阶乘

```python
###
# 6的阶乘: 6*5*4*3*2*1
###

def factorial(number):
    value = 1
    while number >= 1:
        value *= number
        number -= 1
    return value

print("6的阶乘是:", factorial(6))

# 输出
# 6的阶乘是: 720
```

### 计算圆的面积

```python
###
# 计算圆的面积,并保留两位小数
###

import math
def circle_area(radius):
    return round(math.pi * radius * radius,2)

print("半径为2的圆面积是:", circle_area(2))

# 输出
# 半径为2的圆面积是: 12.57
```

### 求前N个数字的平方和

```python
###
# 输入数字N,计算1的平方+2的平方+3的平方+4的平方+5的平方
###

def squares_sum(number):
    index = 1
    sum = 0
    while index <= number:
        sum += index * index
        index += 1
    return sum

print(f"前10个数字的平方和为：", squares_sum(10))

# 输出
# 区间 0 到 20 存在的素数有: [2, 3, 5, 7, 11, 13, 17, 19]
```

### 计算列表数字的和

```python
###
# 计算列表数字的和，相当与sum函数
###
def sum_of_list(num):
    sum = 0
    for val in num:
        sum += val
    return sum

list = [1, 2, 3, 4]
map = (1, 2, 3)

# 写法一：自定义函数sum_of_list
print(f"{list}中数字和为：", sum_of_list(list))
print(f"{map}中数字和为：", sum_of_list(map))

# 写法二：使用内置函数sum
print(f"{list}中数字和为：", sum(list))

# 输出
# [1, 2, 3, 4]中数字和为： 10
# (1, 2, 3)中数字和为： 6
# [1, 2, 3, 4]中数字和为： 10
```



### 水仙花数

```python
###
# 水仙花数是指一个3 位数，它的每个数位上的数字的3次幂之和等于它本身
###

def narcissistic():
    result = []
    number = 100
    while number < 1000:
        # x 百位 y 十位 z 个位
        x = number // 100
        y = (number - x * 100) // 10
        z = number - x * 100 - y * 10
        # 三位数各位的立方之和等于三位数本身
        if number == (x ** 3 + y ** 3 + z ** 3):
            result.append(number)
        number += 1
    return result

print("水仙花数:",narcissistic())

# 输出
# 水仙花数: [153, 370, 371, 407]
```

### 区间内所有的素数

```python
###
# 区间内所有的素数
# 素数只能被1和自己整除，打印0到20内的所有素数
###
import math
def is_prime(num):
    if num <= 1:
        return False
    index = 2
    while index < int(math.sqrt(n)+1):
        if num % index == 0:
            return False
        index += 1
    return True

startNumber = 0
endNumber = 20
result = []
for number in range(startNumber, endNumber+1):
    if is_prime(number):
        result.append(number)
    number += 1
print(f"区间 {startNumber} 到 {endNumber} 存在的素数有:", result)

# 输出
# 区间 0 到 20 存在的素数有: [2, 3, 5, 7, 11, 13, 17, 19]
```

### 输出范围中的偶数

```python
###
# 输入一个数字范围，输出该范围内所有的偶数
###
def get_even_range(begin,end):
    result = []
    for number in range(begin,end):
        if number % 2 == 0:
            result.append(number)
    return result

begin = 1
end = 10
# 写法一：自定义函数get_even_range
print(f"begin={begin} end={end} even numbers:", get_even_range(begin,end))

# 写法二：使用for的简化写法
data = [item for item in range(begin,end) if item % 2 == 0]
print(f"begin={begin} end={end} even numbers:", data)
```



### 斐波那契数列





# 课后练习 - 较难



## 猜数字游戏

```python
input_number = input("请输入数字:")  # 定义变量number保存控制台输入的数字
if 8 == int(input_number):
    print("猜对了")  # 若正确的数字 等于 输入的数字 则打印：猜对了
else:
    print("猜错了")  # 若正确的数字 不等于 输入的数字 则打印：猜错了
```





## 分词

### 简单的英文单词统计

```python
###
# 统计英文文章中出现频率最多的单词
# data文件内容如下：No fear of words, no fear of years
###
word_count = {}
with open("./data.txt") as file:
    for line in file:
        line = line.replace("\n", "")  # 去除尾端的换行符\n
        words = line.split()  # 根据空格分割
        for word in words:
            if word not in word_count:
                word_count[word] = 0

            word_count[word] += 1

sort_result = sorted(word_count.items(), key=lambda x: x[1], reverse=True)
print(sort_result[:3])

# 输出： [('fear', 2), ('of', 2), ('No', 1)]
```



### 统计四级高频单词

```python
import re
import pandas as pd

with open('./data.txt') as fin:
    content = fin.read()

words = re.split(r'[\s.()-?]+', content)

print(pd.Series(words).value_counts()[:20])
```



### 中文小说分词统计

```python
import jieba
import re

content = """
今天天气好晴朗,处处好风光
会当凌绝顶,一览众山小
"""
content = re.sub(r"[\s。，、；]", "", content)
word_list = jieba.cut(content)
print(list(word_list))

# 中文分词
# ==========================
content = "李玲和张鹏宇是朋友"
import jieba.posseg as posseg

for word, flag in posseg.cut(content):
    print(word, flag)
    # nr 人名 v 动词 n 名称
    if flag == "nr":
        print(word, flag)
```



## 简易计算器



## 学生信息管理系统

## 数据类型

### 列表去重

```python
###
# 原始列表：[10,20,20,30,40,10,5]
# 重复元素: [10,20]
###

def get_unique_list(list):
    result = []
    for item in list:
        if(item not in result):
            result.append(item)
    return result

num_list = [10, 20, 20, 30, 40, 10, 5]

# 写法一：自定义函数get_unique_list
print(f"原列表是 {num_list} 去重后：", get_unique_list(num_list))

# 写法二：借用set去重
print(f"原列表是 {num_list} 去重后：", list(set(num_list)))

# 输出
# 原列表是 [10, 20, 20, 30, 40, 10, 5] 去重后： [10, 20, 30, 40, 5]
# 原列表是 [10, 20, 20, 30, 40, 10, 5] 去重后： [5, 40, 10, 20, 30]
```

### 简单列表排序

```python
###
# 对列表进行排序
###
def sort_list(list):
    for i in range(len(list)):
        for j in range(i + 1, len(list)):
            if list[i] > list[j]:
                list[i], list[j] = list[j], list[i]
    return list

# 写法一，自定义sort_list
list_number1 = [20, 38, 1, 40, 13, 2]
print(f"原列表 {list_number1} 排序后 ", sort_list(list_number1))

# 写法二：使用内置函数sorted
list_number2 = [40, 34, 11, 2, 43, 32]
print(f"原列表 {list_number2} 排序后 ", sorted(list_number2))

# 写法二：使用list对象方法sort,默认是升序
list_number3 = [89, 4, 32, 24, 12, 3]
list_number3.sort()
print("list_number3排序后 ", list_number3)
list_number3.sort(reverse=True)
print("list_number3排序后 ", list_number3)

# 输出
# 原列表 [20, 38, 1, 40, 13, 2] 排序后  [1, 2, 13, 20, 38, 40]
# 原列表 [40, 34, 11, 2, 43, 32] 排序后  [2, 11, 32, 34, 40, 43]
# list_number3排序后  [3, 4, 12, 24, 32, 89]
# list_number3排序后  [89, 32, 24, 12, 4, 3]
```

### 复杂列表排序

```python
###
# 对复杂列表排序
###

# 列表元素是字典
students = [
    {"no": "101", "name": "小郑", "grade": 90},
    {"no": "102", "name": "小李", "grade": 65},
    {"no": "103", "name": "小红", "grade": 76},
    {"no": "104", "name": "小米", "grade": 343},
]

# 列表元素是列表
teachers = [
    ['103', '张老师', '32'],
    ['101', '郑老师', '46'],
    ['102', '李老师', '28'],
]

# 对 列表元素是字典 的 进行排序
students_sort = sorted(students, key=lambda x: x["grade"], reverse=True)
# 对 列表元素是列表 的 进行排序
teachers_sort = sorted(teachers, key=lambda x: int(x[2]), reverse=True)

print(f"students_sort : {students_sort}")
print(f"students_sort : {teachers_sort}")

# 输出
# sort : [
#     {'no': '104', 'name': '小米', 'grade': 343}, 
#     {'no': '101', 'name': '小郑', 'grade': 90},
#     {'no': '103', 'name': '小红', 'grade': 76}, 
#     {'no': '102', 'name': '小李', 'grade': 65}
# ]
# students_sort : [
#    ['101', '小郑', '87'], 
#    ['103', '小张', '65'], 
#    ['102', '小米', '43']
# ]
```



## 文件

### 总成绩排名

```python
###
# 总成绩排名
# data文件内容如下：
# 103,小张,253
# 101,小郑,432
# 102,小米,322
###
# 读取数据
def read_file(filename):
    result = []
    with open(filename, "r", encoding="utf-8") as file:
        for line in file:
            line = line.replace("\n", "")  # 去除尾端的换行符\n
            result.append(line.split(","))  # 根据英文逗号分割
    return result

# 排序数据
def sort_grade(data):
    data.sort(key=lambda x: int(x[2]), reverse=True)
    return data

# 写入文件
def write_file(filename, data):
    with open(filename, "w", encoding="utf-8") as file:
        for line in data:
            file.write(",".join(line) + "\n")

# 主函数
file_data = read_file("./data.txt")
sort_data = sort_grade(file_data)
write_file("./sort_data.txt", sort_data)

# 输出
# 103,小张,98
# 101,小郑,87
# 102,小米,43

# 说明：如果使用 file.write(str(line) + "\n") 输出如下：
# ['103', '小张', '98']
# ['101', '小郑', '87']
# ['102', '小米', '43']
```



### 统计各科成绩

```python
###
# 统计各科成绩最大值、最小值、平均值，并按照总成绩大小排名
# 文件有学号、姓名、成绩三列，列之前使用英文逗号分割，行之间用\n换行分割
# data.txt文件内容：
# 101,小郑,语文,87
# 101,小郑,数学,67
# 102,小米,语文,93
# 102,小米,数学,88
###
file_path = "./data.txt"
course_grades = {}

with open(file_path, "r", encoding="utf-8") as file:
    for line in file:
        line = line.replace("\n", "")
        no, name, course, grade = line.split(",")
        if course not in course_grades:
            course_grades[course] = []
        course_grades[course].append(int(grade))

for course, grade in course_grades.items():
    print(course, max(grade), min(grade), sum(grade) / len(grade))
    
# 输出
# 语文 93 87 90.0
# 数学 88 67 77.5
```

### 统计目录下文件大小

```python
###
# 统计目录下全部文件大小
###
import os

def count_dir_file_size(dirPath):
    sum_size = 0
    for file in os.listdir(dirPath):
        # 判断当前是否是文件;若是目录则跳过,若是文件则执行
        if os.path.isdir(file):
            # 获取当前文件的大小,单位是B
            sum_size += os.path.getsize(file)
    return sum_size / 1024


# 打印全部文件大小，单位是KB
print(f"全部文件大小：{count_dir_file_size('.')} KB")

# 输出：全部文件大小：4.0 KB
```



### 按文件后缀名分类文件

```python
###
# 按文件后缀分类文件
###
import os
import shutil

base_dir = "./data"
for file in os.listdir(base_dir):
    # 获取文件后缀名
    suffix = os.path.splitext(file)[1]
    suffix = suffix[1:]
    # 判断是否存在以该后缀名的目前，若无则新建
    if not os.path.isdir(f"{base_dir}/{suffix}"):
        os.mkdir(f"{base_dir}/{suffix}")
    # 将文件移动到对应的目录下
    source_path = f"{base_dir}/{file}"
    target_path = f"{base_dir}/{suffix}/{file}"
    shutil.move(source_path,target_path)
```

### 递归搜索目录

```python
###
# 递归搜索目录找出最大的文件
###
import os
base_dir = ".\data"
result = []
# root当前目录
# dirs 当前目录下的子目录列表
# files 当前目录下的文件列表
# os.walk 递归遍历当前目录以及子目录
for root, dirs, files in os.walk(base_dir):
    for file in files:
        file_path = f"{root}\\{file}"
        file_size = round(os.path.getsize(file_path) / 1024, 2)
        result.append((file_path, file_size))

max_result = sorted(result, key=lambda x: x[1], reverse=True)[0]

print(f"最大文件路径{max_result[0]} 大小{max_result[1]}")
```

### 文件合并

```python
###
# 将指定目录下的txt文件合并
###
import os
# 读取数据
def merge_file(dirPath):
    contents = []
    for file in os.listdir(dirPath):
        file_path = f"{dirPath}/{file}"
        if os.path.isfile(file_path) and file.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as fin:
                contents.append(fin.read())

    with open(f"{dirPath}/copy.txt", "w") as fount:
        fount.write("\n".join(contents))


merge_file("./data")
```



## 正则表达式

### 匹配日期和手机号格式

```python
import re

# 判断字符是否是日期
def date_str_is_right(date_str):
    # r表示 \ 不会被转义"
    # \d: 表示数字
    # \d{4}: 表示4个数字
    pattern = r"\d{4}-\d{2}-\d{2}"
    return re.match(pattern, date_str) is not None

# 判断字符是否是手机号
def phone_is_right(date_str):
    # 第1位：1开头
    # 第2位：中括号表示是3到9之间的某一个数字
    # 其 他：大括号表示精确匹配9位数字
    pattern = r"1[3-9]\d{9}"
    return re.match(pattern, date_str) is not None
```



### 获取手机号和邮箱

```python
import re

# 在文本中获取手机号
def get_phone_list_in_content(content):
    pattern = r"1[3-9]\d{9}"
    return re.findall(pattern, content)

# # 在文本中获取邮箱 采用预编译正则的写法
def get_email_list_in_content(content):
    # 第一行：中括号表示取值范围为：a-z或者A-Z或者0-9或者_或者- ; + 号表示至少有一位
    # 第二行：固定为@
    # 第三行：中括号表示取值范围为：a-z或者A-Z或者0-9 ; + 号表示至少有一位
    # 第四行：. 在正则中表示除换行符外的任意字符，所以，此处需要转义
    # 第五行：中括号表示取值范围为：a-z或者A-Z; {2,4} 表示要有2到4位数
    # re.VERBOSE 表示支持换行
    pattern = re.compile(r"""
    [a-zA-Z0-9_-]+ 
    @
    [a-zA-Z0-9]+
    \.
    [a-zA-Z]{2,4}
    """, re.VERBOSE)
    return pattern.findall(content)
```



### 验证密码是否满足条件

```python
import re

###
# 验证密码是否满足条件
# 长度位于[2,10]之间
# 必须包含至少一个小写字母和一个特殊字符
###
def passwd_validate(passwd):
    if not 2 <= len(passwd) <= 10:
        return False, "密码必须在2到10之间"
    if not re.findall(r"[a-z]", passwd):
        return False, "必须包含至少一个小写字母"
    if not re.findall(r"[^0-9a-zA-Z]", passwd):
        return False, "必须包含至少一个特殊字符"
    return True, None
```



### 提取商品价格

```python
import re

####
# 提取商品价格
###
def get_goods_price():
    contents = """
    买了1斤黄瓜花了8元
    买了4斤西兰花花了4.6元
    """
    for line in contents.split("\n"):
        # 正则：r"\d斤.*花了\d+(\.\d+)?元"
        # .* : 表示 多位任意字符 (. 表示任意字符  * 表示多位)
        # \d+ : 表示任一数字 (\d 表示任意数字 + 表示一位)
        # (\.\d+)? : ()？表示可选的 \. 表示字符.
        # (\d) : 此处的 () 表示提取匹配的内容
        pattern = r"(\d)斤(.*)花了(\d+(\.\d+)?)元"
        match = re.search(pattern, line)
        if match:
            # match.groups() : 获取全部数据
            # match.group(index) : 获取指定数据
            print(f"{match.group(1)}\t{match.group(2)}\t{match.group(3)}")
```



### 敏感信息加密

```python
import re

####
# 敏感信息加密
###
def sensitive_info():
    content = "天19123423231不会7878766代表15787654432从"
    pattern = r"(1[3-9])\d{9}"
    # \1 表示匹配pattern中第一个分组(1[3-9]),剩余的以星号代替
    print(re.sub(pattern, r"\1******", content))

####
# 多种日期格式标准化
###
def standard_format_data():
    print(re.sub(r"(\d{4})/(\d{2})/(\d{2})", r"\1-\2-\3", "2024/01/14"))
    print(re.sub(r"(\d{2}).(\d{2}) (\d{4})", r"\3-\1-\2", "04.21 2023"))
```



### 多种日期格式标准化

```python
import re

####
# 多种日期格式标准化
###
def standard_format_data():
    print(re.sub(r"(\d{4})/(\d{2})/(\d{2})", r"\1-\2-\3", "2024/01/14"))
    print(re.sub(r"(\d{2}).(\d{2}) (\d{4})", r"\3-\1-\2", "04.21 2023"))
```



## 时间与日期

### time

```python
import time

# 睡眠1s
time.sleep(1)
# 时间格式化
print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
```



### datetime

```python
import datetime

# 获取当前时间字符串
def date_time_to_str():
    current_time = datetime.datetime.now()
    return current_time.strftime("%Y-%m-%d %H:%M:%S")

# 当前时间字符串转换成时间对象
def str_to_data_time(data_str):
    return datetime.datetime.strftime(data_str, "%Y-%m-%d %H:%M:%S")

# 获取当前日期字符串
def date_to_str():
    current_time = datetime.datetime.now()
    return current_time.strftime("%Y-%m-%d %H:%M:%S")

# 时间戳转换成日期
# 测试用例：unix_time_to_date(1620747647)
def unix_time_to_date(unix_time):
    date_time_obj = datetime.datetime.fromtimestamp(unix_time)
    return date_time_obj.strftime("%Y-%m-%d %H:%M:%S")

# 获取日期相差的天数
def minus_data(first_date, second_date):
    minus = first_date - second_date
    return minus.days

# 获取n天前的日期
def get_diff_days(date_str, days):
    date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    time_gap = datetime.timedelta(days=days)
    date_result = date_obj - time_gap
    return date_result.strftime("%Y-%m-%d")

# 获取开始和结算范围内所有的日期
def get_date_range(begin_date, end_date):
    date_list = []
    while begin_date <= end_date:
        date_list.append(begin_date)
        begin_date_obj = datetime.datetime.strptime(begin_date, "%Y-%m-%d")
        time_gap = datetime.timedelta(days=1)
        begin_date = (begin_date_obj + time_gap).strftime("%Y-%m-%d")
    return date_list
```

