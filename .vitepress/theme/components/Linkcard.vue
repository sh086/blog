<script setup lang="ts">
interface Props {
    url: string
    title: string
    logo: string
    description?: string
    type?: string // 默认：normal 可选 normal、full
}

const props = withDefaults(defineProps<Props>(), {
    url: '',
    title: '',
    description: '',
    logo: '',
    type: 'normal',
})
</script>

<template>
    <div v-if="props.type === 'normal'" style="margin-top: 24px" class="linkcard">
        <a :href="props.url" >
            <div class="logo">
                <img alt="logo" :src="props.logo" />
            </div>
            <p class="description">{{ props.title }}</p>
        </a>
    </div>

    <div v-if="props.type === 'full'" style="margin-top: 24px" class="linkcard_large">
        <a :href="props.url">
            <p class="description">{{ props.title }}<br><span>{{ props.description }}</span></p>
            <div class="logo">
                <img alt="logo" width="70px" height="70px" :src="props.logo" />
            </div>
        </a>
    </div>
</template>

<style>
/* 卡片背景 */
.linkcard {
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
    padding: 8px;
    transition: color 0.5s, background-color 0.5s;
    margin: 15px 0 0 15px; /* 添加外边距以便在一行中排列 */
    width: 120px; /* 设置固定宽度 */
    height: 120px; /* 设置固定高度，使其成为正方形 */
    display: inline-block; /* 或者使用 flex */
    vertical-align: top; /* 确保垂直对齐 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}


/* 卡片鼠标悬停 */
.linkcard:hover {
    background-color: var(--vp-c-yellow-soft);
}


/* 链接样式 */
.linkcard a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    text-decoration: none;
    color: inherit;
}

/* 描述链接文字 */
.linkcard .description {
    flex: 1;
    font-weight: 500;
    font-size: 16px;
    line-height: 25px;
    color: var(--vp-c-text-1);
    margin: 0;
    text-align: center;
    transition: color 0.5s;
    display: flex;
    align-items: center;
    justify-content: center; 
    height: 100%; 
    width: 100%;
}

/* 卡片背景 */
.linkcard_large {
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
    padding: 8px 16px 8px 8px;
    transition: color 0.5s, background-color 0.5s;
    margin-top: 15px;
}

/* 卡片鼠标悬停 */
.linkcard_large:hover {
    background-color: var(--vp-c-yellow-soft);
}

/* 链接样式 */
.linkcard_large a {
    display: flex;
    align-items: center;
}

/* 描述链接文字 */
.linkcard_large .description {
    flex: 1;
    font-weight: 500;
    font-size: 16px;
    line-height: 25px;
    color: var(--vp-c-text-1);
    margin: 0 0 0 16px;
    transition: color 0.5s;
}

/* 描述链接文字2 */
.linkcard_large .description span {
    font-size: 14px;
}

/* 链接下划线去除 */
.vp-doc a {
    text-decoration: none;
}

/* logo图片 */
.logo img {
    width: 80px;
    object-fit: contain;
    cursor: default; 
}
</style>