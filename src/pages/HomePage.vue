<script setup>
import { ref, computed } from "vue";
import TextInput from "../forms/inputs/TextInput.vue";
import ScreenLoader from "../containers/loaders/ScreenLoader.vue";
import PokemonListContainer from "../containers/pokemonsList/PokemonListContainer.vue";
import { usePokemonWithFavorites } from "../composables/usePokemon";
import { usePokemonPagination } from "../composables/usePokemonPagination";
import { useInitialPokemon } from "../composables/useInitialPokemon";
import { useFavoritesStore } from "../store/favorites";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import SecondaryButton from "../components/buttons/SecondaryButton.vue";
import TabNavigation from "../components/navigation/TabNavigation.vue";

// Reactive state
const searchQuery = ref("");
const activeTab = ref("all");

// Store
const favoritesStore = useFavoritesStore();

// Initial Pokemon loading for the first batch
const { isInitialLoading, initialLoadError } = useInitialPokemon();

// Pagination for all Pokemon (when no search)
const {
  allPokemon: paginatedPokemon,
  loadMore,
  hasNextPage,
  isFetchingNextPage,
  isLoading: isPaginationLoading,
  error: paginationError,
} = usePokemonPagination(10);

// Pokemon data with search integration
const { displayedPokemon, isLoading, error, hasSearched, showNoResults } =
  usePokemonWithFavorites(
    searchQuery,
    activeTab,
    computed(() => favoritesStore.favorites),
    paginatedPokemon
  );

// Determine if we should use virtual scrolling (when no search and showing all)
const useVirtualScrolling = computed(() => {
  return !hasSearched.value && activeTab.value === "all";
});

// Favorite management
const toggleFavorite = (pokemon) => {
  favoritesStore.toggle(pokemon);
};

const isFavorite = (name) => {
  return favoritesStore.isFavorite(name);
};

const handleLoadMore = () => {
  if (!hasSearched.value && activeTab.value === "all") {
    loadMore();
  }
};
</script>

<template>
  <!-- Screen Loader for initial load -->
  <ScreenLoader v-if="isInitialLoading" />

  <!-- Initial Load Error -->
  <div
    v-else-if="initialLoadError"
    class="max-w-4xl mx-auto p-4 min-h-screen flex flex-col justify-center items-center bg-poke-light-gray-100"
  >
    <div class="text-center py-10 text-red-500">
      <p>Failed to load Pokemon data. Please refresh the page.</p>
      <button
        @click="window.location.reload()"
        class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Refresh Page
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div
    v-else
    class="max-w-4xl mx-auto p-4 h-screen flex flex-col bg-poke-light-gray-100"
  >
    <!-- Search Input -->
    <div class="flex-shrink-0 mb-4">
      <TextInput v-model="searchQuery" placeholder="Search Pokemon..." />
    </div>

    <!-- Pokemon List - Takes remaining height -->
    <div class="flex-1 mb-4 min-h-0">
      <PokemonListContainer
        :displayed-pokemon="displayedPokemon"
        :is-loading="isLoading || isPaginationLoading"
        :error="error || paginationError"
        :show-no-results="showNoResults"
        :active-tab="activeTab"
        :has-searched="hasSearched"
        :use-virtual-scrolling="useVirtualScrolling"
        :has-next-page="hasNextPage"
        :is-fetching-next-page="isFetchingNextPage"
        @toggle-favorite="toggleFavorite"
        @is-favorite="isFavorite"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- Navigation Tabs -->
    <TabNavigation />
  </div>
</template>
