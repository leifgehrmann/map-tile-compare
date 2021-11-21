<template>
  <div
    class="flex justify-center pointer-events-none"
  >
    <div
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
    >
      <transition
        name="button-fade"
        mode="out-in"
      >
        <div
          class="absolute top-2 right-2"
        >
          <button
            v-if="showResizeButton && mountedExpanded"
            tabindex="2"
            class="
              bg-gray-800 bg-opacity-70
              backdrop-filter backdrop-blur-xl
              rounded-lg
              p-2
            "
            aria-label="Close reference photo"
            title="Close reference photo"
            @click="mountedExpanded = !mountedExpanded"
          >
            <img
              v-if="mountedExpanded"
              aria-hidden="true"
              src="../assets/close.svg"
              alt="Close reference photo"
              class="w-5"
            >
          </button>
          <div class="h-2" />
          <button
            v-if="showResizeButton && mountedExpanded"
            tabindex="3"
            aria-label="Open reference photo in new window"
            title="Open reference photo in new window"
            class="
              bg-gray-800 bg-opacity-70
              backdrop-filter backdrop-blur-xl
              rounded-lg
              p-2
            "
            @click="openImageExternally"
          >
            <img
              v-if="mountedExpanded"
              aria-hidden="true"
              src="../assets/open-external.svg"
              alt="Open reference photo in new window"
              class="w-5"
            >
          </button>
        </div>
      </transition>
      <transition
        name="button-fade"
        mode="out-in"
      >
        <button
          v-if="showResizeButton && !mountedExpanded"
          tabindex="1"
          class="
            bg-gray-800 bg-opacity-70
            backdrop-filter backdrop-blur-xl
            rounded-lg
            absolute top-1 right-1
            p-1
          "
          aria-label="Expand reference photo"
          title="Expand reference photo"
          @click="mountedExpanded = !mountedExpanded"
        >
          <img
            v-if="!mountedExpanded"
            aria-hidden="true"
            src="../assets/expand.svg"
            alt="Expand reference photo"
            class="w-3"
          >
        </button>
      </transition>
      <img
        ref="image"
        class="
          rounded-xl shadow-md
          bg-gray-300 dark:bg-gray-800 bg-opacity-50
          cursor-pointer
        "
        alt="Reference photo associated with the map"
        :src="imageUrl"
        @load="$emit('update:imageLoaded')"
        @click="mountedExpanded = !mountedExpanded"
        @keyup.space="mountedExpanded = !mountedExpanded"
      >
    </div>
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
      const image = this.$refs.image as HTMLImageElement|null;
      if (image !== null) {
        image.style.maxHeight = this.maxHeight;
      }
    },
    openImageExternally(): void {
      window.open(this.imageUrl, '_blank');
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
