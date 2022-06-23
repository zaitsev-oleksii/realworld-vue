import { ref, computed } from "vue";

const usePagination = ({ limitPerPage, totalElements }) => {
  const currentPage = ref(1);

  const firstPage = 1;
  const lastPage = totalElements
    ? Math.ceil(totalElements / limitPerPage)
    : Infinity;
  const offset = computed(() => (currentPage.value - 1) * limitPerPage);

  const goToNextPage = () => {
    currentPage.value =
      currentPage.value < lastPage ? currentPage.value + 1 : currentPage.value;
  };
  const goToPrevPage = () => {
    currentPage.value = currentPage.value <= 1 ? 1 : currentPage.value - 1;
  };
  const goToPage = (page) => {
    currentPage.value = page;
  };

  return {
    currentPage,
    offset,
    goToNextPage,
    goToPrevPage,
    goToPage,
    firstPage,
    lastPage
  };
};

export default usePagination;
