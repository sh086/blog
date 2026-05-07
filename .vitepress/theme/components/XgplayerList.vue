<template>
  <div class="video-list">
    <div 
      v-for="(item, index) in videos" 
      :key="index" 
      class="video-item"
    >
      <div :id="`video-${index}-${randomId}`" class="video-player"></div>
      <p v-if="item.title" class="video-title">{{ item.title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Player from "xgplayer";
  import "xgplayer/dist/index.min.css";
  import { onMounted, onBeforeUnmount } from 'vue'

  interface VideoItem {
    url: string
    poster?: string
    title?: string
  }

  interface Props {
    videos: VideoItem[]
    autoplay?: boolean
    volume?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    videos: () => [],
    autoplay: false,
    volume: 0,
  })

  const randomId = Math.random().toString(36).slice(2, 11)
  const players: Player[] = []

  onMounted(() => {
    props.videos.forEach((video, index) => {
      const player = new Player({
        id: `video-${index}-${randomId}`,
        volume: props.volume,
        lang: "zh",
        autoplay: props.autoplay,
        fluid: true,
        controls: true,
        leavePlayerTime: 0,
        download: true,
        keyShortcut: true,
        url: video.url,
        poster: video.poster || '',
        start: {
          isShowPause: true
        }
      })
      players.push(player)
    })
  })

  onBeforeUnmount(() => {
    players.forEach(player => player.destroy())
    players.length = 0
  })
</script>

<style scoped>
.video-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.video-item {
  flex: 1;
  min-width: 300px;
  max-width: calc(50% - 8px);
}

.video-player {
  width: 100%;
}

.video-title {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .video-item {
    max-width: 100%;
  }
}
</style>