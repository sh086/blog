
/**
 * 观影历史左侧栏
 */
const historyBaseUrl =  '/docs/more/history/';
const more =  [
  {
    text: '观影历史',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '时间线', link: historyBaseUrl},
      { text: '正在追更', link: historyBaseUrl+ '01_正在追更'},
      { text: '收藏网站', link: historyBaseUrl+ '02_收藏网站'},
    ]
  },
  {
    text: '我喜欢的',
    collapsed: false, 
    items: [
      { text: 'Vlog', link: historyBaseUrl + '03_Vlog'},
      { text: '纪录片', link: historyBaseUrl + '04_纪录片'},
      { text: '电影', link: historyBaseUrl + '05_电影'},
      { text: '电视剧', link: historyBaseUrl + '06_电视剧'},
      { text: '游戏', link: historyBaseUrl + '07_游戏'},
      { text: '动漫', link: historyBaseUrl + '08_动漫'},
      { text: '综艺', link: historyBaseUrl + '09_综艺'},
    ]
  },
]


/**
 * 文档与图书左侧栏
 */
const docsBaseUrl =  '/docs/more/docs/';
const docs =  [
  {
    text: '置顶',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '时间线', link: docsBaseUrl},
      { text: '常用网站', link: docsBaseUrl+ '01_常用网站'},
    ]
  },
  {
    text: '文档',
    collapsed: false, 
    items: [
      { text: '在线文档', link: docsBaseUrl + '02_在线文档'},
    ]
  },
  {
    text: '图书',
    collapsed: false, 
    items: [
      { text: '经济学', link: docsBaseUrl + '03_经济学'},
      { text: '计算机', link: docsBaseUrl + '04_计算机'},
      { text: '博览群书', link: docsBaseUrl + '05_博览群书'},
    ]
  },
]

export {more,docs}