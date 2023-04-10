<template>
  <div>
    <el-button @click="print">打印</el-button>
  </div>
</template>

<script>
import { printHTML } from './printHTML.js';
import printTemplate from './print-template.twig';
export default {
  data() {
    return {
      tableData: [
        {
          date: 1,
          name: 1,
          address: 1,
          name1: 1,
          address1: 1,
          name2: 1,
          address2: 1,
          name3: 1,
          address3: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 1,
          name: 1,
          address: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 1,
          name: 1,
          address: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 1,
          name: 1,
          address: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 1,
          name: 1,
          address: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 1,
          name: 1,
          address: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 1,
          name: 1,
          address: 1,
        },
        {
          date: 2,
          name: 2,
          address: 3,
        },
        {
          date: 3,
          name: 3,
          address: 3,
        },
        {
          date: 4,
          name: 4,
          address: 4,
        },
        {
          date: 5,
          name: 5,
          address: 5,
        },
      ],
    };
  },
  methods: {
    print() {
      let html = null;
      html = printTemplate({
        title: '员工信息表',
        list: this.tableData,
        now_time: '12312',
      });
      printHTML(html);
    },
  },
};
</script>

<style lang="scss" scoped></style>
