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
    <button @click="btnLogin">登录</button> {{ model }}
  </div>
</template>

<script>
// @ is an alias to /src
import zFormItem from "@/components/zForm/zFormItem";
import zInput from "@/components/zForm/zInput";
import zForm from "@/components/zForm";
import dialog from "@/utils/dialog/index.js";
import moban from "@/utils/dialog/index.vue";

export default {
  name: "HomeView",
  components: {
    zFormItem,
    zInput,
    zForm,
  },
  data() {
    return {
      model: {
        username: "123",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "用户名必须填写" }],
        password: [{ required: true, message: "密码必须填写" }],
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
            title: "123",
            message: "通过",
          });
        } else {
          // alert("gg");
          dialogForm = dialog(moban, {
            title: "123",
            message: "gg",
          });
        }
        // console.log(dialogForm);
        dialogForm.show();
      });
    },
  },
};
</script>
