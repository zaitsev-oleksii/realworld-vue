<template>
  <loading-spinner v-if="isLoading" />
  <template v-else>
    <div class="article-page">
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
              :isAuthorizedToModify="isAuthorizedToModify"
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
              :isAuthorizedToModify="isAuthorizedToModify"
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
              v-if="isAuthenticated"
              :articleSlug="article.slug"
              :userImage="currentUser.image"
              @new-comment="(commentText) => handleAddComment(commentText)"
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
                @delete-comment="(commentId) => handleDeleteComment(commentId)"
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

import LoadingSpinner from "../components/LoadingSpinner.vue";
import ArticleMeta from "../components/ArticleMeta.vue";
import ArticleControls from "../components/ArticleControls.vue";
import TagList from "../components/TagList.vue";
import CommentForm from "../components/CommentForm.vue";
import CommentCard from "../components/CommentCard.vue";

import useLoading from "../composables/loading";

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
    const profileAPI = inject("profileAPI");

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const currentUser = computed(() => store.state.user);
    const [{ isLoading }, { start: startLoading, stop: stopLoading }] =
      useLoading(true);

    const article = ref({
      slug: "",
      title: "",
      description: "",
      body: "",
      tags: [],
      createdAt: "",
      favorited: null,
      favoritesCount: null,
      author: {
        username: "",
        bio: "",
        image: "",
        following: null
      }
    });

    const loadArticle = async () => {
      const { error, data: articleData } = await articlesAPI.getArticle(
        props.slug
      );
      if (error) {
        router.push({ name: "home" });
        return;
      }

      article.value = articleData;
    };

    const isAuthorizedToModify = computed(
      () => currentUser.value.username === article.value.author.username
    );
    const handleDeleteArticle = async () => {
      await articlesAPI.deleteArticle(props.slug);
      router.push({ name: "home" });
    };

    const favorited = computed(() => article.value.favorited);
    const favoritesCount = computed(() => article.value.favoritesCount);
    const handleFavoriteArticle = async () => {
      if (!isAuthenticated.value) {
        router.push({ name: "login" });
        return;
      }
      const { error, data: newArticleData } = await (!favorited.value
        ? articlesAPI.favorite(props.slug)
        : articlesAPI.unfavorite(props.slug));
      if (error) {
        return;
      }
      article.value.favorited = newArticleData.favorited;
      article.value.favoritesCount = newArticleData.favoritesCount;
    };

    const followingAuthor = computed(() => article.value.author.following);
    const handleFollowAuthor = async () => {
      if (!isAuthenticated.value) {
        router.push({ name: "login" });
        return;
      }
      const { error, data: newAuthorData } = await (!followingAuthor.value
        ? profileAPI.follow(article.value.author.username)
        : profileAPI.unfollow(article.value.author.username));
      if (error) {
        return;
      }
      article.value.author.following = newAuthorData.following;
    };

    const comments = ref([]);
    const loadComments = async () => {
      const { error, data: commentsData } = await commentsAPI.getComments(
        props.slug
      );
      if (error) {
        return;
      }
      comments.value = commentsData;
    };
    const handleAddComment = async (commentText) => {
      const { error, data: newComment } = await commentsAPI.createComment({
        slug: props.slug,
        commentText: commentText
      });
      if (error) {
        return;
      }

      comments.value.unshift(newComment);
    };
    const handleDeleteComment = async (commentId) => {
      const { error } = await commentsAPI.deleteComment({
        slug: props.slug,
        id: commentId
      });

      if (error) {
        return;
      }

      comments.value = comments.value.filter(
        (comment) => comment.id !== commentId
      );
    };
    const sortCriteria = (curr, next) =>
      new Date(next.createdAt) - new Date(curr.createdAt);
    const displayedComments = computed(() =>
      comments.value.slice().sort(sortCriteria)
    );

    watch(
      () => props.slug,
      async () => {
        startLoading();
        await loadArticle();
        await loadComments();
        stopLoading();
      },
      { immediate: true }
    );

    return {
      article,
      isLoading,
      currentUser,
      isAuthorizedToModify,
      handleDeleteArticle,
      followingAuthor,
      handleFollowAuthor,
      favorited,
      handleFavoriteArticle,
      favoritesCount,
      displayedComments,
      handleAddComment,
      handleDeleteComment,
      isAuthenticated
    };
  }
};
</script>

<style scoped>
.article-tag-list {
  margin-top: 25px;
}
</style>
