
const funtlBaseUrl =  '/docs/blog/topic/funtl/';

const funtl =  [
  {
    text: '鲁斯菲尔-李卫民',
    collapsed: false,
    items: [
       // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '开篇', link: funtlBaseUrl},
      { text: '单体应用', link: funtlBaseUrl + 'framework/'},
      { text: '微服务解决复杂问题', link: funtlBaseUrl+ 'microservice/'},
    ]
  },
  {
    text: '拓展',
    collapsed: false, 
    items: [
    ]
  },
]

export {funtl}