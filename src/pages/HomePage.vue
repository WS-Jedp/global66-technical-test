<script setup>
import { toRef } from "vue";
import TextInput from "../forms/inputs/TextInput.vue";
import ScreenLoader from "../containers/loaders/ScreenLoader.vue";
import PokemonListContainer from "../containers/pokemonsList/PokemonListContainer.vue";
import { useHomePage } from "../composables/useHomePage";
import TabNavigation from "../components/navigation/TabNavigation.vue";
import { useSearchStore } from "../store/useSearchStore";

// Search store
const searchStore = useSearchStore();

// Pokemon data with search integration - use toRef to ensure reactivity
const searchQueryRef = toRef(searchStore, 'searchQuery');
const {
  displayedPokemon,
  isInitialLoading,
  isLoading,
  isPaginationLoading,
  initialLoadError,
  error,
  hasSearched,
  showNoResults,
  hasNextPage,
  isFetchingNextPage,
  loadMore
} = useHomePage(searchQueryRef, 10);

// Load more handler
const handleLoadMore = () => {
  if (!hasSearched.value) {
    loadMore();
  }
};

// Refresh page handler
const handleRefreshPage = () => {
  window.location.reload();
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
        @click="handleRefreshPage"
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
      <TextInput v-model="searchStore.searchQuery" placeholder="Search Pokemon..." />
    </div>

    <!-- Pokemon List - Takes remaining height -->
    <div class="w-full max-w-4xl mx-auto flex-1 mb-4 min-h-0 px-3">
      <PokemonListContainer
        :displayed-pokemon="displayedPokemon"
        :is-loading="isLoading || isPaginationLoading"
        :error="error"
        :show-no-results="showNoResults"
        :has-searched="hasSearched"
        :has-next-page="hasNextPage"
        :is-fetching-next-page="isFetchingNextPage"
        @load-more="handleLoadMore"
        @reset-search="searchStore.clearSearch()"
      />
    </div>

    <!-- Navigation Tabs -->
    <TabNavigation v-if="!showNoResults" />
  </section>
</template>
