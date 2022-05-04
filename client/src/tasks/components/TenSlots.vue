<template>
  <div class='tenslots-main'>
    <button class="tenslots-item"
        v-for="(item,index) in shuffled"
        :key="index"
        :class="{'selected':orginal.indexOf(item)<current}"
        @click="next()"
        :disabled="current!=orginal.indexOf(item)"
    >{{item}}</button>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    data(){
        return{
            orginal:this.$attrs.items,
            shuffled:JSON.parse(JSON.stringify(this.$attrs.items)).sort(()=>Math.random()-0.5),
            current:0,
        }
    },
    methods:{
        next(){
            this.current++;
            if(this.current==10){
                this.$emit('do')
            }
        }
    }
  })
</script>

<style scoped lang='scss'>
  .tenslots-main{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(100px,1fr));
    gap:10px;
  }
  .tenslots-item{
    aspect-ratio:1/1;
    border:1px solid #ccc;
    border-radius:5px;
    padding:10px;
    cursor:pointer;
    font-size:1.5em;
    font-weight:bold;
    text-align:center;
    background-color:white;
    color:black;
    transition:all 0.2s;
    &.selected{
      background-color:#ccc;
      color:white;
    }
  }
</style>