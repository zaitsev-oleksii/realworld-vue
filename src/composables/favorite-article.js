import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import articlesAPI from "../api/articles";

const useFavoriteArticle = (slug) => {
  const store = useStore();
  const router = useRouter();
  const isAuthorized = computed(() => store.getters.isAuthorized);

  const favorited = ref(null);
  const favoritesCount = ref(null);

  const execute = async () => {
    const articleData = await articlesAPI.getArticle({
      slug: slug,
      token: store.state.user.token
    });
    favorited.value = articleData.favorited;
    favoritesCount.value = articleData.favoritesCount;
  };

  const handleFavorite = async () => {
    if (favorited.value === null) return;

    if (!isAuthorized.value) {
      router.push({ path: "/login" });
      return;
    }

    const articleData = await (!favorited.value
      ? articlesAPI.favorite({ slug: slug, token: store.state.user.token })
      : articlesAPI.unfavorite({ slug: slug, token: store.state.user.token }));

    favorited.value = articleData.favorited;
    favoritesCount.value = articleData.favoritesCount;
  };

  execute();

  return [favorited, handleFavorite, favoritesCount];
};

export default useFavoriteArticle;
