const vitepress =  [
  {
    text: '指南',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '快速开始', link: '/docs/guide/develop/webapp/vitepress/'},
      { text: '站点配置', link: '/docs/guide/develop/webapp/vitepress/01_站点配置'},
      { text: '部署', link: '/docs/guide/develop/webapp/vitepress/02_部署'},
    ]
  },
  {
    text: '写作',
    collapsed: false, 
    items: [
      { text: '导航栏', link: '/docs/guide/develop/webapp/vitepress/03_导航栏'},
      { text: '侧边栏', link: '/docs/guide/develop/webapp/vitepress/04_侧边栏'},
      { text: 'MarkDown拓展', link: ''},
      { text: 'frontmatter', link: ''},
      { text: '在MarkDown使用Vue', link: ''},
    ]
  },
  {
    text: '自定义',
    collapsed: false, 
    items: [
      { text: '访问统计', link: ''},
      { text: 'Giscus评论', link: ''},
      { text: '公益404页面', link: ''},
    ]
  },
]

export {vitepress}