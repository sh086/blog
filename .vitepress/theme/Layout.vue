<script setup lang="ts">

import DefaultTheme from 'vitepress/theme'

const {Layout} = DefaultTheme

</script>


<template>
  <Layout></Layout>
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
</style>