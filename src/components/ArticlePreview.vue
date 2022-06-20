<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="`/profile/${$props.author.username}`"
        ><img :src="$props.author.image"
      /></router-link>
      <div class="info">
        <router-link
          :to="`/profile/${$props.author.username}`"
          class="author"
          >{{ $props.author.username }}</router-link
        >
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
