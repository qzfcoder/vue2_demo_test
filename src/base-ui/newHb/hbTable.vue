<template>
  <div>
    <el-table
      v-if="isDelate"
      class="hbTable"
      :data="list"
      :span-method="objectSpanMethod"
      border
      :cell-style="{ borderColor: '#59aefe' }"
      :header-cell-style="{ borderColor: '#59aefe' }"
    >
      <template v-for="propItem in headers">
        <el-table-column v-bind="propItem" align="center" :key="propItem.prop">
          <template #default="scope">
            <slot :name="propItem.slotName" :row="scope.row" :list="list">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        v-if="option && !(this.$route.query.changeType == 'detail')"
        class="options"
      >
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button
              v-if="scope.row.isSecShow && !noEr"
              @click="addhandler(scope.$index, scope.row, scope)"
              type="primary"
              size="mini"
              plain
              :disabled="isDetail"
              >新增二级
            </el-button>
            <el-button
              v-if="scope.row.isThreedShow"
              @click="addhandler2(scope.$index, scope.row)"
              type="primary"
              size="mini"
              plain
              :disabled="isDetail"
              >新增三级</el-button
            >
            <!-- 若是二级固定的不能删除的时候，删除按钮做了一下区分 -->
            <span
              class="xian"
              v-if="!scope.row.isNoCanDel && scope.row.isThreedShow"
              >|</span
            >
            <el-button
              type="danger"
              icon="el-icon-del"
              size="mini"
              :disabled="isDetail"
              v-if="!scope.row.isNoCanDel"
              @click="delate(scope.$index, scope.row)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepClone } from '@/utils/deepclone.js';
const MAX_SECONDE_NUM = 8; // 二级最大条目数
const MAX_THREE_NUM = 8; // 三级最大条目数

const COLUMN_LEVEL = {
  second: 2,
  threed: 3,
};

