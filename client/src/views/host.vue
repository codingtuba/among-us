<template>
  <div class='host-main'>
    <div class="join">
      <b v-if="!starting">Join at https://play.aimedtuba.com and enter the code {{$route.params.g}}</b>
      <b v-else>Click on the "next role" button to show your role and speical code</b>
    </div>
    <div class="start">
      <button class="start" @click="giveroles()" :disabled="devices.length==0" v-if="!starting"><b>start</b></button>
      <button class="next-role" @click="showingrole=true" v-else-if="!showingrole"><b>next role</b></button>
      <button class="hide-role" @click="hiderole()" v-else><b>hide</b></button>
    </div>
    <div class="devices">
      <div>
        <b>{{devices.length}} device{{devices.length==1?'':'s'}}</b><br>
        <b v-if="!starting"><input type="number" v-model="players" class="small-input" :style="{'width':players.toString().split('').length==0?'30px':players.toString().split('').length*10+20+'px'}"> player{{players==1?'':'s'}}<br></b>
        <b v-else>{{players}} player{{players==1?'':'s'}}<br></b>
        <b>{{floor(players/4)}} imposter{{floor(players/4)==1?'':'s'}}</b>
      </div>
    </div>
    <div class="device-list">
      <ul class="device-list">
        <li class="device-list-item" v-for="device in devices" :key="device.id">
          {{device.code}}
        </li>
      </ul>
    </div>
    <div class="colors" :style="{'background-color':currentrolecolor()}">
      <div class="crew-info" v-if="showingrole">
        <b v-if="playerdata[currentrole].imposter" style="color:red">Imposter<br></b>
        <b v-else style="color:green">Crewmate<br></b>
        <b>Code: {{currentrolecode()}}</b><br>
        <b>Color: {{currentrolecolor()}}</b>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import server from '../server/'
  import cookies from 'cookies-js'
  const code={
    animals:["Monkey","Tiger","Panda","Dog","Cat","Dragon","Mouse","Hamster","Unicorn","Person","Turtle","Bird"],
    verbs:["Running","Walking","Talking","Hiding","Dying","Crying","Writing","Reading","Eating","Drinking","Dinning","Dancing"],
    places:["Your house","Thailand","Japan","China","Russia","Ukraine","the USA","Germany","France","Spain","Mexico","the UK"]
  }
  
  export default defineComponent({
    data(){return{
      devices:[] as any[],
      players:1,
      playerdata:[] as any[],
      starting:false,
      colors:["blue","green","red","yellow","black","brown","pink","purple","orange","gray","lightgray","cyan"] as string[],
      showingrole:false,
      currentrole:0,
    }},
    async mounted(){
      let devices=await fetch(`${server}/${this.$route.params.g}/devices/?passcode=${cookies.get('passcode')}`)
      if(devices.status==404){alert("Game not found");this.$router.push("/")}
      this.devices=await devices.json()
      this.getdevices()
    },
    methods:{
      currentrolecolor(){
        return this.showingrole?this.colors[this.playerdata[this.currentrole].color]:"white"
      },
      currentrolecode(){
        let split=this.playerdata[this.currentrole].code.split("|")
        split[0]=split[0].toLowerCase()
        split[1]=split[1].toLowerCase()
        split[2]="in "+split[2]
        return "A "+split.join(" ")
      },
      async getdevices(){
        let devices=await fetch(`${server}/${this.$route.params.g}/devices/update/?passcode=${cookies.get('passcode')}`)
        if(devices.status==404){alert("Game not found");this.$router.push("/")}
        this.devices=await devices.json()
        this.getdevices()
      },
      async start(){
        let start=await fetch(`${server}/${this.$route.params.g}/start/?passcode=${cookies.get('passcode')}`,{method:"POST"})
        if(start.status==404){alert("Game not found");this.$router.push("/")}
        else{
          let data=await start.json()
          this.$router.push(`/${this.$route.params.g}/manage/`)
        }
      },
      async giveroles(){
        if(this.players-0<0){
          alert("You can't have less than 0 players")
          this.starting=false;
          return
        }
        if(this.players-0>12){
          alert("You can't have more than 12 players")
          this.starting=false;
          return
        }
        this.starting=true;
        let playerdata=[];
        let imposters=Math.floor(this.players/4)
        let colors=[0,1,2,3,4,5,6,7,8,9,10,11]
        for(let i=0;i<this.players;i++){
          colors.sort(() => Math.random() - 0.5);
          playerdata.push({
            imposter:imposters>0,
            color:colors.shift(),
            code:
              code.animals.sort(() => 0.5 - Math.random())[0]+"|"
              +code.verbs.sort(() => 0.5 - Math.random())[0]+"|"
              +code.places.sort(() => 0.5 - Math.random())[0],
            tasks:this.devices.length,
            done:"[]",
            game:this.devices[0].game,
          })
          imposters--
        }
        this.playerdata=playerdata.sort(() => 0.5 - Math.random())
      },
      floor(num:number){
        return Math.floor(num)
      },
      async hiderole(){
        this.currentrole++;
        this.showingrole=false
        if(this.currentrole==this.players){
          let players=await fetch(`${server}/${this.$route.params.g}/start/?passcode=${cookies.get('passcode')}`,{
            method:"POST",
            body:JSON.stringify({
              playerdata:this.playerdata,
              tasks:this.devices.length,
            }),
            headers:{
              "Content-Type":"application/json",
            }
          })
          if(players.status==406){alert("wow, look at you, learning inspect element in chrome, thinking you're a genius. well guess what bastard, i'm not retarted, you are.");this.$router.push("/")}
          else{
            this.$router.push(`/${this.$route.params.g}/manage/`)
          }
        }
      },
    },
  })
</script>

<style scoped lang='scss'>
  .host-main{
    display: grid;
    height:calc(100% - 20px);
    padding:10px;
    background-color: #eee;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap:10px;
    overflow-y:scroll;
  }
  .host-main > div{
    background-color: white;
  }
  .join, .devices, div.start{
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
  }
  .join > b, .host > b, .devices > b{
    padding:20px;
    font-size:18px;
    text-align: center;
  }
  .devices > div{
    text-align: center;
  }
  button{
    padding:10px;
    padding-left: 20px;
    padding-right: 20px;
    font-size:18px;
    cursor: pointer;
    border:none;
    border-radius: 5px;
    background-color: rgb(0, 158, 0);
    width:calc(fit-content(100%) - 20px);
    transition:0.5s;
    &:hover, &:disabled{
      background-color: green;
      transition:0.5s;
    }
  }
  .next-role,.hide-role{
    background-color:lightgray;
    &:hover, &:disabled{
      background-color: rgb(191, 191, 191);
    }
  }
  div.start{
    grid-row-start:2;
  }
  .devices{
    grid-row-start:3;
  }
  .device-list{
    grid-row-start:1;
    grid-row-end:4;
    grid-column-start:2;
    grid-column-end:3;
  }
  .colors{
    grid-row-start:1;
    grid-row-end:4;
    grid-column-start:3;
    grid-column-end:5;
    display: flex;
    justify-content: center;
    align-items:center;
    vertical-align: middle;
  }
  @media screen and (max-width:800px) {
    .host-main{
      display:block;
    }
    .join, .devices, div.start{
      margin: 5px;
      margin-top: 15px;
      aspect-ratio: 1/.4;
    }
  }
  .small-input{
    outline: none;
    border: none;
    font-weight: bold;
    font-size: 16px;
  }
  .crew-info{
    text-align: center;
  }
  .crew-info>b{
    background-color: white;
  }
</style>