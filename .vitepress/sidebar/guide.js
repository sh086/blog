const guideIndex =  [
  {
    text: '指南',
    collapsed: false,
    items: [
      { text: '快速开始', link: '/docs/guide/'},
      { text: '面试宝典', link: '/docs/guide/#面试宝典'},
    ]
  },
  {
    text: '项目组',
    collapsed: false,
    items: [
      { text: '产品与运营', link: '/docs/guide/#产品与运营'},
      { text: '大前端', link: '/docs/guide/#大前端'},
      { text: '单体应用', link: '/docs/guide/#单体应用'},
      { text: '微服务架构', link: '/docs/guide/#微服务架构'},
    ]
  },
  {
    text: '云服务',
    collapsed: false,
    items: [
      { text: 'DevOps流水线', link: '/docs/guide/#devops流水线'},
      { text: '平台即服务', link: '/docs/guide/#平台即服务'},
      { text: 'Python与自动化', link: '/docs/guide/#python与自动化'},
    ]
  },
  // {
  //   text: '模型',
  //   collapsed: false,
  //   items: [
  //     { text: 'NPL自然语言模型', link: ''},
  //   ]
  // },
  {
    text: '拓展',
    collapsed: true,
    items: [
      { text: '游戏编程', link: ''},
      { text: 'Alot物联网', link: ''},
    ]
  },
]

const vitepress =  [
  {
    text: 'VitePress',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '快速开始', link: '/docs/guide/webapp/vitepress/'},
      { text: '站点配置', link: '/docs/guide/webapp/vitepress/01_站点配置'},
      { text: '部署', link: '/docs/guide/webapp/vitepress/02_部署'},
    ]
  },
  {
    text: '进阶',
    collapsed: false, 
    items: [
      { text: '路由', link: '/docs/guide/webapp/vitepress/03_路由'},
      { text: 'MarkDown', link: '/docs/guide/webapp/vitepress/04_MarkDown'},
    ]
  },
  {
    text: '拓展',
    collapsed: false, 
    items: [
      { text: '自定义主题', link: '/docs/guide/webapp/vitepress/05_自定义主题'},
      { text: '第三方插件', link: '/docs/guide/webapp/vitepress/06_第三方插件'},
      { text: '访问统计', link: '/docs/guide/webapp/vitepress/07_访问统计'},
    ]
  },
]

const debug =  [
  {
    text: 'DeBug日志',
    collapsed: false,
    items: [
      { text: '最新', link: '/docs/guide/devops/debug/'},
    ]
  },
]


const easyBiliBili =  [
  {
    text: 'Easy-BiliBili',
    collapsed: false,
    items: [
      { text: '快速开始', link: '/docs/guide/startup/easy-bilibili/'},
    ]
  },
]

export {easyBiliBili,vitepress,debug,guideIndex}