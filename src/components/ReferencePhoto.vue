<template>
  <div
    class="
    text-white
    flex
    flex-col
    space-y-2
    "
  >
    <button
      class="
      rounded-xl
      w-20
      flex
      flex-col
      shadow-lg
      relative
      "
    >
      <div
        class="
          bg-gray-600 bg-opacity-70
          backdrop-filter backdrop-blur-xl
          rounded-lg
          absolute
          top-1
          right-1
          p-1
        "
      >
        <img
          src="../assets/expand.svg"
          alt="Expand image"
          title="Expand image"
          class="w-3"
        >
      </div>
      <img
        class="rounded-xl shadow-md"
        src="../assets/photo.jpg"
      >
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReferencePhoto',
});
</script>

<style scoped>

</style>
