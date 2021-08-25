<template>
  <div
    id="comparison-container"
    :class="showCompare ? 'showCompare' : 'hideCompare'"
  >
    <div
      id="before"
      class="absolute top-0 bottom-0 w-full"
    />
    <div
      id="after"
      class="absolute top-0 bottom-0 w-full"
    />
  </div>
</template>

<script lang="ts">
import maplibregl, { PaddingOptions } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MaplibreCompare from '@maplibre/maplibre-gl-compare';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { ref, defineComponent } from 'vue';

type LayerBackup = {
  layer: maplibregl.AnyLayer;
  beforeLayer: string|null;
}

interface MaplibreCompareInstance {
  // eslint is broken
  // eslint-disable-next-line no-unused-vars
  setSlider(offset: number): void;
  currentPosition: number;
}

export default defineComponent({
  name: 'Map',
  props: {
    beforeStyle: { type: String, required: true },
    beforeStyleAccessToken: { type: String, required: true },
    beforeStyleBeforeLayerId: { type: String, required: true },
    sourceTiles: { type: String, required: true },
    sourceTileScheme: { type: String as () => 'xyz'|'tms', required: true },
    sourceTileSize: { type: Number, required: true },
    sourceMinZoom: { type: Number, required: true },
    sourceMaxZoom: { type: Number, required: true },
    sourceBounds: { type: Array as () => number[], required: true },
    showLabels: { type: Boolean, required: true },
    showCompare: { type: Boolean, required: true },
    uiPadding: { type: Object as () => PaddingOptions, required: true },
  },
  setup: () => {
    const count = ref(0);
    return { count };
  },
  data: () => ({
    beforeMap: null as maplibregl.Map|null,
    beforeMapLabelBackups: [] as LayerBackup[],
    afterMap: null as maplibregl.Map|null,
    afterMapLabelBackups: [] as LayerBackup[],
    compareMap: null as MaplibreCompareInstance|null,
    compareMapCurrentPosition: 0,
  }),
  watch: {
    showLabels(): void {
      if (this.beforeMap !== null && this.afterMap !== null) {
        if (this.showLabels) {
          this.addLabels(this.beforeMap, this.beforeMapLabelBackups);
          this.addLabels(this.afterMap, this.afterMapLabelBackups);
        } else {
          this.beforeMapLabelBackups = this.removeLabels(this.beforeMap);
          this.afterMapLabelBackups = this.removeLabels(this.afterMap);
        }
      }
    },
    showCompare(): void {
      if (this.compareMap !== null) {
        if (this.showCompare) {
          this.addCompare(this.compareMap);
        } else {
          this.removeCompare(this.compareMap);
        }
      }
    },
  },
  mounted() {
    let bounds = [-180, -90, 180, 90] as [number, number, number, number];
    if (this.sourceBounds.length === 4) {
      bounds = this.sourceBounds as [number, number, number, number];
    }

    maplibregl.accessToken = this.beforeStyleAccessToken;
    const beforeMap = new maplibregl.Map({
      container: 'before',
      style: this.beforeStyle,
      bounds,
    });

    const afterMap = new maplibregl.Map({
      container: 'after',
      style: this.beforeStyle,
      bounds,
    });

    beforeMap.fitBounds(bounds, { padding: this.uiPadding });
    afterMap.fitBounds(bounds, { padding: this.uiPadding });

    this.afterMap = afterMap;
    this.beforeMap = beforeMap;

    beforeMap.once('sourcedata', () => {
      if (this.beforeMap === null) {
        throw new Error('beforeMap is null when it should not be');
      }
      if (!this.showLabels) {
        this.beforeMapLabelBackups = this.removeLabels(this.beforeMap);
      }
    });

    afterMap.once('sourcedata', () => {
      if (this.afterMap === null) {
        throw new Error('afterMap is null when it should not be');
      }
      this.afterMap.addSource('map-tile-source', {
        type: 'raster',
        tiles: [this.sourceTiles],
        scheme: this.sourceTileScheme,
        minzoom: this.sourceMinZoom,
        maxzoom: this.sourceMaxZoom,
        tileSize: this.sourceTileSize,
        bounds,
      });
      this.afterMap.addLayer(
        {
          id: 'map-tile-layer',
          type: 'raster',
          source: 'map-tile-source',
          paint: {},
        },
        this.beforeStyleBeforeLayerId,
      );
      if (!this.showLabels) {
        this.afterMapLabelBackups = this.removeLabels(this.afterMap);
      }
    });

    // eslint-disable-next-line no-new
    this.compareMap = new MaplibreCompare(beforeMap, afterMap, '#comparison-container');
    if (this.compareMap !== null) {
      if (this.showCompare) {
        this.addCompare(this.compareMap);
      } else {
        this.removeCompare(this.compareMap);
      }
    }
  },
  methods: {
    addLabels(map: maplibregl.Map, layerBackups: LayerBackup[]): void {
      layerBackups.forEach((backup) => {
        if (backup.beforeLayer !== null) {
          map.addLayer(backup.layer, backup.beforeLayer);
        } else {
          map.addLayer(backup.layer);
        }
      });
    },
    removeLabels(map: maplibregl.Map): LayerBackup[] {
      const { layers } = map.getStyle();
      if (layers === undefined) {
        throw new Error('Unexpected undefined layers found in style');
      }
      const layerBackups = [];
      for (let i = layers.length - 1; i > 0; i -= 1) {
        if (layers[i].type === 'symbol' || layers[i].type === 'line') {
          map.removeLayer(layers[i].id);
          layerBackups.push({
            layer: layers[i],
            beforeLayer: i === layers.length - 1 ? null : layers[i + 1].id,
          });
        }
      }
      return layerBackups;
    },
    addCompare(compareMap: MaplibreCompareInstance): void {
      if (this.compareMapCurrentPosition >= window.innerWidth) {
        this.compareMapCurrentPosition = window.innerWidth / 2;
      }
      if (compareMap.currentPosition <= 0 || compareMap.currentPosition >= window.innerWidth) {
        compareMap.setSlider(this.compareMapCurrentPosition);
      }
    },
    removeCompare(compareMap: MaplibreCompareInstance): void {
      this.compareMapCurrentPosition = compareMap.currentPosition;
      compareMap.setSlider(0);
    },
  },
});
</script>

<style>
.maplibregl-compare {
  z-index: revert;
}

.maplibregl-compare .compare-swiper-vertical {
  backdrop-filter: blur(24px);
  background-color: rgba(117, 117, 117, 0.5);
}

.hideCompare .maplibregl-compare {
  display: none;
}

.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl, .maplibregl-ctrl-bottom-left .maplibregl-ctrl {
  margin: 0 0 1rem 1rem;
}

a.mapboxgl-ctrl-logo, a.maplibregl-ctrl-logo {
  margin: 0;
}

.maplibregl-ctrl.maplibregl-ctrl-attrib:not(.maplibregl-compact) {
  margin: 1rem;
  border-radius: 15px;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(24px);
  background-color: rgba(66, 66, 66, 0.5);
}

.maplibregl-ctrl.maplibregl-ctrl-attrib:not(.maplibregl-compact),
.maplibregl-ctrl.maplibregl-ctrl-attrib:not(.maplibregl-compact) a {
  color: rgba(255,255,255,0.75);
}

.mapboxgl-ctrl-attrib.mapboxgl-compact, .maplibregl-ctrl-attrib.maplibregl-compact {
  margin: 1rem;
  min-height: 24px;
}

</style>
