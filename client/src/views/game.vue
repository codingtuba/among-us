<template>
  <div class='game-main'>
    game
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import server from '../server/'
  import cookies from 'cookies-js';
  
  export default defineComponent({
    async mounted(){
      let data=await fetch(`${server}/${this.$route.params.g}/updates/?passcode=${cookies.get('passcode')}`)
      if(data.status==404){alert("Game not found");this.$router.push("/")}
      else if(data.status==307){this.$router.push(`/${this.$route.params.g}/${this.$route.params.d}/meet/`)}
      else location.reload()
    }
  })
</script>

<style scoped lang='scss'>
  
</style>