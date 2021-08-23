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
      rounded-xl
      w-20
      flex
      flex-col
      shadow-lg
      "
    >
      <img class="rounded-xl shadow-md" src="public/photo.jpg">
    </div>
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
