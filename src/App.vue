<template>
  <Map
    :show-labels="showLabels"
    :show-compare="showCompare"
  />
  <div class="absolute top-4 left-4">
    <ReferencePhoto/>
  </div>
  <div class="absolute top-4 right-4">
    <MapControls
      :show-labels="showLabels"
      :show-compare="showCompare"
      @update:show-labels="showLabels = $event"
      @update:show-compare="showCompare = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Map from './components/Map.vue';
import MapControls from './components/MapControls.vue';
import ReferencePhoto from './components/ReferencePhoto.vue';

export default defineComponent({
  name: 'App',
  components: {
    Map,
    MapControls,
    ReferencePhoto,
  },
  data: () => ({
    showLabels: false,
    showCompare: false,
  }),
});
</script>
