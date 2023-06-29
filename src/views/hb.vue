<template>
  <el-form ref="form" :model="form">
    {{ form.tableData }}
    {{ tempIndex }}
    <el-table
      :data="form.tableData"
      border
      :span-method="handleSameMerge"
      style="width: 100%"
      :header-cell-style="rowClass"
    >
      <el-table-column prop="id" label="id" width="180"> </el-table-column>
      <el-table-column prop="class_label" label="渠道分类" width="180">
      </el-table-column>
      <el-table-column
        prop="source_label"
        label="渠道来源"
        width="180"
      ></el-table-column>
      <el-table-column prop="source_label" label="渠道来源" width="180">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.source_label"
            active-text="导入"
            inactive-text="不导入"
            @change="switchChange($event, scope.row)"
          >
          </el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
// import hbT from '@/base-ui/hbT/hbTable.vue';
export default {
  data() {
    return {
      form: {
        tableData: [],
      },
      tableData: [],
      tempIndex: [],
      list: [
        {
          id: 5,
          class_code: 1,
          class_label: 'xxxxx',
          created_at: null,
          updated_at: null,
        },
        {
          id: 1,
          class_code: 1,
          class_label: '媒体',
          created_at: null,
          updated_at: null,
          source: [
            {
              id: 1,
              source_code: 31,
              source_label: '电视媒体',
              created_at: null,
              updated_at: null,
              class_code: '1',
            },
            {
              id: 17,
              source_code: 16,
              source_label: '地铁广告',
              created_at: null,
              updated_at: null,
              class_code: '1',
            },
          ],
        },
        {
          id: 2,
          class_code: 1,
          class_label: 'hhh',
          created_at: null,
          updated_at: null,
          source: [
            {
              id: 1,
              source_code: 31,
              source_label: 'test1',
              created_at: null,
              updated_at: null,
              class_code: '1',
            },
            {
              id: 17,
              source_code: 16,
              source_label: 'test2',
              created_at: null,
              updated_at: null,
              class_code: '1',
            },
            {
              id: 17,
              source_code: 16,
              source_label: 'test3',
              created_at: null,
              updated_at: null,
              class_code: '1',
            },
            {
              id: 17,
              source_code: 16,
              source_label: 'test4',
              created_at: null,
              updated_at: null,
              class_code: '1',
            },
          ],
        },
        {
          id: 4,
          class_code: 1,
          class_label: 'shiyixia',
          created_at: null,
          updated_at: null,
        },
      ],
    };
  },
  watch: {
    list: {
      handler(nv) {
        let arr = [];
        let tempMergeIndex = [];
        let pos;
        nv.forEach((item, i) => {
          if (item.source && item.source.length) {
            arr.push(item);
            let sourceArr = item.source.map((_) => {
              return {
                ..._,
                flag: i + '',
                class_label: item.class_label,
              };
            });
            arr.push(...sourceArr);
          } else {
            arr.push(item);
          }
        });
        this.tableData = arr;
        this.form.tableData = arr;
        console.log(this.tableData);
        // 处理arr，生成一个与行数相同的数组记录每一行设置的合并数
        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            tempMergeIndex.push(1);
            pos = 0;
          } else {
            if (arr[i].flag && arr[i].flag === arr[i - 1].flag) {
              tempMergeIndex[pos] += 1;
              tempMergeIndex.push(0);
            } else {
              tempMergeIndex.push(1);
              pos = i;
            }
          }
        }
        console.log(tempMergeIndex);
        this.tempIndex = tempMergeIndex;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    rowClass({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 1) {
        this.$nextTick(() => {
          document
            .getElementsByClassName(column.id)[0]
            .setAttribute('colSpan', 2);
        }); //  一定要写在加载完毕后，nextTick 更新的最晚，才能获取到dom节点。
      }
      if (rowIndex === 0 && columnIndex === 2) {
        return { display: 'none' };
      }
      // return tableHeaderStyle
    },
    // 从 tempIndex 获取当前 row 需要合并的行数
    handleSameMerge({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);
      if (columnIndex === 2 && this.tempIndex[rowIndex] == 1) {
        return [0, 0];
      }
      if (columnIndex === 1) {
        if (this.tempIndex[rowIndex] == 1) {
          return {
            rowspan: this.tempIndex[rowIndex],
            colspan: 2,
          };
        } else {
          return {
            rowspan: this.tempIndex[rowIndex],
            colspan: 1,
          };
        }
      }
      // if (this.tempIndex[rowIndex] == 1 && columnIndex === 1) {
      //   return {
      //     rowspan: 1,
      //     colspan: 2,
      //   };
      // }
    },
  },
};
</script>
