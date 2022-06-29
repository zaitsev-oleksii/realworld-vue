<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link
        :to="{ name: 'profile', params: { username: author.username } }"
      >
        <img :src="$props.author.image || MISSING_PROFILE_IMAGE_URL"
      /></router-link>
      <div class="info">
        <router-link
          :to="{ name: 'profile', params: { username: author.username } }"
          class="author"
        >
          {{ author.username }}
        </router-link>
        <span class="date">{{ createdAt }}</span>
      </div>
      <button
        class="btn btn-sm pull-xs-right"
        :class="{
          'btn-primary': favorited,
          'btn-outline-primary': !favorited
        }"
        @click="handleFavorite"
      >
        <i class="ion-heart"></i> {{ favoritesCount }}
      </button>
    </div>
    <router-link
      :to="{ name: 'article', params: { slug: slug } }"
      class="preview-link"
    >
      <h1>{{ $props.title }}</h1>
      <p>{{ $props.description }}</p>
      <span>Read more...</span>
      <tag-list :tags="tags" />
    </router-link>
  </div>
</template>

<script>
import TagList from "./TagList.vue";

import useFavoriteArticle from "../composables/favorite-article";

import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "ArticlePreview",
  components: { TagList },
  props: {
    slug: String,
    author: Object,
    createdAt: String,
    title: String,
    description: String,
    tags: Array
  },
  setup(props) {
    const [favorited, handleFavorite, favoritesCount] = useFavoriteArticle(
      props.slug
    );
    return {
      favorited,
      handleFavorite,
      favoritesCount,
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
