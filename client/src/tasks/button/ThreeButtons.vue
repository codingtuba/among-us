<template>
  <div class='threebuttons-main'>
    <img src="https://i.imgur.com/EUBmCyl.png" class="threebuttons-image" :class="{'gray':images[0]}" @click="click(1)">
    <img src="https://i.imgur.com/EUBmCyl.png" class="threebuttons-image" :class="{'gray':images[1]}" @click="click(2)">
    <img src="https://i.imgur.com/EUBmCyl.png" class="threebuttons-image" :class="{'gray':images[2]}" @click="click(3)">
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    data(){return{
        images:[false,false,false]
    }},
    methods:{
        click(num:number) {
            this.images[num-1]=true
            setTimeout(()=>{this.images[num-1]=false},1500)
            if(this.images[0]==true&&this.images[1]==true&&this.images[2]==true){
                this.$emit('do')
            }
        }
    },
  })
</script>

<style scoped lang='scss'>
  .threebuttons-image{
    width:calc(33% - 20px);
    cursor:pointer;
    padding:10px;
    transition:0.5s;
    &:hover, &.gray{
        opacity:0.5;
        transition:0.5s;
    }
  }
</style>