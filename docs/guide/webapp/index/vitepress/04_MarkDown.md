# MarkDown

> [支持的 emoji 列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)

## 组件

### 表格

**输入：**

```
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

**输出：**

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |



## 容器

### GitHub风格的容器

```
> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息

> [!IMPORTANT]
> 对用户达成目标至关重要的信息

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容

> [!CAUTION]
> 行为可能带来的负面影响
```

**输出：**

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。



### 自定义容器

**输入：**

```
::: info
这是一条info，自定义格式：info+空格+自定义文字
:::

::: tip 提示
这是一个提示，自定义格式：tip+空格+自定义文字
:::

::: warning 警告
这是一条警告，自定义格式：warning+空格+自定义文字
:::

::: danger 危险
这是一个危险警告，自定义格式：danger+空格+自定义文字
:::

::: details 点我查看
这是一条详情，自定义格式：details+空格+自定义文字
:::
```

**输出：**

::: info
这是一条info，自定义格式：info+空格+自定义文字
:::

::: tip 提示
这是一个提示，自定义格式：tip+空格+自定义文字
:::

::: warning 警告
这是一条警告，自定义格式：warning+空格+自定义文字
:::

::: danger 危险
这是一个危险警告，自定义格式：danger+空格+自定义文字
:::

::: details 点我查看
这是一条详情，自定义格式：details+空格+自定义文字
:::



### MarkDown原生

**输入：**

```
<span v-pre>里面的内容原样输出</span>

<details>
  <summary>点我展开</summary>
  Markdown默认折叠语法，Vitepress可以使用容器折叠语法，更加美观
</details>
```

**输出：**

<details>
  <summary>点我展开</summary>
  Markdown默认折叠语法，Vitepress可以使用容器折叠语法，更加美观
</details>


## 代码块

### 语法高亮

**输入：**

~~~js
```js {2}
export default {
  name: '小明',
  age: '12',
  msg1: 'Removed' // [!code --]
  msg2: 'Added' // [!code ++]
  msg3: 'Error', // [!code error]
  msg4: 'Warning' // [!code warning]
}
```
ps: {2}、{2,3}、{2-5,7} 都是正确的写法
~~~

**输出：**

```js {2}
export default {
  name: '小明',
  age: '12',
  msg1: 'Removed' // [!code --]
  msg2: 'Added' // [!code ++]
  msg3: 'Error', // [!code error]
  msg4: 'Warning' // [!code warning]
}
```

### 代码组

**输入：**

```
::: code-group

​```js [config.js]

​```

​```ts [config.ts]

​```

:::
```

**输出：**


::: code-group

```js [config.js]
我是config.js
```

```ts [config.ts]
我是config.ts
```

:::



### 代码片段

```md
// 语法
<<< @/filepath                 // 从现有文件中导入代码片段
<<< @/filepath{highlightLines} // 支持行高亮
===============================================================================
// 示例
// @对应于源代码根目录,默认情况下是 VitePress 项目根目录，除非配置了srcDir
<<< @/.vitepress/config.mts
// 也可以从相对路径导入
<<< ./index.md
```



## 在MarkDown中使用Vue

​	　在 VitePress 中，每个 Markdown 文件都被编译成 HTML，即在 Markdown 中使用任何 Vue 功能，包括动态模板、使用 Vue 组件或通过添加 `<script>` 标签为页面的 Vue 组件添加逻辑。

> [!TIP] 在MarkDown中使用Vue的方式：
>
> - 直接添加Vue代码
>
> - 编写成组件
>
>   ​       └── 在MarkDown中import后使用
>
>   ​       └── 注册为全局组件，可在MarkDown中直接使用
>
> - 使用布局插槽，组件不需要添加到文章中就能使用，相当于注册为全局组件
>
>   ​      └── 使用Layout布局实现
>
>   ​      └── 使用h函数实现



### 直接添加Vue代码

​	　适用于**简单功能**，直接在MarkDown中添加Vue代码即可。如直接将下面的代码加到`index.md`尾部，然后重启项目，刷新首页即可看到效果啦。

::: code-group

```js[index.md]
---
title: 一个计数器
---

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

The count is: {{ count }}

<button :class="$style.button" @click="count++">点我计数</button>

<style module>
.button {
  color: white; /* 文字颜色 */
  background-color: #007bff; /* 背景颜色 */
  font-weight: bold; /* 字体加粗 */
  border: 2px solid #0056b3; /* 边框颜色和宽度 */
  padding: 5px 5px; /* 内边距 */
  cursor: pointer; /* 鼠标悬停效果 */
  border-radius: 5px; /* 圆角 */
  transition: background-color 0.3s; /* 过渡效果 */
}

.button:hover {
  background-color: #0056b3; /* 悬停时的背景颜色 */
}
</style>
```

:::



### 导入组件

​	　可以直接在 Markdown 文件中导入和使用 Vue 组件。若仅有一个或几个页面使用的组件，只需在要使用的MarkDown中导入即可；若一个组件要在大多数页面上使用，可以通过注册全局组件导入。

::: code-group

```md [单页面导入]
<script setup lang="ts">
    import ShowModal from ".vitepress/components/theme/ShowModal.vue";
</script>

<!-- 添加到md文章末尾 -->
<ShowModal/>
```



```md [使用全局组件]
<!-- 添加到md文章末尾 -->
<ShowModal/>
```



:::

​	　**如何开发组件**以及**如何把组件注册为全局组件**，请看下一章。
