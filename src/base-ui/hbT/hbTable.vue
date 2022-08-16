<template>
  <div>
    <h3>表格合并</h3>
    <table border>
      <tr>
        <th v-for="item in headers" :key="item">{{ item.label }}</th>
      </tr>
      <template v-for="item in list">
        <template v-for="i in item.children">
          <tr v-for="(a, index) in i.children" :key="index">
            <td
              :rowspan="item.rowspan"
              v-if="i.rowspan !== 0 && a.rowspan !== 0"
            >
              {{ i.rowspan }}
              {{ item.fristTarfet }}
            </td>
            <td :rowspan="i.children.length" v-if="a.rowspan !== 0">
              {{ i.secondTarfet }}
            </td>
            <td>
              {{ a.threedTarfet }}
            </td>
            <td>
              {{ a.target }}
            </td>
          </tr>
        </template>
      </template>
    </table>
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
        { prop: 'target', label: '操作' },
      ],
      newList: [],
      list: [
        {
          id: 'frist',
          fristTarfet: '产出指标',
          rowspan: 5,
          children: [
            {
              id: 'children_frist',
              secondTarfet: '数量指标',
              children: [
                { threedTarfet: '1', target: '2' },
                { rowspan: 0, threedTarfet: '1', target: '2' },
              ],
            },
            {
              id: 'children_frist',
              secondTarfet: '数量指标',
              rowspan: 0,
              children: [
                { threedTarfet: '1', target: '2' },
                { rowspan: 0, threedTarfet: '1', target: '2' },
              ],
            },
            {
              id: 'children_frist',
              secondTarfet: '数量指标',
              rowspan: 0,
              children: [{ threedTarfet: '1', target: '2' }],
            },
          ],
        },

        {
          id: 'second',
          fristTarfet: '效益指标',
          rowspan: 2,
          children: [
            {
              id: 'children_second',
              secondTarfet: '2~',
              children: [
                { threedTarfet: '5', target: '6' },
                { rowspan: 0, threedTarfet: '5', target: '6' },
              ],
            },
          ],
        },
        {
          id: 'threed',
          fristTarfet: '满意度指标',
          rowspan: 1,
          children: [
            {
              id: 'children_threed',
              secondTarfet: '121321',
              children: [{ threedTarfet: '7', target: '8' }],
            },
          ],
        },
      ],
    };
  },
  methods: {},
  // methods中定义方法
};
</script>
