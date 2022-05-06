<template>
  <div class='threewires-main'>
    <wires :wires="['red','blue','green']" @do="$emit('do')"></wires>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import wires from '../components/Wires.vue'
  
  export default defineComponent({
    components:{wires}
  })
</script>

<style scoped lang='scss'>
  
</style>