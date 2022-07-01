<template>
  <div class="article-meta">
    <router-link
      :to="{
        name: 'profile',
        params: { username: authorUsername }
      }"
      ><img :src="authorImage || MISSING_PROFILE_IMAGE_URL"
    /></router-link>
    <div class="info">
      <router-link
        :to="{
          name: 'profile',
          params: { username: authorUsername }
        }"
        class="author"
        >{{ authorUsername }}</router-link
      >
      <span class="date">{{ createdAt }}</span>
    </div>
    <template v-if="!isCurrentUserArticle">
      <follow-button
        v-if="following !== null"
        :username="authorUsername"
        :following="following"
        @click="handleFollow"
      />
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-primary" @click="handleFavorite">
        <i class="ion-heart"></i>
        &nbsp; {{ !favorited ? "Favorite" : "Unfavorite" }} Post
        <span class="counter">({{ favoritesCount }})</span>
      </button>
    </template>
    <template v-if="isCurrentUserArticle">
      <router-link
        class="btn btn-outline-secondary btn-sm"
        :to="{ name: 'editor', params: { slug: articleSlug } }"
      >
        <i class="ion-edit"></i> Edit Article
      </router-link>
      <button
        class="btn btn-outline-danger btn-sm"
        @click="handleDeleteArticle"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import FollowButton from "../components/FollowButton.vue";

import useFavoriteArticle from "../composables/favorite-article";
import useFollowProfile from "../composables/follow-profile";

import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "ArticleMeta",
  props: {
    articleSlug: String,
    authorUsername: String,
    authorImage: String,
    createdAt: String
  },
  components: { FollowButton },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const articlesAPI = inject("articlesAPI");

    const isCurrentUserArticle = computed(
      () => store.state.user.username === props.authorUsername
    );

    const handleDeleteArticle = async () => {
      await articlesAPI.deleteArticle(props.articleSlug);
      router.push("/");
    };

    const [following, handleFollow] = useFollowProfile(props.authorUsername);

    const [favorited, handleFavorite, favoritesCount] = useFavoriteArticle(
      props.articleSlug
    );

    return {
      isCurrentUserArticle,
      handleDeleteArticle,
      following,
      handleFollow,
      favorited,
      handleFavorite,
      favoritesCount,
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
