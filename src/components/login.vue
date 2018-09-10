<template>
    <div class="login">
      <div class="login_top">
        <span @click="$store.commit('closeLogin')">×</span>
      </div>

      <div class="username">
          <label for="username">用户名:</label>
          <input id="username" v-model="username"/>
      </div>

      <div class="password">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password"/>
      </div>
      <span class="reg">没有账号？快去<span @click="open">注册</span></span>
      <input class="button" type="button" value="登录" @click="login"/>
    </div>
</template>

<script>

    import axios from 'axios';


    export default {
      data(){
        return{
          username:'',
          password:''
        }
      },
      methods:{
        open(){
          this.$store.commit('closeLogin')
          this.$store.commit('openReg')
        },
        login(){
          axios({
            method: 'get',
            url: 'http://localhost:8088/login?username='+ this.username+'&password='+this.password,
          }).then(res=>{
            let data = res.data
            if(data.err){
              alert(data.err)
            }else {
              this.$store.commit('closeLogin');
              //console.log(data)
              this.ChangeTitle(data.userid)
              this.username='';
              this.password='';
              alert(data.ok);
            }
          })
        },
        ChangeTitle(id){
          this.$store.commit('ChangeStatus',{username:this.username,userid:id});
        }
      }
    }
</script>

<style scoped>
  .login_top{

  }

  .login{
    width: 300px;
    height: 300px;
    border: #00AADD 1px solid;
    background-color:  #e3e8ee;
    position: fixed;
    top:100px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2;
  }
  label{
    display: block;
    width:70px ;
    position: relative;
    left: -50%;
    margin-left:140px  ;
  }
  input{
    width: 98%;
    height: 30px;
    border-left: none;
    border-right: none;
    border-top: none;
    background-color: rgba(0,0,0,0);
    outline:none;
    box-shadow: silver 0px 0px 3px 3px inset;
  }
  .username,.password{
    width: 100%;
  }
  .username{
    margin-top: 50px;
  }
  .button{
    position: absolute;
    bottom: 0px;
    left: 0;
    background-color:  #00AADD;
    box-shadow:none;
    height: 30px;
    font-size: 20px;
    color: white;
  }
  .reg span{
    color: #00AADD;
  }
  .login_top{
    width: 100%;
    position: relative;
  }
  .login_top span{
    font-size: 20px;
    position: absolute;
    right: 5px;
    cursor: pointer;
  }
</style>
