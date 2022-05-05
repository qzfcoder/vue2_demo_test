<template>
  <div v-if="isShow" class="dialog">
    <p>{{ title }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
  },
  data() {
    return { isShow: false };
  },
  methods: {
    show() {
      if (this.isShow == false) {
        console.log(this.isShow, this.duration);
        this.isShow = true;
        if (this.duration) {
          setTimeout(() => {
            this.isShow = false;
            this.remove();
          }, this.duration);
        }
      }
    },
    hide() {
      this.isShow = false;
      this.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  transform: translateY(-50%);
}
</style>
