<script setup>
import { useRouter } from "vue-router";
import PrimaryButton from "../buttons/PrimaryButton.vue";
import SecondaryButton from "../buttons/SecondaryButton.vue";
const router = useRouter();

const navigateToHome = () => {
  router.push({ name: "home" });
};

const navigateToFavorites = () => {
  router.push({ name: "favorites" });
};

const emit = defineEmits(["navigate-home", "navigate-favorites"]);
</script>
<template>
  <!-- Navigation Tabs -->
  <div
    class="fixed bottom-0 left-0 w-full flex items-center justify-center bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-5 py-3 space-x-2"
  >
    <PrimaryButton @click="navigateToHome">
      <template #icon>
        <img
          src="/assets/icons/pokemon-menu-icon.svg"
          alt="Pokemon Menu Icon"
          class="w-4 h-4"
        />
      </template>
      <template #text>All</template>
    </PrimaryButton>
    <SecondaryButton @click="navigateToHome">
      <template #icon>
        <img
          src="/assets/icons/pokemon-star-icon.svg"
          alt="Pokemon Menu Icon"
          class="w-4 h-4"
        />
      </template>
      <template #text>Favorites</template>
    </SecondaryButton>
  </div>
</template>
