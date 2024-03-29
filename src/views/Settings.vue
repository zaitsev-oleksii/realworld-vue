<template>
  <loading-spinner v-if="isLoading" />
  <template v-else>
    <div class="settings-page" v-if="isAuthenticated">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <form @submit.prevent="handleSubmitUpdates">
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    v-model="userData.image"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="userData.username"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    v-model="userData.bio"
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="userData.email"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    v-model="userData.password"
                  />
                </fieldset>
                <button
                  type="submit"
                  class="btn btn-lg btn-primary pull-xs-right"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button
              class="btn btn-outline-danger pull-xs-right"
              @click="handleLogout"
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { LOGOUT, UPDATE_USER_DATA } from "../store/action-types";

import LoadingSpinner from "../components/LoadingSpinner.vue";
import useLoading from "../composables/loading";

export default {
  name: "SettingsView",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const [{ isLoading }, { start: startLoading }] = useLoading(false);

    const userData = reactive({
      username: store.state.user.username,
      image: store.state.user.image,
      bio: store.state.user.bio,
      password: ""
    });

    const handleSubmitUpdates = async () => {
      startLoading();
      const updatedUserData = await store.dispatch(UPDATE_USER_DATA, userData);
      router.push({
        name: "profile",
        params: { username: updatedUserData.username }
      });
    };

    const handleLogout = async () => {
      startLoading();
      await store.dispatch(LOGOUT);
      router.push({ name: "home" });
    };

    return {
      isAuthenticated,
      isLoading,
      userData,
      handleSubmitUpdates,
      handleLogout
    };
  }
};
</script>
