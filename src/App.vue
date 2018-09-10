<template>
  <div id="app">
    <login v-show="$store.state.login"></login>
    <reg v-show="$store.state.reg"></reg>

    <title_top></title_top>

    <guide></guide>
    <list></list>
    <TheArticle></TheArticle>
  </div>
</template>

<script>
import guide from './components/guide.vue'
import list from './components/list.vue'
import TheArticle from './components/TheArticle.vue'
import title_top from './components/title.vue'
import login from './components/login.vue'
import reg from './components/regist.vue'
import axios from 'axios'
axios.defaults.withCredentials=true

export default {
  name: 'App',
  components: {guide,list,TheArticle,title_top,login,reg},
  mounted(){
    axios.get('http://localhost:8088/logined')
      .then(res => {
        let data = res.data;
        if(data=='b'){

        }else{
          this.$store.commit('ChangeStatus',data)
        }


      })
      .catch(function (error) {
        console.log(error);
      });
  }


}
</script>

<style>
  body{
    margin: 0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
