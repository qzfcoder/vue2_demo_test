<template>
  <div class="line-echarts" :id="echartsIndex" :ref="echartsIndex"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  props: {
    echartsIndex: {
      type: String,
      default: 'barCharts',
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
  watch: {
    options() {
      this.initEcharts();
    },
  },
  methods: {
    initEcharts() {
      var chartDom = document.getElementById(this.echartsIndex);
      this.myChart = echarts.init(chartDom);
      this.options && this.myChart.setOption(this.options);
      window.addEventListener('resize', () => {
        this.myChart.setOption(this.options);
        this.myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.line-echarts {
  width: 100%;
  height: 100%;
}
</style>
