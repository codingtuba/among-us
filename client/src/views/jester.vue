<template>
  <div class='crew-main'>
    <div class="crew-image" @click="$router.push('/')"></div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    
  })
</script>

<style scoped lang='scss'>
  .crew-main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    text-align: center;
    height: 100%;
    width: 100%;
    background-color: #eee;
  }
  .crew-image{
    width:60%;
    height:60%;
    background-image: url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcheep-yt.com%2Ffiles%2F4887%2Fimages%2Fhd_04.png&f=1&nofb=1");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: white;
    cursor: pointer;
  }
</style>