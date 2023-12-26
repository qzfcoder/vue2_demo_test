<template>
  <div class="wpsContent">
    <!-- <div class="imgList">
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
          <div class="collIndex" v-for="item in collList" :key="item.id">
            <template v-if="!item.displayNone">
              <div class="topColl">
                <div class="allColl" @click="indexClick(item)">
                  <span :class="item.show ? 'bottomTrangle' : 'trangle'"></span>
                  <span class="text">{{ item.indexName }}</span>
                </div>
                <span class="closeText" @click="deleteIndex(item)"> </span>
              </div>
              <div class="bottomColl" v-if="item.show">
                <div
                  class="bottomImg"
                  v-if="imgloading"
                  v-loading="imgloading"
                ></div>
                <div
                  class="bottomImg"
                  v-loading="imgloading"
                  v-for="(i, index) in item.imgList"
                  :key="index"
                >
                  <div class="imgContent">
                    <img
                      :class="
                        i.type == 'tableCharts' ? 'tableImg' : 'echartsImg'
                      "
                      :src="i.picInfo"
                      alt=""
                    />
                    <span class="imgText" @click="clickImg(i, index)">
                      预览</span
                    >
                  </div>
                  <span class="imgTitle">{{ i.title }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div> -->
    <!-- </div> -->
    <div id="wpsContainer">
      <div id="wps" align="right" style="width: 100%; height: 100%"></div>
    </div>
    <!-- <baseCharts
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
    <el-dialog
      v-if="targetsDialogVisible"
      :close="dialogClose"
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
    </el-dialog> -->
  </div>
</template>

<script>
// import * as echarts from 'echarts';
// import { uploadImg } from '@/api/menu.js';
import { deepClone } from '@/utils/deepclone';
// import { TableSheet } from '@antv/s2';
// import { queryCycleIndex, indexInfo } from '@/api/weeklyNewspaper/index.js';
// import { getSession, clearSession } from '@/utils/SessionMsg';
// import { debounce } from '@/utils/debounce';
// import indexPage from '../echartsModel/indexpage.vue';
// import baseCharts from '../echartsModel/baseCharts.vue';
// import { lineData } from '../echartsModel/lineCharts.js';
export default {
  components: {
    // baseCharts,
    // indexPage,
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
      obj: null,
      app: null,
      documentTmp: null,
      s2Canvas: null,
      tableImg: '',
      indexType: true,
      imgType: false,
      previewImg: '',
      selectModel: '',
      weekReportMsg:
        'http://10.54.89.46:9087/profile/upload/2023/12/20/KT-%E7%BB%88%E7%AB%AF%E7%94%B3%E8%AF%B720230908105043_20231220120142A012.pdf',
      // 新增
      selectionIds: [],
      selectionRemovetemp: [],
      imgloading: false,
      echartsList: {},
    };
  },
  watch: {
    selectModel() {
      // if (this.selectModel) {
      //   debounce(this.selectionList(this.selectModel), 500);
      // } else {
      //   this.collList = this.collList.map((item) => {
      //     item.displayNone = false;
      //     return item;
      //   });
      // }
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
  created() {
    this.$modal.loading('正在加载...');
    // this.queryCycleIndex()
  },
  async mounted() {
    // this.weekReportMsg = await JSON.parse(getSession('weekReport'));
    this.$nextTick(() => {
      this.InitFrame();
    });
    // clearSession('weekReport')
  },
  methods: {
    init(tagID, w, h) {
      var iframe;
      iframe = document.getElementById(tagID);
      iframe.innerHTML = '';
      var codes = [];
      codes.push(
        "<object  name='webwps' id='webwps_id' type='application/x-wps' width='100%' height='100%'> <param name='Enabled' value='1' />  </object>"
      );

      iframe.innerHTML = codes.join('');
      this.obj = document.getElementById('webwps_id');

      window.onbeforeunload = function () {
        this.obj.Application.Quit();
      };

      window.onresize = function () {
        this.obj.sltReleaseKeyboard();
      };
      return this.obj.Application;
    },
    InitFrame() {
      let app = this.init('wps', '100%', '100%');
      if (!app) {
        // console.log('初始化插件失败！！！');
        return 'gg';
      } else {
        this.app = deepClone(app);
        const status = this.weekReportMsg.status;
        if (JSON.stringify(this.weekReportMsg) != '{}') {
          if (status == '1') {
            setTimeout(() => {
              app.openDocumentRemote_s(this.weekReportMsg.url, true);
              app.openDocumentRemote(this.weekReportMsg.url, true);
            }, 1000);
          } else {
            setTimeout(() => {
              app.openDocumentRemote_s(this.weekReportMsg.url, false);
              app.openDocumentRemote(this.weekReportMsg.url, false);
            }, 1000);
          }
        }
        this.createDocument();
      }
    },
    createDocument() {
      this.obj.EnterEditMode(); // 解决新建之后立马能输入 QuitEditMode  sltReleaseKeyboard
      this.app.createDocument('wps');
    },
    // 点击预览图片
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
    // //弹出框确定插入图片
    // uploadImg() {
    //   let file = this.base64ToFile(this.previewImg);
    //   let formData = new FormData();
    //   formData.append('file', file);
    //   uploadImg(formData).then((res) => {
    //     this.insertPicture(res.url);
    //   });
    // },
    // wps插入图片
    insertPicture(url) {
      this.app.insertPicture(url);
      this.targetsDialogVisible = false;
    },
    // base64转file
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
      }); // 返回文件流
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
