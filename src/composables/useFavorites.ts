import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch, type Ref } from 'vue'
import { pokemonService } from '../services/pokemonService'
import { useFavoritesStore } from '../store/favorites'

/**
 * Hook for managing favorite Pokemon with search functionality
 */
export function useFavorites(searchQuery: Ref<string>) {
  const favoritesStore = useFavoritesStore()
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
      debouncedQuery.value = newQuery.trim().toLowerCase()
    }, 300)
  }, { immediate: true })

  // Fetch favorite Pokemon
  const { data: favoritePokemon, isLoading, error } = useQuery({
    queryKey: computed(() => ['favorite-pokemon', favoritesStore.favoriteNames]),
    queryFn: () => pokemonService.getFavoritePokemon(favoritesStore.favoriteNames),
    enabled: computed(() => favoritesStore.favoriteNames.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  const hasSearched = computed(() => debouncedQuery.value.length > 0)

  // Filter favorites based on search query
  const displayedPokemon = computed(() => {
    const pokemon = favoritePokemon.value || []
    
    if (!hasSearched.value) {
      return pokemon
    }

    return pokemon.filter(p => 
      p.name.toLowerCase().includes(debouncedQuery.value)
    )
  })

  const showNoResults = computed(() => {
    if (!hasSearched.value) {
      return favoritesStore.favoriteNames.length === 0
    }
    return displayedPokemon.value.length === 0 && !isLoading.value
  })

  return {
    displayedPokemon,
    isLoading,
    error,
    hasSearched,
    showNoResults
  }
}
