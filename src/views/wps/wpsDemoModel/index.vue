<template>
  <div class="wpsContent">
    <div class="imgList">
      <div class="collContent">
        <el-button
          type="primary"
          style="width: 100%"
          icon="el-icon-plus"
          :disabled="this.weekReportMsg && this.weekReportMsg.status == '1'"
          @click="chooseIndex()"
          >新增统计指标</el-button
        >
        <el-input
          style="margin-top: 5px"
          v-model="selectModel"
          suffix-icon="el-icon-search"
        ></el-input>
        <div class="collListStyle">
          <div
            class="collIndex"
            v-for="(item, index) in collList"
            :key="item.id"
          >
            <div class="topColl">
              <div class="allColl" @click="indexClick(item)">
                <span :class="item.show ? 'bottomTrangle' : 'trangle'"></span>
                <span class="text">{{ item.indexName }}</span>
              </div>
              <span class="closeText" @click="deleteIndex(item, index)"> </span>
            </div>
            <div class="bottomColl" v-if="item.show">
              <div
                class="bottomImg"
                v-if="imgloading"
                v-loading="imgloading"
              ></div>
              <div
                class="bottomImg"
                v-for="(i, index) in item.imgList"
                :key="index"
              >
                <div class="imgContent">
                  <img
                    :class="i.type == 'tableCharts' ? 'tableImg' : 'echartsImg'"
                    :src="i.picInfo"
                    alt=""
                  />
                  <span class="imgText" @click="clickImg(i, index)"> 预览</span>
                </div>
                <span class="imgTitle">{{ i.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
    <!-- </div> -->
    <div id="wpsContainer">
      <div id="wps" align="right" style="width: 100%; height: 100%"></div>
    </div>
    <baseCharts
      class="lineCharts"
      :options="getChartsList(echartsList, 'lineCharts')"
      :echartsIndex="'lineCharts'"
    >
    </baseCharts>
    <baseCharts
      class="barCharts"
      :options="getChartsList(echartsList, 'barCharts')"
      :echartsIndex="'barCharts'"
    >
    </baseCharts>
    <baseCharts
      class="lineBarCharts"
      :options="getChartsList(echartsList, 'lineBarCharts')"
      :echartsIndex="'lineBarCharts'"
    >
    </baseCharts>
    <div
      class="tableCharts"
      ref="tableCanvas"
      id="container"
      style="position: absolute; left: -5000px"
    />
    <!-- 指标多选 -->
    <el-dialog
      v-if="targetsDialogVisible"
      :title="indexType ? '指标多选' : '图表预览'"
      custom-class="selection_dialog"
      :visible.sync="targetsDialogVisible"
      :close-on-click-modal="false"
      width="85%"
    >
      <div v-if="indexType" class="indexType">
        <div class="leftTable">
          <indexPage
            ref="indexPage"
            :selectionShow="true"
            :selectionIds="selectionIds"
            :selectionRemovetemp="selectionRemovetemp"
            @selectRemovetemp="selectRemovetemp"
            :selectionMsg="selection"
            @selectReviewerIds="selectReviewerIds"
            @selectReviewerMsg="selectReviewerMsg"
          >
          </indexPage>
        </div>
        <div class="rightSelection">
          <div class="title">{{ `选中(${selection.length})` }}</div>
          <el-scrollbar class="el_scrollbarBox">
            <ul class="selectionList">
              <li v-for="(row, index) in selection" :key="index">
                <span>{{ row.indexName }}</span>
                <i
                  class="el-icon-close"
                  style="cursor: pointer"
                  @click="deleteSelection(row, index)"
                ></i>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div v-if="imgType" class="imgType">
        <img class="previewImg" :src="previewImg" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="indexType ? close('sure') : uploadImg()"
          >{{ indexType ? '确定' : '插入图表' }}
        </el-button>
        <el-button @click="close('cancel')" v-if="indexType">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';
// import { uploadImg } from '@/api/menu.js';
// import { deepClone } from '@/utils/index';
import { TableSheet } from '@antv/s2';
import { lineData } from '../echartsModel/lineCharts.js';
import { queryCycleIndex, indexInfo } from '@/api/weeklyNewspaper/index.js';
import { getSession } from '@/utils/SessionMsg';
import { debounce } from '@/utils/debounce';
import baseCharts from '../echartsModel/baseCharts.vue';
import indexPage from '../echartsModel/indexpage.vue';
import Wps from './wps-ext.js';
export default {
  components: {
    indexPage,
    baseCharts,
  },
  data() {
    return {
      options: [], //指标数据
      selectList: '',
      targetsDialogVisible: false,
      selection: [],
      collList: [],
      collListClone: [],
      packState: false,
      imgList: [],
      app: null,
      documentTmp: null,
      s2Canvas: null,
      tableImg: '',
      indexType: true,
      imgType: false,
      previewImg: '',
      selectModel: '',
      weekReportMsg: null,
      // 新增
      targetsDialogVisible: false,
      selection: [],
      selectionIds: [],
      selectionRemovetemp: [],
      imgloading: false,
      echartsList: {},
      data: {
        '2023-12': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2023-11': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2023-10': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2023-9': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2023-8': {
          absolute_value: '11.11',
          year_on_year: '-10.54',
          month_on_month: '23.12',
        },
        '2023-7': {
          absolute_value: '11.11',
          year_on_year: '-10.54',
          month_on_month: '23.12',
        },
        '2023-6': {
          absolute_value: '11.11',
          year_on_year: '-10.54',
          month_on_month: '23.12',
        },
        '2023-5': {
          absolute_value: '11.11',
          year_on_year: '-10.54',
          month_on_month: '23.12',
        },
        '2023-4': {
          absolute_value: '11.11',
          year_on_year: '-10.54',
          month_on_month: '23.12',
        },
        '2023-3': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2023-2': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2023-1': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2022-52': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2022-51': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2022-50': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
        '2022-49': {
          absolute_value: null,
          year_on_year: null,
          month_on_month: null,
        },
      },
    };
  },
  watch: {
    selectModel() {
      debounce(this.selectionList(this.selectModel), 500);
    },
    targetsDialogVisible(val) {
      let wps = document.getElementById('wps');
      if (!val) {
        wps.style.visibility = 'visible';
      } else {
        wps.style.visibility = 'hidden';
      }
    },
  },
  async created() {
    // this.$modal.loading("正在加载...");
    // this.queryCycleIndex()
  },
  async mounted() {
    this.weekReportMsg = await JSON.parse(getSession('weekReport'));
    this.$nextTick(() => {
      this.init();
    });
    // clearSession('weekReport')
  },
  methods: {
    //获取echarts options数据
    getChartsList(data, type) {
      switch (type) {
        case 'lineCharts':
          return lineData(data, Object.keys(data).length, '', 'line');
        case 'barCharts':
          return lineData(data, Object.keys(data).length, '', 'bar');
        case 'lineBarCharts':
          return lineData(data, Object.keys(data).length, '', 'line', 'bar');
      }
    },
    //初始化
    init() {
      let wps1 = Wps.createNew(document.querySelector('#wps'));
      let weekReportMsg = this.weekReportMsg;
      window.wpsExt = wps1;
      const modal = this.$modal;
      function __f() {
        try {
          wps1.apis.newDoc({});
          if (JSON.stringify(weekReportMsg) != '{}') {
            console.log(weekReportMsg, 'weekReportMsg');
            modal.closeLoading();
            if (weekReportMsg.status == '1') {
              weekReportMsg.readOnly = true;
              Wps.wpsExt.apis.openRemoteDoc(weekReportMsg);
            } else {
              weekReportMsg.readOnly = false;
              Wps.wpsExt.apis.openRemoteDoc(weekReportMsg);
            }
          }
        } catch (e) {
          modal.closeLoading();
          throw 'gg';
          // setTimeout(__f, 500);
          // return 'gg'
        }
      }

      setTimeout(__f, 500);
    },

    selectionList(str) {
      // this.collListClone.find((item) => item.indexName.includes(str));
      // this.collList;
      this.collList = this.collListClone.filter((item) =>
        item.indexName.includes(str)
      );
      console.log(this.collList, this.collListClone);
    },
    selectRemovetemp(e) {
      this.selectionRemovetemp = e;
    },
    // 获取selection
    selectReviewerIds(arr) {
      let tem = [...this.selectionRemovetemp];
      this.selectionIds = arr.filter((item) => !tem.includes(item.id));
      // this.selectionIds = [...arr];
    },
    selectReviewerMsg(arr) {
      // console.log(231213, this.selectionRemovetemp);
      let tem = [...this.selectionRemovetemp];
      this.selection = arr.filter((item) => !tem.includes(item.id));
    },
    //点击预览图片
    clickImg(img, ind) {
      this.targetsDialogVisible = true;
      this.indexType = false;
      this.imgType = true;
      this.previewImg = img.picInfo;
      if (ind == 3) {
        this.$nextTick(() => {
          var dom = document.getElementsByClassName('imgType')[0];
          dom.style.width = '60%';
        });
      } else {
        this.$nextTick(() => {
          var dom = document.getElementsByClassName('imgType')[0];
          dom.style.width = '100%';
        });
      }
    },
    //弹出框确定插入图片
    uploadImg() {
      let file = this.base64ToFile(this.previewImg);
      let formData = new FormData();
      formData.append('file', file);
      uploadImg(formData).then((res) => {
        this.insertPicture(res);
      });
    },
    //图片插入
    insertPicture(res) {
      const params = {
        height: 300,
        width: 700,
        shapeType: false,
      };
      params.picPath = res.url;
      params.horizontalPos = 1;
      params.verticalPos = 1;
      params.left = 200;
      params.top = 200;
      Wps.wpsExt.apis.insertImage(params);
      this.targetsDialogVisible = false;
    },
    //base64转file
    base64ToFile(base64, fileName) {
      // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
      let data = base64.split(',');
      // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
      let type = data[0].match(/:(.*?);/)[1];
      // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
      let suffix = type.split('/')[1];
      // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
      const bstr = window.atob(data[1]);
      // 获取解码结果字符串的长度
      let n = bstr.length;
      // 根据解码结果字符串的长度创建一个等长的整形数字数组
      // 但在创建时 所有元素初始值都为 0
      const u8arr = new Uint8Array(n);
      // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
      while (n--) {
        // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 利用构造函数创建File文件对象
      // new File(bits, name, options)
      const file = new File([u8arr], `${fileName}.${suffix}`, {
        type: type,
      });
      // 将File文件对象返回给方法的调用者
      return file;
    },
    //指标下拉框数据
    queryCycleIndex() {
      let params = {
        type: 4,
      };
      queryCycleIndex(params).then((res) => {
        this.options = res.data;
      });
    },
    //指标弹窗框确定按钮
    chooseIndex() {
      this.$nextTick(() => {
        var dom = document.getElementsByClassName('imgType')[0];
        dom.style.width = '100%';
      });
      this.indexType = true;
      this.imgType = false;
      this.selection = deepClone(this.collList);
      this.targetsDialogVisible = true;
      let tem = [];
      this.collList.forEach((item) => {
        tem.push(item.id);
      });
      this.selectionIds = tem;
    },
    //请求当前指标下的数据
    async indexInfo(indexId) {
      this.imgloading = true;
      this.imgList = [];
      this.weekReportMsg.indexId = indexId;
      let param = {
        ...this.weekReportMsg,
      };
      delete param.isImport;
      delete param.url;
      await indexInfo(param).then(async (res) => {
        for (let key in res.data) {
          if (!res.data[key]) {
            res.data[key] = {
              absolute_value: '0',
              month_on_month: '0',
              year_on_year: '0',
            };
          }
        }
        this.echartsList = deepClone(res.data);
        this.exportEcharts('lineBarCharts', indexId);
        this.exportEcharts('lineCharts', indexId);
        this.exportEcharts('barCharts', indexId);
        this.canvasTable(res.data, indexId);
      });
    },
    //echarts生成图片
    exportEcharts(id, indexId) {
      let myChart = echarts.init(document.getElementById(id));
      setTimeout(() => {
        let newIndex = this.collList.findIndex((item) => item.id == indexId);
        let picInfo = myChart.getDataURL({
          type: 'png',
          pixelRatio: 1,
          backgroundColor: 'white',
        });
        if (!this.collList[newIndex].hasOwnProperty('imgList')) {
          this.collList[newIndex].imgList = [];
        }
        switch (id) {
          case 'lineBarCharts':
            this.collList[newIndex].imgList.push({
              picInfo,
              title: '趋势图',
              type: 'lineBarCharts',
            });
            break;
          case 'lineCharts':
            this.collList[newIndex].imgList.push({
              picInfo,
              title: '折线图',
              type: 'lineCharts',
            });
            break;
          case 'barCharts':
            this.collList[newIndex].imgList.push({
              picInfo,
              title: '柱状图',
              type: 'barCharts',
            });
            break;
        }
        // this.imgloading = false;
        this.$forceUpdate();
      }, 1000);
    },
    // 获取selection
    getSelection(arr) {
      const selection = arr[0] || [];
      this.selection = selection;
    },
    // 删除 selection
    deleteSelection(row, index) {
      // console.log(row, index);
      this.$refs.indexPage.deleteSelectionRow(row);
    },
    // 关闭填框
    close(key) {
      if (key == 'sure') {
        let selection = this.selection;
        selection.map((item, index) => {
          if (index == 0) {
            item.show = true;
          } else {
            item.show = false;
          }
        });
        this.collList = deepClone(selection);
        if (
          this.collList.length &&
          !this.collList[0].hasOwnProperty('imgList')
        ) {
          this.indexInfo(this.collList[0].id);
        } else {
          this.indexClick(this.collList[0]);
        }
        this.targetsDialogVisible = false;
      } else {
        this.selection = [];
        this.targetsDialogVisible = false;
      }
    },
    //指标点击
    indexClick(item) {
      if (this.imgloading) return;
      // this.imgList = [];
      this.collList.map((list) => {
        if (list.id == item.id) {
          list.show = !list.show;
        } else {
          list.show = false;
        }
      });
      if (item && !item.hasOwnProperty('imgList')) {
        this.indexInfo(item.id);
      }
      this.$forceUpdate();
    },
    //删除指标
    deleteIndex(item, i) {
      this.collList.map((list, index) => {
        if (list.id == item.id) {
          this.collList.splice(index, 1);
        }
      });
      let index = this.selectionIds.findIndex((i) => i == item.id);
      this.selectionIds.splice(index, 1);
    },
    //保存为file文件
    savePath() {
      let base64 = this.app.saveAsBase64Str('wps');
      let file = this.downFile(base64);
      return file;
    },
    downFile(base) {
      let length = this.weekReportMsg.url.split('/');
      let title = length[length.length - 1];
      const byteString = atob(base);
      const u8Arr = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        u8Arr[i] = byteString.charCodeAt(i);
      }
      return new File([u8Arr], title.split('_')[0] + '.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }); //返回文件流
    },
    // 渲染表格
    canvasTable(res, indexId) {
      const container = document.getElementById('container');
      // const yearData = Object.keys(res);
      const list = [
        {
          field: 'absolute_value',
          name: '绝对值',
        },
        {
          field: 'month_on_month',
          name: '环比增幅(%)',
        },
        {
          field: 'year_on_year',
          name: '同比增幅(%)',
        },
      ];
      let resData = [];
      // 格式化
      for (let time in res) {
        if (res[time]) {
          // 统一加入单位
          Object.keys(res[time]).map((key) => {
            if (key != 'absolute_value') {
              if (res[time][key] == null || res[time][key] == 'null') {
                res[time][key] = '--';
              } else {
                res[time][key] = res[time][key] + '%';
              }
              // res[time][key] = res[time][key] + "%"
            }
          });
          resData.unshift({
            time: time,
            ...res[time],
          });
        } else {
          resData.unshift({
            time: time,
            absolute_value: '--',
            month_on_month: '--',
            year_on_year: '--',
          });
        }
      }
      let s2DataConfig = {
        fields: {
          columns: ['time', 'absolute_value', 'month_on_month', 'year_on_year'],
        },
        meta: [
          {
            field: 'time',
            name: '时间',
          },
          ...list,
        ],
        data: resData,
      };
      // console.log(s2DataConfig, 's2DataConfig');
      // 获取容器的width
      // const width = this.$refs.tableDiv.offsetWidth;
      const s2Options = {
        // showSeriesNumber: true,//序号
        width: 96 * 5,
        height: 30 * resData.length + 36,
      };
      if (this.s2Canvas) {
        // 更新
        this.s2Canvas.setDataCfg(s2DataConfig);
      } else {
        // 初次 创建
        this.s2Canvas = new TableSheet(container, s2DataConfig, s2Options);
      }
      this.s2Canvas.render();
      //将画布转化为图片
      setTimeout(() => {
        let baseUrl = this.$refs.tableCanvas.children[0].toDataURL('image/png');
        let newIndex = this.collList.findIndex((item) => item.id == indexId);
        this.collList[newIndex].imgList.push({
          picInfo: baseUrl,
          title: '表格',
          type: 'tableCharts',
        });
        this.imgloading = false;
        this.collListClone = deepClone(this.collList);

        this.$forceUpdate();
      }, 1100);
    },
    //指标选择
    selectChange(val) {
      this.collList.map((item) => {
        if (item.id == val) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
      if (!this.collList[val].hasOwnProperty('imgList')) {
        this.indexInfo(val);
      }
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.wpsContent {
  width: 100%;
  height: calc(100vh - 180px);
  display: flex;
  position: relative;
  overflow: hidden;

  #wpsContainer {
    width: 80%;
    height: 100%;

    .saveLocal {
      float: right;
    }
  }

  .barCharts {
    position: absolute;
    left: 3000px;
  }

  .lineBarCharts {
    position: absolute;
    left: 4000px;
  }

  .lineCharts {
    position: absolute;
    left: 5000px;
  }

  .tableCharts {
    position: absolute;
    left: 6000px;
  }

  .imgList {
    width: 25%;
    height: 100%;
    background-color: #fff;
    padding: 10px;
    margin-right: 10px;

    .collContent {
      height: 100%;
    }

    .collListStyle {
      margin-top: 10px;
      height: 88%;
      overflow: auto;

      .collIndex {
        .topColl {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f8f8f8;
          padding: 10px;
          border-bottom: 1px solid #ccc;

          .allColl {
            display: flex;
            align-items: center;
            cursor: pointer;

            .trangle {
              width: 0;
              height: 0;
              border-right: 6px solid transparent;
              border-left: 6px solid transparent;
              border-top: 6px solid #5e6166;
              transform: rotate(-90deg);
            }

            .bottomTrangle {
              width: 0;
              height: 0;
              border-right: 6px solid transparent;
              border-left: 6px solid transparent;
              border-top: 6px solid #5e6166;
            }

            .text {
              font-size: 16px;
              font-weight: 500;
              margin-left: 10px;
            }
          }

          .closeText {
            cursor: pointer;
            box-sizing: border-box;

            .delete {
              width: 18px;
              height: 18px;
              vertical-align: middle;
            }
          }
        }

        .bottomColl {
          width: 100%;
          height: 100%;
          padding-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;

          .bottomImg {
            width: 48%;
            height: 160px;
            margin-top: 10px;
            padding: 10px;
            text-align: center;

            .imgContent {
              position: relative;
              width: 100%;
              height: 100%;

              &:hover {
                border: 1px solid #c61f17;

                & > .imgText {
                  visibility: inherit;
                }
              }

              .echartsImg {
                width: 100%;
                height: 100%;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                padding: 10px;
                box-sizing: border-box;
                border: 1px solid #ccc;
              }

              .imgText {
                position: absolute;
                width: 100%;
                height: 26px;
                line-height: 26px;
                left: 0;
                bottom: 0;
                font-size: 14px;
                color: #c61f17;
                background-color: #f1f1f1;
                visibility: hidden;
                cursor: pointer;

                .icon {
                  width: 18px;
                  height: 12px;
                  vertical-align: middle;
                }
              }

              .tableImg {
                width: 100%;
                height: 100%;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                padding: 10px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                position: relative;
              }
            }

            .imgTitle {
              display: inline-block;
              margin-top: 4px;
              font-size: 16px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  ::v-deep.selection_dialog {
    .el-dialog__body {
      background-color: #f7f7f7;
      display: flex;
      padding: 20px 20px;
      display: flex;
      justify-content: center;
    }

    .indexType {
      display: flex;

      .leftTable {
        width: 78%;
        border-radius: 8px;
        overflow: hidden;
        margin-right: 2%;
        padding: 10px 10px 0 10px;
        height: 100%;
        background-color: #ffffff;
      }

      .rightSelection {
        width: 20%;
        border-radius: 8px;
        overflow: hidden;
        background-color: #ffffff;

        .title {
          text-align: center;
          line-height: 36px;
          border-bottom: 1px solid #ccc;
          padding: 5px 10px;
        }

        ul,
        li {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .selectionList {
          padding: 10px 10px 40px 10px;

          li {
            display: flex;
            line-height: 20px;
            background-color: #d10914;
            color: #fff;
            padding: 8px 5px 8px 15px;
            margin-bottom: 5px;
            align-items: center;
            border-radius: 5px;

            span {
              flex: 1;
            }

            i {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }

    .imgType {
      width: 100%;
      height: 100%;

      .previewImg {
        width: 100%;
        height: 100%;
      }
    }
  }

  ::v-deep .selection_dialog {
    .el-dialog__body {
      height: 72vh;
      overflow: hidden;

      .el_scrollbarBox {
        height: 100%;

        .el-scrollbar__wrap {
          overflow-x: hidden;
          height: 100%;
        }
      }
    }
  }
}
</style>
