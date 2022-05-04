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
  import TicTacToe from '../tasks/games/TicTacToe.vue'
  import RandomLetters from '../tasks/ten-slot-tasks/RandomLetters.vue'
  import RandomNumbers from '../tasks/ten-slot-tasks/RandomNumbers.vue'
  import SetLetters from '../tasks/ten-slot-tasks/SetLetters.vue'
  import SetNumbers from '../tasks/ten-slot-tasks/SetNumbers.vue'
  import FiveWires from '../tasks/wires/FiveWires.vue'
  import ThreeWires from '../tasks/wires/ThreeWires.vue'
  const tasks=[]
  
  export default defineComponent({
    components:{
      task:RandomLetters,
    },
    methods:{
      finishtask(){
        alert("Task finished")
      }
    }
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