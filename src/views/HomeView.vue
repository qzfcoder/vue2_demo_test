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
    1
    <tt-form ref="loginFormRef" v-bind="searchFormConfig" v-model="formData">
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirmClick">确认</el-button>
        </span>
      </template>
    </tt-form>
    <div>================================</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
    <div>================================</div>
    <z-table
      :tableData="tableData"
      :showSelectCloum="true"
      v-bind="contentTableConfig"
    >
    </z-table>
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
import zTable from '@/base-ui/table/index.vue';
import ttForm from '@/base-ui/ttForm/index.vue';
import { contentTableConfig } from './table_test';
import { searchFormConfig } from './formConfig';

export default {
  name: 'HomeView',
  components: {
    zFormItem,
    zInput,
    zForm,
    zTree,
    zTable,
    ttForm,
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
      contentTableConfig,
      searchFormConfig,
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
    handleConfirmClick() {
      console.log(
        this.$refs.loginFormRef.$refs.elFormRef.validate((e) => {
          console.log(e);
        })
      );
    },
  },
};
</script>
