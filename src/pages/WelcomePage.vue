<script setup>
import { useRouter } from "vue-router";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";

const router = useRouter();
const navigateToHome = () => {
  router.push({ name: "Home" });
};
</script>

<template>
  <section class="relative w-full h-screen flex justify-center">
    <div
      class="relative flex flex-col w-full px-6 h-[80%] my-auto items-center justify-around text-black"
    >
      <figure class="relative flex items-center justify-center">
        <div
          class="absolute bottom-3 mx-auto bg-poke-red border-3 border-poke-black rounded-full w-[210px] h-[210px] p-0 overflow-hidden"
        ></div>
        <img
          src="/assets/images/pokemon-welcome.png"
          alt="Pokemon Welcome"
          class="relative z-10 ml-[21px] mb-[1.5px]"
        />
      </figure>
      <h1 class="text-2xl font-bold mb-4">Welcome to the Pokédex</h1>
      <p class="text-md text-poke-black text-center max-w-sm">
        The digital encyclopedia created by Professor Oak is an invaluable tool
        to Trainers in the Pokémon world.
      </p>
      <PrimaryButton @click="navigateToHome">
        <template #text>Get Started</template>
      </PrimaryButton>
    </div>
  </section>
</template>
