<template>
  <div>
    <tt-form
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
  </div>
</template>

<script>
import ttForm from '@/base-ui/ttForm/index.vue';
import { searchFormConfig } from './formConfig';
export default {
  components: {
    ttForm,
  },
  data() {
    return {
      searchFormConfig,
      formData: {
        checkboxsa: [],
        asaaaada: 1,
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
  },
};
</script>

<style lang="scss" scoped></style>
