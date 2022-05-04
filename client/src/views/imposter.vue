<template>
  <div class='imposter-main'>
    <div class="imposter-image" @click="$router.push('/')"></div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    
  })
</script>

<style scoped lang='scss'>
  .imposter-main{
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
  .imposter-image{
    width:60%;
    height:60%;
    background-image: url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flh5.googleusercontent.com%2Fproxy%2Fb1lseAmKfNNjQ3YwkUfMxELSkTubDt6_fDMxQG83netdzQN35gnbTPFVvA73yMZQrDllL--GiB_TQWEsbONIBxWUgKQiLBIn_931bAr2m5S6HNaVpH4Zke9ei1XrsX-kM-a879dMfA%3Dw1200-h630-p-k-no-nu&f=1&nofb=1");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: white;
    cursor: pointer;
  }
</style>