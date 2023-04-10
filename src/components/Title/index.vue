<template>
  <div>
    <div>{{ title }}</div>
    <slot name="slot1"></slot>
    <div class="tets">
      <slot name="slot2"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.tets {
  background: red;
  width: 100px;
  // height: 100px;
}
</style>
