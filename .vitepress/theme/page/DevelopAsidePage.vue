<template>
    <div class="sidebar-recommend">
      <div class="recommend-header">
        <span class="icon-star">⭐ 精选推荐</span>
      </div>
      <ul class="article-list">
        <li v-for="(article, index) in recommendedArticles" :key="article.id" class="article-item">
          <a :href="article.url" class="article-link">
            <span class="article-rank">{{ index + 1 }}</span>
            <span class="article-title">{{ article.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </template>
  
  <style scoped>
  .sidebar-recommend {
    background: #ffffff;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .recommend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e4e4e4;
  }
  
  .icon-star {
    font-size: 0.875rem;
    color: #facc15;
  }
  
  .article-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .article-item {
    margin-bottom: 0.75rem;
    transition: transform 0.2s ease;
  }
  
  .article-item:hover {
    transform: translateX(5px);
  }
  
  .article-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333333;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease;
  }
  
  .article-link:hover {
    background-color: #f0f0f0;
  }
  
  .article-rank {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #e0e0e0;
    border-radius: 50%;
    margin-right: 0.75rem;
    font-weight: bold;
    color: #666666;
  }
  </style>

<script>
export default {
  data() {
    return {
      recommendedArticles: [
        { id: 1, title: '使用VitePress搭建在线博客', url: '/blog/docs/guide/webapp/vitepress/' },
        { id: 2, title: '使用Lombok神级插件简化代码', url: '/blog/docs/develop/2025/20250329_使用Lombok神级插件简化代码' },
        { id: 3, title: 'JUL原生日志框架', url: '/blog/docs/develop/2025/20250401_JUL原生日志框架' }
      ]
    };
  }
};
</script>
