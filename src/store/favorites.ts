import { defineStore } from 'pinia'
import type { Pokemon } from '../types/pokemon'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as Pokemon[],
  }),
  actions: {
    toggle(pokemon: Pokemon) {
      const exists = this.favorites.find(p => p.name === pokemon.name)
      if (exists) {
        this.favorites = this.favorites.filter(p => p.name !== pokemon.name)
      } else {
        this.favorites.push(pokemon)
      }
    },
    isFavorite(name: string) {
      return this.favorites.some(p => p.name === name)
    }
  },
})
