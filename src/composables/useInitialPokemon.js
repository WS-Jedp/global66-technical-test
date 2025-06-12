import { ref, onMounted } from 'vue'
import { pokemonService } from '../services/pokemonService'

export function useInitialPokemon() {
  const allPokemon = ref([])
  const isInitialLoading = ref(true)
  const initialLoadError = ref(null)
  const hasMorePokemon = ref(true)
  const totalPokemon = ref(0)

  const loadAllPokemon = async () => {
    try {
      isInitialLoading.value = true
      initialLoadError.value = null
      
      const result = await pokemonService.getAllPokemon(20, 0)
      allPokemon.value = result.pokemon
      hasMorePokemon.value = result.hasMore
      totalPokemon.value = result.total
    } catch (error) {
      console.error('Error loading initial Pokemon:', error)
      initialLoadError.value = error
    } finally {
      isInitialLoading.value = false
    }
  }

  onMounted(() => {
    loadAllPokemon()
  })

  return {
    allPokemon,
    isInitialLoading,
    initialLoadError,
    hasMorePokemon,
    totalPokemon,
    loadAllPokemon
  }
}
