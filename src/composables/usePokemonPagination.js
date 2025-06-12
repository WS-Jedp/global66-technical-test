import { ref, computed } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { pokemonService } from '../services/pokemonService'

export function usePokemonPagination(pageSize = 10) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['pokemon-paginated'],
    queryFn: ({ pageParam = 1 }) => pokemonService.getPokemonPaginated(pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  })

  const allPokemon = computed(() => {
    return data.value?.pages.flatMap(page => page.pokemon) || []
  })

  const totalCount = computed(() => {
    return data.value?.pages[0]?.total || 0
  })

  const loadMore = async () => {
    if (hasNextPage.value && !isFetchingNextPage.value) {
      await fetchNextPage()
    }
  }

  return {
    allPokemon,
    totalCount,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  }
}
