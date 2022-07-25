import { ref, unref, inject } from "vue";

const useFavoriteArticle = ({
  slug,
  initFavorited = null,
  initFavoritesCount = null,
  isAuthenticated = false,
  onUnauthenticated = () => {}
}) => {
  const articlesAPI = inject("articlesAPI");

  const favorited = ref(initFavorited);
  const favoritesCount = ref(initFavoritesCount);

  const checkFavoritedStatus = async () => {
    const { error, data: articleData } = await articlesAPI.getArticle(slug);
    if (error) {
      return;
    }
    favorited.value = articleData.favorited;
    favoritesCount.value = articleData.favoritesCount;
  };

  const handleFavorite = async () => {
    if (favorited.value === null) {
      return;
    }

    if (!unref(isAuthenticated)) {
      onUnauthenticated();
      return;
    }

    const { error, data: articleData } = await (!favorited.value
      ? articlesAPI.favorite(slug)
      : articlesAPI.unfavorite(slug));

    if (error) {
      return;
    }

    favorited.value = articleData.favorited;
    favoritesCount.value = articleData.favoritesCount;
  };

  if (initFavorited === null) checkFavoritedStatus();

  return [favorited, handleFavorite, favoritesCount];
};

export default useFavoriteArticle;
