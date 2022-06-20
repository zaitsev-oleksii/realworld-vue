<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ $props.body }}
      </p>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img :src="$props.author.image" class="comment-author-img" />
      </a>
      &nbsp;
      <a href="" class="comment-author">{{ $props.author.username }}</a>
      <span class="date-posted">{{ $props.createdAt }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentCard",
  props: {
    author: Object,
    createdAt: String,
    body: String
  },
  setup() {}
};
</script>
