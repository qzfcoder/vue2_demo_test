<template>
  <div>
    <!-- <wpsModel ref="wps" v-if="isWps"></wpsModel>
            <fuxinModel ref="fx"  v-else-if="isFx"></fuxinModel>
            <yongzhongModel ref="yz"  v-else-if="isYz"></yongzhongModel>
            <shukeDemo ref="sk"  v-else-if="isSk"></shukeDemo> -->
    <wpsDemoModel></wpsDemoModel>
  </div>
</template>

<script>
import fuxinModel from './fuxinModel/index.vue';
import shukeDemo from './shukeDemo/index.vue';
import wpsDemoModel from './wpsDemoModel/index.vue';
import wpsModel from './wpsModel/index.vue';
import yongzhongModel from './yongzhongModel/index.vue';
export default {
  components: {
    fuxinModel,
    shukeDemo,
    wpsDemoModel,
    wpsModel,
    yongzhongModel,
    BodyBox,
  },
  data() {
    return {
      isWps: true,
      isFx: true,
      isYz: true,
      isSk: true,
    };
  },
  mounted() {
    // let res = this.$refs.wps.InitFrame();
    // console.log(res, res == "gg", "gg表示为wps失败，初始化插件失败！！！");
    // if (res == "gg") {
    //     this.isWps = false;
    //     try {
    //         this.$refs.fx.fx_init();
    //     } catch {
    //         this.isFx = false;
    //         console.log("执行了，表示为fx失败");
    //         this.$nextTick(async () => {
    //             let res = await this.$refs.yz.openYOZO();
    //             console.log(res, "gg表示为永中失败");
    //             if (res == "gg") {
    //                 this.isYz = false;
    //                 this.$nextTick(async () => {
    //                     console.log(this.$refs.sk, "");
    //                     let res = await this.$refs.sk.initObject();
    //                     console.log(res, "zxz");
    //                     if (res == "gg") {
    //                         this.isSk = false;
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // }
  },
};
</script>

<style></style>
