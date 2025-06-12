import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { pokemonService } from '../services/pokemonService'

/**
 * Hook for searching Pokemon with debouncing
 */
export function usePokemonSearch(searchQuery: any) {
  const debouncedQuery = ref('')
  let debounceTimeout: any = null

  // Debounce the search query
  watch(searchQuery, (newQuery: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (!newQuery.trim()) {
      debouncedQuery.value = ''
      return
    }

    debounceTimeout = setTimeout(() => {
      debouncedQuery.value = newQuery.trim()
    }, 300)
  }, { immediate: true })

  const queryEnabled = computed(() => debouncedQuery.value.length > 0)

  const query = useQuery({
    queryKey: computed(() => ['pokemon-search', debouncedQuery.value]),
    queryFn: () => pokemonService.searchPokemon(debouncedQuery.value, 10),
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  const hasSearched = computed(() => debouncedQuery.value.length > 0)

  return {
    ...query,
    hasSearched
  }
}

/**
 * Hook for managing Pokemon search with favorites integration
 */
export function usePokemonWithFavorites(searchQuery: any, activeTab: any, favorites: any) {
  const { 
    data: searchResults, 
    isLoading, 
    error, 
    hasSearched 
  } = usePokemonSearch(searchQuery)

  const displayedPokemon = computed(() => {
    if (activeTab.value === 'favorites') {
      if (!hasSearched.value) {
        return favorites.value
      }
      // Show only favorites from search results
      return (searchResults.value || []).filter((pokemon: any) => 
        favorites.value.some((fav: any) => fav.name === pokemon.name)
      )
    }
    return searchResults.value || []
  })

  const showNoResults = computed(() => {
    if (activeTab.value === 'favorites' && !hasSearched.value) {
      return favorites.value.length === 0
    }
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
