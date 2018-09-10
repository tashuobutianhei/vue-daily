<template>
  <div class="reg">
    <div class="reg_top">
      <span @click="$store.commit('closeReg')">×</span>
    </div>

    <div class="username">
      <label for="user">用户名:</label>
      <input id="user" :class="{errer:usernameError,right:usernameRight}" @change="checkuser(username)"  v-model="username"/>
    </div>

    <div class="password">
      <label for="pass">密码:</label>
      <input type="password" id="pass":class="{errer:passwordError,right:passwordRight}" @change="checkpass(password)"  v-model="password" />
    </div>

    <div class="password">
      <label for="pass2">再一次密码:</label>
      <input type="password" id="pass2"  :class="{errer:password2Error,right:password2Right}" @change="checkpass2(password2)"  v-model="password2"/>
    </div>

    <input class="button" type="button" value="注册" @click="reg"/>
  </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "regist",
        data(){
          return{
            username:'',
            password:'',
            password2:'',
            usernameRight:'',
            passwordRight:'',
            password2Right:'',
            usernameError:'',
            passwordError:'',
            password2Error:'',
          }
        },
        methods:{
          reg(){
            axios({
              method: 'get',
              url: 'http://localhost:8088/reg?username='+ this.username+'&password='+this.password,
            }).then(res=>{
              let data = res.data
              if(data.err){
                alert(data.err);
              }else {
                this.$store.commit('closeReg');
                this.username='';
                this.password='';
                this.password2='';
                alert(data.ok);
              }
            })
          },
          checkuser(it){
            if(it.length>12){
              this.usernameError=true;
              this.usernameRight=false;
            }else{
              this.usernameRight=true;
              this.usernameError=false;
            }
          },
          checkpass(it){
            if(!/^[a-zA-Z]\w{5,17}$/.test(it)){
              this.passwordError=true;
              this.passwordRight=false;
            }else{
              this.passwordRight=true;
              this.passwordError=false;
            }
          },
          checkpass2(it){
            if(it!=this.password){
              this.password2Error=true;
              this.password2Right=false;
            }else{
              this.password2Right=true;
              this.password2Error=false;
            }
          }
        }
    }
</script>

<style scoped>
  .errer{
    box-shadow: red 0px 0px 3px 3px inset;
  }
  .right{
    box-shadow: greenyellow 0px 0px 3px 3px inset;
  }
  .reg{
    width: 300px;
    height: 300px;
    border: #00AADD 1px solid;
    background-color:  #e3e8ee;
    position: fixed;
    top:100px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 3;
  }
  label{
    display: block;
    width:100px ;
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
  .reg_top{
    width: 100%;
    position: relative;
  }
  .reg_top span{
    font-size: 20px;
    position: absolute;
    right: 5px;
    cursor: pointer;
  }
</style>
