<template>
  <div class="task">
    <div class="header">
      <div>任务创建</div>
      <div>
        <a-form-model layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
          <a-form-model-item>
            <a-input v-model="formInline.processCode" placeholder="流程编码">

            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="formInline.taskCode" placeholder="任务编码">
   
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" icon="search" />
            <transition
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter"

            >
              <div class="test" v-if="haha">
                <div class="inner"><span>+</span></div>
                
              </div>
            </transition>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <a-table :columns="columns" bordered :data-source="data" :pagination="pagination" @change="change" :rowKey="rowKey">

    </a-table>
  </div>
</template>
<script>

import  table  from 'ant-design-vue/lib/table'
import mockdata from './_mock'
console.log('_mockdata',mockdata)

export default {
  data() {
    return {
      mockdata:mockdata,
      haha:false,
      el:null,
      formInline: {
        processCode: '',
        taskCode: '',
        
      },
      data:mockdata.data,
        columns:mockdata.header,
        pagination:{
          pageSize: 5,
          pageCount: 90,
          total: 90,
          current: 1
        }
    };
  },
  components: {
		[table.name]: table,
	},
  methods: {
    begin($event){
        this.el = $event.target
        this.haha = true;


    },

    rowKey(record){
      console.log(record)
      return record.scene2.value+record.scene1.value
    },
    handleSubmit(e) {
      console.log(this.formInline);
    },
    change(pagination, filters, sorter, { currentDataSource }){
      console.log(pagination)
    },
    beforeEnter(el){
        //先把小球移过来
        let dom = this.el;
        let rect = dom.getBoundingClientRect()
        let x = window.innerWidth - rect.left - 20
        let y = rect.top - 25;
        el.style.display= ''
        el.style.transform = `translate3d(0,${y}px,0)`
        let inner = el.querySelector('.inner')
        inner.display =''
        console.log(x)
        inner.style.transform = `translate3d(-${x}px,0,0)`
    },
    enter(el,done){
      let dom = this.el;
      this._offset= document.body.offsetHeight;
      el.style.transform = `translate3d(0,0,0)`
      let inner = el.querySelector('.inner')
      inner.style.transform = `translate3d(0,0,0)`
      el.addEventListener('transitionend',done)
      //inner.addEventListener('transitionend',done)
      console.log(333)
    },
    afterEnter(el){
      console.log(el)
      this.haha= false
      el.style.display = 'none'
      // let inner = el.querySelector('.inner')
      //   inner.style.display = `none`
    },
    enterCancelled(){

    }
  },
}
</script>
<style lang="less" scoped>
    .test{
       position: fixed;
       right: 65px;
       top:69px;
       z-index: 200;
      
       transition: all 0.5s linear;
       .inner{
         width:16px;
         height: 16px;
         display: flex  ;
         border-radius: 8px;
         background: red;
         transition: all 0.5s cubic-bezier(0.49, -0.59, 0.75, 0.41);
         display: flex;
         justify-content: center;
         align-items: center;
       }
    }
  .task{
    padding:20px;
    .header{
      display: grid;
      grid-template-columns: 50% 50%;
      height: 50px;
      div:nth-of-type(1){
        text-align: left;
        font-weight: 600;
      }
      div:nth-of-type(2){
        text-align: right;
        font-weight: 600;
        button{
          background: #2A70E2;
          border: #2A70E2;
        }
      }
    }
  }
</style>