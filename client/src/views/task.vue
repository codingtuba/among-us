<template>
  <div class='task-main'>
    <task class="task-item" @do="finishtask()"></task>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import OneButton from '../tasks/button/OneButton.vue'
  import ThreeButtons from '../tasks/button/ThreeButtons.vue'
  import SimonSays from '../tasks/games/SimonSays.vue'
  import Targets from '../tasks/games/Targets.vue'
  import RandomLetters from '../tasks/ten-slot-tasks/RandomLetters.vue'
  import RandomNumbers from '../tasks/ten-slot-tasks/RandomNumbers.vue'
  import SetLetters from '../tasks/ten-slot-tasks/SetLetters.vue'
  import SetNumbers from '../tasks/ten-slot-tasks/SetNumbers.vue'
  import FiveWires from '../tasks/wires/FiveWires.vue'
  import ThreeWires from '../tasks/wires/ThreeWires.vue'
  import server from '../server/'
  import cookies from 'cookies-js'
  const tasks=[OneButton,ThreeButtons,SimonSays,SimonSays,RandomLetters,RandomNumbers,SetLetters,SetNumbers,FiveWires,ThreeWires,Targets,Targets]
  
  export default defineComponent({
    components:{
      task:tasks[Math.floor(Math.random()*tasks.length)]
    },
    methods:{
      async finishtask(){
        let data=await fetch(`${server}/${this.$route.params.g}/${this.$route.params.d}/${this.$route.params.p}/task/?passcode=${cookies.get('passcode')}`,{method:"POST"})
        console.log(data,data.status)
        if(!data.ok){
          alert("Something went wrong")
        }else{
          this.$router.push(`/${this.$route.params.g}/${this.$route.params.d}/game/`)
        }
      }
    },
    async mounted(){
      if(this.$route.query.reload=="true"){
        console.log("reloading")
        location.replace(location.href.replace("?reload=true",""))
      }
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
  })
</script>

<style scoped lang='scss'>
  .task-main{
    padding:20px;
    background-color:#eee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100% - 40px);
  }
  .task-item{
    padding:20px;
    border:none;
    background-color: white;;
  }
</style>