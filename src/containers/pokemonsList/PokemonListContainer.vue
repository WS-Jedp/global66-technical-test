<script setup>
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { ref } from "vue";
import PokemonSimpleCard from "../../components/pokemons/PokemonSimpleCard.vue";

defineProps({
  displayedPokemon: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Object, null],
    default: null,
  },
  showNoResults: {
    type: Boolean,
    default: false,
  },
  hasSearched: {
    type: Boolean,
    default: false,
  },
  useVirtualScrolling: {
    type: Boolean,
    default: false,
  },
  hasNextPage: {
    type: Boolean,
    default: false,
  },
  isFetchingNextPage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["load-more"]);

const isLoadingMore = ref(false);

const handleScrollEnd = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  emit("load-more");

  // Reset after a short delay to prevent multiple calls
  setTimeout(() => {
    isLoadingMore.value = false;
  }, 1000);
};
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
    <p v-if="!hasSearched">
      No favorite Pokemon yet. Search for Pokemon and add them to your
      favorites!
    </p>
    <p v-else>No Pokemon found. Please try a different search term.</p>
  </div>

  <!-- Virtual Scrolling Pokemon Grid -->
  <div v-else-if="displayedPokemon.length > 0" class="flex flex-col h-full relative">
    <div class="relative overflow-hidden flex-1">
      <RecycleScroller
        class="h-full min-h-0"
        :items="displayedPokemon"
        :item-size="72"
        key-field="name"
        v-slot="{ item }"
        @scroll-end="handleScrollEnd"
      >
        <div class="p-2">
          <PokemonSimpleCard :pokemon="item" />
        </div>
      </RecycleScroller>
      
      <!-- Top gradient overlay -->
      <div class="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-poke-white to-transparent pointer-events-none z-10"></div>
      
      <!-- Bottom gradient overlay -->
      <div class="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-poke-white to-transparent pointer-events-none z-10"></div>
    </div>

    <!-- Loading more indicator -->
    <div
      v-if="isFetchingNextPage"
      class="text-center py-4 text-gray-500 bg-gray-50"
    >
      Loading more Pokemon...
    </div>
  </div>
</template>

