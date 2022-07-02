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
      >
        {{ authorUsername }}
      </router-link>
      <span class="date">{{ createdAt }}</span>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "ArticleMeta",
  props: {
    articleSlug: String,
    authorUsername: String,
    authorImage: String,
    createdAt: String
  },
  setup() {
    return {
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
