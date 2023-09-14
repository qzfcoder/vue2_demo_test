<template>
  <div id="app">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @select="handleSelectChange"
      @select-all="handleSelectAllChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="日期" width="120" prop="date" />
      <el-table-column prop="name" label="姓名" width="120" />
    </el-table>
    <el-button @click="clear"> 清空 </el-button>
    <el-button @click="keys"> 获取 keys </el-button>
    <el-button @click="values"> 获取 values </el-button>
    <el-pagination
      background
      :current-page.sync="currentPage"
      layout="prev, pager, next"
      :total="1000"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import { CrossPage } from './CrossPage';
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalData: Array.from({ length: 1000 }, (_, index) => {
        return {
          date: '2016-05-03',
          id: index,
          name: '王小虎' + index,
        };
      }),
      multipleSelection: [],
    };
  },
  computed: {
    tableData() {
      const { currentPage, totalData, pageSize } = this;
      return totalData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
    },
  },
  mounted() {
    this.crossPageIns = new CrossPage({
      key: 'id',
      data: this.tableData,
      toggleRowSelection: this.$refs.multipleTable.toggleRowSelection,
    });
  },

  methods: {
    clear() {
      this.crossPageIns.clear();
    },
    keys() {
      console.log(
        '__SY__🍟 ~ keys ~ this.crossPageIns.keys:',
        this.crossPageIns.keys
      );
    },
    values() {
      console.log(
        '__SY__🍟 ~ values ~ this.crossPageIns.values:',
        this.crossPageIns.values
      );
    },
    currentChange(page) {
      this.currentPage = page;
      this.crossPageIns.onDataChange(this.tableData);
    },
    handleSelectChange(val, row) {
      this.crossPageIns.onRowSelectChange(row);
    },
    handleSelectAllChange(val) {
      console.log('__SY__🍟 ~ handleSelectAllChange ~ val:', val);
      this.tableData.forEach((row) => {
        if (val.length === 0) {
          // 取消全选
          if (this.crossPageIns.isChecked(row)) {
            this.crossPageIns.onRowSelectChange(row);
          }
        } else {
          // 全选
          if (!this.crossPageIns.isChecked(row)) {
            this.crossPageIns.onRowSelectChange(row);
          }
        }
      });
    },
  },
};
</script>
