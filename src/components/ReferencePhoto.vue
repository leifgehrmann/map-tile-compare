<template>
  <div
    class="flex justify-center"
  >
    <button
      class="
      rounded-xl
      flex
      flex-col
      shadow-lg
      relative
      self-center
      items-center
      "
      @click="mountedExpanded = !mountedExpanded"
    >
      <transition
        name="button-fade"
        mode="out-in"
      >
        <div
          v-if="showResizeButton && mountedExpanded"
          class="
            bg-gray-600 bg-opacity-70
            backdrop-filter backdrop-blur-xl
            rounded-lg
            absolute
            top-1
            right-1
            p-1
          "
          :class="{
            'top-2': mountedExpanded,
            'right-2': mountedExpanded,
            'p-2': mountedExpanded
          }"
        >
          <img
            v-if="mountedExpanded"
            src="../assets/close.svg"
            alt="Close image"
            title="Close image"
            class="w-5 opacity-70"
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
            bg-gray-600 bg-opacity-70
            backdrop-filter backdrop-blur-xl
            rounded-lg
            absolute
            top-1
            right-1
            p-1
          "
          :class="{
            'top-2': mountedExpanded,
            'right-2': mountedExpanded,
            'p-2': mountedExpanded
          }"
        >
          <img
            v-if="!mountedExpanded"
            src="../assets/expand.svg"
            alt="Expand image"
            title="Expand image"
            class="w-3 opacity-70"
          >
        </div>
      </transition>
      <img
        ref="image"
        class="rounded-xl shadow-md"
        src="../assets/photo.jpg"
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
