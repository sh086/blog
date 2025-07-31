---
sidebar: auto
---

# plugin

## jQuery Validation

​	　首先，点击[这里](https://www.jsdelivr.com/package/npm/jquery-validation?version=1.14.0)，下载`jQuery Validation`，然后将解压后的`dist目录`下的内容放入到项目中。然后，在页面按照如下方式，引入`jQuery Validation`前端表单验证框架。

```xml
<!-- Jquery validation Plugin -v1.14.0 -->
<script src="/static/assets/plugins/jquery-validation/js/jquery.validate.min.js"></script>
<script src="/static/assets/plugins/jquery-validation/js/additional-methods.min.js"></script>
<script src="/static/assets/plugins/jquery-validation/js/localization/messages_zh.min.js"></script>
```



### validation.js

​	　新建封装校验器`validation.js`文件，其不仅包含了`jQuery Validation`的**默认校验规则**，还包含了**自定义的检验规则**`mobile`。

```js
/**
 * jQuery 有效性验证
 * @constructor
 */
var Validate = function () {

    /**
     * 自定义校验规则 mobile
     */
    var handlerInit = function () {
        $.validator.addMethod("mobile", function (value, element) {
            var length = value.length;
            var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
            return this.optional(element) || (length == 11 && mobile.test(value));
        }, "手机号码格式错误");
    };

    /**
     * 表单验证
     * @param formId
     */
    var handlerValidate = function (formId) {
        $("#" + formId).validate({
            //声明error元素类型为span，class为help-block
            errorElement: 'span',
            errorClass: 'help-block',
            //error表示错误元素；element表示校验失败的元素
            errorPlacement: function (error, element) {
                //设置element父节点的父节点的class属性包含has-error（显示为红框）
                element.parent().parent().attr("class", "form-group has-error");
                //将声明error元素插入到element后面显示
                error.insertAfter(element);
            }
        });
    };

    return {
        /**
         * 初始化校验规则
         */
        init: function () {
            handlerInit();
        },

        /**
         * 表单验证
         * @param formId
         */
        validateForm: function (formId) {
            handlerValidate(formId);
        }
    }
}();

//该函数在validation.js被页面引用的时候，就会被执行
$(function () {
    Validate.init();
});
```

​	　`Validate`是一个**函数对象**，`return()`里面的是**公共方法**，可以**直接被外部调用**；`handlerInit`和`handlerValidate`都是**私有方法**，**私有方法只能被return里面的公共方法调用**。特别的：`$(function () {});`这种语句会在`validation.js`被页面引用的时候执行，多用于初始化操作。



### 默认的校验规则

```
required：true 必输字段
remote：check.php 使用 ajax 方法调用 check.php 验证输入值
email：true 必须输入正确格式的电子邮件
url：true 必须输入正确格式的网址
date：true 必须输入正确格式的日期
dateISO：true 必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
number：true 必须输入合法的数字(负数，小数)
digits：true 必须输入整数
creditcard： 必须输入合法的信用卡号
equalTo：#field，输入值必须和 #field 相同
accept： 输入拥有合法后缀名的字符串（上传文件的后缀）
maxlength：5，输入长度最多是5的字符串(汉字算一个字符)
minlength：10，输入长度最小是10的字符串(汉字算一个字符)
rangelength：[5,10]，输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
range：[5,10]，输入值必须介于 5 和 10 之间
max：5，输入值不能大于 5
min：10，输入值不能小于 10
```



### 使用示例

```xml{2,9,15}
<!-- 第一步：引入validation.js,初始化自定义校验规则 mobile -->
<script src="/static/assets/app/validation.js"></script>

<!-- 第三步：使用默认规则required、自定义规则mobile -->
<form:form id="inputForm" action="/user/save" method="post" modelAttribute="user">
	<div class="form-group">
       <label for="phone" class="col-sm-2 control-label">手机</label>
       <div class="col-sm-10">
          <form:input class="form-control required mobile" path="phone"/>
       </div>
    </div>
</form:form> 

<!-- 第三步：验证表单inputForm -->
<script>Validate.validateForm("inputForm");</script>
```



效果相当于：

```html{2,6}
<form:form id="inputForm" action="/user/save" method="post" modelAttribute="user">
	<div class="form-group has-error">
       <label for="phone" class="col-sm-2 control-label">手机</label>
       <div class="col-sm-10">
          <form:input class="form-control required mobile" path="phone"/>
          <span class="help-bloc">验证失败信息</span>
       </div>
    </div>
</form:form> 
```





## jQuery iCheck

​	　`jQuery iCheck`是表单复选框、单选框控件美化插件，主要用于渲染并美化当前页面的复选框或单选框，响应复选框或单选框的点击事件。特别的，`iCheck`插件是`AdminLTE-2.4.18`自带的，无需另外下载，在页面按照如下方式，即可引入`jQuery iCheck`插件。

```xml
<!-- CCS部分：iCheck for checkboxes and radio inputs -->
<link rel="stylesheet" href="/static/assets/plugins/iCheck/all.css">
<!-- JS部分：iCheck 1.0.1 -->
<script src="/static/assets/plugins/iCheck/icheck.min.js"></script>
```



### iCheck用法

​	　iCheck 提供了大量回调事件，都可以用来监听 change 事件；也提供了不同的方法来改变iCheck 的状态，具体事件和方法如下：

| 事件名称    | 使用时机                               | 方法名称 | 作用               |
| ----------- | -------------------------------------- | -------- | ------------------ |
| ifClicked   | 点击自定义的输入框或与其相关联的 label | check    | 设置 checked状态   |
| ifChanged   | 输入框的 checked 或 disabled 状态改变  | uncheck  | 移除 checked 状态  |
| ifChecked   | 输入框的状态变为 checked               | disable  | 设置 disabled状态  |
| ifUnchecked | checked 状态被移除                     | enable   | 移除 disabled 状态 |
| ifDisabled  | 输入框状态变为 disabled                | destroy  | 移除 iCheck 样式   |
| ifEnabled   | disabled 状态被移除                    | on       | 绑定事件           |
| ifCreated   | 输入框被应用了 iCheck 样式             | update   |                    |
| ifDestroyed | iCheck 样式被移除                      | toggle   |                    |

​	　`input`元素绑定iCheck `回调事件` 或 `方法` 的示例如下：

```js
// 使用 on() 方法绑定事件
$('input').on('ifChecked', function(event){
  alert(event.type + ' callback');
});
// 改变输入框状态
$('input').iCheck('方法名称')
```



### icheck.js

```js
var Icheck = function (){

    var _checkbox;
    var _masterCheckbox;

    /**
     * 激活 iCheck
     * */
    var handlerInitCheckbox = function () {
        // 默认情况下iCheck是不生效的，需要激活 iCheck，激活时可以指定iCheck的class
        $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
            checkboxClass: 'icheckbox_minimal-blue',
            radioClass   : 'iradio_minimal-blue'
        });

        //加载使用checkbox-master标记的主icheck 和 checkbox列表
        _masterCheckbox = $('input[type = "checkbox"].minimal.checkbox-master');
        _checkbox =  $('input[type = "checkbox"].minimal').not("[disabled]");
    };

    /**
     * 全选
     * */
    var handleCheckboxAll = function(){
        //使用 on() 方法绑定事件
        _masterCheckbox.on("ifClicked", function (e) {
            // true当前状态已选中，点击后应取消选择
            if (e.target.checked) {
                //移除 checked 状态
                _checkbox.iCheck("uncheck");
            }

            // 当前状态未选中，点击后应全选
            else {
                //设置 chec k状态
                _checkbox.iCheck("check");
            }
        });
    }

    /**
     * 获取被选中的ID
     * */
    var handleCheckId = function(){
        var _idArray = [];
        _checkbox.each(function () {
            var _id = $(this).attr("id");
            if(_id != null && _id !== "undefine" && $(this).is(":checked")){
                _idArray.push(_id);
            }
        })
        return _idArray;
    }

    return{
        init: function () {
            handlerInitCheckbox();
            handleCheckboxAll();
        },
        handleCheckId : function () {
            return handleCheckId();
        }
    }

}();

//JS引用时执行
$(document).ready(function (){
    Icheck.init();
})
```



### 使用示例

```html{2,8,17,30}
<!-- 第一步：引入iCheck.js -->
<script src="/static/assets/app/iCheck.js"></script>

<!-- 第二步：修改table，添加主checkbox选择器和子checkbox选择器 -->
<thead>
  <tr>
     <!-- 设置主checkbox选择器，可以通过checkbox-master获取主选择器 -->
     <th><input type="checkbox" class="minimal checkbox-master" /></th>
     <th>编号</th>
     <!-- 以下部分省略 -->
   </tr>
</thead>
<tbody>
   <c:forEach items="${users}" var="user">
       <tr>
         <!-- 设置子checkbox选择器，并新增id属性 -->
          <td><input id="${user.id}" type="checkbox" class="minimal" /></td>
          <!-- 以下部分省略 -->
       </tr>
    </c:forEach>
</tbody>

<!-- 第三步：编写批量删除测试方法 -->
<script>
    /**
     * 批量删除，调用改方法，即可在console中打印选中元素ID
     * */
    function deleteMulti (){
        //将选中的元素的ID放入到数组中
        var checkbox = Icheck.handleCheckId();
        console.log(checkbox.toString)
    }
</script>
```



## jQuery Datatables

​	　DataTables 是一款 jQuery 表格插件。它是一个高度灵活的工具，可以将任何HTML表格添加高级的交互功能。然后，在页面按照如下方式，即可引入`jQuery Datatables`插件。

```xml
<!-- CCS部分-->
<link rel="stylesheet" href="/static/assets/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
<!-- JS部分-->
<script src="/static/assets/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="/static/assets/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
```



### dataTable.js



### 使用示例

```
$('#dataTable').DataTable();
```



## jQuery TreeTable

## jQuery zTree

## Dropzone

## wangEditor

## DateTime

```js
/**
 * 日期时间工具类
 * @type {{dateFormat}}
 */
var DateTime = function () {
    var patterns = {
        PATTERN_ERA: 'G', // Era 标志符 Era strings. For example: "AD" and "BC"
        PATTERN_YEAR: 'y', // 年
        PATTERN_MONTH: 'M', // 月份
        PATTERN_DAY_OF_MONTH: 'd', // 月份的天数
        PATTERN_HOUR_OF_DAY1: 'k', // 一天中的小时数（1-24）
        PATTERN_HOUR_OF_DAY0: 'H', // 24 小时制，一天中的小时数（0-23）
        PATTERN_MINUTE: 'm', // 小时中的分钟数
        PATTERN_SECOND: 's', // 秒
        PATTERN_MILLISECOND: 'S', // 毫秒
        PATTERN_DAY_OF_WEEK: 'E', // 一周中对应的星期，如星期一，周一
        PATTERN_DAY_OF_YEAR: 'D', // 一年中的第几天
        PATTERN_DAY_OF_WEEK_IN_MONTH: 'F', // 一月中的第几个星期(会把这个月总共过的天数除以7,不够准确，推荐用W)
        PATTERN_WEEK_OF_YEAR: 'w', // 一年中的第几个星期
        PATTERN_WEEK_OF_MONTH: 'W', // 一月中的第几星期(会根据实际情况来算)
        PATTERN_AM_PM: 'a', // 上下午标识
        PATTERN_HOUR1: 'h', // 12 小时制 ，am/pm 中的小时数（1-12）
        PATTERN_HOUR0: 'K', // 和 h 类型
        PATTERN_ZONE_NAME: 'z', // 时区名
        PATTERN_ZONE_VALUE: 'Z', // 时区值
        PATTERN_WEEK_YEAR: 'Y', // 和 y 类型
        PATTERN_ISO_DAY_OF_WEEK: 'u',
        PATTERN_ISO_ZONE: 'X'
    };

    var week = {
        'ch': {
            "0": "\u65e5",
            "1": "\u4e00",
            "2": "\u4e8c",
            "3": "\u4e09",
            "4": "\u56db",
            "5": "\u4e94",
            "6": "\u516d"
        },
        'en': {
            "0": "Sunday",
            "1": "Monday",
            "2": "Tuesday",
            "3": "Wednesday",
            "4": "Thursday",
            "5": "Friday",
            "6": "Saturday"
        }
    };

    /**
     * 获取当前时间
     * @returns {string}
     */
    var handlerGetCurrentTime = function () {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();
        var timeString = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        return timeString;
    };

    /**
     * 比较时间大小
     * time1 > time2 return 1
     * time1 < time2 return -1
     * time1 == time2 return 0
     * @param time1
     * @param time2
     * @returns {number}
     */
    var handlerCompareTime = function (time1, time2) {
        if (Date.parse(time1.replace(/-/g, "/")) > Date.parse(time2.replace(/-/g, "/"))) {
            return 1;
        } else if (Date.parse(time1.replace(/-/g, "/")) < Date.parse(time2.replace(/-/g, "/"))) {
            return -1;
        } else if (Date.parse(time1.replace(/-/g, "/")) == Date.parse(time2.replace(/-/g, "/"))) {
            return 0;
        }
    };

    /**
     * 是否闰年
     * @param year
     * @returns {boolean}
     */
    var handlerIsLeapYear = function (year) {
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };

    /**
     * 获取某个月的天数，从 0 开始
     * @param year
     * @param month
     * @returns {*}
     */
    var handlerGetDaysOfMonth = function (year, month) {
        return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    /**
     * 获取某个月的天数，从 0 开始
     * @param year
     * @param month
     * @returns {number}
     */
    var handlerGetDaysOfMonth2 = function (year, month) {
        // 将天置为 0，会获取其上个月的最后一天
        month = parseInt(month) + 1;
        var date = new Date(year, month, 0);
        return date.getDate();
    };

    /**
     * 距离现在几天的日期：负数表示今天之前的日期，0 表示今天，整数表示未来的日期
     * 如 -1 表示昨天的日期，0 表示今天，2 表示后天
     * @param days
     * @returns {string}
     */
    var handlerFromToday = function (days) {
        var today = new Date();
        today.setDate(today.getDate() + days);
        var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        return date;
    };

    /**
     * 格式化日期时间
     * @param dateTime 需要格式化的日期时间
     * @param pattern 格式化的模式，如 yyyy-MM-dd hh(HH):mm:ss.S a k K E D F w W z Z
     * @returns {*}
     */
    var handlerFormat = function (dateTime, pattern) {
        var date = new Date(dateTime);
        if (pattern == null || pattern.length == 0) {
            return date.toLocaleString();
        }
        return pattern.replace(/([a-z])\1*/ig, function (matchStr, group1) {
            var replacement = "";
            switch (group1) {
                case patterns.PATTERN_ERA: //G
                    break;
                case patterns.PATTERN_WEEK_YEAR: //Y
                case patterns.PATTERN_YEAR: //y
                    replacement = date.getFullYear();
                    break;
                case patterns.PATTERN_MONTH: //M
                    var month = date.getMonth() + 1;
                    replacement = (month < 10 && matchStr.length >= 2) ? "0" + month : month;
                    break;
                case patterns.PATTERN_DAY_OF_MONTH: //d
                    var days = date.getDate();
                    replacement = (days < 10 && matchStr.length >= 2) ? "0" + days : days;
                    break;
                case patterns.PATTERN_HOUR_OF_DAY1: //k(1~24)
                    var hours24 = date.getHours();
                    replacement = hours24;
                    break;
                case patterns.PATTERN_HOUR_OF_DAY0: //H(0~23)
                    var hours24 = date.getHours();
                    replacement = (hours24 < 10 && matchStr.length >= 2) ? "0" + hours24 : hours24;
                    break;
                case patterns.PATTERN_MINUTE: //m
                    var minutes = date.getMinutes();
                    replacement = (minutes < 10 && matchStr.length >= 2) ? "0" + minutes : minutes;
                    break;
                case patterns.PATTERN_SECOND: //s
                    var seconds = date.getSeconds();
                    replacement = (seconds < 10 && matchStr.length >= 2) ? "0" + seconds : seconds;
                    break;
                case patterns.PATTERN_MILLISECOND: //S
                    var milliSeconds = date.getMilliseconds();
                    replacement = milliSeconds;
                    break;
                case patterns.PATTERN_DAY_OF_WEEK: //E
                    var day = date.getDay();
                    replacement = week['ch'][day];
                    break;
                case patterns.PATTERN_DAY_OF_YEAR: //D
                    replacement = dayOfTheYear(date);
                    break;
                case patterns.PATTERN_DAY_OF_WEEK_IN_MONTH: //F
                    var days = date.getDate();
                    replacement = Math.floor(days / 7);
                    break;
                case patterns.PATTERN_WEEK_OF_YEAR: //w
                    var days = dayOfTheYear(date);
                    replacement = Math.ceil(days / 7);
                    break;
                case patterns.PATTERN_WEEK_OF_MONTH: //W
                    var days = date.getDate();
                    replacement = Math.ceil(days / 7);
                    break;
                case patterns.PATTERN_AM_PM: //a
                    var hours24 = date.getHours();
                    replacement = hours24 < 12 ? "\u4e0a\u5348" : "\u4e0b\u5348";
                    break;
                case patterns.PATTERN_HOUR1: //h(1~12)
                    var hours12 = date.getHours() % 12 || 12; //0转为12
                    replacement = (hours12 < 10 && matchStr.length >= 2) ? "0" + hours12 : hours12;
                    break;
                case patterns.PATTERN_HOUR0: //K(0~11)
                    var hours12 = date.getHours() % 12;
                    replacement = hours12;
                    break;
                case patterns.PATTERN_ZONE_NAME: //z
                    replacement = handlerGetZoneNameValue(date)['name'];
                    break;
                case patterns.PATTERN_ZONE_VALUE: //Z
                    replacement = handlerGetZoneNameValue(date)['value'];
                    break;
                case patterns.PATTERN_ISO_DAY_OF_WEEK: //u
                    break;
                case patterns.PATTERN_ISO_ZONE: //X
                    break;
                default:
                    break;
            }
            return replacement;
        });
    };

    /**
     * 计算一个日期是当年的第几天
     * @param date
     * @returns {number}
     */
    var handlerDayOfTheYear = function (date) {
        var obj = new Date(date);
        var year = obj.getFullYear();
        var month = obj.getMonth(); //从0开始
        var days = obj.getDate();
        var daysArr = [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (var i = 0; i < month; i++) {
            days += daysArr[i];
        }
        return days;
    };

    /**
     * 获得时区名和值
     * @param dateObj
     * @returns {{name: string, value: string}}
     */
    var handlerGetZoneNameValue = function (dateObj) {
        var date = new Date(dateObj);
        date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        var arr = date.toString().match(/([A-Z]+)([-+]\d+:?\d+)/);
        var obj = {
            'name': arr[1],
            'value': arr[2]
        };
        return obj;
    };

    return {
        getCurrentTime: function () {
            return handlerGetCurrentTime();
        },

        compareTime: function (time1, time2) {
            return handlerCompareTime(time1, time2);
        },

        isLeapYear: function (year) {
            return handlerIsLeapYear(year);
        },

        getDaysOfMonth: function (year, month) {
            return handlerGetDaysOfMonth(year, month);
        },

        getDaysOfMonth2: function (year, month) {
            return handlerGetDaysOfMonth2(year, month);
        },

        fromToday: function (days) {
            return handlerFromToday(days);
        },

        format: function (dateTime, pattern) {
            return handlerFormat(dateTime, pattern);
        },

        dayOfTheYear: function (date) {
            return handlerDayOfTheYear(date);
        },

        getZoneNameValue: function (dateObj) {
            return handlerGetZoneNameValue(dateObj);
        }
    }
}();
```

