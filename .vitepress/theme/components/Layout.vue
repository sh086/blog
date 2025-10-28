<script setup lang="ts">
import {watch} from 'vue'
import GisCus from '@giscus/vue'
import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
import {useRoute,useData,inBrowser} from 'vitepress'
import Notice from "./Notice.vue"
import Backtotop from "./Backtotop.vue"
import BlogAsidePage from '../page/BlogAsidePage.vue'

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
    <!-- <template #not-found>
      <NotFound></NotFound>
    </template> -->

    <!-- 公告  -->
    <!-- <template #layout-top>
      <Notice></Notice>
    </template> -->

    <!-- 返回顶部 -->
    <template #doc-footer-before>
      <Backtotop></Backtotop>
    </template>

    <template #aside-top>
      <div v-if="page.filePath.includes('docs/blog/index.md')">
        <BlogAsidePage></BlogAsidePage>
      </div>
    </template>

    <!-- 评论框 -->
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