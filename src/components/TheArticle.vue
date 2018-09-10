<template>
 <div class="all">

   <div class="img" v-show="$store.state.ready">
     <img src="../assets/timg.jpg">
     <p>开心快乐每一天。</p>
   </div>

   <h2>{{data.data.title}}</h2>
   <span v-show="false">{{$store.state.articleId}}</span>
   <div v-show="data" v-html="data.body"></div>

   <talk></talk>

 </div>
</template>

<script>
    import axios from 'axios'
    import time from '../util.js'
    import talk from './talk'



    export default {
        name: "TheArticle",
        data(){
          return{
            data:{data:{}},
            imgPath:'http://127.0.0.1:8011/img/'
          }
        },
        components: {talk},
        methods:{
            httpRequest(){
              axios.get('//127.0.0.1:8010/news/'+this.$store.state.articleId)
                .then(res => {
                  res.body = res.data.body.replace(/src="http/g,'src="'+this.imgPath+'http');
                  res.body = res.data.body.replace(/src="http/g,'src="'+this.imgPath+'https')
                  this.data = res
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
        },
        updated(){
               this.httpRequest()
        },
    }
</script>

<style scoped>
.all{
  position: fixed;
  top: 40px;
  right:0px;
  left: 450px;
  bottom: 0;
  overflow: auto;
  padding-left: 10%;
  padding-right: 10%;
}
  .img{
    width: 80%;
    height: 500px;
    margin: 50px auto;
  }
  .img img{
    width: 300px;
    height: 300px;
  }

.all::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.all::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.all::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(100,100,100,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
</style>
