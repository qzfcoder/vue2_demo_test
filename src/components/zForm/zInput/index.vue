<template>
  <!--
  form 管理数据模型-model、校验规则-rules、全局校验方法-validate
      formItem 限制标签-label、执行校验-prop和显示校验结果
              input 绑定数据模型、通知formItem校验
-->
  <div>
    <!-- v-bind="$attrs"绑定传过来的所有属性，除props外的 -->
    <input :value="value" @input="onInput" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false, // 避免顶层属性干扰
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    onInput(e) {
      // 通知父组件数值发生变化
      this.$emit("input", e.target.value);
      // 通知formitem进行校验
      this.$parent.$emit("validate"); // 不一定是parent的
    },
  },
};
</script>

<style lang="scss" scoped></style>
