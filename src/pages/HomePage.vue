<script setup>
import { ref, computed } from 'vue'
import TextInput from '../forms/inputs/TextInput.vue'
import { usePokemonWithFavorites } from '../composables/usePokemon'
import { useFavoritesStore } from '../store/favorites'

// Reactive state
const searchQuery = ref('')
const activeTab = ref('all')

// Store
const favoritesStore = useFavoritesStore()

// Pokemon data with Vue Query
const {
  displayedPokemon,
  isLoading,
  error,
  hasSearched,
  showNoResults
} = usePokemonWithFavorites(
  searchQuery,
  activeTab,
  computed(() => favoritesStore.favorites)
)

// Favorite management
const toggleFavorite = (pokemon) => {
  favoritesStore.toggle(pokemon)
}

const isFavorite = (name) => {
  return favoritesStore.isFavorite(name)
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 min-h-screen flex flex-col bg-poke-light-gray-100">
    <!-- Search Input -->
    <TextInput
    v-model="searchQuery"
    placeholder="Search Pokemon..."
    />

    <!-- Pokemon List -->
    <div class="flex-1 mb-5">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-10 text-lg text-gray-500">
        Searching...
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10 text-red-500">
        <p>Error occurred while searching. Please try again.</p>
      </div>
      
      <!-- No Results State -->
      <div v-else-if="showNoResults" class="text-center py-10 text-gray-500">
        <p v-if="activeTab === 'favorites' && !hasSearched">
          No favorite Pokemon yet. Search for Pokemon and add them to your favorites!
        </p>
        <p v-else>
          No Pokemon found. Please try a different search term.
        </p>
      </div>
      
      <!-- Pokemon Grid -->
      <div 
        v-else-if="displayedPokemon.length > 0" 
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="pokemon in displayedPokemon"
          :key="pokemon.name"
          class="bg-white border border-gray-300 rounded-xl p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
        >
          <img 
            :src="pokemon.sprite" 
            :alt="pokemon.name" 
            class="w-24 h-24 object-contain mx-auto"
            loading="lazy"
          />
          <h3 class="mt-2 mb-0 capitalize text-gray-700">{{ pokemon.name }}</h3>
          <button
            @click="toggleFavorite(pokemon)"
            :class="[
              'absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer p-1 rounded-full',
              'transition-transform duration-200 hover:scale-110'
            ]"
            :aria-label="isFavorite(pokemon.name) ? 'Remove from favorites' : 'Add to favorites'"
          >
            {{ isFavorite(pokemon.name) ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex bg-gray-100 rounded-lg p-1 gap-1">
      <button
        @click="activeTab = 'all'"
        :class="[
          'flex-1 py-3 px-4 border-none rounded-md font-medium cursor-pointer transition-all duration-200',
          activeTab === 'all' 
            ? 'bg-white text-indigo-600 shadow-sm' 
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        All
      </button>
      <button
        @click="activeTab = 'favorites'"
        :class="[
          'flex-1 py-3 px-4 border-none rounded-md font-medium cursor-pointer transition-all duration-200',
          activeTab === 'favorites' 
            ? 'bg-white text-indigo-600 shadow-sm' 
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        Favorites ({{ favoritesStore.favoriteCount }})
      </button>
    </div>
  </div>
</template>

