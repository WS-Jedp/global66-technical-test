<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { ref } from 'vue'

defineProps({
  displayedPokemon: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Object, null],
    default: null
  },
  showNoResults: {
    type: Boolean,
    default: false
  },
  activeTab: {
    type: String,
    default: 'all'
  },
  hasSearched: {
    type: Boolean,
    default: false
  },
  useVirtualScrolling: {
    type: Boolean,
    default: false
  },
  hasNextPage: {
    type: Boolean,
    default: false
  },
  isFetchingNextPage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-favorite', 'is-favorite', 'load-more'])

const isLoadingMore = ref(false)

const toggleFavorite = (pokemon) => {
  emit('toggle-favorite', pokemon)
}

const isFavorite = (name) => {
  return emit('is-favorite', name)
}

const handleScrollEnd = async () => {
  if (isLoadingMore.value) return
  
  isLoadingMore.value = true
  emit('load-more')
  
  // Reset after a short delay to prevent multiple calls
  setTimeout(() => {
    isLoadingMore.value = false
  }, 1000)
}
</script>

<template>
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
  
  <!-- Virtual Scrolling Pokemon Grid -->
  <div v-else-if="useVirtualScrolling && displayedPokemon.length > 0" class="flex flex-col h-full">
    <RecycleScroller
      class="scroller flex-1"
      :items="displayedPokemon"
      :item-size="240"
      key-field="name"
      v-slot="{ item }"
      @scroll-end="handleScrollEnd"
    >
      <div class="p-2">
        <div
          class="bg-white border border-gray-300 rounded-xl p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
        >
          <img 
            :src="item.sprite" 
            :alt="item.name" 
            class="w-24 h-24 object-contain mx-auto"
            loading="lazy"
          />
          <h3 class="mt-2 mb-0 capitalize text-gray-700">{{ item.name }}</h3>
          <button
            @click="toggleFavorite(item)"
            :class="[
              'absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer p-1 rounded-full',
              'transition-transform duration-200 hover:scale-110'
            ]"
            :aria-label="isFavorite(item.name) ? 'Remove from favorites' : 'Add to favorites'"
          >
            {{ isFavorite(item.name) ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>
    </RecycleScroller>
    
    <!-- Loading more indicator -->
    <div v-if="isFetchingNextPage" class="text-center py-4 text-gray-500 bg-gray-50">
      Loading more Pokemon...
    </div>
  </div>
  
  <!-- Regular Pokemon Grid -->
  <div 
    v-else-if="displayedPokemon.length > 0" 
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto h-full"
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
</template>

<style scoped>
.scroller {
  height: 100%;
  min-height: 0;
}
</style>