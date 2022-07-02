<template>
  <button
    class="btn btn-sm"
    :class="{
      'btn-primary': favorited,
      'btn-outline-primary': !favorited
    }"
    @click="handleClick"
  >
    <i class="ion-heart"></i>
    <slot></slot>
    {{ $slots.default ? `(${favoritesCount})` : favoritesCount }}
  </button>
</template>

<script>
export default {
  name: "FavoriteButton",
  props: {
    favorited: {
      type: Boolean,
      required: true
    },
    favoritesCount: {
      type: Number,
      required: false
    }
  },
  emits: {
    "toggle-favorite": null
  },
  setup(props, { emit }) {
    return {
      handleClick: () => emit("toggle-favorite")
    };
  }
};
</script>
