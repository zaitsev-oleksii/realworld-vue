import { ref, computed } from "vue";

const usePagination = ({
  limitPerPage = 2,
  totalElements,
  initialPage = 1
}) => {
  const currentPage = ref(initialPage);

  const firstPage = computed(() => initialPage);
  const lastPage = computed(() =>
    totalElements.value
      ? Math.ceil(totalElements.value / limitPerPage)
      : Infinity
  );
  const offset = computed(() => (currentPage.value - 1) * limitPerPage);
  const totalPages = computed(() => lastPage.value - firstPage.value + 1);

  const goToNextPage = () => {
    if (currentPage.value < lastPage.value) currentPage.value += 1;
  };
  const goToPrevPage = () => {
    if (currentPage.value > firstPage.value) currentPage.value -= 1;
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
    lastPage,
    totalPages
  };
};

export default usePagination;
