<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">conduit</router-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <router-link to="/" class="nav-link active">Home</router-link>
        </li>
        <template v-if="isAuthorized">
          <li class="nav-item">
            <router-link to="/editor" class="nav-link">
              <i class="ion-compose"></i>&nbsp;New Article
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/settings" class="nav-link">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="`/profile/${username}`" class="nav-link">
              {{ username }}
            </router-link>
          </li>
        </template>
        <template v-if="!isAuthorized">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Sign in</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">Sign up</router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "NavbarLayout",
  setup() {
    const store = useStore();

    return {
      isAuthorized: computed(() => store.getters.isAuthorized),
      username: computed(() => store.state.user.username)
    };
  }
};
</script>
