
const startUpBaseUrl =  '/docs/develop/startup/';
const hzrencaiBaseUrl = '/docs/guide/master/杭州人才认定/'

const hzrencai =  [
  {
    text: '杭州人才认定',
    collapsed: false,
    items: [
      { text: '简介', link: hzrencaiBaseUrl},
      { text: '软件著作权', link: ''},
      { text: 'E类人才认定', link: ''},
    ]
  },
  {
    text: '信息系统项目管理师',
    collapsed: false,
    items: [
      { text: '综合知识', link: ''},
      { text: '案例分析', link: ''},
      { text: '论文', link: ''},
    ]
  },
  {
    text: '历年真题',
    collapsed: true,
    items: [
      { text: '2021年下半年真题', link: hzrencaiBaseUrl + '高项真题/2021年下半年真题.md'},
      { text: '', link: ''},
    ]
  },
  
]


const startup =  [
  {
    text: '指南',
    collapsed: false,
    items: [
      { text: '快速开始', link: startUpBaseUrl},
      { text: 'Hello Word一镜到底', link: startUpBaseUrl + '01_Hello Word一镜到底'},
      { text: '日志分析与监控', link: startUpBaseUrl + '02_日志分析与监控'},
    ]
  },
  {
    text: '业务开发',
    collapsed: false,
    items: [
      { text: 'DevOps团队搭建', link: startUpBaseUrl + '03_DevOps团队搭建'},
      { text: '史上最全Java工具类', link: startUpBaseUrl + '04_史上最全Java工具类'},
      { text: '统一认证中心', link: startUpBaseUrl + '05_统一认证中心'},
      { text: '微服务解决复杂问题', link: startUpBaseUrl + '06_微服务解决复杂问题'},
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

export {startup,hzrencai}