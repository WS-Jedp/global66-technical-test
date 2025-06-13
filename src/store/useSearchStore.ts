import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSearchStore = defineStore("search", () => {
  const searchQuery = ref("");

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const clearSearch = () => {
    searchQuery.value = "";
  };

  // Computed property to check if there's an active search
  const hasActiveSearch = computed(() => searchQuery.value.trim().length > 0);

  return {
    searchQuery,
    hasActiveSearch,
    setSearchQuery,
    clearSearch,
  };
});
