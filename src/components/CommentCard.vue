<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ $props.body }}
      </p>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img
          :src="$props.author.image || MISSING_PROFILE_IMAGE_URL"
          class="comment-author-img"
        />
      </a>
      &nbsp;
      <a href="" class="comment-author">{{ $props.author.username }}</a>
      <span class="date-posted">{{ $props.createdAt }}</span>
      <span class="mod-options" v-if="isCurrentUserComment">
        <i class="ion-trash-a" @click="handleDeleteComment"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import commentsAPI from "../api/comments";

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
    "comment-deleted": null
  },
  setup(props, { emit }) {
    const store = useStore();

    const isCurrentUserComment = computed(
      () => store.state.user.username === props.author.username
    );

    const handleDeleteComment = async () => {
      await commentsAPI.deleteComment({
        slug: props.articleSlug,
        id: props.id
      });
      emit("comment-deleted");
    };

    return {
      isCurrentUserComment,
      handleDeleteComment,
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
