import { defineStore } from 'pinia'
import type { SimplePokemon } from '../types/pokemon'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as SimplePokemon[],
  }),
  getters: {
    isFavorite: (state) => (name: string) => {
      return state.favorites.some(p => p.name === name)
    },
    favoriteCount: (state) => state.favorites.length
  },
  actions: {
    toggle(pokemon: SimplePokemon) {
      const index = this.favorites.findIndex(p => p.name === pokemon.name)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(pokemon)
      }
    },
    add(pokemon: SimplePokemon) {
      if (!this.isFavorite(pokemon.name)) {
        this.favorites.push(pokemon)
      }
    },
    remove(name: string) {
      this.favorites = this.favorites.filter(p => p.name !== name)
    },
    clear() {
      this.favorites = []
    }
  },
  persist: {
    key: 'pokemon-favorites',
    storage: localStorage
  }
})
