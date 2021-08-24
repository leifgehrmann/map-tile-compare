<template>
  <div class="h-full flex justify-center items-center">
    <button
      class="
        bg-black dark:bg-gray-600 bg-opacity-70
        backdrop-filter backdrop-blur-xl
        text-white dark:text-gray-200
        rounded-xl px-4 py-3
      "
      @click="$emit('update:clicked')"
    >
      <span
        v-if="name !== ''"
      >
        <span class="font-bold">{{ name }}</span> – Click to Load Map
      </span>
      <span
        v-else
      >
        Click to Load Map
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SplashScreen',
  props: {
    name: { type: String, default: '' },
  },
  emits: ['update:clicked'],
});
</script>

<style scoped>

</style>
