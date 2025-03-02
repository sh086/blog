// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import Layout from './Layout.vue'

export default {
  Layout,
  enhanceApp: ({router}) =>{
    // 线上环境将访问记录自动申报到百度统计
    router.onBeforeRouteChange = (to) => {
      if(import.meta.env.MODE === 'production') {
        if( typeof _hmt !== 'undefined' && !!to ){
          _hmt.push(['_trackPageview', to])
        }
      }
    };
  }
}