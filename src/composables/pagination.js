import { ref, computed } from "vue";

const usePagination = ({
  limitPerPage = 2,
  totalElements,
  initialPage = 1
}) => {
  const currentPage = ref(initialPage || initialPage > 0 || 1);

  const firstPage = computed(() => 1);
  const lastPage = computed(() =>
    totalElements.value
      ? Math.ceil(totalElements.value / limitPerPage)
      : Infinity
  );
  const offset = computed(() => (currentPage.value - 1) * limitPerPage);
  const totalPages = computed(() => lastPage.value - firstPage.value + 1);

  const goToPage = (page) => {
    if (!page || page < firstPage.value || page > lastPage.value) {
      return;
    }
    currentPage.value = page;
  };

  return {
    currentPage,
    offset,
    goToPage,
    firstPage,
    lastPage,
    totalPages
  };
};

export default usePagination;
