<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-bind="childrenProps"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="showSelectCloum"
        type="selection"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="showIndexCloum"
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <template v-for="propItem in propList">
        <el-table-column
          v-bind="propItem"
          align="center"
          show-overflow-tooltip
          :key="propItem.prop"
        >
          <template #default="scope">
            <slot :name="propItem.slotName" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => ({}),
    },
    propList: {
      type: Array,
      required: true,
    },
    showSelectCloum: {
      type: Boolean,
      default: false,
    },
    showIndexCloum: {
      type: Boolean,
      default: false,
    },
    childrenProps: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    handleSelectionChange() {},
  },
};
</script>

<style lang="scss" scoped></style>
