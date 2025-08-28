
const wechatBaseUrl =  '/docs/guide/develop/phone/wechat/';

const wechat =  [
  {
    text: '微信公众平台',
    collapsed: false,
    items: [
      // link需要使用全路径,不能使用相对路径 否则侧边栏选中项变成蓝色 这一效果会失效
      { text: '快速开始', link: wechatBaseUrl},
      { text: '部署', link: wechatBaseUrl + '02_部署'},
    ]
  },
  {
    text: '服务',
    collapsed: false, 
    items: [
      { text: '开发平台', link: wechatBaseUrl + '02_部署'},
      { text: '微信支付', link: wechatBaseUrl + '04_MarkDown'},
    ]
  },
  {
    text: '平台',
    collapsed: false, 
    items: [
      { text: '小程序', link: wechatBaseUrl + '03_路由'},
      { text: '公众号', link: wechatBaseUrl + '04_MarkDown'},
      { text: '服务号', link: wechatBaseUrl + '04_MarkDown'},
      { text: '企业微信', link: wechatBaseUrl + '04_MarkDown'},
    ]
  },
  {
    text: '拓展',
    collapsed: true, 
    items: [
      { text: '视频号', link: wechatBaseUrl + '04_MarkDown'},
      { text: '智能对话', link: wechatBaseUrl + '06_第三方插件'},
    ]
  },
]

export {wechat}