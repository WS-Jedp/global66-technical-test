<script setup>
import { ref, toRef } from "vue";
import TextInput from "../forms/inputs/TextInput.vue";
import ScreenLoader from "../containers/loaders/ScreenLoader.vue";
import PokemonListContainer from "../containers/pokemonsList/PokemonListContainer.vue";
import { useFavorites } from "../composables/useFavorites";
import TabNavigation from "../components/navigation/TabNavigation.vue";
import { useSearchStore } from "../store/useSearchStore";

// Search store
const searchStore = useSearchStore();

// Favorites data with search integration - use toRef to ensure reactivity
const searchQueryRef = toRef(searchStore, 'searchQuery');
const { displayedPokemon, isLoading, error, hasSearched, showNoResults } =
  useFavorites(searchQueryRef);
</script>

<template>
  <!-- Main Content -->
  <div class="mx-auto h-screen flex flex-col">
    <!-- Search Input -->
    <div class="w-full max-w-4xl mx-auto flex-shrink-0 p-4">
      <TextInput v-model="searchStore.searchQuery" placeholder="Search favorite Pokemon..." />
    </div>

    <!-- Pokemon List - Takes remaining height -->
    <div class="w-full max-w-4xl mx-auto flex-1 mb-4 min-h-0 px-3">
      <PokemonListContainer
        :displayed-pokemon="displayedPokemon"
        :is-loading="isLoading"
        :error="error"
        :show-no-results="showNoResults"
        :has-searched="hasSearched"
        :has-next-page="false"
        :is-fetching-next-page="false"
        @reset-search="searchStore.clearSearch()"
        :is-favorites-page="true"
      />
    </div>

    <!-- Navigation Tabs -->
    <TabNavigation />
  </div>
</template>
