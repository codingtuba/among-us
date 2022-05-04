<template>
  <ten-row :items="letters" :key="update" @do="$emit('do')"></ten-row>
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
        letters:[],
        update:0,
        letters_arr:['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
      }
    },
    mounted(){
        let min=0;
        let max=1;
        for(let i of [0,0,0,0,0,0,0,0,0,0].keys()){
            let add=Math.floor(Math.random()*(max-min+1)+min)
            this.letters.push(this.letters_arr[add])
            min+=2
            max+=2
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