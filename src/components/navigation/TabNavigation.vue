<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";
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
  <article
    class="w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-5 py-3 "
  >
    <div class="flex items-center justify-center space-x-2 max-w-4xl mx-auto md:px-3">
      <PrimaryButton
        @click="navigateToHome"
        :variant="isOnFavorites ? 'secondary' : 'primary'"
        full
      >
        <template #icon>
          <img
            src="/assets/icons/pokemon-menu-icon.svg"
            alt="Pokemon Menu Icon"
            class="w-4 h-4"
          />
        </template>
        <template #text>All</template>
      </PrimaryButton>
      <PrimaryButton
        @click="navigateToFavorites"
        :variant="!isOnFavorites ? 'secondary' : 'primary'"
        full
      >
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
  </article>
</template>
