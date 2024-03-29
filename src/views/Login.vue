<template>
  <loading-spinner v-if="isLoading" />
  <template v-else>
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
              <router-link :to="{ name: 'register' }"
                >Have an account?</router-link
              >
            </p>

            <ul class="error-messages" v-if="errors">
              <li>{{ parseErrors(errors) }}</li>
            </ul>
            <form @submit.prevent="handleSubmit">
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="formData.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="formData.password"
                />
              </fieldset>
              <button
                type="submit"
                class="btn btn-lg btn-primary pull-xs-right"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import { LOGIN } from "../store/action-types";

import LoadingSpinner from "../components/LoadingSpinner.vue";
import useLoading from "../composables/loading";

import { parseErrors } from "../helpers";

export default {
  name: "LoginView",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const formData = reactive({
      email: "",
      password: ""
    });

    const errors = computed(() => store.state.errors);

    const [{ isLoading }, { start: startLoading, stop: stopLoading }] =
      useLoading(false);

    const handleSubmit = async () => {
      startLoading();
      await store.dispatch(LOGIN, {
        email: formData.email,
        password: formData.password
      });

      if (errors.value) {
        stopLoading();
      } else {
        router.push({ path: route.query.redirect || "/" });
      }
    };

    return {
      formData,
      handleSubmit,
      isLoading,
      errors,
      parseErrors
    };
  }
};
</script>
