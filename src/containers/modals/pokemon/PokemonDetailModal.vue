<script setup>
import { computed, ref } from "vue";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import ModalContainer from "../../../components/modals/ModalContainer.vue";
import SimpleToast from "../../../components/toast/SimpleToast.vue";
import { useFavoritesStore } from "../../../store/favorites";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  pokemon: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "add-to-favorites", "share"]);

const closeModal = () => {
  emit("close");
};

const addToFavorites = () => {
  emit("add-to-favorites", props.pokemon);
};

const showToast = ref(false);
const toastMessage = ref("");

const shareWithFriends = async () => {
  if (props.pokemon) {
    const pokemonData = `Name: ${props.pokemon.name}, Weight: ${props.pokemon.weight}, Height: ${props.pokemon.height}, Types: ${props.pokemon.types.join(', ')}`;

    try {
      await navigator.clipboard.writeText(pokemonData);
      showSuccessToast("Pokemon data copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = pokemonData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showSuccessToast("Pokemon data copied to clipboard!");
    }
  }
};

const showSuccessToast = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => {
  return props.pokemon ? favoritesStore.isFavorite(props.pokemon.name) : false;
});

const toggleFavorite = () => {
  if (props.pokemon) {
    favoritesStore.toggle(props.pokemon.name);
  }
};
</script>

<template>
  <ModalContainer :is-open="isOpen" @close="closeModal">
    <div v-if="pokemon" class="min-w-full max-w-4xl rounded-sm overflow-hidden">
      <!-- Banner with Pokemon Image -->
      <div
        class="relative bg-gradient-to-br from-blue-400 to-purple-500 h-48 flex items-center justify-center"
        style="
          background-image: url('/global66-technical-test/assets/images/pokemon-bg-image.png');
          background-repeat: no-repeat;
          background-size: cover;
        "
      >
        <img
          :src="pokemon.sprite || pokemon.sprites?.front_default"
          :alt="pokemon.name"
          class="w-[180px] h-[180px] object-contain"
        />

        <button>
          <img
            src="/assets/icons/pokemon-close-icon.svg"
            alt="Close Icon"
            class="absolute top-4 right-4 w-8 h-8 cursor-pointer"
            @click="closeModal"
          />
        </button>
      </div>

      <!-- Pokemon Details -->
      <div class="p-6 space-y-1">
        <ul class="flex flex-col items-start justify-start space-y-3">
          <!-- Name -->
          <li
            class="text-lg flex flex-row flex-nowrap items-center w-full py-1 border-b border-poke-light-gray"
          >
            <p class="text-poke-black font-semibold mr-1">Name:</p>
            <p class="font-medium text-poke-black-200 capitalize">{{ pokemon.name }}</p>
          </li>

          <!-- Weight -->
          <li
            class="text-lg flex flex-row flex-nowrap items-center w-full py-1 border-b border-poke-light-gray"
          >
            <p class="text-poke-black font-semibold mr-1">Weight:</p>
            <p class="font-medium text-poke-black-200">{{ pokemon.weight }}</p>
          </li>

          <!-- Height -->
          <li
            class="text-lg flex flex-row flex-nowrap items-center w-full py-1 border-b border-poke-light-gray"
          >
            <p class="text-poke-black font-semibold mr-1">Height:</p>
            <p class="font-medium text-poke-black-200">{{ pokemon.height }}</p>
          </li>

          <!-- Types -->
          <li
            class="text-lg flex flex-row flex-nowrap items-center w-full py-1 border-b border-poke-light-gray"
          >
            <p class="text-poke-black font-semibold mr-1">Types:</p>
            <span class="font-medium text-poke-black-200 capitalize">
              {{ pokemon.types.join(", ") }}
            </span>
          </li>
        </ul>

        <!-- Action Buttons -->
        <div
          class="flex flex-row flex-nowrap items-center justify-between mt-3"
        >
          <PrimaryButton @click="shareWithFriends" variant="primary">
            <template #text> Share To My Friends </template>
          </PrimaryButton>
          <button @click="toggleFavorite" class="cursor-pointer">
            <img
              :src="
                isFavorite
                  ? '/global66-technical-test/assets/icons/pokemon-fav-active.svg'
                  : '/global66-technical-test/assets/icons/pokemon-fav-disabled.svg'
              "
              alt="Favorite Icon"
              class="w-12"
            />
          </button>
        </div>
      </div>
    </div>
  </ModalContainer>

  <!-- Toast Notification -->
  <SimpleToast :is-visible="showToast" :message="toastMessage" />
</template>
