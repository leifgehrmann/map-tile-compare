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
    v-if="referencePhotoImageUrl !== ''"
    ref="referencePhotoContainer"
    class="
      absolute top-0 left-0
      w-28 md:w-40
      transition-all ease-out duration-300
      pointer-events-none
    "
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
    class="
      absolute bottom-0 left-0
      w-screen
      transition-all east-out duration-300
    "
  >
    <div class="p-4 h-full">
      <div class="h-full flex justify-center items-center">
        <button
          ref="splashScreenButton"
          class="
            bg-gray-300 dark:bg-gray-600 bg-opacity-70
            backdrop-filter backdrop-blur-xl
            text-black dark:text-gray-200
            rounded-xl px-4 py-3
          "
          @click="showMap = true; referencePhotoExpanded = false;"
        >
          <span v-if="name !== ''">
            <span class="font-bold">{{ name }}</span> -
            <span class="whitespace-nowrap">Click to Load Map</span>
          </span>
          <span v-else>
            Click to Load Map
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PaddingOptions } from 'maplibre-gl';
import Map from './components/Map.vue';
import MapControls from './components/MapControls.vue';
import ReferencePhoto from './components/ReferencePhoto.vue';

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
  },
  data: () => ({
    name: '',
    beforeStyle: '',
    beforeStyleAccessToken: '',
    beforeStyleBeforeLayerId: '',
    sourceTiles: '',
    sourceTileScheme: 'xyz' as 'xyz'|'tms',
    sourceTileSize: 256,
    sourceMinZoom: 1,
    sourceMaxZoom: 10,
    sourceBounds: [-180, -90, 180, 90],
    referencePhotoImageUrl: '',
    referencePhotoExpanded: true,
    referencePhotoTouchStartWidth: 0,
    referencePhotoTouchStartIdentifier: 0,
    referencePhotoTouchStartX: 0,
    referencePhotoTouchEndX: 0,
    windowHeight: window.innerHeight,
    // Use a non-zero value to avoid some obvious jitter
    splashScreenButtonHeight: 48,
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
      const padding = '1rem';
      if (this.showMap) {
        const mapAttributionHeight = '1rem';
        return `calc(${this.windowHeight}px - ${padding} - ${padding} - ${mapAttributionHeight} - ${padding})`;
      }
      return `calc(${this.windowHeight}px - ${padding} - ${padding} - ${this.splashScreenButtonHeight}px - ${padding} - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
    },
  },
  async mounted() {
    await this.loadConfig();
    this.windowHeight = window.innerHeight;
    this.uiPadding = this.computeUiPadding();
    setTimeout(() => {
      this.resizeSplashScreen();
    }, 300);
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight;
      this.uiPadding = this.computeUiPadding();
      // Wait until CSS transition for referencePhotoContainer has finished.
      setTimeout(() => {
        this.resizeSplashScreen();
      }, 300);
    });
    this.addReferencePhotoTouchEventListeners();
  },
  methods: {
    async loadConfig(): Promise<void> {
      const configUrlEncoded = window.location.hash.substring(1);
      const configUrl = decodeURIComponent(configUrlEncoded);
      const config = await fetch(configUrl).then((response) => response.json());

      this.name = config.name;
      this.beforeStyle = config.beforeStyle;
      this.beforeStyleAccessToken = config.beforeStyleAccessToken;
      this.beforeStyleBeforeLayerId = config.beforeStyleBeforeLayerId;
      this.sourceTiles = config.sourceTiles;
      this.sourceTileScheme = config.sourceTileScheme;
      this.sourceTileSize = config.sourceTileSize;
      this.sourceMinZoom = config.sourceMinZoom;
      this.sourceMaxZoom = config.sourceMaxZoom;
      this.sourceBounds = config.sourceBounds;
      this.referencePhotoImageUrl = config.referencePhotoImageUrl;
    },
    resizeSplashScreen(): void {
      if (!this.showMap) {
        window.requestAnimationFrame(() => {
          const splashScreenButton = this.$refs.splashScreenButton as HTMLDivElement|null;
          if (splashScreenButton !== null) {
            this.splashScreenButtonHeight = splashScreenButton.clientHeight;
          }

          const photoContainer = this.$refs.referencePhotoContainer as HTMLDivElement;
          const photoContainerHeight = photoContainer.clientHeight;
          const leftoverHeight = window.innerHeight - photoContainerHeight;
          const splashScreenContainer = this.$refs.splashScreenContainer as HTMLDivElement|null;
          if (splashScreenContainer !== null) {
            splashScreenContainer.style.height = `calc(${leftoverHeight}px + 1rem)`;
          }
        });
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
    addReferencePhotoTouchEventListeners(): void {
      const pixelsPerRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const photoContainer = this.$refs.referencePhotoContainer as HTMLDivElement;

      // Start recording the user's current touch position and current container width
      photoContainer.addEventListener('touchstart', (event) => {
        const firstTouch = event.touches[0];
        this.referencePhotoTouchStartIdentifier = firstTouch.identifier;
        this.referencePhotoTouchStartX = firstTouch.clientX;
        this.referencePhotoTouchEndX = firstTouch.clientX;
        this.referencePhotoTouchStartWidth = photoContainer.clientWidth;
        photoContainer.style.maxWidth = `${window.innerWidth + 30}px`;
        photoContainer.style.minWidth = `${pixelsPerRem * 7 - 30}px`;
      });

      // Calculate difference from and adjust the width of the
      // referencePhotoContainer to be offset by the x-distance, with some bounciness
      photoContainer.addEventListener('touchmove', (event) => {
        const firstTouch = this.findTouchByIdentifier(
          event.touches,
          this.referencePhotoTouchStartIdentifier,
        );
        if (firstTouch === null) {
          return;
        }
        this.referencePhotoTouchEndX = firstTouch.clientX;
        const offset = this.referencePhotoTouchEndX - this.referencePhotoTouchStartX;
        let newWidth = this.referencePhotoTouchStartWidth + offset;
        newWidth = Math.min(newWidth, window.innerWidth + 30);
        newWidth = Math.max(newWidth, pixelsPerRem * 7 - 30);
        photoContainer.style.width = `${newWidth}px`;

        // Special-case: if we're on the splash screen and we've moved the image more
        // than 30 pixels, just load the map. There's no point waiting for the user
        // to swipe all the way.
        if (!this.showMap && offset < -30) {
          this.showMap = !this.showMap;
        }
      });

      // If the touch is cancelled, reset everything back to normal.
      photoContainer.addEventListener('touchcancel', () => {
        this.referencePhotoTouchEndX = 0;
        this.referencePhotoTouchStartX = 0;
        photoContainer.style.width = '';
        photoContainer.style.maxWidth = '';
        photoContainer.style.minWidth = '';
      });

      // If the touch has ended, check if the user has dragged more than 30 pixels
      // which will toggle the size of the reference photo.
      photoContainer.addEventListener('touchend', () => {
        const offset = this.referencePhotoTouchEndX - this.referencePhotoTouchStartX;
        if (
          (this.referencePhotoExpanded && offset < -30)
          || (!this.referencePhotoExpanded && offset > 30)
        ) {
          this.referencePhotoExpanded = !this.referencePhotoExpanded;
        }
        photoContainer.style.width = '';
        photoContainer.style.maxWidth = '';
        photoContainer.style.minWidth = '';
      });
    },
    findTouchByIdentifier(touches: TouchList, identifier: number): Touch|null {
      for (let i = 0; i < touches.length; i += 1) {
        const id = touches[i].identifier;
        if (id === identifier) {
          return touches[i];
        }
      }
      return null;
    },
  },
});
</script>
