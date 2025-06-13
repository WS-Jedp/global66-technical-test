<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot name="icon"></slot>
    <p class="text-md font-semibold">
      <slot name="text"></slot>
    </p>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  full?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'primary',
  full: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    props.full ? 'w-full' : 'min-w-[150px]',
    'h-12',
    'text-white',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-full',
    'cursor-pointer',
    'transition-colors',
    'duration-200',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'px-6'
  ]

  const variantClasses = {
    primary: [
      'bg-poke-red',
      'hover:bg-poke-red/70',
      'disabled:hover:bg-poke-red'
    ],
    secondary: [
      'bg-poke-black-100',
      'hover:bg-poke-black-200',
      'disabled:hover:bg-poke-black-200'
    ]
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant]
  ].join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
