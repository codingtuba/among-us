<template>
  <div class='wait-main'>
    <div class="wait-infobox">
      <b>The game code is {{this.$route.params.g}}</b>
      <b>Your device id is {{this.$route.params.d}}</b>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import cookies from 'cookies-js'
  import server from '../server'
  
  export default defineComponent({
    async mounted(){
      let start=await fetch(`${server}/${this.$route.params.g}/started/?passcode=${cookies.get('passcode')}`)
      if(start.status==404){alert("Game not found");this.$router.push("/")}
      else{
        this.$router.push(`/${this.$route.params.g}/${this.$route.params.d}/game/`)
      }
    }
  })
</script>

<style scoped lang='scss'>
  .wait-main{
    padding:10px;
    height:calc(100% - 20px);
    background-color: #eee;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  .wait-infobox{
    width:50vw;
    aspect-ratio:1/.6;
    background-color:white;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  .wait-infobox > b{
    font-size:1.5em;
  }
  @media screen and (max-width:500px) {
    .wait-infobox{
      width:calc(80vw - 20px);
    }
    .wait-infobox > b{
      font-size:1em;
    }
    *{padding: 0px;}
  }
</style>