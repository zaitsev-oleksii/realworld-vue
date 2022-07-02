import { ref, unref, inject } from "vue";

const useFavoriteArticle = (
  slug,
  isAuthorized = false,
  onUnauthorized = () => {}
) => {
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

    if (!unref(isAuthorized)) {
      onUnauthorized();
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
