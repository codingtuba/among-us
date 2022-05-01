<template>
  <div class='meet-wait-main'>
    <div class="meet-wait-infobox">
        <div class="meet-wait-container">
            <h2>An emergency meeting is happening, so return to the main device!</h2><br>
            <img src="https://i.imgur.com/EUBmCyl.png" style="width:60%">
        </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import server from '../server/'
  import cookies from 'cookies-js'
  
  export default defineComponent({
    async mounted(){
      let data=await fetch(`${server}/${this.$route.params.g}/updates/?passcode=${cookies.get('passcode')}`)
      if(data.status==404){alert("Game not found");this.$router.push("/")}
      else if(data.status==308){this.$router.push(`/${this.$route.params.g}/${this.$route.params.d}/game/`)}
      else location.reload()
    }
  })
</script>

<style scoped lang='scss'>
  .meet-wait-main{
    padding:10px;
    height:calc(100% - 20px);
    background-color: #eee;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  .meet-wait-infobox{
    width:50vw;
    aspect-ratio:1/.7;
    min-height: fit-content;
    background-color:white;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  .meet-wait-container{
    width:80%;
    text-align:center;
  }
  .wait-infobox > b{
    font-size:1.5em;
  }
  @media screen and (max-width:500px) {
    .meet-wait-infobox{
      width:calc(90vw - 20px);
      height:70vh;
    }
    h2{margin-bottom:1px !important;}
  }
</style>