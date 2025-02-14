<template>
  <map
    style="width: 100%; height: 300px;" 
    :latitude="latitude" 
    :longitude="longitude" 
    :markers="markers"
    mapkey="TINBZ-DRE6I-H7XGE-UG7XQ-UGPHH-4ZBR6"
    :enable-scroll="false"
    :enable-zoom="true"
    :enable-rotate="false"
    :enable-overlooking="false"
  ></map>
</template>

<script setup>
defineProps({
  latitude: {
    type: Number,
    default: 39.90923
  },
  longitude: {
    type: Number,
    default: 116.397428
  },
  markers: {
    type: Array,
    default: () => [{
      latitude: 39.90923,
      longitude: 116.397428,
      title: '当前位置'
    }]
  }
})
</script> 
