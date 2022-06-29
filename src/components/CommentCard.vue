<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ body }}
      </p>
    </div>
    <div class="card-footer">
      <router-link
        :to="{ name: 'profile', params: { username: author.username } }"
        class="comment-author"
      >
        <img
          :src="author.image || MISSING_PROFILE_IMAGE_URL"
          class="comment-author-img"
        />
      </router-link>
      &nbsp;
      <router-link
        :to="{ name: 'profile', params: { username: author.username } }"
        class="comment-author"
        >{{ author.username }}</router-link
      >
      <span class="date-posted">{{ createdAt }}</span>
      <span class="mod-options" v-if="isCurrentUserComment">
        <i class="ion-trash-a" @click="handleDeleteComment"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "CommentCard",
  props: {
    articleSlug: String,
    id: Number,
    author: Object,
    createdAt: String,
    body: String
  },
  emits: {
    "delete-comment": null
  },
  setup(props, { emit }) {
    const store = useStore();

    const isCurrentUserComment = computed(
      () => store.state.user.username === props.author.username
    );

    const handleDeleteComment = async () => {
      emit("delete-comment", props.id);
    };

    return {
      isCurrentUserComment,
      handleDeleteComment,
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
