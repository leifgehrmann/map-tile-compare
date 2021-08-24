<template>
  <transition name="fade">
    <Map
      v-if="showMap"
      :source-tiles="sourceTiles"
      :source-tile-scheme="sourceTileScheme"
      :source-tile-size="sourceTileSize"
      :source-min-zoom="sourceMinZoom"
      :source-max-zoom="sourceMaxZoom"
      :source-bounds="sourceBounds"
      :show-labels="showLabels"
      :show-compare="showCompare"
    />
  </transition>
  <transition name="fade">
    <div
      v-if="showMap"
      class="absolute top-0 right-0"
    >
      <div class="p-4">
        <MapControls
          :show-labels="showLabels"
          :show-compare="showCompare"
          @update:show-labels="showLabels = $event"
          @update:show-compare="showCompare = $event"
        />
      </div>
    </div>
  </transition>
  <div
    ref="referencePhotoContainer"
    class="absolute top-0 left-0 w-28 md:w-40 transition-all"
    :class="{
      'w-screen': referencePhotoExpanded,
      'md:w-screen': referencePhotoExpanded
    }"
  >
    <div
      class="p-4"
    >
      <ReferencePhoto
        :image-url="referencePhotoImageUrl"
        :expanded="referencePhotoExpanded"
        :max-height="referencePhotoMaxHeight"
        :show-resize-button="referencePhotoShowResizeButton"
        @update:expanded="referencePhotoExpanded = $event;showMap = true;"
        @update:imageLoaded="resizeSplashScreen()"
      />
    </div>
  </div>
  <div
    v-if="!showMap"
    ref="splashScreenContainer"
    class="absolute bottom-0 left-0 w-screen"
  >
    <div class="p-4 h-full">
      <SplashScreen
        @click="showMap = true; referencePhotoExpanded = false;"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Map from './components/Map.vue';
import MapControls from './components/MapControls.vue';
import ReferencePhoto from './components/ReferencePhoto.vue';
import SplashScreen from './components/SplashScreen.vue';

// Prevent pinch gestures
document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
});

document.addEventListener('gesturechange', (e) => {
  e.preventDefault();
});

document.addEventListener('gestureend', (e) => {
  e.preventDefault();
});

export default defineComponent({
  name: 'App',
  components: {
    Map,
    MapControls,
    ReferencePhoto,
    SplashScreen,
  },
  data: () => ({
    sourceTiles: 'https://tiles.leifgehrmann.com/tiles/edinburgh_2/{z}/{x}/{y}.png',
    sourceTileScheme: 'tms',
    sourceTileSize: 256,
    sourceMinZoom: 10,
    sourceMaxZoom: 15,
    sourceBounds: [-3.4620, 55.8010, -3.09828, 55.9810],
    showMap: false,
    showLabels: false,
    showCompare: false,
    referencePhotoImageUrl: 'https://tiles.leifgehrmann.com/previews/edinburgh_2.jpg',
    referencePhotoExpanded: true,
  }),
  computed: {
    referencePhotoShowResizeButton(): boolean {
      return this.showMap;
    },
    referencePhotoMaxHeight(): string {
      if (this.showMap) {
        return 'calc(100vh - 1rem - 3rem)';
      }
      return 'calc(100vh - 1rem - 3rem - 2rem - 1rem)';
    },
  },
  mounted() {
    this.resizeSplashScreen();
    window.addEventListener('resize', () => {
      // Wait until CSS transition has finished.
      // 150ms is the default tailwindCSS transition.
      setTimeout(() => {
        this.resizeSplashScreen();
      }, 150);
    });
  },
  methods: {
    resizeSplashScreen(): void {
      if (!this.showMap) {
        const photoContainer = this.$refs.referencePhotoContainer as HTMLDivElement;
        const photoContainerHeight = photoContainer.clientHeight;
        const leftoverHeight = window.innerHeight - photoContainerHeight;
        const splashScreenContainer = this.$refs.splashScreenContainer as HTMLDivElement;
        splashScreenContainer.style.height = `calc(${leftoverHeight}px + 1rem)`;
      }
    },
  },
});
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
