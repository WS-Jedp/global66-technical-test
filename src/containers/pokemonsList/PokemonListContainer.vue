<script setup>
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { ref } from "vue";
import PokemonSimpleCard from "../../components/pokemons/PokemonSimpleCard.vue";
import PokemonDetailModal from "../modals/pokemon/PokemonDetailModal.vue";
import PrimaryButton from "../../components/buttons/PrimaryButton.vue";
import SearchLoader from "../loaders/SearchLoader.vue";

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
  hasNextPage: {
    type: Boolean,
    default: false,
  },
  isFetchingNextPage: {
    type: Boolean,
    default: false,
  },
  isFavoritesPage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["load-more"]);

const isLoadingMore = ref(false);
const isModalOpen = ref(false);
const selectedPokemon = ref(null);

const handleScrollEnd = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  emit("load-more");

  // Reset after a short delay to prevent multiple calls
  setTimeout(() => {
    isLoadingMore.value = false;
  }, 1000);
};

const handlePokemonClick = (pokemon) => {
  selectedPokemon.value = pokemon;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPokemon.value = null;
};

const handleSearchAgain = () => {
  // Reset search state
  emit("reset-search");
};
</script>

<template>
  <!-- Loading State -->
  <SearchLoader v-if="isLoading" />

  <!-- Error State -->
  <div v-else-if="error" class="text-center py-10 text-red-500">
    <p>Error occurred while searching. Please try again.</p>
  </div>

  <!-- No Results State -->
  <div v-else-if="showNoResults" class="text-center py-10 text-gray-500">
    <!-- Favorites Page No Results -->
    <template v-if="isFavoritesPage">
      <h2 class="text-4xl text-poke-black font-bold mb-4">No Favorites Yet!</h2>
      <p class="text-lg">You haven't added any Pokemon to your favorites.</p>
      <p class="text-sm text-gray-400 mt-2">
        Start exploring and add some Pokemon to see them here!
      </p>
    </template>

    <!-- Search No Results -->
    <template v-else>
      <h2 class="text-4xl text-poke-black font-bold mb-4">Uh-Oh!</h2>
      <p class="text-lg">You look lost on your journey!</p>
      <PrimaryButton @click="handleSearchAgain" class="mx-auto mt-3">
        <template #text> Go Back Home </template>
      </PrimaryButton>
    </template>
  </div>

  <!-- Virtual Scrolling Pokemon Grid -->
  <div
    v-else-if="displayedPokemon.length > 0"
    class="flex flex-col h-full relative"
  >
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
          <PokemonSimpleCard
            :pokemon="item"
            @click="() => handlePokemonClick(item)"
          />
        </div>
      </RecycleScroller>

      <!-- Top gradient overlay -->
      <div
        class="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-poke-white to-transparent pointer-events-none z-10"
      ></div>

      <!-- Bottom gradient overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-poke-white to-transparent pointer-events-none z-10"
      ></div>
    </div>

    <!-- Loading more indicator -->
    <div
      v-if="isFetchingNextPage"
      class="text-center py-4 text-gray-500 bg-gray-50"
    >
      Loading more Pokemon...
    </div>
  </div>

  <!-- Pokemon Detail Modal -->
  <PokemonDetailModal
    :is-open="isModalOpen"
    :pokemon="selectedPokemon"
    @close="closeModal"
  />
</template>
