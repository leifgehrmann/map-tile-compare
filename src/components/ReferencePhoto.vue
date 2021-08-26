<template>
  <div
    class="flex justify-center pointer-events-none"
    @click="mountedExpanded = !mountedExpanded"
  >
    <button
      tabindex="1"
      class="
      rounded-xl
      flex
      flex-col
      shadow-lg
      relative
      self-center
      items-center
      pointer-events-auto
      "
      :aria-label="mountedExpanded ? 'Close reference photo' : 'Expand reference photo'"
      :title="mountedExpanded ? 'Close reference photo' : 'Expand reference photo'"
    >
      <transition
        name="button-fade"
        mode="out-in"
      >
        <div
          v-if="showResizeButton && mountedExpanded"
          aria-hidden="true"
          class="
            bg-gray-800 bg-opacity-70
            backdrop-filter backdrop-blur-xl
            rounded-lg
            absolute top-2 right-2
            p-2
          "
        >
          <img
            v-if="mountedExpanded"
            src="../assets/close.svg"
            alt="Close reference photo"
            class="w-5"
          >
        </div>
      </transition>
      <transition
        name="button-fade"
        mode="out-in"
      >
        <div
          v-if="showResizeButton && !mountedExpanded"
          class="
            bg-gray-800 bg-opacity-70
            backdrop-filter backdrop-blur-xl
            rounded-lg
            absolute top-1 right-1
            p-1
          "
          aria-hidden="true"
        >
          <img
            v-if="!mountedExpanded"
            src="../assets/expand.svg"
            alt="Expand reference photo"
            class="w-3"
          >
        </div>
      </transition>
      <img
        ref="image"
        class="rounded-xl shadow-md bg-gray-300 dark:bg-gray-800 color-black bg-opacity-50"
        alt="Reference photo associated with the map"
        :src="imageUrl"
        @load="$emit('update:imageLoaded')"
      >
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReferencePhoto',
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    expanded: {
      type: Boolean,
      required: true,
    },
    maxHeight: {
      type: String,
      required: true,
    },
    showResizeButton: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'update:expanded',
    'update:imageLoaded',
  ],
  data: () => ({
    mountedExpanded: false,
  }),
  watch: {
    expanded(): void {
      this.mountedExpanded = this.expanded;
    },
    mountedExpanded(): void {
      if (this.mountedExpanded !== this.expanded) {
        this.$emit('update:expanded', this.mountedExpanded);
      }
    },
    maxHeight(): void {
      this.resizeImage();
    },
  },
  mounted() {
    this.mountedExpanded = this.expanded;
    this.resizeImage();
  },
  methods: {
    resizeImage(): void {
      const image = this.$refs.image as HTMLImageElement;
      image.style.maxHeight = this.maxHeight;
    },
  },
});
</script>

<style>
.button-fade-leave-active {
  transition: opacity .150s ease 0s;
}
.button-fade-enter-active {
  transition: opacity .150s ease .075s;
}
.button-fade-enter-from, .button-fade-leave-active {
  opacity: 0;
}
</style>
