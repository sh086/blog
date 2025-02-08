
module.exports = {
    // 当用户在 `指南` 目录页面下将会展示这个侧边栏
   
    '/docs/gudie/python/': [
      {
        text: 'Python',
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/gudie/python/'},
          { text: '快速开始', link: '/docs/gudie/python/startup/'},
          { text: '更多的语法', link: '/docs/gudie/python/grammer/'},
          { text: '面试宝典', link: '/docs/gudie/python/interview/'},
        ]
      },
      {
        text: '最佳实践',
        collapsed: false, 
        items: [
          { text: '网络爬虫', link: '/docs/gudie/python/grammer/crawler/'},
          { text: '数据分析', link: '/docs/gudie/python/grammer/analysis/'},
          { text: '自动化办公', link: '/docs/gudie/python/grammer/work/'},
          { text: 'Web开发', link: '/docs/gudie/python/grammer/web/'},
          { text: '第三方工具', link: '/docs/gudie/python/grammer/sdk/'},
        ]
      },
    ],

    '/docs/media/stable-diffusion/': [
      {
        text: 'Stable Diffusion',
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/media/stable-diffusion/'},
          { text: '快速开始', link: '/docs/media/stable-diffusion/quickstart.md'},
        ]
      },
      {
        text: '功能',
        collapsed: false,
        items: [
          { text: '文生图', link: '/docs/media/stable-diffusion/txt2img.md'},
          { text: '图生图', link: '/docs/media/stable-diffusion/img2img.md'},
        ]
      },
      {
        text: '最佳实践',
        collapsed: true,
        items: [
        ]
      },
    ],
}