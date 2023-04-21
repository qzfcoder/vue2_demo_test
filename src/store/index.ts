/* eslint-disable */
import { defineStore } from 'pinia';

export const mainStore = defineStore('store', {
  state: () => {
    return {
      count: 0,
      name: '小红',
      phone: '15139333888',
      CommonMsg: {},
    };
  },
  getters: {
    phoneHidden(state) {
      console.log('getters 被调用');
      return state.phone
        .toString()
        .replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
    },
    getCommonMsg(state) {
      return state.CommonMsg;
    },
  },
  actions: {
    increment() {
      // 这里不要用箭头函数
      this.count++;
      this.name = 'xxxxx';
    },
    setCommonMsg(e: any) {
      this.CommonMsg = e;
    },
  },
});
