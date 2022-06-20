<template>
  <button class="btn btn-sm btn-outline-secondary">
    <i class="ion-plus-round"></i>
    &nbsp; {{ !$props.following ? "Follow" : "Unfollow" }} {{ $props.username }}
  </button>
</template>

<script>
export default {
  name: "FollowButton",
  props: {
    username: String,
    following: Boolean
  },
  setup() {}
};
</script>
