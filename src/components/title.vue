<template>
    <div class="title">
      <span>乎知</span>
      <div v-if="$store.state.status.status">
        <span>{{$store.state.status.username}}</span>
        <span  @click="out">退出登录</span>
      </div>

      <div v-else="$store.state.status.status">
        <span @click="$store.commit('openLogin')">登录</span>
        <span  @click="$store.commit('openReg')">注册</span>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
      data(){
        return{

        }
      },
      methods:{
        out(){
          axios.get('http://localhost:8088/outlogined')
            .then(res => {
              this.$store.commit('ChangeStatusOut');
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>
  .title{
    box-sizing: border-box;
    padding:0 5% 0 5%;
    background-color: #e3e8ee;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content:space-between;
    align-items: center;
  }
  .title>div span{
    cursor: pointer;
    margin-left: 15px;
  }
  .title>div span:hover{
    color: rgba(150,150,150,1);
  }
</style>
