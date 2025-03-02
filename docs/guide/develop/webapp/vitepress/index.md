# 使用vitepress搭建在线博客



> [官网](https://vitepress.dev/zh/) | [视频教程](https://www.bilibili.com/video/BV1dfkvYBE4p/?spm_id_from=333.1387.collection.video_card.click) | [默认主题](https://vitepress.dev/zh/reference/default-theme-config)



## 快速开始

> [!WARNING] 前置准备
>
> [Node.js](https://nodejs.org/) 必须是`18`及以上版本

​	　新建`vitepress`文件夹，并在终端中运行`npm add -D vitepress`将VitePress 安装到当前目录。接着，运行`npx vitepress init`启动安装向导，所有选项**直接按回车选择默认的配置**。

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

​	　最后，执行命令 `npm run docs:dev`启动项目，在终端即可看到站点的本地访问地址。

```
  ➜  Local:   http://localhost:5173/ # 这个就是站点的本地访问地址
  ➜  Network: use --host to expose
  ➜  press h to show help
```



## 站点

### 元数据

```js{2-3,5}
export default defineConfig({
  title: "My Awesome Project",     // 站点标题
  description: "A VitePress Site", // 站点描述
  themeConfig: {
    siteTitle: false,  // 是否展示站点标题
  }
})
```



### 网站logo与图标

​	　在`.vitepress`同级目录下新增`public`目录，然后将`/favicon.ico`放到`public`目录中后，新增如下配置即可生效。若未能生效可清除`Cookie` 或 重启浏览器 再次尝试。另外，`logo`的配置同理。

```js{3,5}
export default defineConfig({
  // 设置网址图标
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    logo: '/logo.svg',  // 设置网址logo
})
```



### 使用更简洁的URL

​	　当设置为 `true` 时，VitePress 将从 URL 中删除 `.html` 后缀。

```js{4-8}
export default {
  cleanUrls:true, // 使用更简洁的Url配置
}
// 配置前:/markdown-examples.html
// 配置后:/markdown-examples
```



## 默认主题



### 目录索引

```js{3-4}
export default {
  themeConfig: {
    outlineTitle: "目录", // 定义索引的标题名称
    outline: [2,6], // 定义索引的标题级别
  }
}
```



### 上下页链接

```js{4-7}
export default {
  themeConfig: {
    // 上下页链接
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
}
```



### 最后更新时间戳

​	　新增如下配置，即可在文章的末尾展示更新时间。注意，需有Git提交记录才能生效。

```js{3-9,12}
export default defineConfig({
    // 自定义上次更新的文本和日期格式
    lastUpdated: {
      text: '更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },
   // 启用配置
  lastUpdated: true 
})
```



### 社交链接

```js{4-8}
export default defineConfig({
    // 社交链接
    // 可填入的icon有: gitlab、tiktok、twitter、wechat、qq、google、twitter等
    socialLinks: [
      { icon: 'bilibili', link: '...' },
      { icon: 'youtube', link: '...' },
      { icon: 'github', link: '...' },
    ],
  },
})
```



### 搜索

```js
export default {
  themeConfig: {
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
  }
}
```



### 页脚

​	　仅当页面不包含侧边栏时才会显示页脚，一般只能在主页显示。

```js{3-6}
export default {
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-ME'
    }
  }
}
```



### 汉化配置

```js{4-8}
export default {
  themeConfig: {
    // 以下配置仅用于移动端按钮中文化
    sidebarMenuLabel:"菜单",
    returnToTopLabel: "返回顶部",
    darkModeSwitchLabel: "深色模式",
    darkModeSwitchTitle: "切换深色模式",
    lightModeSwitchTitle: "切换浅色模式",
  }
}
```



## 写作

### 导航栏

​	　首先，在`config.mts`同级目录下新建`nav.js`，并配置如下示例：

```js
export default [
  { text: '主页', link: '' },
  {
    text: '示例',
    items: [
      { text: 'markdown-examples', link: '/markdown-examples.md' },
      { text: 'api-examples', link: '/api-examples.md' },
    ]
  }
]
```

​	　然后在`config.mts`中引入`./nav`中的配置即可。

```js{1,5}
import nav from "./nav";

export default defineConfig({
  themeConfig: {
    nav: nav,
  },
})
```



### 侧边栏

（1）手动配置sidebar

​	　首先，在`config.mts`同级目录下新建`sidebar.js`，并配置如下示例：

```js
export default {
    '/': [
      {
        text: '示例',
        collapsed: false,
        items: [
          { text: 'markdown-example', link: '/markdown-examples.md'},
          { text: 'api-examples', link: '/api-examples.md'},
        ]
      },
    ],
}
```

​	　最后在`config.mts`中引入`./sidebar`中的配置即可。

```js{1,5}
import sidebar from "./sidebar"

export default defineConfig({
  themeConfig: {
    sidebar: sidebar,
  },
})
```



（2）自动配置sidebar
> [!WARNING] 警告
> 不建议自动配置sidebar


​	　首先，将[auto-gen-sidebar.mjs](./auto-gen-sidebar.mjs)放到在`config.mts`同级目录下，然后在`sidebar.js`新增如下配置：

```js
import { set_sidebar } from "./auto-gen-sidebar.mjs";
export default {
    // 第一个参数：常常是nav的link
    // 第二个参数：是相对于根路径的文件夹路径，返回的是每个文件夹中文件的名称和链接
    "/docs/": set_sidebar("/docs/")
}
```

​	　特别注意，自动配置`sidebar`**脚本生成的 访问路径 和 文件层级 是一样的**，所以，是**不能配置`srcDir: './docs'`的**。



### MarkDown

（1）简单的MarkDown配置

```js
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



## 部署

### GitHub Pages

​	　在项目的 `.github/workflows` 目录中创建一个名为 `deploy.yml` 的文件，其中包含这样的内容：

```yml{53}
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消此区域注释
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

​	　这里特别需要注意`第53行`，我这里没有配送`srcDir: './docs/'`这个属性的，如果你有配置，这里需要改成`path: docs/.vitepress/dist`才行。

​	　然后，在`config.mts`配置文件中配置`base`路径 以及 站点图标链接前加上仓库名。

```
export default defineConfig({
  // 这里配置的是仓库名
  base: '/vitepress/',
   // 站点图标链接前加上仓库名
  head: [["link", { rel: "icon", href: "/vitepress/favicon.ico" }]],
})
```

​	　接着，在仓库的`Settings`选择`Build and deployment` > `Source` > `GitHub Actions`，并将更改推送到 `main` 分支并等待 `GitHub Action` 工作流完成。

​	　注意，如果使用的是`npm install`安装的依赖，还需上传`package-lock.json`；如果使用的是`yarn install`安装的依赖，则还需上传`yarn.lock`文件。

​	　等自动部署完成后，即可在 `https://<username>.github.io/[repository]/` 看到你的博客。而且你的站点将在每次推送到 `main` 分支时自动部署。

## 自定义

### 嵌入视频样式

​	　首先，新建`.vitepress/theme/index.js`**主题入口文件**来启用自定义主题。然后，在同一目录下再新建`.vitepress/theme/Layout.vue`来开发自定义主题。文件目录如下：

```
.
├─ .vitepress
│  │  └─ cache           # 开发缓存目录
│  │  └─ config.mts      # 配置文件
│  │  └─ theme           # 自定义主题
│  │  │  └─ index.js     # 主题入口文件
│  │  │  └─ Layout.vue   # 组件
├─ public                # 静态资源
│  └─ favicon.ico        # 站点图标
│  └─ logo.svg           # 站点logo
├─ api-examples.md
├─ markdown-examples.md
└─ index.md              # 主页
└─ package.json
```

​	　当检测到存在主题入口文件``.vitepress/theme/index.js``时，VitePress 总会使用自定义主题而不是默认主题。

```js
// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import Layout from './Layout.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
```

​	　接着，在`Layout.vue`组件中将默认主题导入，并修改**嵌入视频的样式** 、**表格宽度自适应** 以及 **Markdown图片居中**等效果。

```vue
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
const {Layout} = DefaultTheme
</script>

<template>
  <Layout></Layout>
</template>

<style>
    /* 
    * 修改嵌入视频的样式
    * 原来嵌入的视频特别小,样式修改后可以铺满整行
     */
    iframe {
      width: 100%;
      height: 400px;
      border-top-width: 0px;
      border-bottom-width: 0px;
      border-left-width: 0px;
      border-right-width: 0px;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    /* 表格宽度自适应 */
    th, td{
      /* // 不让th td内容换行显示 */
        white-space: nowrap !important; 
        /* // 强制均匀分配宽度 */
        width: 1%; 
    }

    /* markdown图片居中 */
    .main img{
        display: block;
        margin: 0 auto;
    }
</style>
```

​	　完成后先重启项目，然后以B站视频为例，测试实现效果如下：

![image-20250227172015861](.\images\image-20250227172015861.png)

### 接入百度统计

​	　访问[百度统计](https://tongji.baidu.com/web5/10000673844/welcome/login)并登录，点击 `进入产品` -> `新增网站`，按要求填写后，即可在 `代码管理` - > `代码获取` 中获得所需的统计代码，然后将其复制并粘贴到您要跟踪的每个网页中。





### 第三方评论



### 文章信息统计

  // "@giscus/vue": "^3.0.0",

  // "sass-embedded": "^1.81.0",

### 团队页
