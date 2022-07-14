<template>
  <form @submit.prevent="handleSubmit" class="card comment-form">
    <div class="card-block">
      <textarea
        class="form-control"
        placeholder="Write a comment..."
        rows="3"
        v-model="commentText"
      ></textarea>
    </div>
    <div class="card-footer">
      <img
        :src="userImage || MISSING_PROFILE_IMAGE_URL"
        class="comment-author-img"
      />
      <button type="submit" class="btn btn-sm btn-primary">Post Comment</button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";

import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "CommentForm",
  props: {
    articleSlug: String,
    userImage: String
  },
  emits: {
    "new-comment": null
  },
  setup(props, { emit }) {
    const commentText = ref("");

    const handleSubmit = async () => {
      if (!commentText.value) {
        return;
      }
      emit("new-comment", commentText.value);
      commentText.value = "";
    };

    return {
      commentText,
      handleSubmit,
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
