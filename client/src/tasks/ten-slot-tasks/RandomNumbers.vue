<template>
  <ten-row :items="num" :key="update" @do="$emit('do')"></ten-row>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import TenRow from "../components/TenSlots.vue"
  
  export default defineComponent({
    components:{
        "ten-row":TenRow
    },
    data(){
      return {
        num:[],
        update:0
      }
    },
    mounted(){
        let min=1;
        let max=15;
        for(let i of [0,0,0,0,0,0,0,0,0,0].keys()){
            let add=Math.floor(Math.random()*(max-min+1)+min)
            this.num.push(add)
            min+=15
            max+=15
        }
        this._update()
    },
    methods:{
        parse(arr:any){return JSON.parse(arr)},
        _update(){
            this.update++;
        }
    }
  })
</script>

<style scoped lang='scss'>
  
</style>