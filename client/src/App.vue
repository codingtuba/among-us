<template>
  <div class='app-main'>
    <router-view></router-view>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  
  export default defineComponent({})
</script>

<style lang='scss'>
  body,html{
    margin:0px;
  }
  .app-main{
    height:calc(100vh);
    overflow-y:scroll;
  }
  *{
    font-family: 'Lato', sans-serif;
    max-width:100vw !important;
    max-height:100vh !important;
  }
</style>