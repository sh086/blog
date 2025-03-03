<template>
    <div id="404-container">
      <!-- 腾讯404公益页面将被动态加载到这里 -->
    </div>
</template>
  
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://volunteer.cdn-go.cn/404/latest/404.js'
  document.getElementById('404-container')?.appendChild(script)
})
</script>
  