<template>
  <loading-spinner v-if="isLoading" />
  <template v-else>
    <div class="article-page" v-if="article">
      <div class="banner">
        <div class="container">
          <h1>{{ article.title }}</h1>

          <article-meta
            :articleSlug="article.slug"
            :authorUsername="article.author.username"
            :authorImage="article.author.image"
            :createdAt="article.createdAt"
          >
            <article-controls
              :articleSlug="article.slug"
              :authorUsername="article.author.username"
              :isCurrentUserArticle="isCurrentUserArticle"
              :favorited="favorited"
              :favoritesCount="favoritesCount"
              :followingAuthor="followingAuthor"
              @toggle-favorite="handleFavoriteArticle"
              @toggle-follow="handleFollowAuthor"
              @delete-article="handleDeleteArticle"
            />
          </article-meta>
        </div>
      </div>

      <div class="container page">
        <div class="row article-content">
          <div class="col-md-12">
            <div>
              {{ article.body }}
            </div>
            <tag-list class="article-tag-list" :tags="article.tagList" />
          </div>
        </div>

        <hr />

        <div class="article-actions">
          <article-meta
            :articleSlug="article.slug"
            :authorUsername="article.author.username"
            :authorImage="article.author.image"
            :createdAt="article.createdAt"
          >
            <article-controls
              :articleSlug="article.slug"
              :authorUsername="article.author.username"
              :isCurrentUserArticle="isCurrentUserArticle"
              :favorited="favorited"
              :favoritesCount="favoritesCount"
              :followingAuthor="followingAuthor"
              @toggle-favorite="handleFavoriteArticle"
              @toggle-follow="handleFollowAuthor"
              @delete-article="handleDeleteArticle"
            />
          </article-meta>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-8 offset-md-2">
            <comment-form
              v-if="isAuthorized"
              :articleSlug="article.slug"
              @new-comment="(commentText) => addComment(commentText)"
            />
            <template v-else>
              <span>
                <router-link :to="{ name: 'login' }">Sign in</router-link> or
                <router-link :to="{ name: 'register' }">sign up</router-link> to
                add comments on this article.
              </span>
            </template>
            <template v-if="displayedComments.length > 0">
              <comment-card
                v-for="comment in displayedComments"
                :key="comment.id"
                :articleSlug="article.slug"
                :id="comment.id"
                :author="comment.author"
                :createdAt="comment.createdAt"
                :body="comment.body"
                @delete-comment="(commentId) => deleteComment(commentId)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { ref, watch, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import ArticleMeta from "../components/ArticleMeta.vue";
import ArticleControls from "../components/ArticleControls.vue";

import LoadingSpinner from "../components/LoadingSpinner.vue";
import TagList from "../components/TagList.vue";
import CommentForm from "../components/CommentForm.vue";
import CommentCard from "../components/CommentCard.vue";

import useLoading from "../composables/loading";
import useFavoriteArticle from "../composables/favorite-article";
import useFollowProfile from "../composables/follow-profile";

export default {
  name: "ArticleView",
  components: {
    ArticleMeta,
    ArticleControls,
    LoadingSpinner,
    TagList,
    CommentForm,
    CommentCard
  },
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const articlesAPI = inject("articlesAPI");
    const commentsAPI = inject("commentsAPI");

    const isAuthorized = computed(() => store.getters.isAuthorized);

    const article = ref(null);

    const [{ isLoading }, { start: startLoading, stop: stopLoading }] =
      useLoading(true);

    const setArticle = async () => {
      const articleData = (await articlesAPI.getArticle(props.slug)).data;
      if (!articleData) {
        router.push({ name: "home" });
        return;
      }
      article.value = articleData;
    };

    const isCurrentUserArticle = computed(
      () => store.state.user.username === article.value.author.username
    );

    const handleDeleteArticle = async () => {
      await articlesAPI.deleteArticle(props.slug);
      router.push({ name: "home" });
    };

    const [followingAuthor, handleFollowAuthor] = useFollowProfile(
      { articleSlug: props.slug },
      isAuthorized,
      () => {
        router.push({ name: "login" });
      }
    );

    const [favorited, handleFavoriteArticle, favoritesCount] =
      useFavoriteArticle(props.slug, isAuthorized, () => {
        router.push({ name: "login" });
      });

    const comments = ref([]);
    const refreshComments = async () => {
      const commentsData = (await commentsAPI.getComments(props.slug)).data;
      comments.value = commentsData;
    };
    const addComment = async (commentText) => {
      await commentsAPI.createComment({
        slug: props.slug,
        commentText: commentText
      });
      refreshComments();
    };
    const deleteComment = async (commentId) => {
      await commentsAPI.deleteComment({
        slug: props.slug,
        id: commentId
      });
      refreshComments();
    };
    const displayedComments = computed(() => comments.value.slice().reverse());

    watch(
      () => props.slug,
      async () => {
        startLoading();
        await setArticle();
        await refreshComments();
        stopLoading();
      },
      { immediate: true }
    );

    return {
      article,
      isLoading,
      isCurrentUserArticle,
      handleDeleteArticle,
      followingAuthor,
      handleFollowAuthor,
      favorited,
      handleFavoriteArticle,
      favoritesCount,
      displayedComments,
      addComment,
      deleteComment,
      refreshComments,
      isAuthorized
    };
  }
};
</script>

<style scoped>
.article-tag-list {
  margin-top: 25px;
}
</style>
