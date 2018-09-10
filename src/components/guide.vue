<template>
    <div class="guide">
      <div class="guide-item" @click="httpRequestTui">每日推荐</div>
      <div @click="show=!show" class="guide-item">主题日报
        <span v-if="!show">▶</span>
        <span v-else="!show">▼</span>
      </div>
      <div v-show="show">
        <li v-for="item in list" @click="changelist(item.id)" >
          <span>
            {{item.name}}
          </span>
        </li>
      </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import time from '../util.js'

    export default {
        data(){
          return{
            list:[],
            show:true,
          }
        },
        //第一次的this绑定失败了,应该是闭包
        methods:{
            changelist(id){
              this.$store.commit('changeWhere','theme')
              this.httpRequest2(id);
            },
            httpRequest(){
              //加载主题列表
              axios.get('//127.0.0.1:8010/themes')
                .then(res => {
                  this.list=res.data.others
                })
                .catch(function (error) {
                  console.log(error);
                });
            },
            httpRequest2(id){
              //具体的主题列表内容
              axios.get('//127.0.0.1:8010/theme/'+id)
                .then(res => {
                  console.log(res);
                  this.$store.commit('changeListFu',res.data.stories)
                })
                .catch(function (error) {
                  console.log(error);
                });
            },
            httpRequestTui(){
              //点击推荐，加载推荐内容
              this.$store.commit('changeWhere','daily')
              let itTime = time.prevDay(time.getTodayTime()+86400000);
              axios.get('//127.0.0.1:8010/news/before/'+itTime).then(res=>{
                this.$store.commit('changeListFu',res.data.stories)
              })
            }
        },
        mounted(){
            this.httpRequest();
        }
    }
</script>

<style scoped>
  .guide{
    position: fixed;
    width: 150px;
    top: 40px;
    left: 0;
    bottom: 0;
    overflow: auto;
  }
  .guide-item{
    font-size: 18px;
    text-align: center;
    margin: 5px 0;
    padding: 10px 0;
    cursor: pointer;
    border-right: 2px solid transparent;
    transition: all .3s ease-in-out;
    /*border-right: 2px solid  #3399ff;*/
  }
  .guide-item:hover{
     background: #e3e8ee;
   }
  .guide-item.on{
    border-right: 2px solid #3399ff;
  }

  .guide ul{
    list-style: none;
  }
  .guide li {
    display: block;
    color: inherit;
    text-decoration: none;
    padding: 5px 0;
    margin: 5px 0;
    cursor: pointer;
    list-style-type: none;
  }
  .daily-menu ul li a:hover, .daily-menu ul li a.on{
    color: #3399ff;
  }

</style>
