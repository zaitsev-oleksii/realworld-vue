<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <a href="">Have an account?</a>
          </p>

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
            <button type="submit" class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { LOGIN } from "../store/action-types";

export default {
  name: "LoginPage",
  setup() {
    const store = useStore();
    const router = useRouter();

    const formData = reactive({
      email: "",
      password: ""
    });

    const handleSubmit = async () => {
      await store.dispatch(LOGIN, {
        email: formData.email,
        password: formData.password
      });
      router.push({ path: "/" });
    };

    return {
      formData,
      handleSubmit
    };
  }
};
</script>
