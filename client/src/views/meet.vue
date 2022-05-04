<template>
  <div class='meet-main'>
    <div class="meet-infobox">
      <div class="meet-content">
        <button 
          v-for="(player,index) in players" 
          :key="player.id+''+disabled[index]" 
          :style="{'background-color':colors[player.color]}" 
          @click="toggle(index)"
          class="meet-button"
          :class="{'gray':disabled[index]}"
        ></button><br><br>
        <button class="meet-end" @click="end()">end meeting</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import server from '../server/'
  import cookies from 'cookies-js';
  
  export default defineComponent({
    async mounted(){
      let data=await fetch(`${server}/${this.$route.params.g}/players/?passcode=${cookies.get('passcode')}`)
      if(data.status == 404){alert("Game not found");this.$router.push("/")}
      let players:any=await data.json()
      console.log(players)
      this.players = players.players
      players.players.forEach(()=>this.disabled.push(false))
    },
    data(){return{
      players:[],
      disabled:[],
      colors:["blue","green","red","yellow","black","brown","pink","purple","orange","gray","lightgray","cyan"],
    }},
    methods:{
      toggle(index:number){
        this.disabled[index]=!this.disabled[index]
      },
      async end(){
        let eliminated=[];
        this.disabled.forEach((i:boolean,d:number)=>{if(i==true){eliminated.push(this.players[d].id)}})
        await fetch(`${server}/${this.$route.params.g}/meeting/toggle/?passcode=${cookies.get("passcode")}`,{method:"POST",body:JSON.stringify({
          eliminated:eliminated,
        }),headers:{'Content-Type':'application/json'}})
        this.$router.push(`/${this.$route.params.g}/manage/`)
      }
    }
  })
</script>

<style scoped lang='scss'>
  .meet-main{
    padding:20px;
    height:calc(100% - 40px);
    background-color: #eee;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  .meet-infobox{
    width:100%;
    height:100%;
    background-color:white;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    vertical-align:middle;
  }
  .meet-content{
    max-width:80%;
    overflow-x:none;
    text-align: center;
  }
  .meet-button{
    height: 150px;
    width: 150px;
    margin:10px;
    border:none;
    cursor:pointer;
    &.gray{
      opacity: 0.5;
      background-color:white;
    }
  }
  .meet-end{
    padding:20px;
    border:none;
    border-radius: 10px;
    font-size:30px;
    cursor:pointer;
    background-color: white;
    transition:0.5s;
    &:hover{
      background-color: rgba(221, 221, 221, 0.5);
      transition:0.5s;
    }
  }
</style>