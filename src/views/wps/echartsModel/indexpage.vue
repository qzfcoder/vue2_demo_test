<template>
  <div class="page-container card_style">
    <div class="pageBox">
      <div class="search">
        <div class="searchForm">
          <el-form
            ref="queryForm"
            :model="queryParams"
            :inline="true"
            label-width="80px"
          >
            <el-col :span="12">
              <el-form-item label="指标类型" prop="indexType">
                <el-select
                  v-model="queryParams.indexType"
                  placeholder="请选择指标类型"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.index_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分类" prop="category">
                <el-select
                  v-model="queryParams.category"
                  placeholder="请选择分类"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.index_classification"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="指标名称" prop="indexName">
                <el-input
                  v-model="queryParams.indexName"
                  placeholder="请输入指标名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上报单位" prop="reportOrgId">
                <!-- <treeselect
                  class="treeselect-class"
                  v-model="queryParams.reportOrgId"
                  :options="deptOptions"
                  :normalizer="normalizer"
                  placeholder="选择上报单位"
                /> -->
                <treeselect
                  class="treeselect-class"
                  v-model="queryParams.reportOrgId"
                  :options="deptOptions"
                  placeholder="选择上报部门"
                  clearable
                  :normalizer="normalizer"
                  :async="Isasync"
                  :default-expand-level="defaultLevel"
                  :load-options="Isasync ? asyncOptions : loadOptions"
                  @input.native="onpropertychange()"
                  @keydown.native="assetTreeKeydownFun"
                  @open="itemopen()"
                  @close="itemClose()"
                  @keyup.native="assetTreeKeyupFun($event)"
                  no-options-text="暂无可用选项"
                  noChildrenText="数据加载中"
                  noResultsText="暂无匹配项"
                  loadingText="数据加载中"
                  no-results-text="没有匹配的搜索结构"
                  searchPromptText="正在搜索"
                  :appendToBody="true"
                  z-index="9999"
                  :beforeClearAll="beforeClearAll"
                />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="btn-box">
          <el-button type="primary" @click="handleQuery" icon="el-icon-search"
            >搜索</el-button
          >
          <el-button type="primary" @click="reset" icon="el-icon-refresh"
            >重置</el-button
          >
        </div>
      </div>
      <div class="bot">
        <div class="content">
          <div class="tableBox">
            <el-table
              ref="metricTable"
              height="200px"
              :data="indexList"
              @select="selectHandle"
              :row-key="getRowKey"
              @select-all="handleSelectAll"
            >
              <el-table-column
                v-if="selectionShow"
                type="selection"
                :reserve-selection="true"
                align="center"
                width="55"
              />
              <el-table-column
                width="80"
                label="序号"
                type="index"
                align="center"
              />
              <el-table-column label="指标类型" align="center" prop="indexType">
                <template slot-scope="scope">
                  {{ echoData(scope.row.indexType, dict.type['index_type']) }}
                </template>
              </el-table-column>
              <el-table-column label="分类" align="center" prop="category">
                <template slot-scope="scope">
                  {{
                    echoData(
                      scope.row.category,
                      dict.type['index_classification']
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="指标名称"
                align="center"
                prop="indexName"
              />
              <el-table-column
                label="上报单位"
                align="center"
                prop="reportOrgStr"
              ></el-table-column>
              <el-table-column label="统计频率" align="center" prop="frequency">
                <template slot-scope="scope">
                  {{
                    scope.row.frequency
                      ? selectDictLabels(frequencyOptions, scope.row.frequency)
                      : '-'
                  }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 页码 -->
        <div class="paginationDiv">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            layout="total, prev, pager, next"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 指标管理
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { echoData } from '@/utils/public';
import { httpApi } from '@/api/publicApi';
import { getSession } from '@/utils/SessionMsg';
import mixinX from '@/minx/index.js';
export default {
  name: 'metricSelection',
  mixins: [mixinX],
  components: { Treeselect },
  dicts: [
    'index_classification',
    'index_type',
    'index_update_frequency',
    'index_unit_measure',
    'index_model',
  ],
  props: {
    selectionShow: {
      type: Boolean,
      default: false,
    },
    selectionIds: {
      type: Array,
      default: () => [],
    },
    selectionMsg: {
      type: Array,
      default: () => [],
    },
    selectionRemovetemp: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexName: undefined,
        category: undefined,
        indexType: undefined,
        frequency: undefined,
        reportOrgId: undefined,
      }, //搜索 form
      indexList: [], //列表数据
      total: 0,
      deptOptions: [], // 部门树选项
      form: {
        isEnable: '1',
      }, //新增 修改 form

      ids: [],
      selectIds: [], // 选中区
      removetemp: [], // 删除区
      selectMsg: [],
      frequencyOptions: [],
    };
  },
  watch: {
    selectId: {
      handler(val, oldValue) {
        // console.log(val);
        if (val && val?.length > 0) {
          this.selectIds = [...val];
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getDict();
    this.selectMsg = [...this.selectionMsg];
    if (this.selectMsg.length) {
      this.selectIds = [...this.selectionIds];
    } else {
      this.selectIds = [];
    }
    this.removetemp = [...this.selectionRemovetemp];
    // 获取部门three
    this.getDeptList();
    let weekReportMsg = JSON.parse(getSession('weekReport'));
    this.queryParams.frequency = weekReportMsg.type;
    this.queryParams.year = weekReportMsg.year;
    this.queryParams.timeIndex = weekReportMsg.timeIndex;
    this.getList();
  },
  methods: {
    async getDict() {
      //频率字典
      await this.getDicts('index_update_frequency').then((response) => {
        this.frequencyOptions = response.data;
      });
    },
    getRowKey(row) {
      return row.id;
    },

    // 获取table数据
    async getList() {
      let params = {
        pageNum: 1,
        pageSize: 10,
        frequency: 4,
        year: 2023,
        timeIndex: 13,
      };
      let res = await httpApi('/index/model/selectReportIndexList', 'get', {
        ...params,
      });
      this.indexList = res.rows;
      this.total = res.total;
      const selectIds = this.selectIds;
      const removetemp = this.removetemp;
      this.$nextTick(() => {
        this.indexList.forEach((item) => {
          let result = selectIds.includes(item.id);
          if (removetemp.includes(item.id)) {
            result = false;
          }
          this.$refs.metricTable.toggleRowSelection(item, result);
        });
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.resetForm('queryForm');
      this.getList();
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    async handleSelectAll(selection) {
      let len = this.selectIds.length - this.removetemp.length;
      let tem = await selection.map((item) => item.id);
      this.selectIds = [...new Set([...this.selectIds, ...tem])];
      this.selectMsg = await this.uniqueFunc(
        this.selectMsg.concat(selection),
        'id'
      );
      if (len < selection.length) {
        // console.log("在增加");
        // 这两个是总共的集合

        // ending
        // 对删除区域的控制
        let temid = await this.indexList.map((item) => item.id);
        const arr3 = await this.removetemp.filter((x) => temid.indexOf(x) < 0);
        this.removetemp = [...arr3];
        // ending
        // console.log(this.selectMsg);
      } else {
        // console.log("在减少", selection, this.selectIds);
        let nowPageList = await this.indexList.map((item) => item.id);
        // console.log(nowPageList);
        this.selectIds = await this.selectIds.filter(
          (x) => nowPageList.indexOf(x) < 0
        );
        this.selectMsg = await this.selectMsg.filter(
          (x) => nowPageList.indexOf(x.id) < 0
        );
        const arr3 = await this.removetemp.filter(
          (x) => nowPageList.indexOf(x) < 0
        );
        this.removetemp = [...arr3];
      }

      this.selectReviewer();
    },
    uniqueFunc(arr, uniId) {
      //第一个参数是合并后的数组，第二个参数是去重的属性
      const res = new Map();
      return arr.filter(
        (item) => !res.has(item[uniId]) && res.set(item[uniId], 1)
      );
    },
    // 选中的 slection
    selectReviewer() {
      const removetemp = this.removetemp;
      const selectIds = this.selectIds;
      const selectMsg = this.selectMsg;
      // const temp = selectIds.filter((item) => !removetemp.includes(item));
      // const tempMsg = selectMsg.filter((item) => !removetemp.includes(item.id));
      this.$emit('selectRemovetemp', removetemp);
      this.$emit('selectReviewerMsg', selectMsg);
      this.$emit('selectReviewerIds', selectIds);
    },
    // 单行选中状态切换
    selectHandle(selection, row) {
      const { id } = row;
      const selectIds = this.selectIds; // 选中区
      const removetemp = this.removetemp; // 删除区
      const selectMsg = this.selectMsg; // 选中信息
      const isDeleteCurRow =
        selection.findIndex((item) => item.id == id) >= 0 ? false : true;

      if (isDeleteCurRow) {
        // 在【选中区】，移除到 【删除区】
        if (!removetemp.includes(id)) this.removetemp.push(id);
        const index = selectIds.findIndex((item) => item == id);
        const indexMsg = selectMsg.findIndex((item) => item.id == id);
        if (index >= 0) {
          // 从【选中区】移除
          this.selectIds.splice(index, 1);
        }
        if (indexMsg >= 0) {
          this.selectMsg.splice(indexMsg, 1);
        }
      } else {
        // 没在【选中区】，移入到【选中区】
        const index = removetemp.findIndex((item) => item == id);
        const indexMsg = selectMsg.findIndex((item) => item.id == id);
        if (index >= 0) {
          // 从【删除区】移除
          this.removetemp.splice(index, 1);
          // this.selectMsg.splice(indexMsg, 1);
        }
        if (indexMsg >= 0) {
          this.selectMsg.splice(indexMsg, 1);
        }
        const awaitMsg = selection.filter(
          (item) => !selectIds.includes(item.id)
        );
        const awaitPush = awaitMsg.map((item) => item.id);
        this.selectIds = [...selectIds, ...awaitPush];
        this.selectMsg = [...selectMsg, ...awaitMsg];
      }
      // console.log(this.selectMsg);
      this.$emit('selectRemovetemp', this.removetemp);
      this.$emit('selectReviewerMsg', this.selectMsg);
      this.$emit('selectReviewerIds', this.selectIds);
    },
    getremovetemp() {
      return this.removetemp;
    },
    deleteSelectionRow(row) {
      // 没在【选中区】，移入到【选中区】
      const index = this.selectIds.findIndex((item) => item == row.id);
      const indexMsg = this.selectMsg.findIndex((item) => item.id == row.id);
      // console.log(index, indexMsg, 111111111);
      if (index >= 0) {
        // 从【删除区】移除
        this.selectIds.splice(index, 1);
        this.selectMsg.splice(indexMsg, 1);
      }
      this.removetemp = [...new Set([...this.removetemp, row.id])];
      this.$nextTick(() => {
        this.indexList.forEach((item) => {
          // let result = selectIds.includes(item.id);
          if (item.id == row.id) {
            this.$refs.metricTable.toggleRowSelection(item, false);
          }
        });
      });
      this.$emit('selectRemovetemp', this.removetemp);
      this.$emit('selectReviewerMsg', this.selectMsg);
      this.$emit('selectReviewerIds', this.selectIds);
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    //table 回显数据
    echoData,
  },
};
</script>
<style lang="scss" scoped>
.card_style {
  background-color: #fff;
  height: 100%;
}

::v-deep.vue-treeselect__control {
  height: 36px !important;
}

::v-deep .el-table {
  height: 100% !important;
}

.pageBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .search {
    display: flex;
    justify-content: space-between;

    .searchForm {
      flex: 1;

      .frequency-label {
        display: flex;
        align-items: center;
        justify-content: end;

        .wenhao {
          margin-left: 3px;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .label-content {
          color: #d10914;
        }
      }
    }

    .btn-box {
      width: 300px;
      display: flex;
      align-items: flex-end;
      margin-bottom: 27px;
    }
  }

  .bot {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    // flex-wrap: wrap;

    .content {
      border-top: 1px solid #ccc;
      flex: 1;
      overflow: hidden;

      // min-height: 38vh;
      .tableBox {
        height: 100%;
        width: 100%;
      }
    }

    .paginationDiv {
      width: 100%;
    }
  }
}

::v-deep.vue-treeselect__input {
  line-height: 36px;
}
</style>
