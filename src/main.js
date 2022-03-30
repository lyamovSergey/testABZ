import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import Vuelidate from 'vuelidate'
import './assets/styles/mainStyles.scss'
 

Vue.prototype.$axios = Axios;


Vue.prototype.$addPreloader = function(){
  let preloader = document.createElement("div");
  let body = document.getElementsByTagName('body')
  preloader.classList.add('preloader');
  body[0].appendChild(preloader);
}

Vue.prototype.$removePreloader = function(){
  let preloader = document.querySelectorAll('.preloader')[0];
  let body = document.getElementsByTagName('body')[0]
  body.removeChild(preloader);
}

Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
