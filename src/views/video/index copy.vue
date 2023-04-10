<template>
  <div class="trainingLearning-box">
    <div class="trainingLearning-video">
      <div class="trainingLearning-title">1111111111</div>
      <CommonVideo
        :videoData="videoData"
        @videoStudyTime="videoStudyTime"
      ></CommonVideo>
      <div class="trainingLearning-desc">1111111111</div>
    </div>
    <div class="trainingLearning-playList"></div>
  </div>
</template>

<script>
// import CommonVideo from '@/components/CommonVideo/index.vue';
import CommonVideo from '@/base-ui/CommonVideo/index.vue';
export default {
  components: { CommonVideo },
  data() {
    return {
      videoData: {
        currentTime: 0,
        duration: 0,
      },
    };
  },
  methods: {
    videoStudyTime(e) {
      console.log(e);
      this.videoData.currentTime = e.currentTime;
      this.videoData.duration = e.duration;
    },
  },
  mounted() {
    this.videoData = { duration: 169, currentTime: 20 };
  },
};
</script>

<style lang="scss" scoped>
.trainingLearning-box {
  box-sizing: border-box;
  margin: 10px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  .trainingLearning-video {
    flex: 3;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .trainingLearning-playList {
    flex: 1;
  }
}
</style>
