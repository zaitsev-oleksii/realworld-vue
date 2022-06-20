<template>
  <div class="article-preview">
    <div class="article-meta">
      <a href="profile.html"><img :src="$props.author.image" /></a>
      <div class="info">
        <a href="" class="author">{{ $props.author.username }}</a>
        <span class="date">{{ $props.createdAt }}</span>
      </div>
      <button class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ $props.favoritesCount }}
      </button>
    </div>
    <router-link :to="`/article/${$props.slug}`" class="preview-link">
      <h1>{{ $props.title }}</h1>
      <p>{{ $props.description }}</p>
      <span>Read more...</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ArticlePreview",
  props: {
    slug: String,
    author: Object,
    createdAt: String,
    favoritesCount: Number,
    title: String,
    description: String
  },
  setup() {}
};
</script>
