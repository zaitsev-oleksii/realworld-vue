<template>
  <div class="article-page" v-if="article">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <div class="article-meta">
          <a href=""
            ><img :src="article.author.image || MISSING_PROFILE_IMAGE_URL"
          /></a>
          <div class="info">
            <a href="" class="author">{{ article.author.username }}</a>
            <span class="date">{{ article.createdAt }}</span>
          </div>
          <template v-if="!isCurrentUserArticle">
            <follow-button
              v-if="following !== null"
              :username="article.author.username"
              :following="following"
              @click="handleFollow"
            />
            &nbsp;&nbsp;
            <button
              class="btn btn-sm btn-outline-primary"
              @click="handleFavorite"
            >
              <i class="ion-heart"></i>
              &nbsp; {{ !favorited ? "Favorite" : "Unfavorite" }} Post
              <span class="counter">({{ article.favoritesCount }})</span>
            </button>
          </template>
          <template v-if="isCurrentUserArticle">
            <router-link
              class="btn btn-outline-secondary btn-sm"
              :to="`/editor/${article.slug}`"
            >
              <i class="ion-edit"></i> Edit Article
            </router-link>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="handleDeleteArticle"
            >
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          {{ article.body }}
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <a href="profile.html"><img :src="article.author.image" /></a>
          <div class="info">
            <a href="" class="author">{{ article.author.username }}</a>
            <span class="date">{{ article.createdAt }}</span>
          </div>

          <template v-if="!isCurrentUserArticle">
            <follow-button
              v-if="following !== null"
              :username="article.author.username"
              :following="following"
              @click="handleFollow"
            />
            &nbsp;
            <button
              class="btn btn-sm btn-outline-primary"
              @click="handleFavorite"
            >
              <i class="ion-heart"></i>
              &nbsp;
              <span class="counter"
                >{{ !favorited ? "Favorite" : "Unfavorite" }} Post ({{
                  article.favoritesCount
                }})</span
              >
            </button>
          </template>

          <template v-if="isCurrentUserArticle">
            <router-link
              class="btn btn-outline-secondary btn-sm"
              :to="`/editor/${article.slug}`"
            >
              <i class="ion-edit"></i> Edit Article
            </router-link>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="handleDeleteArticle"
            >
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </template>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <comment-form
            v-if="isAuthorized"
            :articleSlug="article.slug"
            @new-comment="setComments"
          />
          <template v-else>
            <span>
              <router-link to="/login">Sign in</router-link> or
              <router-link to="/register">sign up</router-link> to add comments
              on this article.
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
              @comment-deleted="setComments"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import articlesAPI from "../api/articles";
import commentsAPI from "../api/comments";

import FollowButton from "../components/FollowButton.vue";
import CommentForm from "../components/CommentForm.vue";
import CommentCard from "../components/CommentCard.vue";

import useFavoriteArticle from "../composables/favorite-article";
import useFollowProfile from "../composables/follow-profile";

import { MISSING_PROFILE_IMAGE_URL } from "../config";

export default {
  name: "ArticlePage",
  components: { FollowButton, CommentForm, CommentCard },
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const isAuthorized = computed(() => store.getters.isAuthorized);

    const article = ref(null);
    const isCurrentUserArticle = computed(
      () => store.state.user.username === article.value?.author.username
    );
    const handleDeleteArticle = async () => {
      await articlesAPI.deleteArticle(article.value.slug);
      router.push("/");
    };

    const setArticle = async () => {
      const articleData = (await articlesAPI.getArticle(props.slug)).data;
      if (!articleData) {
        router.push("/");
        return;
      }
      article.value = articleData;
    };

    const comments = ref([]);
    const displayedComments = computed(() => comments.value.slice().reverse());
    const setComments = async () => {
      const commentsData = (await commentsAPI.getComments(props.slug)).data;
      comments.value = commentsData;
    };

    onMounted(async () => {
      setArticle();
      setComments();
    });

    const [following, handleFollow] = useFollowProfile({
      articleSlug: props.slug
    });

    const [favorited, handleFavorite] = useFavoriteArticle(props.slug);

    return {
      article,
      isCurrentUserArticle,
      handleDeleteArticle,
      displayedComments,
      setComments,
      isAuthorized,
      following,
      handleFollow,
      favorited,
      handleFavorite,
      MISSING_PROFILE_IMAGE_URL
    };
  }
};
</script>
