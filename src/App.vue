<template>
  <navbar-layout />
  <home-page />
  <footer-layout />
</template>

<script>
import NavbarLayout from "./layout/NavbarLayout.vue";
import FooterLayout from "./layout/FooterLayout.vue";
import HomePage from "./pages/HomePage.vue";

export default {
  name: "App",
  components: { NavbarLayout, FooterLayout, HomePage },
  setup() {}
};
</script>

<style></style>
