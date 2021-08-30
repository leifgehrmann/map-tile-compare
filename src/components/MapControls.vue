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
      bg-gray-800 bg-opacity-70
      backdrop-filter backdrop-blur-xl
      rounded-xl
      text-center
      shadow-lg
      "
    >
      <button
        tabindex="4"
        class="
        px-3 py-3
        w-12 h-12
        group
        "
        aria-label="Toggle labels"
        title="Toggle labels"
        @click="mountedShowLabels = !mountedShowLabels"
      >
        <img
          v-if="mountedShowLabels"
          src="../assets/show-labels-active.svg"
          alt="Labels are enabled"
          aria-hidden="true"
        >
        <img
          v-else
          src="../assets/show-labels-inactive.svg"
          alt="labels are disabled"
          aria-hidden="true"
        >
      </button>
      <div
        class="
        bg-gray-800 bg-opacity-50
        w-12
        h-px
        backdrop-filter backdrop-blur-xl backdrop-brightness-200
        "
      />
      <button
        tabindex="5"
        class="
        px-3 py-3
        w-12 h-12
        "
        aria-label="Toggle compare mode"
        title="Toggle compare mode"
        @click="mountedShowCompare = !mountedShowCompare"
      >
        <img
          v-if="mountedShowCompare"
          src="../assets/show-compare-active.svg"
          alt="Compare mode is enabled"
          aria-hidden="true"
        >
        <img
          v-else
          src="../assets/show-compare-inactive.svg"
          alt="Compare mode is disabled"
          aria-hidden="true"
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
