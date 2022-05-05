<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return { form: this }; // 传递form实例给后代
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
    },
  },
  methods: {
    validate(callback) {
      const tasks = this.$children.map((item) => item.validate());
      Promise.all(tasks).then(
        (res) => {
          console.log(res);
          callback(true);
        },
        (err) => {
          console.log(err);
          callback(false);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
