<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    class="min-w-[150px] h-10 bg-poke-black-100 text-white flex items-center justify-center gap-2 rounded-full cursor-pointer hover:bg-poke-red/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-poke-red"
  >
    <slot name="icon"></slot>
    <p class="text-md font-semibold">
      <slot name="text"></slot>
    </p>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};
</script>
