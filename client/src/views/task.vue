<template>
  <div class='task-main'>
    <task></task>
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
      task:OneButton,
    }
  })
</script>

<style scoped lang='scss'>
  
</style>