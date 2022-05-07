<template>
  <div class='wires-main'>
    <div class="wires-left">
        <button class="wires-item"
            v-for="wire in lshuffled"
            :key="stringify(lshuffled)+wire"
            @click="select(l,wire)"
            :class="{'selected':wire==left}"
            :style="{'background-color':wire}"
        ></button>
    </div>
    <div class="wires-right">
        <button class="wires-item"
            v-for="wire in rshuffled"
            :key="stringify(rshuffled)+wire"
            @click="select(r,wire)"
            :class="{'selected':wire==right}"
            :style="{'background-color':wire}"
        ></button>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  function d(item:any){return JSON.parse(JSON.stringify(item))}
    
  export default defineComponent({
    async mounted(){
        let dummy=d(this.$attrs.wires)
        this.lshuffled=dummy.sort(()=> 0.5 - Math.random())
        this.rshuffled=(this.$attrs.wires as any).sort(()=> 0.5 - Math.random())
    },
    data(){return{
        l:'left',
        r:'right',
        lshuffled:[],
        rshuffled:[],
        update:0,
        left:"",
        right:"",
    }},
    methods:{
        select(side:string,item:string){
            if(side==='left'){
                this.left=item
            }else{
                this.right=item
            }
            if(this.left===this.right){
                this.lshuffled.splice((this.lshuffled as any).indexOf(this.left),1)
                this.rshuffled.splice((this.rshuffled as any).indexOf(this.left),1)
            }
            if(this.lshuffled.length===0){
                this.$emit('do')
            }
            this.update++
        },
        stringify:JSON.stringify
    }
  })
</script>

<style scoped lang='scss'>
  .wires-main{
    display:grid;
    grid-template-columns: 1fr 1fr;
    width:calc(100vw - 80px);
    max-width:700px !important;
    gap:10px;
  }
  .wires-item{
    width:100%;
    aspect-ratio:1/.4;
    border:none;
    cursor:hover;
    margin-bottom:10px;
    &.selected{
        opacity: 0.5;
    }
  }
</style>