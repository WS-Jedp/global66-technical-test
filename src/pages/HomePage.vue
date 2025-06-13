<script setup>
import { ref, computed, onMounted } from "vue";
import TextInput from "../forms/inputs/TextInput.vue";
import ScreenLoader from "../containers/loaders/ScreenLoader.vue";
import PokemonListContainer from "../containers/pokemonsList/PokemonListContainer.vue";
import { useHomePokemon } from "../composables/useHomePokemon";
import { usePokemonPagination } from "../composables/usePokemonPagination";
import { useInitialPokemon } from "../composables/useInitialPokemon";
import TabNavigation from "../components/navigation/TabNavigation.vue";

const searchQuery = ref("");

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
  useHomePokemon(searchQuery, paginatedPokemon);

// Load more handler
const handleLoadMore = () => {
  if (!hasSearched.value) {
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
  <section
    v-else
    class="mx-auto h-screen flex flex-col"
  >
    <!-- Search Input -->
    <div class="w-full max-w-4xl mx-auto flex-shrink-0 p-4">
      <TextInput v-model="searchQuery" placeholder="Search Pokemon..." />
    </div>

    <!-- Pokemon List - Takes remaining height -->
    <div class="w-full max-w-4xl mx-auto flex-1 mb-4 min-h-0 px-3">
      <PokemonListContainer
        :displayed-pokemon="displayedPokemon"
        :is-loading="isLoading || isPaginationLoading"
        :error="error || paginationError"
        :show-no-results="showNoResults"
        :has-searched="hasSearched"
        :has-next-page="hasNextPage"
        :is-fetching-next-page="isFetchingNextPage"
        @load-more="handleLoadMore"
        @reset-search="searchQuery = ''"
      />
    </div>

    <!-- Navigation Tabs -->
    <TabNavigation v-if="!showNoResults" />
  </section>
</template>
