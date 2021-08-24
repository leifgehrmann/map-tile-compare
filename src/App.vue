<template>
  <Map
    v-if="showMap"
    :before-style="beforeStyle"
    :before-style-access-token="beforeStyleAccessToken"
    :before-style-before-layer-id="beforeStyleBeforeLayerId"
    :source-tiles="sourceTiles"
    :source-tile-scheme="sourceTileScheme"
    :source-tile-size="sourceTileSize"
    :source-min-zoom="sourceMinZoom"
    :source-max-zoom="sourceMaxZoom"
    :source-bounds="sourceBounds"
    :show-labels="showLabels"
    :show-compare="showCompare"
    :ui-padding="uiPadding"
  />
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
  <div
    ref="referencePhotoContainer"
    class="absolute top-0 left-0 w-28 md:w-40 transition-all duration-300 pointer-events-none"
    :class="{
      'w-screen': referencePhotoExpanded,
      'md:w-screen': referencePhotoExpanded
    }"
  >
    <div
      class="p-4 pointer-events-none"
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
        :name="name"
        @update:clicked="showMap = true; referencePhotoExpanded = false;"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PaddingOptions } from 'maplibre-gl';
import LZString from 'lz-string';
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

const dataCompressed = window.location.hash.substring(1);
const dataUncompressedJson = LZString.decompressFromBase64(dataCompressed);
if (dataUncompressedJson === null) {
  throw new Error('Invalid data. Please use the README for instructions on how to setup the map data.');
}
const dataUncompressed = JSON.parse(dataUncompressedJson);

export default defineComponent({
  name: 'App',
  components: {
    Map,
    MapControls,
    ReferencePhoto,
    SplashScreen,
  },
  data: () => ({
    name: dataUncompressed.n,
    beforeStyle: dataUncompressed.bS,
    beforeStyleAccessToken: dataUncompressed.bSAT,
    beforeStyleBeforeLayerId: dataUncompressed.bSBLI,
    sourceTiles: dataUncompressed.sT,
    sourceTileScheme: dataUncompressed.sTSc as 'xyz'|'tms',
    sourceTileSize: dataUncompressed.sTSi,
    sourceMinZoom: dataUncompressed.sMin,
    sourceMaxZoom: dataUncompressed.sMax,
    sourceBounds: dataUncompressed.sB,
    referencePhotoImageUrl: dataUncompressed.rPIU,
    referencePhotoExpanded: true,
    showMap: false,
    showLabels: false,
    showCompare: false,
    uiPadding: {
      left: 0, right: 0, top: 0, bottom: 0,
    } as PaddingOptions,
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
    this.uiPadding = this.computeUiPadding();
    window.addEventListener('resize', () => {
      this.uiPadding = this.computeUiPadding();
      // Wait until CSS transition for referencePhotoContainer has finished.
      setTimeout(() => {
        this.resizeSplashScreen();
      }, 300);
    });
  },
  methods: {
    resizeSplashScreen(): void {
      if (!this.showMap) {
        const photoContainer = this.$refs.referencePhotoContainer as HTMLDivElement;
        const photoContainerHeight = photoContainer.clientHeight;
        const leftoverHeight = window.innerHeight - photoContainerHeight;
        const splashScreenContainer = this.$refs.splashScreenContainer as HTMLDivElement;
        splashScreenContainer.style.minHeight = `calc(${leftoverHeight}px + 1rem)`;
      }
    },
    computeUiPadding(): PaddingOptions {
      const pixelsPerRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const referencePhotoWidth = pixelsPerRem * (1 + 7 / 2 + 1);
      const mapControlWidth = pixelsPerRem * (1 + 3 + 1);
      const expectedMaxWidth = window.innerWidth - referencePhotoWidth - mapControlWidth;
      const mapControlHeight = pixelsPerRem * (1 + 3 + 3 + 1);
      const mapAttributionHeight = pixelsPerRem * (3);
      const expectedMaxHeight = window.innerHeight - mapControlHeight - mapAttributionHeight;
      if (expectedMaxHeight > expectedMaxWidth) {
        return {
          left: pixelsPerRem,
          right: pixelsPerRem,
          top: mapControlHeight,
          bottom: mapAttributionHeight,
        };
      }
      return {
        left: referencePhotoWidth,
        right: mapControlWidth,
        top: pixelsPerRem,
        bottom: mapAttributionHeight,
      };
    },
  },
});
</script>
