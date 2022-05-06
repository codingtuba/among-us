<template>
  <div class='simon-main'>
    <button class="simon-item" @click="next()" :disabled="current!=0" style="background-color:green"></button>
    <button class="simon-item" @click="next()" :disabled="current!=1" style="background-color:red"></button>
    <button class="simon-item" @click="next()" :disabled="current!=2" style="background-color:yellow"></button>
    <button class="simon-item" @click="next()" :disabled="current!=3" style="background-color:blue"></button>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  function r0to3n(not:number):number{
    let random=Math.floor(Math.random()*4)
    while(random===not){random=Math.floor(Math.random()*4)}
    return random;
  }
  
  export default defineComponent({
    data(){return{
        left:5,
        current:r0to3n(-1)
    }},
    methods:{
        next(){
            this.current=r0to3n(this.current);
            this.left--
            if(this.left===0){
                this.$emit('do')
            }
        }
    }
  })
</script>

<style scoped lang='scss'>
  .simon-main{
    display:grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap:10px;
  }
  .simon-item{
    width:calc(40vw - 30px);
    aspect-ratio:1/.4;
    border:none;
    cursor: pointer;
    &:disabled{
        opacity:0.5;
    }
  }
</style>