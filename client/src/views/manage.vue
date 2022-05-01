<template>
  <div class='manage-main'>
    <div class="manage-box">
      <button class="manage-meeting" @click="meet()"><img src="https://i.imgur.com/EUBmCyl.png"></button>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import server from '../server/'
  import cookies from 'cookies-js'
  
  export default defineComponent({
    methods:{
      async meet(){
        let meeting=await fetch(`${server}/${this.$route.params.g}/meeting/toggle/?passcode=${cookies.get("passcode")}`,{method:"POST"})
        if(meeting.status==404){alert("Game not found");this.$router.push("/")}
        else this.$router.push(`/${this.$route.params.g}/meet/`)
      }
    }
  })
</script>

<style scoped lang='scss'>
  .manage-main{
    padding:20px;
    background-color: #eee;
    height: calc(100vh - 40px);
  }
  .manage-box{
    background-color:#fff;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    text-align: center;
  }
  .manage-meeting{
    max-width:60%;
    max-height:70%;
    cursor: pointer;
    background:none;
    border: none;
  }
  .manage-meeting > img{
    width:100%;
    aspect-ratio:1/1;
  }
</style>