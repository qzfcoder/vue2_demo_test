<template>
  <div class="alllll">
    <scrollView>
      <div class="all-card" v-for="item in picList" :key="item.blurPicUrl">
        <div class="img-card"><img :src="item.blurPicUrl" alt="" />;</div>
        <div class="name">{{ item.name }}</div>
      </div></scrollView
    >
  </div>
</template>

<script>
import scrollView from '@/base-ui/scrollView';
export default {
  components: {
    scrollView,
  },
  data() {
    return {
      picList: [
        {
          blurPicUrl: require('../../assets/1.jpg'),
          name: 1,
        },
        {
          blurPicUrl: require('../../assets/1.jpg'),
          name: 2,
        },
        {
          blurPicUrl: require('../../assets/1.jpg'),
          name: 3,
        },
        {
          blurPicUrl: require('../../assets/1.jpg'),
          name: 4,
        },
        {
          blurPicUrl: require('../../assets/1.jpg'),
          name: 5,
        },
        {
          blurPicUrl: require('../../assets/1.jpg'),
          name: 6,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.alllll {
  width: 400px;
}
.all-card {
  width: 100px;
  flex-basis: 120px;
  flex-shrink: 0;
  padding: 12px 0;
  margin-right: 16px;
  border-radius: 3px;
  font-size: 17px;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  .name {
    margin-top: 5px;
    color: #000;
    font-size: 12px;
    width: 90%;
    overflow: hidden;
  }
  .writer-name {
    color: #666;
    font-size: 12px;
    width: 90%;
    overflow: hidden;
  }
  .img-card {
    height: 100px;
    box-sizing: border-box;

    img {
      /* width: 100%; */
      height: 100%;
    }
  }
}
</style>
