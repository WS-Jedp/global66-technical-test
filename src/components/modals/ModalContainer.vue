<script>
export default {
  name: "ModalContainer",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  beforeUnmount() {
    document.body.style.overflow = "";
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg"
      @click.stop
    >
      <slot></slot>
    </div>
  </div>
</template>
