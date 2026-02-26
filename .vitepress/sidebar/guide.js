

/**
 * VitePress左侧栏
 */
const vitepressBaseUrl =  '/docs/guide/webapp/vitepress/';
const vitepress =  [
  {
    text: 'VitePress',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '快速开始', link: vitepressBaseUrl},
      { text: '站点配置', link: vitepressBaseUrl+ '01_站点配置'},
      { text: '部署', link: vitepressBaseUrl + '02_部署'},
    ]
  },
  {
    text: '进阶',
    collapsed: false, 
    items: [
      { text: '路由', link: vitepressBaseUrl + '03_路由'},
      { text: 'MarkDown', link: vitepressBaseUrl + '04_MarkDown'},
    ]
  },
  {
    text: '拓展',
    collapsed: false, 
    items: [
      { text: '自定义主题', link: vitepressBaseUrl + '05_自定义主题'},
      { text: '第三方插件', link: vitepressBaseUrl + '06_第三方插件'},
      { text: '访问统计', link: vitepressBaseUrl + '07_访问统计'},
    ]
  },
]

export {vitepress}