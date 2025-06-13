<script lang="ts">
// Define component options separately
export default {
  name: 'ScreenLoader'
}
</script>
<template>
  <article class="w-full h-screen flex justify-center items-center z-10">
    <img 
      src="/assets/icons/pokemon-loader.svg" 
      alt="Loading..." 
      class="pokeball-animation"
    />
  </article>
</template>

<style scoped>
.pokeball-animation {
  animation: pokeball-struggle 1.5s ease-in-out infinite;
  transform-origin: center bottom;
}

/* Imitate Pokeball animation when is struggling to catch a Pokemon ;) */
@keyframes pokeball-struggle {
  0%, 100% {
    transform: rotate(0deg) translateY(0px);
  }
  10% {
    transform: rotate(-15deg) translateY(-8px);
  }
  20% {
    transform: rotate(12deg) translateY(-4px);
  }
  30% {
    transform: rotate(-8deg) translateY(-6px);
  }
  40% {
    transform: rotate(5deg) translateY(-2px);
  }
  50% {
    transform: rotate(-3deg) translateY(-4px);
  }
  60% {
    transform: rotate(2deg) translateY(-1px);
  }
  70% {
    transform: rotate(-1deg) translateY(-2px);
  }
  80% {
    transform: rotate(1deg) translateY(-1px);
  }
  90% {
    transform: rotate(0deg) translateY(0px);
  }
}
</style>
