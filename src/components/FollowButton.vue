<template>
  <button class="btn btn-sm btn-outline-secondary" @click="handleClick">
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
  emits: {
    "toggle-follow": null
  },
  setup(props, { emit }) {
    return {
      handleClick: () => emit("toggle-follow")
    };
  }
};
</script>
