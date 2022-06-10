<template>
  <div class='game-main'>
    <div class="game-infobox">
      <div class="game-content">
        <button 
          v-for="(player,index) in players" 
          :key="key(player,'id')+''+selected" 
          :style="{'background-color':colors[key(player,'color')]}" 
          @click="selected=index"
          class="game-button"
          :class="{'gray':selected==index}"
        ></button><br>
        <div :class="{'gray':selected==-1}">
          <h2>A <select :disabled="selected==-1" class="game-select" v-model="code.animal">
              <option value="-1" selected>animal</option>
              <option 
                v-for="(animal,index) in animals"
                :key="index"
                :value="animal"
              >{{animal.toLowerCase()}}</option>
            </select> <select :disabled="selected==-1" class="game-select" v-model="code.action">
              <option value="-1" selected>action</option>
              <option 
                v-for="(verb,index) in verbs"
                :key="index"
                :value="verb"
              >{{verb.toLowerCase()}}</option>
            </select> in <select :disabled="selected==-1" class="game-select" v-model="code.place">
              <option value="-1" selected>place</option>
              <option 
                v-for="(place,index) in places"
                :key="index"
                :value="place"
              >{{place}}</option>
            </select></h2>
        </div>
        <button class="game-end" @click="dotask()">do task</button>
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
      this.getplayers()
      let data=await fetch(`${server}/${this.$route.params.g}/updates/?passcode=${cookies.get('passcode')}`)
      if(data.status==404){alert("Game not found");this.$router.push("/")}
      else if(data.status==307){this.$router.push(`/${this.$route.params.g}/${this.$route.params.d}/meet/`)}
      else if(data.status==410){
        let text=await data.text()
        if(text=="Crewmates win"){
          this.$router.push("/crew/")
        }else if(text=="Imposters win"){this.$router.push("/imposter/")}
        else {this.$router.push("/jester/")}
      }
      else setTimeout(()=>{location.reload()},500)
    },
    methods:{
      async getplayers(){
        let data=await fetch(`${server}/${this.$route.params.g}/players/?passcode=${cookies.get('passcode')}`)
        let players:any=await data.json()
        this.players=players.players
      },
      dotask(){
        if(this.code.animal+"|"+this.code.action+"|"+this.code.place=="-1|-1|-1"){
          alert("Please select an animal, action, and place")
          return
        }else if(this.code.animal+"|"+this.code.action+"|"+this.code.place==(this.players as any)[this.selected].code){
          if(!(this.players as any)[this.selected].done.includes(this.$route.params.d)){
            this.$router.push(`/${this.$route.params.g}/${this.$route.params.d}/${(this.players as any)[this.selected].id}/task/?reload=true`)
          }else{
            alert("You've already completed this task")
          }
        }else{
          alert("Incorrect code")
          return
        }
      },
      key(object:any, key:any){
        return object[key]
      }
    },
    data(){
      return {
        players:[],
        selected:-1,
        colors:["blue","green","red","yellow","black","brown","pink","purple","orange","gray","lightgray","cyan"],
        verbs:["Running","Walking","Talking","Hiding","Dying","Crying","Writing","Reading","Eating","Drinking","Dinning","Dancing"],
        places:["Your house","Thailand","Japan","China","Russia","Ukraine","the USA","Germany","France","Spain","Mexico","the UK"],
        animals:["Monkey","Tiger","Panda","Dog","Cat","Dragon","Mouse","Hamster","Unicorn","Person","Turtle","Bird"],
        code:{animal:-1,place:-1,action:-1,}
      }
    }
  })
</script>

<style scoped lang='scss'>
  .game-main{
    padding:20px;
    height:calc(100% - 40px);
    background-color: #eee;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }
  .game-infobox{
    width:100%;
    height:100%;
    background-color:white;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    vertical-align:middle;
    overflow-y:auto;
  }
  .game-content{
    max-width:80%;
    overflow-x:none;
    text-align: center;
  }
  .game-button{
    height: 150px;
    width: 150px;
    max-width:calc(80vw - 20px) !important;
    max-height:calc(80vw - 20px) !important;
    margin:10px;
    border:none;
    cursor:pointer;
  }
  .game-end{
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
  .gray{
    opacity: 0.5;
    background-color:white;
  }
  .game-select{
    font-size:20px;
    padding:10px;
    border:none;
    border-radius: 10px;
    background-color: white;
    transition:0.5s;
    outline:none;
    cursor: pointer;
    &:hover{
      background-color: rgba(221, 221, 221, 0.5);
      transition:0.5s;
    }
  }
</style>