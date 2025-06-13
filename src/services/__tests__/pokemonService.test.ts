import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PokemonService } from '../../services/pokemonService'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PokemonService', () => {
  let pokemonService: PokemonService

  beforeEach(() => {
    pokemonService = new PokemonService()
    vi.clearAllMocks()
  })

  const mockPokemonApiResponse = {
    id: 1,
    name: 'pikachu',
    height: 4,
    weight: 60,
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-artwork.png'
        }
      }
    },
    types: [
      { type: { name: 'electric' } }
    ]
  }

  const mockPokemonListResponse = {
    count: 1000,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' }
    ]
  }

  describe('searchPokemonByName', () => {
    it('returns simplified pokemon data for exact name match', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonApiResponse)
      })

      const result = await pokemonService.searchPokemonByName('pikachu')

      expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
      expect(result).toEqual({
        id: 1,
        name: 'pikachu',
        sprite: 'https://example.com/pikachu-artwork.png',
        weight: 60,
        height: 4,
        types: ['electric']
      })
    })

    it('returns null when pokemon is not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await pokemonService.searchPokemonByName('invalidpokemon')

      expect(result).toBeNull()
    })

    it('handles fetch errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await pokemonService.searchPokemonByName('pikachu')

      expect(result).toBeNull()
    })
  })

  describe('searchPokemonByPartialName', () => {
    it('returns filtered pokemon list for partial name match', async () => {
      // Mock the initial list call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'pikablu', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' }
          ]
        })
      })

      // Mock the detailed pokemon calls
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, name: 'pikachu' })
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, id: 2, name: 'pikablu' })
      })

      const result = await pokemonService.searchPokemonByPartialName('pika')

      expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=1000')
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('pikachu')
      expect(result[1].name).toBe('pikablu')
    })

    it('returns empty array when no matches found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' }
          ]
        })
      })

      const result = await pokemonService.searchPokemonByPartialName('xyz')

      expect(result).toEqual([])
    })
  })

  describe('getAllPokemon', () => {
    it('returns paginated pokemon data', async () => {
      // Mock the list call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonListResponse)
      })

      // Mock the detailed pokemon calls
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, name: 'pikachu' })
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, id: 6, name: 'charizard' })
      })

      const result = await pokemonService.getAllPokemon(2, 0)

      expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=2&offset=0')
      expect(result.pokemon).toHaveLength(2)
      expect(result.hasMore).toBe(true)
      expect(result.total).toBe(1000)
    })

    it('handles API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'))

      const result = await pokemonService.getAllPokemon()

      expect(result).toEqual({
        pokemon: [],
        hasMore: false,
        total: 0
      })
    })
  })

  describe('getFavoritePokemon', () => {
    it('returns pokemon data for favorite names', async () => {
      const favoriteNames = ['pikachu', 'charizard']

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, name: 'pikachu' })
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, id: 6, name: 'charizard' })
      })

      const result = await pokemonService.getFavoritePokemon(favoriteNames)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('pikachu')
      expect(result[1].name).toBe('charizard')
    })

    it('returns empty array for empty favorites list', async () => {
      const result = await pokemonService.getFavoritePokemon([])

      expect(result).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('filters out failed requests', async () => {
      const favoriteNames = ['pikachu', 'invalidpokemon']

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockPokemonApiResponse, name: 'pikachu' })
      })
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await pokemonService.getFavoritePokemon(favoriteNames)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })
  })

  describe('searchPokemon', () => {
    it('returns exact match when found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonApiResponse)
      })

      const result = await pokemonService.searchPokemon('pikachu')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })

    it('falls back to partial search when exact match fails', async () => {
      // Mock exact search failure
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      // Mock partial search success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
          ]
        })
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonApiResponse)
      })

      const result = await pokemonService.searchPokemon('pika')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })
  })
})
