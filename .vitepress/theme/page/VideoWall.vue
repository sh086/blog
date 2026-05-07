<template>
  <div class="video-wall">
    <!-- 分类导航 -->
    <div class="category-nav">
      <button 
        v-for="cat in categories" 
        :key="cat"
        :class="['cat-btn', { active: currentCategory === cat }]"
        @click="currentCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 视频网格 -->
    <div class="video-grid">
      <a 
        v-for="video in paginatedVideos" 
        :key="video.id" 
        :href="video.link" 
        class="video-card"
      >
        <div class="cover-wrapper">
          <img :src="video.cover" :alt="video.title" class="cover" />
          <div class="cover-overlay">
            <span class="duration">{{ video.duration }}</span>
          </div>
        </div>
        <div class="info">
          <h3 class="title">{{ video.title }}</h3>
        </div>
      </a>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Video {
  id: number
  title: string
  cover: string
  duration: string
  link: string
  category?: string
}

const props = defineProps<{
  videos: Video[]
}>()

const categories = ['精选', '电影', '电视剧', '综艺', '纪录片', '游戏', '动漫', '搞笑', '知识', 'Vlog', '美剧', '日剧']
const currentCategory = ref('精选')
const currentPage = ref(1)
const perPage = 12 // 6行 * 2列 = 12个

// 切换分类时重置页码
watch(currentCategory, () => {
  currentPage.value = 1
})

// 筛选当前分类的视频
const filteredVideos = computed(() => {
  return props.videos.filter(v => v.category === currentCategory.value)
})

const totalPages = computed(() => Math.ceil(filteredVideos.value.length / perPage) || 1)

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredVideos.value.slice(start, start + perPage)
})
</script>

<style scoped>
.video-wall {
  padding: 16px 24px;
  background: var(--vp-c-bg);
}

.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 16px;
}

.cat-btn {
  padding: 6px 16px;
  font-size: 13px;
  border: none;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cat-btn:hover {
  background: var(--vp-c-bg-elv);
}

.cat-btn.active {
  background: var(--vp-c-brand);
  color: #fff;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

@media (max-width: 1400px) {
  .video-grid { grid-template-columns: repeat(5, 1fr); }
}

@media (max-width: 1100px) {
  .video-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 768px) {
  .video-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .video-wall { padding: 12px; }
  .category-nav { gap: 6px; }
  .cat-btn { padding: 5px 12px; font-size: 12px; }
}

@media (max-width: 480px) {
  .video-grid { grid-template-columns: repeat(2, 1fr); }
}

.video-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.video-card:hover .title {
  color: var(--vp-c-brand);
}

.video-card:hover .cover {
  opacity: 0.85;
}

.cover-wrapper {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 6px;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s ease;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 8px 6px;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
}

.duration {
  font-size: 12px;
  color: #fff;
  background: rgba(0,0,0,0.7);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.info {
  padding: 8px 2px;
}

.title {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.page-btn {
  padding: 6px 16px;
  font-size: 13px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>