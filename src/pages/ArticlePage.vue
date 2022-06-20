<template>
  <div class="article-page" v-if="article">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <div class="article-meta">
          <a href=""><img :src="article.author.image" /></a>
          <div class="info">
            <a href="" class="author">{{ article.author.username }}</a>
            <span class="date">{{ article.createdAt }}</span>
          </div>
          <follow-button
            v-if="followingAuthor !== null"
            :username="article.author.username"
            :following="followingAuthor"
            @click="handleFollow"
          />
          &nbsp;&nbsp;
          <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; Favorite Post
            <span class="counter">({{ article.favoritesCount }})</span>
          </button>
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

          <follow-button
            v-if="followingAuthor !== null"
            :username="article.author.username"
            :following="followingAuthor"
            @click="handleFollow"
          />
          &nbsp;
          <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; Favorite Post
            <span class="counter">({{ article.favoritesCount }})</span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <comment-form v-if="isAuthorized" />
          <template v-else>
            <span>
              <router-link to="/login">Sign in</router-link> or
              <router-link to="/register">sign up</router-link> to add comments
              on this article.
            </span>
          </template>
          <template v-if="comments.length > 0">
            <comment-card
              v-for="comment in comments"
              :key="comment.id"
              :author="comment.author"
              :createdAt="comment.createdAt"
              :body="comment.body"
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
import { useRoute, useRouter } from "vue-router";

import articlesAPI from "../api/articles";
import commentsAPI from "../api/comments";
import profileAPI from "../api/profile";

import FollowButton from "../components/FollowButton.vue";
import CommentForm from "../components/CommentForm.vue";
import CommentCard from "../components/CommentCard.vue";

export default {
  name: "ArticlePage",
  components: { FollowButton, CommentForm, CommentCard },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const isAuthorized = computed(() => store.getters.isAuthorized);

    const article = ref(null);

    const comments = ref([]);

    const followingAuthor = ref(null);

    onMounted(async () => {
      const articleData = await articlesAPI.getArticle(route.params.slug);
      if (!articleData) {
        router.push("/");
        return;
      }
      const commentsData = await commentsAPI.getComments(route.params.slug);

      article.value = articleData;
      comments.value = commentsData;
      followingAuthor.value = article.value.author.following;
    });

    const handleFollow = async () => {
      if (!isAuthorized.value) {
        router.push({ path: "/login" });
        return;
      }

      const profileData = await (!followingAuthor.value
        ? profileAPI.follow(
            store.state.user.token,
            article.value.author.username
          )
        : profileAPI.unfollow(
            store.state.user.token,
            article.value.author.username
          ));

      followingAuthor.value = profileData.following;
    };

    return {
      article,
      comments,
      isAuthorized,
      followingAuthor,
      handleFollow
    };
  }
};
</script>
