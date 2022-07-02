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
      <favorite-button
        v-if="favorited !== null"
        class="pull-xs-right"
        :favorited="favorited"
        :favoritesCount="favoritesCount"
        @toggleFavorite="handleFavorite"
      />
    </div>
    <router-link
      :to="{ name: 'article', params: { slug: slug } }"
      class="preview-link"
    >
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <span>Read more...</span>
      <tag-list :tags="tags" />
    </router-link>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import FavoriteButton from "./FavoriteButton.vue";
import TagList from "./TagList.vue";

import useFavoriteArticle from "../composables/favorite-article";

import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "ArticlePreview",
  components: { TagList, FavoriteButton },
  props: {
    slug: String,
    author: Object,
    createdAt: String,
    title: String,
    description: String,
    tags: Array
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const [favorited, handleFavorite, favoritesCount] = useFavoriteArticle(
      props.slug,
      store.getters.isAuthorized,
      () => {
        router.push({ name: "login" });
      }
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
