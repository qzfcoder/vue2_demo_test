<template>
  <div>
    <label v-if="label">
      {{ label }}
    </label>
    <slot></slot>
    <p v-if="errorMsg">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script>
import Schema from "async-validator";
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: String,
  },
  inject: ["form"],
  data() {
    return {
      errorMsg: "",
    };
  },
  mounted() {
    // 监听校验时间,并执行监听
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    validate() {
      // 执行组件校验
      // 1、获取校验规则
      // console.log(this.form.rules[this.prop]);
      const rules = this.form.rules[this.prop];
      // 获取数据
      const value = this.form.model[this.prop];

      // 执行校验方法
      const desc = {
        [this.prop]: rules,
      };
      const schema = new Schema(desc);
      // 参数一是值，
      // return 返回的是prmise的，返回true或者boolean
      return schema.validate({ [this.prop]: value }, (errors) => {
        if (errors) {
          console.log(errors);
          this.errorMsg = errors[0].message;
        } else {
          this.errorMsg = "";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
