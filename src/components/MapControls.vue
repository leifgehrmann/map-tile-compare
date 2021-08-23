<template>
  <div class="
    text-white
    flex
    flex-col
    space-y-2
    "
  >
    <div class="
      bg-white dark:bg-gray-600 bg-opacity-50 dark:bg-opacity:70
      backdrop-filter backdrop-blur-xl
      rounded-xl
      text-center
      shadow-lg
      "
    >
      <div class="
        px-4 py-3
        w-12 h-12
        "
      >
        <input
          id="showLabels"
          v-model="mountedShowLabels"
          type="checkbox"
          class="opacity-10"
        >
        <label for="showLabels"></label>
      </div>
      <div
        class="
        bg-gray-600 bg-opacity-50
        w-12
        h-px
        backdrop-filter backdrop-blur-xl backdrop-brightness-200
        "
      ></div>
      <div class="
        px-4 py-3
        w-12 h-12
        "
      >
        <input
          id="showCompare"
          v-model="mountedShowCompare"
          type="checkbox"
          class="opacity-10"
        >
        <label for="showCompare"></label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapControls',
  props: {
    showLabels: {
      type: Boolean,
      default: (): boolean => false,
    },
    showCompare: {
      type: Boolean,
      default: (): boolean => false,
    },
  },
  emits: [
    'update:showLabels',
    'update:showCompare',
  ],
  data: () => ({
    mountedShowLabels: false,
    mountedShowCompare: false,
  }),
  watch: {
    mountedShowLabels(): void {
      this.$emit('update:showLabels', this.mountedShowLabels);
    },
    mountedShowCompare(): void {
      this.$emit('update:showCompare', this.mountedShowCompare);
    },
  },
  mounted(): void {
    this.mountedShowLabels = this.showLabels;
    this.mountedShowCompare = this.showCompare;
  },
});
</script>

<style scoped>

</style>
