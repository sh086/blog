// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import { useRoute,inBrowser } from "vitepress";
import DefaultTheme from 'vitepress/theme'

// 引入自定义组件
import Linkcard from "./components/Linkcard.vue"
import Xgplayer from "./components/Xgplayer.vue"
import Layout from './components/Layout.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue"
import Img from './components/Img.vue'

// 图片放大插件
import { onMounted, watch, nextTick } from "vue";
import mediumZoom from "medium-zoom";
// 实时代码预览插件
import { Sandbox } from 'vitepress-plugin-sandpack';
import 'vitepress-plugin-sandpack/dist/style.css';
// 时间线插件样式
import "vitepress-markdown-timeline/dist/theme/index.css";
// 进度条
import { NProgress } from 'nprogress-v2/dist/index.js'
import 'nprogress-v2/dist/index.css'
// 引入自定义样式
import './style/index.css'


export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp: ({router,app}) =>{
    
    // 注册为全局组件
    app.component('Img', Img);
    app.component('Sandbox', Sandbox);
    app.component('Linkcard', Linkcard)
    app.component("Xgplayer", Xgplayer);
    app.component("ArticleMetadata", ArticleMetadata);

    // 切换路由进度条
    if (inBrowser) {
      NProgress.configure({ showSpinner: false })
      router.onBeforeRouteChange = (to) => {
        // 开始进度条
        NProgress.start()
        // 线上环境将访问记录自动申报到百度统计
        if(import.meta.env.MODE === 'production') {
          if( typeof _hmt !== 'undefined' && !!to ){
            _hmt.push(['_trackPageview', to])
          }
        }
      }
      // 停止进度条
      router.onAfterRouteChange = () => {
         NProgress.done() 
       }
    }
  
  },
  setup() {
    // 图片放大
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
      // mediumZoom(".main img", { background: "var(--vp-c-bg)" }); 
      // 使用 :not([alt="logo"]) 排除 alt="logo" 的图片
      mediumZoom(".main img:not([alt='logo'])", { background: "var(--vp-c-bg)" });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
}