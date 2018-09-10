<template>
  <div class="talk">
    <span v-show="false">{{$store.state.articleId}}</span>
    <div class="talk_top">
      <span>留言区</span>
      <span @click="talk=!talk" >写留言</span>
    </div>

    <div v-show="list.length==0">暂无评论，快来评论啊</div>

    <div class="talk_input" v-show="talk">
      <textarea v-model="value" ref="input"></textarea>
      <input type="button" value="确认评论" @click="uptalk"/>
    </div>

    <div class="talk_input" v-show="call">
      <textarea id="call" v-model="backValue"  ref="callinput" ></textarea>
      <input type="button" value="确认回复" @click="upcalltalk"/>
    </div>

    <div class="talk_body" v-for="item in listTime">
        <span>{{item.username}}:</span>
        <p>{{item.talkvalue}}</p>
        <span class="time">{{item.time}}</span>
        <span class="callback" @click="callback(item.username)">回复</span>
    </div>

  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "talk",
      data(){
          return{
            talk:false,
            call:false,
            list:[],
            value:'',
            backValue:'',
            callname:''
          }
      },
      methods:{
        getHttpRequest(){
          axios({
            method: 'get',
            url: 'http://localhost:8088/talk?articleId='+this.$store.state.articleId
          }).then(res=>{

            this.list=res.data
          })
        },
        uptalk(){
          if(this.$store.state.status.userid){
            axios({
              method: 'get',
              url: 'http://localhost:8088/uptalk?articleId='+this.$store.state.articleId+'&value='+this.value+'&userid='+this.$store.state.status.userid+'&time='+new Date().getTime()
            }).then(res=>{
              this.value='';
              this.talk=!this.talk;
            })
          }else{
            alert('请登录后评论')
          }
        },
        upcalltalk(){
          if(this.$store.state.status.userid){
            axios({
              method: 'get',
              url: 'http://localhost:8088/upcalltalk?articleId='+this.$store.state.articleId+'&talkvalue='+this.backValue+'&userid='+this.$store.state.status.userid+'&username='+this.callname+'&time='+new Date().getTime()
            }).then(res=>{
              this.backValue='';
              this.call=!this.call;
            })
          }else{
            alert('请登录后评论')
          }
        },
        callback(it) {
          this.callname=it;
          this.backValue = '@' + it + ':';
          this.call = true;
          this.$refs.callinput.focus();

             let textField = document.getElementById("call");
             let startText = '@' + it + ':';

             let _this = this;

             textField.onkeyup = function () {
               var string = _this.backValue;
              (string.indexOf(startText) === 0) || (_this.backValue = startText);
          }
        },
      },
      computed:{
        listTime(){
          this.list.forEach((item,index,arr)=> {
            let text='';
            let newTime = new Date().getTime()-item.time;
            if(newTime<60000){
              text='刚刚'
            } else if(newTime>=60000&&newTime<3600000){
              text=Math.floor(newTime/60000)+'分钟前'
            } else if(newTime>=3600000&&newTime<86400000){
              text=Math.floor(newTime/3600000)+'小时前'
            } else if(newTime>=86400000&&newTime<172800000){
              text='昨天'
            } else if(newTime>=172800000&&newTime<259200000){
              text='前天'
            } else {
              text = new Data(item.time).getFullYear()+'-'+new Data(item.time).getMonth()+1+'月'+new Data(item.time).getDate()+'日'
            }
            arr[index].time=text;
          })
          return this.list;
        }
      },
      updated(){
          this.getHttpRequest()
      },
      mounted(){
          this.getHttpRequest()
      }
    }
</script>

<style scoped>
  .talk{
    margin-top: 50px;
    width: 100%;
    border: #0e8c8c 1px solid;
    margin-bottom: 50px;
  }
  .talk_top{
    width: 100%;
    height: 30px;
    display: flex;
    justify-content:space-between;
    background-color: #00AADD;
    color: white;
  }
  .talk_top span{
    cursor: pointer;
  }
  .talk_input{
    display: flex;
  }
  .talk_input input{
    background-color: #f0ad4e;
    border: none;
    cursor: pointer;
  }
  .talk_input textarea{
    flex: 1;
    height: 30px;
  }


  .talk_body{
    width: 100%;
    height: 100px;
    position: relative;
    border: 1px solid black;
  }
  .talk_body span:first-of-type{
    position: absolute;
    top: 5px;
    left: 15px;
  }
  .callback{
    position: absolute;
    bottom: 5px;
    right: 15px;
    cursor: pointer;
  }
  .time{
    position: absolute;
    top: 5px;
    right: 15px;
    cursor: pointer;
  }
  .talk_body p{
    position: absolute;
    top: 5px;
    right: 15px;
    /*border:1px silver solid;*/
    width: 90%;
  }
</style>
