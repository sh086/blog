
/**
 * 观影历史左侧栏
 */
const historyBaseUrl =  '/docs/more/history/';
const more =  [
  {
    text: '置顶',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '时间线', link: historyBaseUrl},
      { text: '关注收藏', link: historyBaseUrl+ '01_关注收藏'},
      { text: '在线文档', link: historyBaseUrl + '02_在线文档'},
    ]
  },
  {
    text: '视频',
    collapsed: false, 
    items: [
      { text: '纪录片', link: historyBaseUrl + '03_纪录片'},
      { text: '电影', link: historyBaseUrl + '04_电影'},
      { text: '游戏', link: historyBaseUrl + '05_游戏'},
    ]
  },
  {
    text: '图书',
    collapsed: false, 
    items: [
      { text: '经济', link: historyBaseUrl + '06_经济'},
      { text: '专业书', link: historyBaseUrl + '07_专业书'},
    ]
  },
]

export {more}