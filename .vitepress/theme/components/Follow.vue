<template>
  <a :href="url" :target="target" class="follow-card">
    <div class="follow-logo">
      <img :src="logo" :alt="title" loading="lazy" data-no-zoom />
    </div>
    <p v-if="title" class="follow-title">{{ title }}</p>
  </a>
</template>

<script setup lang="ts">
  interface Props {
    url: string
    title?: string
    logo: string
    target?: '_blank' | '_self' | '_parent' | '_top'
  }

  withDefaults(defineProps<Props>(), {
    target: '_blank',
  })
</script>

<style scoped>
.follow-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  padding: 12px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
}

.follow-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
}

.follow-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.follow-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
