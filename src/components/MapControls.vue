<template>
  <div
    class="
    text-white
    flex
    flex-col
    space-y-2
    "
  >
    <div
      class="
      bg-gray-600 bg-opacity-70
      backdrop-filter backdrop-blur-xl
      rounded-xl
      text-center
      shadow-lg
      "
    >
      <button
        class="
        px-3 py-3
        w-12 h-12
        group
        "
        @click="mountedShowLabels = !mountedShowLabels"
      >
        <img
          src="../assets/show-labels.svg"
          alt="Show labels"
          title="Show labels"
          class="transition-opacity"
          :class="{
            'opacity-50': !mountedShowLabels,
            'group-hover:opacity-70': !mountedShowLabels,
          }"
        >
      </button>
      <div
        class="
        bg-gray-600 bg-opacity-50
        w-12
        h-px
        backdrop-filter backdrop-blur-xl backdrop-brightness-200
        "
      />
      <button
        class="
        px-3 py-3
        w-12 h-12
        group
        "
        @click="mountedShowCompare = !mountedShowCompare"
      >
        <img
          src="../assets/show-compare.svg"
          alt="Show comparison"
          title="Show comparison"
          class="transition-opacity"
          :class="{
            'opacity-50': !mountedShowCompare,
            'group-hover:opacity-70': !mountedShowCompare,
          }"
        >
      </button>
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
      required: true,
    },
    showCompare: {
      type: Boolean,
      required: true,
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
