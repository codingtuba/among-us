<template>
  <ten-row :items="[1,2,3,4,5,6,7,8,9,10]" @do="$emit('do')"></ten-row>
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