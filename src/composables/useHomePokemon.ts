import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch, type Ref } from 'vue'
import { pokemonService } from '../services/pokemonService'

/**
 * Hook for searching Pokemon with debouncing (for HomePage)
 */
export function useHomePokemon(searchQuery: Ref<string>, paginatedPokemon: any) {
  const debouncedQuery = ref('')
  let debounceTimeout: any = null

  // Debounce the search query - ensure reactivity
  watch(searchQuery, (newQuery: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (!newQuery || !newQuery.trim()) {
      debouncedQuery.value = ''
      return
    }

    debounceTimeout = setTimeout(() => {
      debouncedQuery.value = newQuery.trim()
    }, 300)
  }, { immediate: true })

  const queryEnabled = computed(() => debouncedQuery.value.length > 0)

  const { data: searchResults, isLoading: isSearchLoading, error: searchError } = useQuery({
    queryKey: computed(() => ['pokemon-search', debouncedQuery.value]),
    queryFn: () => pokemonService.searchPokemon(debouncedQuery.value, 10),
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  const hasSearched = computed(() => debouncedQuery.value.length > 0)

  const displayedPokemon = computed(() => {
    // When there's a search query, use search results
    if (hasSearched.value) {
      return searchResults.value || []
    }
    
    // When no search query, use paginated results
    return paginatedPokemon.value || []
  })

  const isLoading = computed(() => {
    return hasSearched.value ? isSearchLoading.value : false
  })

  const error = computed(() => {
    return hasSearched.value ? searchError.value : null
  })

  const showNoResults = computed(() => {
    return hasSearched.value && displayedPokemon.value.length === 0 && !isLoading.value
  })

  return {
    displayedPokemon,
    isLoading,
    error,
    hasSearched,
    showNoResults
  }
}
