<template>
    <div class="list" ref="list">
        <div class="date">{{date}}</div>
        <div class="item" v-for="item in $store.state.List" @click="article(item.id)">
          <img  v-show="getIf(item)"  :src="getSrc(item)">
          <p>{{item.title}}</p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import time from '../util.js'

    export default {
        name: "list",
        data(){
          return{
            imgPath:'http://127.0.0.1:8011/img/',
            days:0
          }
        },
      methods:{
          getIf(obj){
            if(!obj.images)
              return false;
            return true
          },
          getSrc(obj){
              if(this.getIf(obj))
                return this.imgPath+obj.images[0];
          },
          httpRequest(ittime){
            let itTime = time.prevDay(time.getTodayTime()+86400000-ittime);
            axios.get('//127.0.0.1:8010/news/before/'+itTime).then(res=>{
              this.$store.commit('changeListPush',res.data.stories)
            })
          },
          article(id){
            this.$store.commit('changeReady')
            this.$store.commit('changeArticleId',id)
          }
      },
      computed:{
          date(){
            const date = new Date();
            return date.getMonth()+1+'月'+date.getDate()+'日'
          }
      },
      mounted(){
          this.httpRequest(0);

          let list = this.$refs.list;
          let days = 0;

          list.addEventListener('scroll',()=>{
            //只有每日推荐进行加载
            if(this.$store.state.where=='theme') return;

            var heigth=list.scrollHeight-1

            days+=86400000;
            if(list.scrollTop+list.clientHeight>=heigth){
              this.httpRequest(days);
            }
          })
      }
    }
</script>

<style scoped>

.list{
  width: 300px;
  position: fixed;
  left: 151px;
  top: 40px;
  bottom: 0;
  overflow-y: scroll;
}
.date{
  text-align: center;
  margin: 10px 0;
}
.item{
  width: 100%;
  height: 100px;
  display: flex;
  cursor: pointer;
}

.item img{
  flex:1;
  /*width: 80px;*/
  height: 80px;
}
.item p{
  flex: 2;
}
.list::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.list::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(100,100,100,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
</style>
