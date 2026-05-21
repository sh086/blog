<template>
  <div class="video-list">
    <div
      v-for="(item, index) in videos"
      :key="index"
      class="video-card"
      :class="{ 'video-card-horizontal': item.orientation === 'horizontal' }"
    >
      <a :href="item.url" :target="item.target || '_blank'" class="video-cover" :class="{ 'video-cover-horizontal': item.orientation === 'horizontal' }">
        <img :src="item.poster" :alt="item.title" loading="lazy" data-no-zoom />
      </a>
      <p v-if="item.title" class="video-title">{{ item.title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface VideoItem {
    url: string
    poster: string
    title?: string
    orientation?: 'horizontal' | 'vertical' // horizontal: 横屏(16:9), vertical: 竖屏(9:16)，默认竖屏
    target?: '_blank' | '_self' | '_parent' | '_top'
  }

  interface Props {
    videos: VideoItem[]
  }

  withDefaults(defineProps<Props>(), {
    videos: () => [],
  })
</script>

<style scoped>
.video-list {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  margin: 16px 0;
}

.video-card {
  overflow: hidden;
  grid-column: span 3;
}

.video-card-horizontal {
  grid-column: span 4;
}

.video-cover {
  display: block;
  text-decoration: none;
  width: 100%;
  aspect-ratio: 1 / 1.48;
  background: #000;
  overflow: hidden;
}

.video-cover-horizontal {
  aspect-ratio: 16 / 9;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  cursor: pointer;
}

.video-title {
  margin: 0;
  padding: 8px;
  font-size: 12px;
  text-align: center;
  color: #000;
}

@media (max-width: 960px) {
  .video-list {
    grid-template-columns: repeat(6, 1fr);
  }

  .video-card {
    grid-column: span 3;
  }

  .video-card-horizontal {
    grid-column: span 6;
  }
}

@media (max-width: 640px) {
  .video-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
