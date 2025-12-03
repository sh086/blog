import { defineConfig } from 'vitepress'
import nav from "./nav"
import sidebar from "./sidebar"
import container from 'markdown-it-container';
import { renderSandbox } from 'vitepress-plugin-sandpack';
// 时间线
import timeline from "vitepress-markdown-timeline";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "探索未至之境", // 站点标题
  description: "学习笔记", // 站点描述
  base: '/blog/',
  head: [
    ["link", { rel: "icon", href: "/blog/favicon.ico" }],
    [
      'script',
       {},
      `window._hmt = window._hmt || [];
      (function() { 
        var hm = document.createElement("script"); 
        hm.src = "https://hm.baidu.com/hm.js?39514e29553ce2485c0bc9d3a4d580ca";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
        })();`
    ]
  ],
  cleanUrls:true, // 使用更简洁的Url配置
  lastUpdated: true, // 更新时间启用
  themeConfig: {

    // 站点logo
    logo: '/logo.svg',

    // 导航栏和侧边栏
    nav: nav,
    sidebar: sidebar,

    // 标题索引
    outlineTitle: "目录", // 定义索引的标题名称
    outline: [2,6], // 定义索引的标题级别

    // 社交链接
    socialLinks: [
      { icon: 'youtube', link: 'https://www.youtube.com/@suhe086' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/393064787' },
      { icon: 'github', link: 'https://github.com/sh086' },
    ],

    // 更新时间配置
    // 允许自定义上次更新的文本和日期格式 需提交Git后生效
    lastUpdated: {
      text: '更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

     // 页脚设置
    footer: {
       message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present S.H'
    },

    // 上一页和下一页
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

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

     // 移动端汉化
     sidebarMenuLabel:"菜单",
     returnToTopLabel: "返回顶部",
     darkModeSwitchLabel: "深色模式",
     darkModeSwitchTitle: "切换深色模式",
     lightModeSwitchTitle: "切换浅色模式",

  },

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
      lazyLoading: false
    },
    config(md) {
      //时间线
      md.use(timeline);
      // 代码实时解析
      md.use(container, 'sandbox', {
          render (tokens, idx) {
            return renderSandbox(tokens, idx, 'sandbox');
          },
        });
      // ArticleMetadata组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          let htmlResult = slf.renderToken(tokens, idx, options);
          if (tokens[idx].tag === 'h1' && !env.path.includes('index.md')) {
            htmlResult += `<ArticleMetadata />`; 
          }
          return htmlResult;
      }
    },
  },
})
