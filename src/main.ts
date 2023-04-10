import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { createPinia, PiniaVuePlugin } from 'pinia';
import App from './App.vue';
import router from './router';
// import 'pixi-filters';
import Print from '@/utils/print';
import '@/global/index';
Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(Print);

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  router,
  render: (h) => h(App),
  pinia,
}).$mount('#app');
