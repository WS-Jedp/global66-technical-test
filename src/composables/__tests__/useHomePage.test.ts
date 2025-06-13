import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { useHomePage } from '../../composables/useHomePage'

// Mock the pokemon service
vi.mock('@/services/pokemonService', () => ({
  pokemonService: {
    getPokemonPaginated: vi.fn(),
    searchPokemon: vi.fn()
  }
}))

import { pokemonService } from '../../services/pokemonService'

// Test wrapper component to test the composable
const TestComponent = {
  setup() {
    const searchQuery = ref('')
    const homePageData = useHomePage(searchQuery)
    
    return {
      searchQuery,
      ...homePageData
    }
  },
  template: '<div></div>'
}

describe('useHomePage', () => {
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

  const mockPokemonData = {
    pokemon: [
      {
        id: 1,
        name: 'pikachu',
        sprite: 'https://example.com/pikachu.png',
        weight: 60,
        height: 4,
        types: ['electric']
      }
    ],
    hasMore: true,
    total: 1000
  }

  it('loads initial pokemon data on mount', async () => {
    vi.mocked(pokemonService.getPokemonPaginated).mockResolvedValue(mockPokemonData)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    // Wait for the query to resolve
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(pokemonService.getPokemonPaginated).toHaveBeenCalledWith(1, 10)
    expect((wrapper.vm as any).displayedPokemon).toEqual(mockPokemonData.pokemon)
  })

  it('searches pokemon when search query is provided', async () => {
    const searchResults = [
      {
        id: 1,
        name: 'pikachu',
        sprite: 'https://example.com/pikachu.png',
        weight: 60,
        height: 4,
        types: ['electric']
      }
    ]

    vi.mocked(pokemonService.searchPokemon).mockResolvedValue(searchResults)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    // Set search query
    ;(wrapper.vm as any).searchQuery = 'pikachu'
    await wrapper.vm.$nextTick()

    // Wait for debounce and query
    await new Promise(resolve => setTimeout(resolve, 350))

    expect((wrapper.vm as any).hasSearched).toBe(true)
    expect((wrapper.vm as any).displayedPokemon).toEqual(searchResults)
  })

  it('debounces search query changes', async () => {
    vi.mocked(pokemonService.searchPokemon).mockResolvedValue([])

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    // Rapidly change search query
    ;(wrapper.vm as any).searchQuery = 'p'
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as any).searchQuery = 'pi'
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as any).searchQuery = 'pik'
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as any).searchQuery = 'pika'
    await wrapper.vm.$nextTick()

    // Wait less than debounce time
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(pokemonService.searchPokemon).not.toHaveBeenCalled()

    // Wait for debounce to complete
    await new Promise(resolve => setTimeout(resolve, 250))
    expect(pokemonService.searchPokemon).toHaveBeenCalledTimes(1)
    expect(pokemonService.searchPokemon).toHaveBeenCalledWith('pika', 10)
  })

  it('shows no results when search returns empty array', async () => {
    vi.mocked(pokemonService.searchPokemon).mockResolvedValue([])

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    ;(wrapper.vm as any).searchQuery = 'nonexistent'
    await wrapper.vm.$nextTick()

    // Wait for debounce and query
    await new Promise(resolve => setTimeout(resolve, 350))

    expect((wrapper.vm as any).showNoResults).toBe(true)
    expect((wrapper.vm as any).displayedPokemon).toEqual([])
  })

  it('returns to paginated results when search query is cleared', async () => {
    vi.mocked(pokemonService.getPokemonPaginated).mockResolvedValue(mockPokemonData)
    vi.mocked(pokemonService.searchPokemon).mockResolvedValue([])

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    // Wait for initial load
    await new Promise(resolve => setTimeout(resolve, 0))

    // Set search query
    ;(wrapper.vm as any).searchQuery = 'pikachu'
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 350))

    expect((wrapper.vm as any).hasSearched).toBe(true)

    // Clear search query
    ;(wrapper.vm as any).searchQuery = ''
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 350))

    expect((wrapper.vm as any).hasSearched).toBe(false)
    expect((wrapper.vm as any).displayedPokemon).toEqual(mockPokemonData.pokemon)
  })

  it('handles pagination correctly', async () => {
    const firstPageData = { ...mockPokemonData }
    const secondPageData = {
      pokemon: [
        {
          id: 2,
          name: 'charizard',
          sprite: 'https://example.com/charizard.png',
          weight: 905,
          height: 17,
          types: ['fire', 'flying']
        }
      ],
      hasMore: false,
      total: 1000
    }

    vi.mocked(pokemonService.getPokemonPaginated)
      .mockResolvedValueOnce(firstPageData)
      .mockResolvedValueOnce(secondPageData)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [
          pinia,
          [VueQueryPlugin, { queryClient }]
        ]
      }
    })

    // Wait for initial load
    await new Promise(resolve => setTimeout(resolve, 0))

    expect((wrapper.vm as any).hasNextPage).toBe(true)

    // Load more
    await (wrapper.vm as any).loadMore()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(pokemonService.getPokemonPaginated).toHaveBeenCalledTimes(2)
    expect(pokemonService.getPokemonPaginated).toHaveBeenNthCalledWith(2, 2, 10)
    
    // Should have both pages of data
    expect((wrapper.vm as any).displayedPokemon).toHaveLength(2)
    expect((wrapper.vm as any).hasNextPage).toBe(false)
  })
})
