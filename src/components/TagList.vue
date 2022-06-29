<template>
  <ul class="tag-list">
    <li
      class="tag-default tag-pill"
      :class="{
        'tag-outline': theme === TAG_LIST_THEMES.bright
      }"
      v-for="tag in tags"
      :key="tag"
      @click="handleTagClick(tag)"
    >
      {{ tag }}
    </li>
  </ul>
</template>

<script>
import { TAG_LIST_THEMES } from "../config";

export default {
  name: "TagList",
  props: {
    tags: Array,
    theme: {
      type: String,
      default: TAG_LIST_THEMES.bright
    }
  },
  emits: {
    "tag-selected": null
  },
  setup(props, { emit }) {
    return {
      handleTagClick: (tag) => {
        emit("tag-selected", tag);
      },
      TAG_LIST_THEMES
    };
  }
};
</script>
