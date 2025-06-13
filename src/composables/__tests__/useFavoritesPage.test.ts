import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { useFavoritesPage } from '../../composables/useFavoritesPage'
import { useFavoritesStore } from '../../store/favorites'

// Mock the pokemon service
vi.mock('@/services/pokemonService', () => ({
  pokemonService: {
    getFavoritePokemon: vi.fn()
  }
}))

import { pokemonService } from '../../services/pokemonService'

// Test wrapper component to test the composable
const TestComponent = {
  setup() {
    const searchQuery = ref('')
    const favoritesPageData = useFavoritesPage(searchQuery)
    
    return {
      searchQuery,
      ...favoritesPageData
    }
  },
  template: '<div></div>'
}

describe('useFavoritesPage', () => {
  let queryClient: QueryClient
  let pinia: any

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const mockFavoritePokemon = [
    {
      id: 1,
      name: 'pikachu',
      sprite: 'https://example.com/pikachu.png',
      weight: 60,
      height: 4,
      types: ['electric']
    },
    {
      id: 6,
      name: 'charizard',
      sprite: 'https://example.com/charizard.png',
      weight: 905,
      height: 17,
      types: ['fire', 'flying']
    }
  ]

  it('loads favorite pokemon when favorites exist', async () => {
    vi.mocked(pokemonService.getFavoritePokemon).mockResolvedValue(mockFavoritePokemon)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')
    favoritesStore.add('charizard')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(pokemonService.getFavoritePokemon).toHaveBeenCalledWith(['pikachu', 'charizard'])
    expect(wrapper.vm.displayedPokemon).toEqual(mockFavoritePokemon)
  })

  it('does not load pokemon when no favorites exist', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(pokemonService.getFavoritePokemon).not.toHaveBeenCalled()
    expect(wrapper.vm.showNoResults).toBe(true)
  })

  it('filters favorite pokemon based on search query', async () => {
    vi.mocked(pokemonService.getFavoritePokemon).mockResolvedValue(mockFavoritePokemon)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')
    favoritesStore.add('charizard')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Search for pikachu
    wrapper.vm.searchQuery = 'pika'
    await wrapper.vm.$nextTick()

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.hasSearched).toBe(true)
    expect(wrapper.vm.displayedPokemon).toHaveLength(1)
    expect(wrapper.vm.displayedPokemon[0].name).toBe('pikachu')
  })

  it('shows no results when search query matches no favorites', async () => {
    vi.mocked(pokemonService.getFavoritePokemon).mockResolvedValue(mockFavoritePokemon)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')
    favoritesStore.add('charizard')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Search for something that doesn't exist
    wrapper.vm.searchQuery = 'nonexistent'
    await wrapper.vm.$nextTick()

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.hasSearched).toBe(true)
    expect(wrapper.vm.showNoResults).toBe(true)
    expect(wrapper.vm.displayedPokemon).toHaveLength(0)
  })

  it('debounces search query changes', async () => {
    vi.mocked(pokemonService.getFavoritePokemon).mockResolvedValue(mockFavoritePokemon)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Rapidly change search query
    wrapper.vm.searchQuery = 'p'
    await wrapper.vm.$nextTick()
    wrapper.vm.searchQuery = 'pi'
    await wrapper.vm.$nextTick()
    wrapper.vm.searchQuery = 'pik'
    await wrapper.vm.$nextTick()
    wrapper.vm.searchQuery = 'pika'
    await wrapper.vm.$nextTick()

    // Wait less than debounce time
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.hasSearched).toBe(false)

    // Wait for debounce to complete
    await new Promise(resolve => setTimeout(resolve, 250))
    expect(wrapper.vm.hasSearched).toBe(true)
  })

  it('returns all favorites when search query is cleared', async () => {
    vi.mocked(pokemonService.getFavoritePokemon).mockResolvedValue(mockFavoritePokemon)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')
    favoritesStore.add('charizard')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Set search query
    wrapper.vm.searchQuery = 'pika'
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.displayedPokemon).toHaveLength(1)

    // Clear search query
    wrapper.vm.searchQuery = ''
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.hasSearched).toBe(false)
    expect(wrapper.vm.displayedPokemon).toHaveLength(2)
  })

  it('handles case-insensitive search', async () => {
    vi.mocked(pokemonService.getFavoritePokemon).mockResolvedValue(mockFavoritePokemon)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')
    favoritesStore.add('charizard')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Search with uppercase
    wrapper.vm.searchQuery = 'PIKA'
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.displayedPokemon).toHaveLength(1)
    expect(wrapper.vm.displayedPokemon[0].name).toBe('pikachu')
  })

  it('reacts to changes in favorites store', async () => {
    vi.mocked(pokemonService.getFavoritePokemon)
      .mockResolvedValueOnce([mockFavoritePokemon[0]]) // First call with just pikachu
      .mockResolvedValueOnce(mockFavoritePokemon) // Second call with both

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    const favoritesStore = useFavoritesStore()
    favoritesStore.add('pikachu')

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.vm.displayedPokemon).toHaveLength(1)

    // Add another favorite
    favoritesStore.add('charizard')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(pokemonService.getFavoritePokemon).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.displayedPokemon).toHaveLength(2)
  })
})
