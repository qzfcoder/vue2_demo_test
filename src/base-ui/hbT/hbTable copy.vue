<template>
  <div>
    <h3>表格合并</h3>
    <el-table :data="list" :span-method="objectSpanMethod" border>
      <template v-for="propItem in headers">
        <el-table-column v-bind="propItem" align="center" :key="propItem.prop">
          <template #default="scope">
            <slot :name="propItem.slotName" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scope">
          {{ scope.row }}
          <el-button
            v-if="scope.row.status"
            @click="addhandler(scope.$index, scope.row, scope)"
            type="primary"
            size="mini"
            >新增
          </el-button>
          <el-button
            @click="addhandler2(scope.$index, scope.row)"
            type="primary"
            size="mini"
            >新增二级</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  // 合并单元格 二维数组-> 根据“标识”去遍历数据
  data() {
    return {
      headers: [
        { prop: 'fristTarfet', label: '一级目标' },
        { prop: 'secondTarfet', label: '二级目标', slotName: 'secondTarfet' },
        { prop: 'threedTarfet', label: '三级目标', slotName: 'threedTarfet' },
        { prop: 'target', label: '指标值', slotName: 'target' },
      ],
      list: [
        {
          id: 'frist',
          fristTarfet: '产出指标',
          secondTarfet: '数量指标',
          threedTarfet: '1',
          target: '2',
          status: true,
        },

        {
          id: 'second',
          fristTarfet: '效益指标',
          secondTarfet: '2~',
          threedTarfet: '5',
          target: '6',
          status: true,
        },
        {
          id: 'threed',
          fristTarfet: '满意度指标',
          secondTarfet: '121321',
          threedTarfet: '7',
          target: '8',
          status: true,
        },
      ],
      spanArr: [], // 遍历数据时，根据相同的标识去存储记录
      pos: 0, // 二维数组的索引
      secArr: [],
      sec: 0, // 二维数组的索引
    };
  },
  methods: {
    getSpanArr(data) {
      const that = this;
      // 页面展示的数据，不一定是全部的数据，所以每次都清空之前存储的 保证遍历的数据是最新的数据。以免造成数据渲染混乱
      that.spanArr = [];
      that.pos = 0;
      that.secArr = [];
      that.sec = 0;
      // 遍历数据
      data.forEach((item, index) => {
        // 判断是否是第一项
        if (index === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          this.secArr.push(1);
          this.sec = 0;
        } else {
          // 不是第一项时，就根据标识去存储
          if (data[index].fristTarfet === data[index - 1].fristTarfet) {
            // 查找到符合条件的数据时每次要把之前存储的数据+1
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 没有符合的数据时，要记住当前的index
            this.spanArr.push(1);
            this.pos = index;
          }
          if (data[index].id === data[index - 1].id) {
            this.secArr[this.sec] += 1;
            this.secArr.push(0);
          } else {
            this.secArr.push(1);
            this.sec = index;
          }
        }
      });
    },
    // 列表方法
    objectSpanMethod({ rowIndex, columnIndex }) {
      // 页面列表上 表格合并行 -> 第几列(从0开始)
      // 需要合并多个单元格时 依次增加判断条件即可
      if (columnIndex === 0) {
        // 二维数组存储的数据 取出
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(rowIndex, 'q', _row);
        return {
          rowspan: _row,
          colspan: _col,
        };
      } else if (columnIndex === 1) {
        // 二维数组存储的数据 取出
        const _row = this.secArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      } else {
        return false;
      }
    },
    addhandler(index, row, e) {
      // 这里是通过表格中属性相同的话则会合并起来
      // 增加list中的数据，
      this.list[index].status = false;
      this.list.splice(index + 1, 0, {
        ...row,
        secondTarfet: undefined,
        status: true,
        id: this.list[index].id + 1,
      });
      this.getSpanArr(this.list);
    },
    addhandler2(index, row) {
      console.log(index, row);
      // this.list[index + 1].status = true;
      if (row.secondTarfet) {
        this.list.splice(index, 0, {
          ...row,
          status: false,
          isSecond: true,
        });
        this.getSpanArr(this.list);
      } else {
        console.log('请填写二级目标');
      }
    },
  },
  // methods中定义方法

  created() {
    this.getSpanArr(this.list);
  },
};
</script>
