// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    status:{status:false,username:'',userid:''},
    ready:true,
    allList:[],
    List:[],
    articleId:'666',
    where:'',
    login:false,
    reg:false
  },
  mutations:{
    ChangeStatus(state,it){
      console.log(it)
      state.status.status=true;
      state.status.username=it.username;
      state.status.userid=it.userid;
    },
    ChangeStatusOut(state){
      state.status.status=false;
      state.status.username='';
      state.status.userid='';
    },
    openLogin(state){
      state.login=true;
    },
    closeLogin(state){
      state.login=false;
    },
    openReg(state){
      state.reg=true;
    },
    closeReg(state){
      state.reg=false;
    },
    changeReady(state){
        state.ready=false;
      },
    changeListPush(state,it){
        state.allList=it;
        if(it.length>20){
          state.List.push(...it.slice(0,10))
          //state.List =it.slice(0,10) ;
        }else{
          state.List.push(...it)
        }
      },
    changeListFu(state,it){
      state.allList=it;
      if(it.length>20){
        state.List =it.slice(0,10) ;
      }else{
        state.List =it ;
      }
    },
    changeArticleId(state,it){
      state.articleId = it;
    },
    changeWhere(state,it){
      state.where = it;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
