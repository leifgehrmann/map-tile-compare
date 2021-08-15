<template>
  <div id="comparison-container">
    <div id="before" class="map"></div>
    <div id="after" class="map"></div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    return { count }
  },
  mounted() {
    maplibregl.accessToken = 'pk.eyJ1IjoibGVpZmdlaHJtYW5uIiwiYSI6Ik4waTNoeGMifQ.320CRn54CJk41-Dbm4iSLQ';
    var beforeMap = new maplibregl.Map({
      container: "before",
      style: 'mapbox://styles/leifgehrmann/cksdm6ebv3u8417p1amevc6d6',
      center: [7.221275, 50.326111],
      zoom: 5,
    });

    var afterMap = new maplibregl.Map({
      container: "after",
      style:
          "mapbox://styles/leifgehrmann/ckqqx35za2evv18o0vzlrmib1",
      center: [7.221275, 50.326111],
      zoom: 5,
    });

    // A selector or reference to HTML element
    var container = "#comparison-container";

    // @ts-ignore
    var map = new maplibregl.Compare(beforeMap, afterMap, container);
  }
})
</script>

<style scoped>
.map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #0F0;
}
</style>
