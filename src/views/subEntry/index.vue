<template>
  <WujieVue
    class="wujie-vue-sub"
    width="100%"
    height="100%"
    :name="$route.name"
    :url="url"
    :loadError="errorHandler"
  ></WujieVue>
</template>
<script>
import WujieVue from 'wujie-vue2';
export default {
  components: {
    WujieVue,
  },
  name: 'index',
  computed: {
    url() {
      return this.urlDict[this.$route.name];
    },
  },
  data() {
    return {
      urlDict: {
        sub_app_page1: 'http://localhost:81/#/index',
      },
    };
  },
  methods: {
    errorHandler(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss"></style>
