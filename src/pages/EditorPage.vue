<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="formData.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="formData.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="formData.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="formData.tag"
                  @keydown.enter="addTag"
                />
                <div class="tag-list" v-if="tags.length > 0">
                  <span
                    class="tag-default tag-pill"
                    v-for="tag in tags"
                    :key="tag"
                  >
                    <i class="ion-close-round" @click="removeTag(tag)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="handleSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import articlesAPI from "../api/articles";

export default {
  name: "EditorPage",
  props: {
    slug: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const formData = reactive({
      title: "",
      description: "",
      body: "",
      tag: ""
    });

    const tags = ref([]);

    onMounted(async () => {
      if (!store.getters.isAuthorized) {
        router.push("/login");
        return;
      }
      // if (route.params.slug !== "AAAB-57111") router.push("/editor/AAAB-57111");

      if (props.slug) {
        const articleData = (await articlesAPI.getArticle(props.slug)).data;
        if (articleData.author.username !== store.state.user.username) {
          router.push("/");
          return;
        }

        formData.title = articleData.title;
        formData.description = articleData.description;
        formData.body = articleData.body;
        tags.value = articleData.tagList;
      }
    });

    const addTag = () => {
      tags.value.push(formData.tag);
      formData.tag = "";
    };

    const removeTag = (tag) => {
      tags.value = tags.value.filter((t) => t !== tag);
    };

    const handleSubmit = async () => {
      const newArticleData = {
        title: formData.title,
        description: formData.description,
        body: formData.body,
        tagList: tags.value
      };
      if (props.slug) {
        const updatedArticleData = (
          await articlesAPI.updateArticle({
            slug: props.slug,
            articleData: newArticleData
          })
        ).data;
        router.push(`/article/${updatedArticleData.slug}`);
        return;
      }
      const createdArticleData = (
        await articlesAPI.createArticle(newArticleData)
      ).data;
      router.push(`/article/${createdArticleData.slug}`);
    };

    return {
      formData,
      tags,
      addTag,
      removeTag,
      handleSubmit
    };
  }
};
</script>
