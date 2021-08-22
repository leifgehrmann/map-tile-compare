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
import MaplibreCompare from '@maplibre/maplibre-gl-compare';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'Map',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup: () => {
    const count = ref(0);
    return { count };
  },
  mounted() {
    maplibregl.accessToken = 'pk.eyJ1IjoibGVpZmdlaHJtYW5uIiwiYSI6Ik4waTNoeGMifQ.320CRn54CJk41-Dbm4iSLQ';
    const beforeMap = new maplibregl.Map({
      container: 'before',
      style: 'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
      center: [-3.1817, 55.9548],
      zoom: 13,
    });

    const afterMap = new maplibregl.Map({
      container: 'after',
      style:
          'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
      center: [-3.1817, 55.9548],
      zoom: 13,
    });

    afterMap.on('load', () => {
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
    });

    // A selector or reference to HTML element
    const container = '#comparison-container';

    // eslint-disable-next-line no-new
    new MaplibreCompare(beforeMap, afterMap, container);
  },
});
</script>
