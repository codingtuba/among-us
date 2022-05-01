<template>
  <div class='index-main'>
    <div class="index-item">
      <div class="index-flex-evade">
        <div class="index-image one"></div>
        <input class="code" :class="{'comein':joining||!comein}" v-model="code">
        <button class="join" @click="join()" :disabled="creating||joining"><b>Join game</b></button>
      </div>
    </div>
    <div class="index-item">
      <div class="index-flex-evade">
        <div class="index-image two"></div>
        <button class="create" @click="create()" :disabled="creating||joining"><b>Create game</b></button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import server from '../server/';
  import cookies from 'cookies-js';
  import { NewGameResponse } from "../types/"
  
  export default defineComponent({
    data(){return{
      comein:false,
      joining:false,
      creating:false,
      code:'',
    }},
    methods:{
      join(){
        if(this.comein==false){this.comein=true}
        else{
          this.joining=true
          setTimeout(async ()=>{
            let join=await fetch(`${server}/${this.code}/join/`,{method:"POST"})
            if(join.status==404){alert("Invalid join code");this.joining=false}
            else{
              let data=await join.json()
              cookies.set("code",data.game)
              cookies.set("id",data.id)
              cookies.set("passcode",data.passcode)
              this.$router.push(`/${this.code}/${data.code}/wait/`)
            }
          },500)
        }
      },
      async create(){
        this.creating=true;
        this.comein=false;
        let game=await fetch(`${server}/game/`,{method:"POST"})
        let data:NewGameResponse=await game.json()
        cookies.set("code",data.code)
        cookies.set("passcode",data.passcode)
        console.log(data)
        this.$router.push(`/${data.code}/game/`)
      },
    }
  })
</script>

<style scoped lang='scss'>
  .index-main{
    display:grid;
    padding:10px;
    grid-template-columns:repeat(2, 1fr);
    height:calc(100% - 20px);
  }
  .index-item{
    display:flex;
    vertical-align:middle;
    align-items:center;
    justify-content:center;
    height:100%;
  }
  .index-image{
    background-size:cover;
    background-position:center;
    width:calc(50vw - 30px);
    aspect-ratio: 1/.5;
    margin:10px;
    transition:.5s;
  }
  button{
    border: none;
    border-radius: 5px;
    font-size:15px;
    background-color: #eee;
    width:calc(fit-content(100%) - 20px);
    cursor:pointer;
    padding:5px;
    transition:0.5s;
    &:hover, &:disabled{
      background-color: #ddd;
      transition:0.5s;
    }
    display:inline;
  }
  .comein{
    width:0px;
    opacity: 0;
    margin: 0px;
    transition:0.5s;
  }
  input{
    margin-right:5px;
    width:calc(200px);
    border:none;
    border-radius: 5px;
    font-size:15px;
    background-color: #eee;
    padding:5px;
    transition:0.5s;
    opacity: 1;
    font-weight: bold;
    &:hover,&:focus{
      background-color: #ddd;
      transition:0.5s;
      outline: none;
    }
  }
  .progress-bar{
    background-color: #eee;
    width:200px;
    border-radius: 50px;
    height: 20px;
    border-radius: 5px;
    margin:5px;
    transition:0.5s;
    display:inline;
  }
  @media screen and (max-width:500px) {
    .index-main{
      display:block;
      height:fit-content;
      transition:.5s;
    }
    .index-image{
      width:calc(100vw - 30px);
      transition:.5s;
    }
  }
  .index-flex-evade{text-align:center;}
  .one{background-image:url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.windowsreport.com%2Fwp-content%2Fuploads%2F2020%2F10%2FAmong-US-1.jpg&f=1&nofb=1');}
  .two{background-image:url('https://twinfinite.net/wp-content/uploads/2020/09/among-us-1.jpg');}
</style>