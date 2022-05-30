<template>
  <div>
    <h3>表格合并</h3>
    <el-table :data="list" :span-method="spanMethod" border>
      <el-table-column
        v-for="it in headers"
        :key="it.prop"
        :prop="it.prop"
        :label="it.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="addhandler(scope.$index, scope.row, true)"
            type="primary"
            size="mini"
            >新增</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'hbTable',
  data() {
    return {
      headers: [
        { prop: 'fristTarfet', label: '一级目标' },
        { prop: 'secondTarfet', label: '二级目标' },
        { prop: 'threedTarfet', label: '三级目标' },
        { prop: 'target', label: '指标值' },
      ],
      list: [
        {
          fristTarfet: '产出指标',
          secondTarfet: '数量指标',
          threedTarfet: '',
          target: '',
        },
        {
          fristTarfet: '效益指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
        },
        {
          fristTarfet: '满意度指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
        },
      ],
      typeList: [
        {
          fristTarfet: '产出指标',
          secondTarfet: '数量指标',
          threedTarfet: '',
          target: '',
        },
        {
          fristTarfet: '效益指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
        },
        {
          fristTarfet: '满意度指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
        },
      ],
      spanMethod: null,
    };
  },

  methods: {
    addhandler(index, row) {
      const that = this;
      this.list.splice(index + 1, 0, JSON.parse(JSON.stringify(row)));
      console.log(this.list);
      this.spanMethod = function ({ rowIndex, columnIndex }) {
        const sameIndexList = {};
        that.list.forEach((it, index) => {
          if (sameIndexList[it.fristTarfet] === undefined)
            sameIndexList[it.fristTarfet] = [];
          // 存储相同“类型”所在行的索引
          if (sameIndexList[it.fristTarfet])
            sameIndexList[it.fristTarfet].push(index);
        });
        if (columnIndex === 0) {
          for (const typeName in sameIndexList) {
            const firstIndex = sameIndexList[typeName][0];
            const tailIndex =
              sameIndexList[typeName][sameIndexList[typeName].length - 1];
            console.log(
              'tt',
              rowIndex,
              sameIndexList[typeName],
              firstIndex,
              tailIndex
            );
            if (rowIndex === sameIndexList[typeName][0]) {
              return {
                rowspan: tailIndex - firstIndex + 1,
                colspan: 1,
              };
            }
          }
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      };
    },
  },
};
</script>
