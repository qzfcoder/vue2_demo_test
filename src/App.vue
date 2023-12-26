<template>
  <div id="app">
    {{ alarmBizCode }}1``
    <el-button @click="click">无需处理</el-button>
    <el-button @click="toHandle">去处理</el-button>
    <deptTreeSelect></deptTreeSelect>
    <nav>
      <router-link to="/home"> Home </router-link>|
      <router-link to="/sub_app_page1"> sub_app_page1 </router-link>
      <router-link to="/compositionApi"> CompositionApi </router-link>
      <router-link to="/zujianDemo"> zujianDemo </router-link>
      <router-link to="/hbTable"> hbTable </router-link>
      <router-link to="/hbTable2"> hbTable2 </router-link>
      <router-link to="/video"> video </router-link>
      <router-link to="/office"> office </router-link>
      <router-link to="/printFile"> printFile </router-link>
      <router-link to="/showPz"> showPz </router-link>
      <router-link to="/chajianDemo"> chajianDemo </router-link>
      <router-link to="/csDemo"> csDemo </router-link>
      <router-link to="/docViewDemo"> docViewDemo </router-link>
      <router-link to="/docViewDemo2"> docViewDemo2 </router-link>
      <router-link to="/docViewDemo3"> docViewDemo3 </router-link>
      <router-link to="/moreTable"> moreTable </router-link>
      <router-link to="/uploadSlice"> uploadSlice </router-link>
      <router-link to="/hb"> hb </router-link>
      <router-link to="/ceshi"> ceshi </router-link>
      <router-link to="/tableChoose"> tableChoose </router-link>
      <router-link to="/formChild"> formChild </router-link>
      <router-link to="/wps"> wps </router-link>
    </nav>
    <router-view />
  </div>
</template>
<script>
// import { accountLoginRequest } from '@/api/index';
import deptTreeSelect from '@/components/deptTreeSelect';
export default {
  components: {},
  data() {
    return {
      token: '',
      query: '',
      queryJson: '',
      alarmBizCode: '',
    };
  },
  created() {
    console.log('页面刷新了');
    // 接收消息，子页面
    // window.addEventListener('message', this.handleMessage, false);
  },
  methods: {
    // 获取到可能传过来的token,等相关信息
    handleMessage(event) {
      console.log(event.data, '1');
      const { token, type, id } = event.data;
      if (type == 'msg') {
        this.token = token;
        this.alarmBizCode = id;
        console.log(event.data);
      }
    },

    click() {
      console.log('点击了');
      // 点击无需处理, 向父级页面发送相关内容
      window.parent.postMessage(
        {
          type: 'noHandle',
          data: {
            alarmBizCode: this.alarmBizCode,
          },
        },
        '*'
      );
    },
    toHandle() {
      console.log(this.alarmBizCode);
      let that = this;
      // 点击去派单, 向父级页面发送相关内容
      window.parent.postMessage(
        {
          type: 'toHandle',
          data: {
            alarmBizCode: that.alarmBizCode,
          },
        },
        '*'
      );
    },
    components: { deptTreeSelect },
    mounted() {
      // accountLoginRequest('select');
    },
  },
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  border: 1px solid yellow;
  width: 100%;
  height: 100%;
}

nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
