<script setup lang="ts">
import {watch} from 'vue'
import GisCus from '@giscus/vue'
import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
import {useRoute,useData,inBrowser} from 'vitepress'

const {page,isDark} = useData()
const {Layout} = DefaultTheme

// 评论框暗黑和明亮主题切换
watch(isDark, (dark) => {
    if (!inBrowser) return;
    const giscusWidget = document.querySelector('giscus-widget');
    if (!giscusWidget) return;
    const iframe = giscusWidget.shadowRoot?.querySelector('iframe');
    if (!iframe) return;
    iframe.contentWindow?.postMessage(
        {
            giscus: {
                setConfig: {
                    theme: dark ? 'dark' : 'light',
                },
            },
        },
        'https://giscus.app'
    );
});

</script>


<template>
  <Layout>
    <!-- #not-found 这里使用了插槽-->
    <!-- 具体可见https://vitepress.dev/zh/guide/extending-default-theme#layout-slots -->
    <template #not-found>
      <NotFound></NotFound>
    </template>

    <!-- #doc-after 这里使用了插槽，具体可见https://vitepress.dev/zh/guide/extending-default-theme#layout-slots -->
    <template #doc-after>
      <!--index页面不展示评论框 只有具体的文章才展示评论框 -->
      <div v-if="!page.filePath.includes('index.md')" style="margin-top: 24px">
        <GisCus
            :key="page.filePath"
            repo="sh086/blog"
            repo-id="R_kgDOJZ3-Ug"
            category="General"
            category-id="DIC_kwDOJZ3-Us4Cne5f"
            mapping="pathname"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="bottom"
            theme="preferred_color_scheme"
            lang="zh-CN"
            crossorigin="anonymous"
            Loading = 'lazy'/>
      </div>
    </template>
  </Layout>
</template>

<style>
/* 
* 修改嵌入视频的样式
* 原来嵌入的视频特别小,样式修改后可以铺满整行
 */
iframe {
  width: 100%;
  height: 400px;
  border-top-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  margin-top: 40px;
  margin-bottom: 40px;
}

/* 表格宽度自适应 */
th, td{
  /* // 不让th td内容换行显示 */
    white-space: nowrap !important; 
    /* // 强制均匀分配宽度 */
    width: 1%; 
}

/* markdown图片居中 */
.main img{
    display: block;
    margin: 0 auto;
}
.medium-zoom-overlay {
    z-index: 30;
  }
  
.medium-zoom-image {
  z-index: 9999 !important;
}
</style>