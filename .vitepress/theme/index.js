// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import Layout from './Layout.vue'
import { VPBadge } from 'vitepress/theme'
import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import { Sandbox } from 'vitepress-plugin-sandpack';
import 'vitepress-plugin-sandpack/dist/style.css';
import './style/index.css'
import Linkcard from "./Linkcard.vue"
import Xgplayer from "./Xgplayer.vue"
import ArticleMetadata from "./ArticleMetadata.vue"


export default {
  Layout,
  enhanceApp: ({router,app}) =>{
    // 将实时编码插件Sandbox注册为全局组件
    app.component('Sandbox', Sandbox);
    // 注册为全局组件
    app.component('Badge', VPBadge);
    app.component('Linkcard', Linkcard)
    app.component("Xgplayer", Xgplayer);
    app.component("ArticleMetadata", ArticleMetadata);
    // 线上环境将访问记录自动申报到百度统计
    router.onBeforeRouteChange = (to) => {
      if(import.meta.env.MODE === 'production') {
        if( typeof _hmt !== 'undefined' && !!to ){
          _hmt.push(['_trackPageview', to])
        }
      }
    };
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
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