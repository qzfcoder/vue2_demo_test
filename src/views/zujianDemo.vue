<template>
  <div class="home">
    <form-demo></form-demo>
    <div>================================</div>
    <table-demo></table-demo>
  </div>
</template>

<script>
// @ is an alias to /src

import formDemo from './formDemo/index.vue';
import tableDemo from './tableDemo/index.vue';

export default {
  name: 'HomeView',
  components: {
    tableDemo,
    formDemo,
  },
  data() {
    return {
      formData: {
        name: '123',
        word: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
      },
    };
  },
  methods: {
    handleConfirmClick() {
      console.log(
        this.$refs.loginFormRef.$refs.elFormRef.validate((e) => {
          console.log(e);
        })
      );
    },
    handleEditClick(e) {
      console.log(e);
    },
    handleClick(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped>
.loginForm {
  border: 1px solid red;
}
.tableData {
  border: 1px solid blue;
}
</style>
