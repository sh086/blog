# MarkDown

> [所有支持的 emoji 列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)

## 主题配置

::: code-group

```js[.vitepress/config.mts]
export default {
  markdown: {
    lineNumbers: true, // 是否显示行号
    // 将自定义容器里面的提示信息变成中文
    // https://vitepress.dev/zh/guide/markdown#custom-containers
    container:{
      tipLabel:"提示",
      warningLabel:"警告",
      dangerLabel:"危险",
      infoLabel:"信息",
      detailsLabel:"详细信息",
    },
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  },
}
```

:::

## 表格

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



## 自定义容器

```
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

::: details
This is a details block.
:::

 <span v-pre>里面的内容原样输出</span>
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

::: details
This is a details block.
:::

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


