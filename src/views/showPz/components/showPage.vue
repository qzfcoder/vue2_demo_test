<template>
  <div>
    <tt-form
      v-if="showForm"
      ref="loginFormRef"
      v-bind="searchFormConfig"
      v-model="formData"
      class="loginForm"
    >
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirmClick">确认</el-button>
        </span>
      </template>
    </tt-form>
    <el-button type="primary" @click="getAllMsg">获取相关信息</el-button>
  </div>
</template>

<script>
import ttForm from '@/base-ui/ttForm/index.vue';
import { mainStore } from '@/store';
import rule from '@/utils/rule';
export default {
  components: {
    ttForm,
  },
  data() {
    return {
      searchFormConfig: {},
      showForm: true,
      formData: {},
    };
  },
  methods: {
    getAllMsg() {
      this.showForm = false;
      this.searchFormConfig = {};
      this.searchFormConfig = mainStore().getCommonMsg;
      this.searchFormConfig.formItems.map((item) => {
        item.rules = rule(item.ruleSwitch, item.ruleContent ?? null);
        return item;
      });
      this.showForm = true;
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

<style lang="scss" scoped></style>
