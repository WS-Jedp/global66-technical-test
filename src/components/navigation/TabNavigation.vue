<script setup>
import { useRouter } from "vue-router";
import { computed } from 'vue'
import PrimaryButton from "../buttons/PrimaryButton.vue";
const router = useRouter();

const navigateToHome = () => {
  router.push({ name: "Home" });
};

const navigateToFavorites = () => {
  router.push({ name: "Favorites" });
};

const isOnFavorites = computed(() => {
  return router.currentRoute.value.name === "Favorites";
});

const emit = defineEmits(["navigate-home", "navigate-favorites"]);
</script>
<template>
  <!-- Navigation Tabs -->
  <div
    class=" w-full flex items-center justify-center bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-5 py-3 space-x-2"
  >
    <PrimaryButton @click="navigateToHome" :variant="isOnFavorites ? 'secondary' : 'primary'">
      <template #icon>
        <img
          src="/assets/icons/pokemon-menu-icon.svg"
          alt="Pokemon Menu Icon"
          class="w-4 h-4"
        />
      </template>
      <template #text>All</template>
    </PrimaryButton>
    <PrimaryButton @click="navigateToFavorites" :variant="!isOnFavorites ? 'secondary' : 'primary'">
      <template #icon>
        <img
          src="/assets/icons/pokemon-star-icon.svg"
          alt="Pokemon Menu Icon"
          class="w-4 h-4"
        />
      </template>
      <template #text>Favorites</template>
    </PrimaryButton>
  </div>
</template>
