import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { createPinia, PiniaVuePlugin } from 'pinia';
import App from './App.vue';
import router from './router';
// import 'pixi-filters';
import Print from '@/utils/print';
import agelForm from 'agel-form';
import WujieVue from "wujie-vue2";
import '@/global/index';
// import VueEditorWord from 'vue-editor-word';

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(Print);
Vue.use(WujieVue);
// Vue.use(VueEditorWord);
Vue.use(PiniaVuePlugin);
const pinia = createPinia();
const formConfig = {
  // 设置所有表单
  form: {
    labelWidth: 'auto',
  },
  // 设置日期组件的格式化
  'el-date-picker': function (item: any) {
    if (
      item.type == undefined ||
      item.type == 'date' ||
      item.type == 'daterange'
    ) {
      return { valueFormat: 'yyyy-MM-dd' };
    }
    if (item.type == 'datetime' || item.type == 'datetimerange') {
      return { valueFormat: 'yyyy-MM-dd HH:mm:ss' };
    }
    if (item.type == 'month' || item.type == 'monthrange') {
      return { valueFormat: 'yyyy-MM' };
    }
    if (item.type == 'year') {
      return { valueFormat: 'yyyy' };
    }
  },
  // 为第三方/自定义组件设置组件默认回填初始值
  'xx-array-input': function () {
    return { defaultValue: [] };
  },
};
Vue.use(agelForm, formConfig);
new Vue({
  router,
  render: (h) => h(App),
  pinia,
}).$mount('#app');
