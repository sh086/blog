import  {vitepress} from './sidebar/webapp.js'

export default {
  '/docs/guide/develop/webapp/vitepress/':vitepress,

  '/docs/workflow/': [
    {
      text: '指南',
      collapsed: false,
      items: [
        { text: 'AI工作台', link: '/docs/workflow/'},
        { text: '从0到100搭建工作流', link: ''},
        { text: '大模型白皮书', link: '/docs/workflow/model/'},
        // { text: '一人公司方法论', link: ''},
        { text: '如何学习人工智能', link: ''},
      ]
    },
    {
      text: '应用',
      collapsed: false, 
      items: [
        { text: '小红书图文', link: ''},
        // { text: '都市仙游记', link: ''},
        { text: '漫改经济学', link: ''},
        // 可灵AI + 打印机 做手办
        // { text: '梦想打印机', link: ''},
        { text: '', link: ''},
        { text: '更多的应用', link: ''},
      ]
    },
    {
      text: '技术支持',
      collapsed: true, 
      items: [
        { text: '大模型使用说明', link: ''},
        { text: '主流平台对接方式', link: ''},
        { text: 'AI工具箱', link: ''},
      ]
    },
  ],
}