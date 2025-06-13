import { useQuery, useInfiniteQuery } from "@tanstack/vue-query";
import { computed, ref, watch, type Ref } from "vue";
import { pokemonService } from "../services/pokemonService";
import type { SimplePokemon } from "../types/pokemon";

interface PaginatedPokemonResponse {
  pokemon: SimplePokemon[];
  hasMore: boolean;
  total: number;
}

/**
 * Composable for HomePage Pokemon management
 * Combines initial loading, pagination, and search functionality
 */
export function useHomePage(searchQuery: Ref<string>, pageSize = 10) {
  // Search debouncing
  const debouncedQuery = ref("");
  let debounceTimeout: any = null;

  // Debounce the search query
  watch(
    searchQuery,
    (newQuery: string) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      if (!newQuery || !newQuery.trim()) {
        debouncedQuery.value = "";
        return;
      }

      debounceTimeout = setTimeout(() => {
        debouncedQuery.value = newQuery.trim();
      }, 300);
    },
    { immediate: true }
  );

  // Pagination query for all Pokemon (when no search)
  const {
    data: paginationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPaginationLoading,
    error: paginationError,
  } = useInfiniteQuery<PaginatedPokemonResponse>({
    queryKey: ["pokemon-paginated"],
    queryFn: ({ pageParam }) =>
      pokemonService.getPokemonPaginated((pageParam as number) ?? 1, pageSize),
    getNextPageParam: (
      lastPage: PaginatedPokemonResponse,
      allPages: PaginatedPokemonResponse[]
    ) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Search query for Pokemon search
  const queryEnabled = computed(() => debouncedQuery.value.length > 0);
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery({
    queryKey: computed(() => ["pokemon-search", debouncedQuery.value]),
    queryFn: () => pokemonService.searchPokemon(debouncedQuery.value, 10),
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Computed values
  const paginatedPokemon = computed(() => {
    return (
      paginationData.value?.pages.flatMap(
        (page: PaginatedPokemonResponse) => page.pokemon
      ) || []
    );
  });

  const hasSearched = computed(() => debouncedQuery.value.length > 0);

  const displayedPokemon = computed(() => {
    // When there's a search query, use search results
    if (hasSearched.value) {
      return searchResults.value || [];
    }

    // When no search query, use paginated results
    return paginatedPokemon.value || [];
  });

  const isLoading = computed(() => {
    return hasSearched.value ? isSearchLoading.value : false;
  });

  const error = computed(() => {
    return hasSearched.value ? searchError.value : paginationError.value;
  });

  const showNoResults = computed(() => {
    return (
      hasSearched.value &&
      displayedPokemon.value.length === 0 &&
      !isLoading.value
    );
  });

  // Computed values for initial loading state
  const isInitialLoading = computed(() => {
    // Show initial loading only when pagination is loading for the first time
    // and we don't have any data yet
    return isPaginationLoading.value && paginatedPokemon.value.length === 0;
  });

  const initialLoadError = computed(() => {
    // Show initial error only when pagination has an error and no data
    return paginationError.value && paginatedPokemon.value.length === 0
      ? paginationError.value
      : null;
  });

  // Load more handler
  const loadMore = async () => {
    if (hasNextPage.value && !isFetchingNextPage.value) {
      await fetchNextPage();
    }
  };

  return {
    // Pokemon data
    displayedPokemon,
    paginatedPokemon,

    // Loading states
    isInitialLoading,
    isLoading,
    isPaginationLoading,

    // Error states
    initialLoadError,
    error,

    // Search states
    hasSearched,
    showNoResults,

    // Pagination
    hasNextPage,
    isFetchingNextPage,
    loadMore,
  };
}
