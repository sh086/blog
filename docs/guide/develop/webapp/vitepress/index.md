# 快速开始

​	　VitePress 是一个静态站点生成器，专为构建快速、以内容为中心的站点而设计。可以获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

> [官网](https://vitepress.dev/zh/) | [视频教程](https://www.bilibili.com/video/BV1dfkvYBE4p/?spm_id_from=333.1387.collection.video_card.click)  | [参考](https://vitepress.yiov.top/getting-started.html)



## 安装

### 前置准备

> [!WARNING] 请检查
>
> [Node.js](https://nodejs.org/) 必须是`18`及以上版本

​	　新建`blog`文件夹，并在终端中运行如下命令将`VitePress`安装到现有项目中。

```shell
npm add -D vitepress
```



### 安装向导

​	　运行以下命令启动安装向导：

```shell
npx vitepress init
```

​	　将需要回答几个简单的问题，此处所有选项**直接按回车选择默认的配置**。

```
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
└  Done! Now run npm run docs:dev and start writing.
```

​	　安装向导结束后，项目文件目录如下：

```
.
├─ .vitepress
│  │  └─ cache           # 开发缓存目录
│  │  └─ config.mts      # 配置文件
├─ api-examples.md
├─ markdown-examples.md
└─ index.md              # 主页
└─ package.json 
说明：配置文件后缀可能是 .mts 或 .js 或 .mjs 或 .ts
```



### 启动命令

​	　安装向导会将启动命令注入到 `package.json` 中，我们这里稍加改动：


::: code-group

```js [package.json]
{
  "scripts": {
    "docs:dev": "vitepress dev docs",// [!code --]
    "docs:build": "vitepress build docs",// [!code --]
    "docs:preview": "vitepress preview docs"// [!code --]
    "dev": "vitepress dev",// [!code ++]
    "build": "vitepress build",// [!code ++]
    "preview": "vitepress preview"// [!code ++]
  },
  "devDependencies": {
    "vitepress": "^1.6.3"
  },
  "type":"module"// [!code ++]
}
```

:::

​	　注意，要确保最新的 `package.json` 包含 `"type": "module"`，这个配置是为了告诉 `Node.js` 使用 `ECMAScript Modules` (`ESM`) 语法来处理 `.js` 文件，而不是使用 `CommonJS` 模块系统，避免后面安装插件报错。

​	　最后，执行命令 `npm run dev`启动项目，在终端即可看到站点的本地访问地址。

```
  ➜  Local:   http://localhost:5173/ # 这个就是站点的本地访问地址
  ➜  Network: use --host to expose
  ➜  press h to show help
```



## 导入项目

​	　 　新建`blog`文件夹，将代码从[这里](https://github.com/sh086/blog)拉取到本地后，依次运行以下命令即可：

```shell
# 第一步：将VitePress安装到现有项目中
npm add -D vitepress
# 第二步：根据package.json安装项目所需依赖
npm install
# 第三步：启动项目(具体请看package.json中的scripts配置命令)
npm run dev
```



