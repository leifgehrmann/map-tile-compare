<template>
  <div class="h-full flex justify-center items-center">
    <button
      class="
        bg-white dark:bg-gray-600 bg-opacity-70
        backdrop-filter backdrop-blur-xl
        text-black dark:text-white
        rounded-xl px-4 py-3
      "
    >
      Click to Load Map
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SplashScreen',
});
</script>

<style scoped>

</style>
