<template>
  <navbar-layout />
  <router-view></router-view>
  <footer-layout />
</template>

<script>
import NavbarLayout from "./layout/NavbarLayout.vue";
import FooterLayout from "./layout/FooterLayout.vue";

export default {
  name: "App",
  components: { NavbarLayout, FooterLayout },
  setup() {}
};
</script>

<style></style>
