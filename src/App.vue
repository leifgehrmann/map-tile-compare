<template>
  <Map msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Map from './components/Map.vue'

export default defineComponent({
  name: 'App',
  components: {
    Map
  }
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #EEE;
  font-family: ui-rounded, sans-serif;
}

body * {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #000;
  }
}
</style>
