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
import maplibregl from 'maplibre-gl';
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
    showLabels: {
      type: Boolean,
      default: (): boolean => false,
    },
    showCompare: {
      type: Boolean,
      default: (): boolean => false,
    },
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
    maplibregl.accessToken = 'pk.eyJ1IjoibGVpZmdlaHJtYW5uIiwiYSI6Ik4waTNoeGMifQ.320CRn54CJk41-Dbm4iSLQ';
    const beforeMap = new maplibregl.Map({
      container: 'before',
      style: 'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
      bounds: [-3.4620, 55.8010, -3.09828, 55.9810],
    });

    const afterMap = new maplibregl.Map({
      container: 'after',
      style: 'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
      // center: [-3.1817, 55.9548],
      bounds: [-3.4620, 55.8010, -3.09828, 55.9810],
      // zoom: 13,
    });

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
      this.afterMap.addSource('edinburgh_2', {
        type: 'raster',
        tiles: [
          'https://tiles.leifgehrmann.com/edinburgh_2/{z}/{x}/{y}.png',
        ],
        scheme: 'tms',
        minzoom: 10,
        maxzoom: 15,
        tileSize: 256,
        bounds: [-3.4620, 55.8010, -3.09828, 55.9810],
      });
      this.afterMap.addLayer(
        {
          id: 'edinburgh_2-layer',
          type: 'raster',
          source: 'edinburgh_2',
          paint: {},
        },
        'tunnel-street-minor-low',
      );
      if (!this.showLabels) {
        this.afterMapLabelBackups = this.removeLabels(this.afterMap);
      }
    });

    // window.addEventListener('resize', () => {
    //   afterMap.easeTo({
    //     padding: {
    //       right: 75,
    //     },
    //     duration: 1000,
    //   });
    // });

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
        // console.log(layers[i].type, layers[i]);
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
  background-color: rgba(75, 85, 99, 0.5);
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
  background-color: rgba(75, 85, 99, 0.5);
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
