<template>
  <div class="home">
    <div class="st-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.name"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.address"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="warning" @click="edit(scope.row, scope)"
              >编辑</el-button
            >
            <el-button type="danger" @click="save(scope.row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <form-demo></form-demo>
    <div>================================</div>
    <table-demo></table-demo>
    <div>================================</div>
    <down-file></down-file>
  </div>
</template>

<script>
// @ is an alias to /src

import formDemo from './formDemo/index.vue';
import tableDemo from './tableDemo/index.vue';
import downFile from './downFile/index.vue';

export default {
  name: 'HomeView',
  components: {
    tableDemo,
    formDemo,
    downFile,
  },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          iseditor: false,
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          iseditor: false,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          iseditor: false,
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          iseditor: false,
        },
      ],
      formData: {
        name: '123',
        word: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
      },
    };
  },
  methods: {
    handleConfirmClick() {
      console.log(
        this.$refs.loginFormRef.$refs.elFormRef.validate((e) => {
          console.log(e);
        })
      );
    },
    handleEditClick(e) {
      console.log(e);
    },
    handleClick(e) {
      console.log(e);
    },
    edit(row, index) {
      row.iseditor = true;
    },
    save(row, index) {
      row.iseditor = false;
    },
  },
};
</script>

<style scoped>
.loginForm {
  border: 1px solid red;
}
.tableData {
  border: 1px solid blue;
}
</style>
