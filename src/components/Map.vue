<template>
  <div id="comparison-container">
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
// import MaplibreCompare from '@maplibre/maplibre-gl-compare';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { ref, defineComponent } from 'vue';

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
    map: null as maplibregl.Map|null,
    backupLayers: [] as {
      layer: maplibregl.AnyLayer,
      beforeLayer: string|null,
    }[],
  }),
  watch: {
    showLabels(): void {
      if (this.map !== null) {
        if (this.showLabels) {
          this.addLayers();
        } else {
          this.removeLayers();
        }
      }
    },
  },
  mounted() {
    maplibregl.accessToken = 'pk.eyJ1IjoibGVpZmdlaHJtYW5uIiwiYSI6Ik4waTNoeGMifQ.320CRn54CJk41-Dbm4iSLQ';
    // const beforeMap = new maplibregl.Map({
    //   container: 'before',
    //   style: 'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
    //   center: [-3.1817, 55.9548],
    //   zoom: 13,
    // });

    const afterMap = new maplibregl.Map({
      container: 'after',
      style:
          'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
      // center: [-3.1817, 55.9548],
      bounds: [-3.4620, 55.8010, -3.09828, 55.9810],
      // zoom: 13,
    });

    afterMap.on('styledata', () => {
      afterMap.addSource('edinburgh_2', {
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
      afterMap.addLayer(
        {
          id: 'edinburgh_2-layer',
          type: 'raster',
          source: 'edinburgh_2',
          paint: {},
        },
        'tunnel-street-minor-low',
      );
      this.removeLayers();
    });

    this.map = afterMap;

    window.addEventListener('resize', () => {
      afterMap.easeTo({
        padding: {
          right: 75,
        },
        duration: 1000,
      });
    });

    // A selector or reference to HTML element
    // const container = '#comparison-container';

    // eslint-disable-next-line no-new
    // new MaplibreCompare(beforeMap, afterMap, container);
  },
  methods: {
    addLayers(): void {
      this.backupLayers.forEach((backup) => {
        if (this.map === null) {
          return;
        }
        if (backup.beforeLayer !== null) {
          this.map.addLayer(backup.layer, backup.beforeLayer);
        } else {
          this.map.addLayer(backup.layer);
        }
      });
      this.backupLayers = [];
    },
    removeLayers(): void {
      if (this.map === null) {
        return;
      }
      const { layers } = this.map.getStyle();
      if (layers === undefined) {
        return;
      }
      for (let i = layers.length - 1; i > 0; i -= 1) {
        console.log(layers[i].type, layers[i]);
        if (layers[i].type === 'symbol' || layers[i].type === 'line') {
          this.map.removeLayer(layers[i].id);
          this.backupLayers.push({
            layer: layers[i],
            beforeLayer: i === layers.length - 1 ? null : layers[i + 1].id,
          });
        }
      }
    },
  },
});
</script>

<style>
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
  background-color: hsla(0,0%,100%,.75);
}

@media (prefers-color-scheme: dark) {
  .maplibregl-ctrl.maplibregl-ctrl-attrib:not(.maplibregl-compact) {
    background-color: rgba(75, 85, 99, 0.5);
  }

  .maplibregl-ctrl.maplibregl-ctrl-attrib:not(.maplibregl-compact),
  .maplibregl-ctrl.maplibregl-ctrl-attrib:not(.maplibregl-compact) a {
    color: rgba(255,255,255,1);
  }
}

</style>
