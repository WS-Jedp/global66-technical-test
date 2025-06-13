<script setup>
import { computed } from "vue";
import { useFavoritesStore } from "../../store/favorites";

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.pokemon.name);
});

const toggleFavorite = () => {
  favoritesStore.toggle(props.pokemon.name);
};

const handleCardClick = () => {
  emit("click", props.pokemon);
};
</script>

<template>
  <div
    class="relative flex flex-row items-center justify-between bg-white border border-gray-300 rounded-xl h-14 px-4 py-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    @click="handleCardClick"
  >
    <h3 class="capitalize text-poke-black text-lg">{{ pokemon.name }}</h3>
    <button
      @click.stop="toggleFavorite"
      :class="[
        'bg-transparent border-none text-xl cursor-pointer rounded-full',
        'transition-transform duration-200 hover:scale-110',
      ]"
      :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
    >
      <img
        width="36px"
        src="/assets/icons/pokemon-fav-active.svg"
        alt="Fav Icon Active"
        v-if="isFavorite"
      />
      <img
        width="36px"
        src="/assets/icons/pokemon-fav-disabled.svg"
        alt="Fav Icon Inactive"
        v-else
      />
    </button>
  </div>
</template>