export default {
  props: {
    newlist: {
      type: Array,
      required: true,
    },
    option: {
      type: Boolean,
      default: true,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    noEr: {
      type: Boolean,
      default: false,
    },
  },
  // 合并单元格 二维数组-> 根据“标识”去遍历数据
  data() {
    return {
      isDelate: true,
      headers: [
        { prop: 'fristTarfet', label: '一级目标' },
        { prop: 'secondTarfet', label: '二级目标', slotName: 'secondTarfet' },
        { prop: 'threedTarfet', label: '三级目标', slotName: 'threedTarfet' },
        { prop: 'target', label: '指标值', slotName: 'target' },
      ],
      list: [
        {
          id: 'frist_',
          fristTarfet: '产出指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
          isSecShow: true,
          isThreedShow: true,
          isNoCanDel: true,
          allSecondKinds: 1,
        },

        {
          id: 'second_',
          fristTarfet: '效益指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
          isSecShow: true,
          isThreedShow: true,
          isNoCanDel: true,
          allSecondKinds: 1,
        },
        {
          id: 'threed_',
          fristTarfet: '满意度指标',
          secondTarfet: '',
          threedTarfet: '',
          target: '',
          isSecShow: true,
          isThreedShow: true,
          isNoCanDel: true,
          allSecondKinds: 1,
        },
      ],
      spanArr: [], // 遍历数据时，根据相同的标识去存储记录
      pos: 0, // 二维数组的索引
      secArr: [],
      sec: 0,
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
        // console.log(rowIndex, "q", _row);
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
      this.list[index].isSecShow = false;
      this.list[index].isThreedShow = true;
      this.list.splice(index + 1, 0, {
        ...row,
        secondTarfet: undefined,
        threedTarfet: '',
        target: '',
        isSecShow: false,
        isThreedShow: false,
        isNoCanDel: false, // 后续都能删除
        id: this.list[index].id + 1,
        allSecondKinds: (row.allSecondKinds || 1) + 1,
      });

      this.checkAllBtn(row);
      this.getSpanArr(this.list);
    },
    addhandler2(index, row) {
      if (row.secondTarfet) {
        this.list.splice(index + 1, 0, {
          ...row,
          isSecShow: false,
          isSecond: false,
          threedTarfet: '',
          target: '',
          isNoCanDel: false, // 后续都能删除
        });

        this.checkAllBtn(row);

        this.getSpanArr(this.list);
      } else {
        this.$message({
          message: '请填写二级目标',
          type: 'error',
        });
        return;
      }
    },
    delate(index, row) {
      //  只要删除了，数量就一定小于MAX_NUM (最大条数)
      const list = this.list;
      list.splice(index, 1);

      this.list = [...list];

      this.$nextTick(() => {
        this.checkAllBtn(row);
        this.getSpanArr(this.list);
      });
    },

    checkAllBtn(row) {
      const secondeList = this.getSecondMarketList(
        this.list,
        'fristTarfet',
        row.fristTarfet
      );
      const threeList = this.getSecondMarketList(this.list, 'id', row.id);

      this.switchAddBtn(secondeList, COLUMN_LEVEL.second, row);
      if (this.noEr) {
        this.switchDel(secondeList, COLUMN_LEVEL.second, row);
      }
      this.switchAddBtn(threeList, COLUMN_LEVEL.threed, row);
    },

    // 返回指定标识的数据  2级或3级
    getSecondMarketList(origin, markkey, onlyKey) {
      const temp = origin.filter((item) => item[markkey] == onlyKey);
      return temp;
    },

    // 控制新增按钮
    switchAddBtn(list, level, curRow) {
      const lastItem = list[list.length - 1]; //
      if (level == COLUMN_LEVEL.second) {
        list.forEach((item) => {
          item.isSecShow = false;
        });

        // 最后一个2级的所有数据
        const lastSecond = this.getSecondMarketList(list, 'id', lastItem.id);
        // 最后一个2级下的- 最后一个3级
        const lastSecondLastThree = lastSecond[lastSecond.length - 1];
        if (lastSecondLastThree) {
          lastSecondLastThree.isSecShow =
            lastSecondLastThree.allSecondKinds < MAX_SECONDE_NUM;
          lastSecondLastThree.isThreedShow = true;
        }
      } else if (level == COLUMN_LEVEL.threed) {
        // 当前2级下的所有数据----指代3级数据
        const curSecondList = this.getSecondMarketList(list, 'id', curRow.id);
        curSecondList.forEach((item) => (item.isThreedShow = false));

        const lastThree = curSecondList[curSecondList.length - 1];
        if (lastThree) {
          lastThree.isThreedShow = curSecondList.length < MAX_THREE_NUM;
        }
      }
    },
    // 控制删除按钮
    switchDel(list, level, curRow) {
      if (list.length === 1) {
        this.list.forEach((item) => {
          if (item.id === list[0].id) {
            item.isNoCanDel = true;
          }
        });
      }
    },
    async resert(list) {
      const newList = await deepClone(list);
      this.list = newList;
      await this.getSpanArr([...newList]);
    },
  },
  // methods中定义方法
  mounted() {
    if (!this.option) {
      this.list = [...this.newlist];
    } else {
      if (
        this.$route.query.changeType == 'edit' ||
        this.$route.query.changeType == 'detail' ||
        this.noEr
      ) {
        this.list = [...this.newlist];
      }
    }

    this.getSpanArr(this.list);
  },
};
</script>
<style scoped lang="scss">
.hbTable {
  border: 1px solid #59aefe;
}
.xian {
  display: inline-block;
  margin: auto 10px;
  transform: scale(1.5);
  color: #59aefe;
}
::v-deep .el-button--danger {
  width: 30px;
  height: 30px;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(236, 114, 94, 0.2) !important;
  border-color: rgba(236, 114, 94, 0.2) !important;
}
::v-deep .el-button--danger:hover {
  background-color: rgba(236, 114, 94, 0.3) !important;
}
::v-deep .el-icon-del::before {
  content: '12';
  background-color: red;
  color: rgba(255, 255, 255, 0);

  width: 12px;
  height: 12px;
  background: url('../../../../assets/policySupport/del.png') no-repeat;
  background-size: 100% 100%;
}
::v-deep .el-table th.gutter {
  display: table-cell !important;
}
::v-deep .el-table td.el-table__cell div {
  min-height: 22px;
}
</style>
