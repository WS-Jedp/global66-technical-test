<script setup>
import { ref } from "vue";
import TextInput from "../forms/inputs/TextInput.vue";
import ScreenLoader from "../containers/loaders/ScreenLoader.vue";
import PokemonListContainer from "../containers/pokemonsList/PokemonListContainer.vue";
import { useFavorites } from "../composables/useFavorites";
import TabNavigation from "../components/navigation/TabNavigation.vue";

// Reactive state
const searchQuery = ref("");

// Favorites data with search integration
const { displayedPokemon, isLoading, error, hasSearched, showNoResults } =
  useFavorites(searchQuery);
</script>

<template>
  <!-- Main Content -->
  <div class="mx-auto h-screen flex flex-col">
    <!-- Search Input -->
    <div class="w-full max-w-4xl mx-auto flex-shrink-0 p-4">
      <TextInput v-model="searchQuery" placeholder="Search favorite Pokemon..." />
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
      />
    </div>

    <!-- Navigation Tabs -->
    <TabNavigation />
  </div>
</template>
