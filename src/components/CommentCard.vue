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
    </div>
  </div>
</template>

<script>
import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "CommentCard",
  props: {
    author: Object,
    createdAt: String,
    body: String
  },
  setup() {
    return { MISSING_PROFILE_IMAGE_URL };
  }
};
</script>
