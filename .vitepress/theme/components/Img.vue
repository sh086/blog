<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    src: string
}

const props = withDefaults(defineProps<Props>(), {
    src: ''
});

const isLoading = ref(true);
const isError = ref(false);

function onImageLoad() {
    console.error('onImageLoad' + isLoading);
    isLoading.value = false;
}

function onImageError() {
    isLoading.value = false;
    isError.value = true;
    console.error('图片加载失败');
}
</script>

<template>
    <div v-if="isLoading" class="image-container">
      <div class="loading-indicator">图片加载中... 请稍等(～￣▽￣)～</div>
    </div>
    <div v-if="isError" class="image-container">
      <div class="loading-indicator">图片加载失败了😂</div>
    </div>
    <div v-if="!isError">
      <img
        :src="props.src"
        @load="onImageLoad"
        @error="onImageError"
      />
    </div>
</template>

<style scoped>
.image-container {
    position: relative;
    width: 100%;  
    height: 200px;
}

.loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
}
</style>