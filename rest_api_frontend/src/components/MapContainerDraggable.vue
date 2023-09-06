<template>
  <div style="height:600px; width:500px" class="boxed" id="leafletmap">
    <l-map ref="map" v-model:zoom="zoom" :center="[latitude, longitude]" :use-global-leaflet="false">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <!-- Utilisez le composant LMarker avec l'option draggable -->
      <l-marker :lat-lng="[latitude, longitude]" :draggable=draggable @dragend="updateLatLng"></l-marker>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 16,
    };
  },
  props: {
    latitude: Number,
    longitude: Number,
    draggable:Boolean
  },
  methods: {
    updateLatLng(event) {
      // Mise à jour des valeurs des props
      this.$emit('update:latitude', event.target._latlng.lat);
      this.$emit('update:longitude', event.target._latlng.lng);
    },
  },
};
</script>

<style></style>
