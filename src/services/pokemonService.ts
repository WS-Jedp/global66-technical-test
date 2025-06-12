import type { Pokemon } from '../types/pokemon'

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    name: string
    url: string
  }>
}

interface SimplePokemon {
  name: string
  sprite: string
  id: number
}

export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2'

  /**
   * Search for a single Pokemon by exact name or ID
   */
  async searchPokemonByName(query: string): Promise<SimplePokemon | null> {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${query.toLowerCase()}`)
      
      if (!response.ok) {
        return null
      }

      const data: Pokemon = await response.json()
      return this.transformPokemonData(data)
    } catch (error) {
      console.error('Error searching Pokemon by name:', error)
      return null
    }
  }

  /**
   * Search for Pokemon by partial name match
   */
  async searchPokemonByPartialName(query: string, limit: number = 10): Promise<SimplePokemon[]> {
    try {
      // First, get the list of all Pokemon names
      const listResponse = await fetch(`${this.baseUrl}/pokemon?limit=1000`)
      
      if (!listResponse.ok) {
        throw new Error('Failed to fetch Pokemon list')
      }

      const listData: PokemonListResponse = await listResponse.json()
      
      // Filter by partial name match
      const matches = listData.results
        .filter(pokemon => pokemon.name.includes(query.toLowerCase()))
        .slice(0, limit)

      if (matches.length === 0) {
        return []
      }

      // Fetch detailed data for each match
      const pokemonDetails = await Promise.all(
        matches.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url)
          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch details for ${pokemon.name}`)
          }
          const detail: Pokemon = await detailResponse.json()
          return this.transformPokemonData(detail)
        })
      )

      return pokemonDetails
    } catch (error) {
      console.error('Error searching Pokemon by partial name:', error)
      return []
    }
  }

  /**
   * Get full Pokemon details by name or ID
   */
  async getPokemonDetails(nameOrId: string | number): Promise<Pokemon | null> {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${nameOrId}`)
      
      if (!response.ok) {
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching Pokemon details:', error)
      return null
    }
  }

  /**
   * Transform Pokemon API data to simplified format
   */
  private transformPokemonData(pokemon: Pokemon): SimplePokemon {
    return {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default || 'https://via.placeholder.com/96?text=No+Image',
      id: pokemon.id
    }
  }

  /**
   * Combined search that tries exact match first, then partial match
   */
  async searchPokemon(query: string, limit: number = 10): Promise<SimplePokemon[]> {
    // First try exact match
    const exactMatch = await this.searchPokemonByName(query)
    
    if (exactMatch) {
      return [exactMatch]
    }

    // If no exact match, try partial match
    return this.searchPokemonByPartialName(query, limit)
  }

  /**
   * Get Pokemon with pagination support for virtual scrolling
   */
  async getPokemonPaginated(page: number = 1, limit: number = 10): Promise<{
    pokemon: SimplePokemon[]
    hasMore: boolean
    total: number
  }> {
    try {
      const offset = (page - 1) * limit
      const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon list')
      }

      const data: PokemonListResponse = await response.json()

      // Fetch detailed data for each Pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url)
          if (!detailResponse.ok) {
            console.warn(`Failed to fetch details for ${pokemon.name}`)
            return null
          }
          const detail: Pokemon = await detailResponse.json()
          return this.transformPokemonData(detail)
        })
      )

      const validPokemon = pokemonDetails.filter(pokemon => pokemon !== null) as SimplePokemon[]

      return {
        pokemon: validPokemon,
        hasMore: data.next !== null,
        total: data.count
      }
    } catch (error) {
      console.error('Error fetching paginated Pokemon:', error)
      return {
        pokemon: [],
        hasMore: false,
        total: 0
      }
    }
  }

  /**
   * Get all Pokemon with pagination support (updated for initial load)
   */
  async getAllPokemon(limit: number = 20, offset: number = 0): Promise<{
    pokemon: SimplePokemon[]
    hasMore: boolean
    total: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon list')
      }

      const data: PokemonListResponse = await response.json()

      // Fetch detailed data for each Pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url)
          if (!detailResponse.ok) {
            console.warn(`Failed to fetch details for ${pokemon.name}`)
            return null
          }
          const detail: Pokemon = await detailResponse.json()
          return this.transformPokemonData(detail)
        })
      )

      const validPokemon = pokemonDetails.filter(pokemon => pokemon !== null) as SimplePokemon[]

      return {
        pokemon: validPokemon,
        hasMore: data.next !== null,
        total: data.count
      }
    } catch (error) {
      console.error('Error fetching all Pokemon:', error)
      return {
        pokemon: [],
        hasMore: false,
        total: 0
      }
    }
  }
}

// Export singleton instance
export const pokemonService = new PokemonService()
