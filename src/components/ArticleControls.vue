<template>
  <template v-if="!isCurrentUserArticle">
    <follow-button
      v-if="followingAuthor !== null"
      :username="authorUsername"
      :following="followingAuthor"
      @toggleFollow="handleFollowAuthor"
    />
    &nbsp;&nbsp;
    <favorite-button
      v-if="favorited !== null"
      :favorited="favorited"
      :favoritesCount="favoritesCount"
      @toggleFavorite="handleFavoriteArticle"
    >
      &nbsp; {{ !favorited ? "Favorite" : "Unfavorite" }} Post
    </favorite-button>
  </template>
  <template v-if="isCurrentUserArticle">
    <router-link
      class="btn btn-outline-secondary btn-sm"
      :to="{ name: 'editor', params: { slug: articleSlug } }"
    >
      <i class="ion-edit"></i> Edit Article
    </router-link>
    <button class="btn btn-outline-danger btn-sm" @click="handleDeleteArticle">
      <i class="ion-trash-a"></i> Delete Article
    </button>
  </template>
</template>

<script>
import FollowButton from "../components/FollowButton.vue";
import FavoriteButton from "../components/FavoriteButton.vue";

export default {
  name: "ArticleMeta",
  props: {
    articleSlug: String,
    authorUsername: String,
    isCurrentUserArticle: Boolean,
    favorited: Boolean,
    followingAuthor: Boolean,
    favoritesCount: Number
  },
  emits: {
    "toggle-favorite": null,
    "toggle-follow": null,
    "delete-article": null
  },
  components: { FollowButton, FavoriteButton },
  setup(props, { emit }) {
    return {
      handleFavoriteArticle: () => emit("toggle-favorite"),
      handleFollowAuthor: () => emit("toggle-follow"),
      handleDeleteArticle: () => emit("delete-article")
    };
  }
};
</script>
