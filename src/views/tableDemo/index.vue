<template>
  <div>
    <tt-table
      :tableData="tableData"
      :showSelectCloum="true"
      v-bind="contentTableConfig"
      class="tableData"
    >
      <template #handle="scope">
        <div class="handle-btns">
          <el-button size="mini" type="text" @click="handleEditClick(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="handleClick(scope)"
            >删除</el-button
          >
        </div>
      </template>
    </tt-table>
  </div>
</template>

<script>
import ttTable from '@/base-ui/table/index.vue';
import { contentTableConfig } from './table_test';
export default {
  name: 'tableDemo',
  components: {
    ttTable,
  },
  data() {
    return {
      contentTableConfig,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    };
  },
  methods: {
    handleEditClick(e) {
      console.log(e);
    },
    handleClick(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss" scoped></style>
