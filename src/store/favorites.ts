import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteIds: [] as string[], // Store only IDs/names
  }),
  getters: {
    isFavorite: (state) => (name: string) => {
      return state.favoriteIds.includes(name)
    },
    favoriteCount: (state) => state.favoriteIds.length,
    favoriteNames: (state) => state.favoriteIds
  },
  actions: {
    toggle(pokemonName: string) {
      const index = this.favoriteIds.findIndex(name => name === pokemonName)
      if (index > -1) {
        this.favoriteIds.splice(index, 1)
      } else {
        this.favoriteIds.push(pokemonName)
      }
    },
    add(pokemonName: string) {
      if (!this.isFavorite(pokemonName)) {
        this.favoriteIds.push(pokemonName)
      }
    },
    remove(name: string) {
      this.favoriteIds = this.favoriteIds.filter(id => id !== name)
    },
    clear() {
      this.favoriteIds = []
    }
  },
  persist: {
    key: 'pokemon-favorite-ids',
    storage: localStorage
  }
})
