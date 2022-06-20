<template>
  <form @submit.prevent="handleSubmit" class="card comment-form">
    <div class="card-block">
      <textarea
        class="form-control"
        placeholder="Write a comment..."
        rows="3"
        v-model="commentBody"
      ></textarea>
    </div>
    <div class="card-footer">
      <img :src="currentUserImage" class="comment-author-img" />
      <button type="submit" class="btn btn-sm btn-primary">Post Comment</button>
    </div>
  </form>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "CommentForm",
  setup() {
    const store = useStore();

    const commentBody = ref("");

    const currentUserImage = computed(() => store.state.user.image);

    const handleSubmit = () => {};

    return {
      commentBody,
      currentUserImage,
      handleSubmit
    };
  }
};
</script>
