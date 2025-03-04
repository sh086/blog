const base = '/docs/guide/develop/webapp';
const vitepress =  [
  {
    text: 'VitePress',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '快速开始', link: base + '/vitepress/'},
      { text: '站点配置', link: base + '/vitepress/01_站点配置'},
      { text: '部署', link: base + '/vitepress/02_部署'},
    ]
  },
  {
    text: '写作',
    collapsed: false, 
    items: [
      { text: '路由', link: base + '/vitepress/03_路由'},
      { text: 'MarkDown', link: base + '/vitepress/04_MarkDown'},
    ]
  },
  {
    text: '拓展',
    collapsed: false, 
    items: [
      { text: '自定义主题', link: base + '/vitepress/05_自定义主题'},
      { text: '访问统计', link: base + '/vitepress/06_访问统计'},
      { text: 'Giscus评论', link: base +'/vitepress/07_Giscus评论'},
      { text: '公益404页面', link: base + '/vitepress/08_公益404页面'},
    ]
  },
]

export {vitepress}