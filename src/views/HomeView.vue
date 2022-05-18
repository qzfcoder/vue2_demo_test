<template>
  <div class="home">
    <z-form :model="model" :rules="rules" ref="loginForm">
      <z-form-item label="用户名" prop="username">
        <z-input v-model="model.username"></z-input>
      </z-form-item>
      <z-form-item label="密码" prop="password">
        <z-input v-model="model.password" type="password"></z-input>
      </z-form-item>
    </z-form>
    <el-button @click="btnLogin">登录</el-button>
    <z-tree></z-tree>
  </div>
</template>

<script>
// @ is an alias to /src
import zFormItem from '@/components/zForm/zFormItem/index.vue';
import zInput from '@/components/zForm/zInput/index.vue';
import zForm from '@/components/zForm/index.vue';
import dialog from '@/utils/dialog/index';
import zTree from '@/components/zTree/index.vue';
import moban from '@/utils/dialog/index.vue';

export default {
  name: 'HomeView',
  components: {
    zFormItem,
    zInput,
    zForm,
    zTree,
  },
  data() {
    return {
      model: {
        username: '123',
        password: '',
      },
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

      rules: {
        username: [{ required: true, message: '用户名必须填写' }],
        password: [{ required: true, message: '密码必须填写' }],
      },
    };
  },
  methods: {
    btnLogin() {
      let dialogForm;
      this.$refs.loginForm.validate((isValid) => {
        if (isValid) {
          // alert("通过");
          dialogForm = dialog(moban, {
            title: '123',
            message: '通过',
          });
        } else {
          // alert("gg");
          dialogForm = dialog(moban, {
            title: '123',
            message: 'gg',
          });
        }
        // console.log(dialogForm);
        dialogForm.show();
      });
    },
  },
};
</script>
