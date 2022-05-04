<template>
  <ten-row :items="['a','b','c','d','e','f','g','h','i','j']" @do="$emit('do')"></ten-row>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import TenRow from "../components/TenSlots.vue"
  
  export default defineComponent({
    components:{
        "ten-row":TenRow
    }
  })
</script>

<style scoped lang='scss'>
  
</style>