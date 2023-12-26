<template>
  <div>
    <wpsModel ref="wps" v-if="isWps"></wpsModel>
    <!-- <wpsDemoModel ref="demo" v-else-if="isDemo"></wpsDemoModel>
      <fuxinModel ref="fx" v-else-if="isFx"></fuxinModel>
      <yongzhongModel ref="yz" v-else-if="isYz"></yongzhongModel>
      <shukeDemo ref="sk" v-else></shukeDemo> -->
    <template slot="button">
      <el-button type="primary" icon="el-icon-download" @click="downloadReport"
        >下载报告</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-s-order"
        @click="onlineSave"
        :disabled="weekReportMsg && weekReportMsg.status == '1'"
        >在线保存</el-button
      >
    </template>
  </div>
</template>

<script>
// import fuxinModel from './fuxinModel/index.vue';
// import shukeDemo from './shukeDemo/index.vue';
// import wpsDemoModel from './wpsDemoModel/index.vue';
import wpsModel from './wpsModel/index.vue';
// import yongzhongModel from './yongzhongModel/index.vue';
// import { getSession, clearSession } from '@/utils/SessionMsg';
// import { httpApi } from '@/api/publicApi';
// import { uploadImg } from '@/api/menu.js';
// import { downloadfun } from '@/utils/downPDF';
export default {
  components: {
    // fuxinModel,
    // shukeDemo,
    // wpsDemoModel,
    wpsModel,
    // yongzhongModel,
  },
  data() {
    return {
      isWps: true,
      isFx: true,
      isYz: true,
      isSk: true,
      isDemo: true,
      downLoadUrl: '',
      // weekReportMsg: JSON.parse(getSession('weekReport')),
    };
  },
  mounted() {
    setTimeout(() => {
      let res = this.$refs.wps.InitFrame();
      console.log(res, res == 'gg', 'gg表示为wps失败，初始化插件失败！！！');
      if (res == 'gg') {
        this.isWps = false;
        try {
          let res = this.$refs.demo.init();
          console.log(res, 'gg表示为demo失败');
          if (res == 'gg') {
            this.isDemo = false;
          }
        } catch {
          try {
            this.$refs.fx.fx_init();
          } catch {
            this.isFx = false;
            console.log('执行了，表示为fx失败');
            this.$nextTick(async () => {
              let res = await this.$refs?.yz?.openYOZO();
              console.log(res, 'gg表示为永中失败');
              if (res == 'gg') {
                this.isYz = false;
              }
            });
          }
        }
      }
    });
    if (this.weekReportMsg.status != '1') {
      window.setInterval(() => {
        setTimeout(() => {
          this.onlineSave();
        }, 0);
      }, 300000);
    }
  },
  beforeDestroy() {
    window.clearInterval();
  },
  methods: {
    //下载报告
    async downloadReport() {
      // let weekReportMsg = JSON.parse(getSession('weekReport'));
      // var week;
      // if (weekReportMsg && weekReportMsg.status != '1') {
      //   await this.onlineSave();
      // } else {
      //   this.downLoadUrl = weekReportMsg.url;
      // }
      // if (weekReportMsg.year) {
      //   week =
      //     weekReportMsg?.year +
      //     '年第' +
      //     weekReportMsg?.timeIndex +
      //     '周周报' +
      //     '.docx';
      // } else {
      //   week = weekReportMsg.week + '.docx';
      // }
      // downloadfun(week, this.downLoadUrl);
    },
    // 在线保存
    async onlineSave() {
      // let file = this.$refs.wps.savePath();
      // let weekReportMsg = JSON.parse(getSession('weekReport'));
      // let url = file ? await this.uploadImg(file) : weekReportMsg.url;
      // this.downLoadUrl = url;
      // let param = {
      //   ...weekReportMsg,
      //   url: url,
      // };
      // await httpApi('/indexReport/saveReport', 'post', param).then((res) => {
      //   if (res.code == 200) {
      //     this.$message.success('保存成功');
      //   }
      // });
    },
    uploadImg(file) {
      // let formData = new FormData();
      // formData.append('file', file);
      // return uploadImg(formData).then((res) => {
      //   return res.url;
      // });
    },
  },
};
</script>

<style></style>
