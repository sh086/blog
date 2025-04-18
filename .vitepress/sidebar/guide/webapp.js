const vitepress =  [
  {
    text: 'VitePress',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '快速开始', link: '/docs/guide/webapp/index/vitepress/'},
      { text: '站点配置', link: '/docs/guide/webapp/index/vitepress/01_站点配置'},
      { text: '部署', link: '/docs/guide/webapp/index/vitepress/02_部署'},
    ]
  },
  {
    text: '进阶',
    collapsed: false, 
    items: [
      { text: '路由', link: '/docs/guide/webapp/index/vitepress/03_路由'},
      { text: 'MarkDown', link: '/docs/guide/webapp/index/vitepress/04_MarkDown'},
    ]
  },
  {
    text: '拓展',
    collapsed: false, 
    items: [
      { text: '自定义主题', link: '/docs/guide/webapp/index/vitepress/05_自定义主题'},
      { text: '第三方插件', link: '/docs/guide/webapp/index/vitepress/06_第三方插件'},
      { text: '访问统计', link: '/docs/guide/webapp/index/vitepress/07_访问统计'},
    ]
  },
]

const startup =  [
  {
    text: '指南',
    collapsed: false,
    items: [
      { text: '快速开始', link: '/docs/guide/webapp/startup/'},
      { text: 'Hello Word一镜到底', link: '/docs/guide/webapp/startup/01_Hello Word一镜到底'},
      { text: '日志分析与监控', link: '/docs/guide/webapp/startup/02_日志分析与监控'},
    ]
  },
  {
    text: '业务开发',
    collapsed: false,
    items: [
      { text: 'DevOps团队搭建', link: '/docs/guide/webapp/startup/03_DevOps团队搭建'},
      { text: '史上最全Java工具类', link: '/docs/guide/webapp/startup/04_史上最全Java工具类'},
      { text: '统一认证中心', link: '/docs/guide/webapp/startup/05_统一认证中心'},
      { text: '微服务解决复杂问题', link: '/docs/guide/webapp/startup/06_微服务解决复杂问题'},
    ]
  },
  {
    text: '毕业设计',
    collapsed: false,
    items: [
      { text: '哔哩哔哩 (゜-゜)つロ', link: ''},
    ]
  },

]

const interview =  [
  {
    text: '指南',
    collapsed: false,
    items: [
      { text: '简介', link: '/docs/guide/webapp/interview/'},
      { text: '算法与设计模式', link: ''},
      { text: '语言学习', link: ''},
    ]
  },
  {
    text: '技术面试',
    collapsed: false,
    items: [
      { text: 'Java全栈开发', link: ''},
      { text: 'GoLang云原生', link: ''},
    ]
  },
  {
    text: '行为面试',
    collapsed: false,
    items: [
      { text: '团队', link: ''},
    ]
  },
]

export {startup,interview,vitepress}