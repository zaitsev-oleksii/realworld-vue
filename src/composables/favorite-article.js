import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const useFavoriteArticle = (slug) => {
  const store = useStore();
  const router = useRouter();
  const isAuthorized = computed(() => store.getters.isAuthorized);
  const articlesAPI = inject("articlesAPI");

  const favorited = ref(null);
  const favoritesCount = ref(null);

  const checkFavoritedStatus = async () => {
    const articleData = (await articlesAPI.getArticle(slug)).data;
    favorited.value = articleData.favorited;
    favoritesCount.value = articleData.favoritesCount;
  };

  const handleFavorite = async () => {
    if (favorited.value === null) return;

    if (!isAuthorized.value) {
      router.push({ path: "/login" });
      return;
    }

    const articleData = (
      await (!favorited.value
        ? articlesAPI.favorite(slug)
        : articlesAPI.unfavorite(slug))
    ).data;

    favorited.value = articleData.favorited;
    favoritesCount.value = articleData.favoritesCount;
  };

  checkFavoritedStatus();

  return [favorited, handleFavorite, favoritesCount];
};

export default useFavoriteArticle;
