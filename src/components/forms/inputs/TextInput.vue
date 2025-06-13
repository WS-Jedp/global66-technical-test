<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="relative w-full shadow-md rounded-md bg-poke-white">
    <!-- Search Icon -->
    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <img src="/assets/icons/pokemon-search-icon.svg" alt="Search icon">
    </div>
    
    <!-- Input Field -->
    <input
      v-model="value"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-3 py-3 rounded-lg text-base outline-none transition-colors duration-300 focus:border-indigo-600"
    />
  </div>
</template>
