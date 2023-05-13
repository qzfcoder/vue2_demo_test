<template>
  <div id="app">
    <nav>
      <router-link to="/home"> Home </router-link>|
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
    </nav>
    <router-view />
  </div>
</template>
<script>
import { accountLoginRequest } from '@/api/index';
export default {
  components: {},
  mounted() {
    accountLoginRequest('select');
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
