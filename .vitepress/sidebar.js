import  {vitepress,vuejs} from './sidebar/webapp.js'
import  {xiaohongshu} from './sidebar/workflow.js'
import  {deepseek} from './sidebar/smart.js'
import  {python} from './sidebar/quant.js'
import  {startup,interview} from './sidebar/guide.js'
import  {gaoxiang} from './sidebar/topic.js'

export default {
  // 前端
  '/docs/guide/webapp/vitepress/':vitepress,
  '/docs/guide/webapp/vuejs/':vuejs,

   // 指南
   '/docs/guide/startup/':startup,
   '/docs/guide/interview/':interview,

   // 考证
   '/docs/topic/信息系统项目管理师/':gaoxiang,

   // python
   '/docs/guide/python/':python,

  // 工作流
  '/docs/workflow/uploader/deepseek/':deepseek,
  '/docs/workflow/media/小红书/':xiaohongshu,

  // 量化
}