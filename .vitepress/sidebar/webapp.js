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

const vuejs =  [
  {
    text: 'VueJS渐进式框架',
    collapsed: false,
    items: [
      { text: '快速开始', link: '/docs/guide/webapp/vuejs/'},
      { text: '语法', link: '/docs/guide/webapp/vuejs/grammer.md'},
    ]
  },
]

export {vitepress,vuejs}