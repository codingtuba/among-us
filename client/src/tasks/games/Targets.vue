<template>
  <div class='targets-main'>
    <button 
        class="target" 
        v-for='(target,index) in targets' 
        :key='target+""' 
        :disabled='!target' 
        @click='clicked(index)'
    ></button>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    data(){return{
        targets:[false,false,false,false,false,false,false,false,false],
        pace:1,
        duration:.8,
        left:7,
    }},
    mounted(){
        setInterval(()=>{this.pace-=.05;this.duration+=.05},2500)
        this.tick()
    },
    methods:{
        clicked(i:number){
            this.targets[i]=false;
            this.left--
            if(this.left===0){
                this.$emit('do')
            }
        },
        tick(){
            setTimeout(()=>{
                let random=Math.floor(Math.random()*9)
                this.targets[random]=true;
                setTimeout(()=>{
                    if(!(this.pace<=0)){
                        this.targets[random]=false;
                    }
                },this.duration*1000)
                this.tick()
            },this.pace*1000)
        }
    }
  })
</script>

<style scoped lang='scss'>
  .targets-main{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      grid-template-rows:repeat(3,1fr);
      grid-gap:10px;
  }
  .target{
    width:calc(30vh - 15px);
    aspect-ratio:1/1;
    border-radius:50%;
    background-color:red;
    border:5px solid black;
    margin:5px;
    display:inline-block;
    cursor:pointer;
    &:disabled{
        background-color:white;
    }
  }
  @media screen and (max-width:700px) {
    .target{
        width:calc(30vw - 15px)
    }
  }
</style>