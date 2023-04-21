<template>
  <div class="all_page">
    <showPage class="page_one"></showPage>
    <pz class="page_two"></pz>
  </div>
</template>

<script>
import showPage from './components/showPage.vue';
import pz from './components/pz.vue';
export default {
  components: {
    showPage,
    pz,
  },
};
</script>

<style lang="scss" scoped>
.all_page {
  display: flex;
  height: calc(100vh - 200px);
  .page_one {
    border: 1px solid red;
    flex: 2;
  }
  .page_two {
    border: 1px solid red;
    flex: 1;
    overflow: auto;
  }
}
</style>
