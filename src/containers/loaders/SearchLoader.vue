<script lang="ts">
export default {
  name: 'SearchLoader'
}
</script>

<template>
  <div class="w-full flex flex-col justify-center items-center py-10">
    <img 
      src="/assets/icons/pokemon-loader.svg" 
      alt="Loading..." 
      class="pokeball-animation mb-4"
    />
    <div class="text-gray-600 text-lg font-medium">
      Searching<span class="dots-animation"></span>
    </div>
  </div>
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

.dots-animation::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}
</style>
