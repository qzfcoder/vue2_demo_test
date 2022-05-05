import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueBus from "vue-bus";
Vue.config.productionTip = false

import VueBus from 'vue-bus'

new Vue({
  router,
  store,
  VueBus,
  render: (h) => h(App)
}).$mount('#app')
