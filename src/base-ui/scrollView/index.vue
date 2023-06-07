<template>
  <div class="all">
    <div
      class="control left"
      v-if="showLeftBtn"
      @click="controlClickHandle(false)"
    >
      左
    </div>
    <div
      class="control right"
      v-if="showRightBtn"
      @click="controlClickHandle(true)"
    >
      右
    </div>
    <div class="scroll">
      <div class="scroll-content" ref="scrollContentRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrollWidth: 0,
      clientWidth: 0,
      totalDistanceRef: 0,
      showLeftBtn: false,
      showRightBtn: true,
      positionIndex: 0,
    };
  },
  mounted() {
    this.scrollWidth = this.$refs.scrollContentRef.scrollWidth;
    this.clientWidth = this.$refs.scrollContentRef.clientWidth;
    this.totalDistanceRef = this.scrollWidth - this.clientWidth;
  },
  methods: {
    setShowBtn() {
      let scorll = this.scrollWidth;
      let all = this.clientWidth;
      if (scorll - all) {
        this.showRightBtn = true;
      }
      if (scorll > 0) {
        this.showLeftBtn = true;
      }
    },
    controlClickHandle(isRight) {
      let newIndex = isRight ? this.positionIndex + 1 : this.positionIndex - 1;
      const newEl = this.$refs.scrollContentRef.children[newIndex];
      const newLeft = newEl.offsetLeft;
      this.$refs.scrollContentRef.style.transform = `translate(-${newLeft}px)`;
      // setPositionIndex(newIndex);
      this.positionIndex = newIndex;
      console.log('positionIndex', this.totalDistanceRef, newLeft);
      // // 是否继续显示右侧按钮
      // setShowRightBtn(totalDistanceRef.current > newLeft);
      // setShowLeftBtn(newLeft > 0);
      this.totalDistanceRef > newLeft
        ? (this.showRightBtn = true)
        : (this.showRightBtn = false);
      newLeft > 0 ? (this.showLeftBtn = true) : (this.showLeftBtn = false);
    },
  },
};
</script>

<style lang="scss" scoped>
.all {
  position: relative;
}
.scroll {
  overflow: hidden;
  .scroll-content {
    display: flex;
    transition: transform 200ms ease;
  }
}

.control {
  position: absolute;
  cursor: pointer;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  text-align: center;
  border-width: 2px;
  border-style: solid;
  border-color: #fff;
  background-color: #fff;
  box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.14);
  &.left {
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &.right {
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
}
</style>
