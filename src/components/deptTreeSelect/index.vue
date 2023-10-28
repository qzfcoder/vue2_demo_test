<template>
  <div class="deptTreeSelect">
    <treeselect class="zzzfixSize_vueTreeSelectSmall" v-model="reportOrgId" :disabled="disabled"
      :options="deptOptions" placeholder="请选择" :clearable="clearable" :normalizer="normalizer"
      :async="Isasync" :default-expand-level="defaultLevel"
      :load-options="Isasync ? asyncOptions : loadOptions" @input.native="onpropertychange()"
      @keydown.native="assetTreeKeydownFun" @open="itemopen()" @close="itemClose()"
      @keyup.native="assetTreeKeyupFun($event)" no-options-text="暂无可用选项" noChildrenText="数据加载中"
      noResultsText="暂无匹配项" loadingText="数据加载中" no-results-text="没有匹配的搜索结构" searchPromptText="正在搜索"
      :appendToBody="true" z-index="9999" :beforeClearAll="beforeClearAll" >
      <div
        style="
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100%;
        "
        slot="option-label"
        slot-scope="{ node }"
        :title="node.label"
      >
        <template> {{ node.label }}</template>
      </div>
      </treeselect>
  </div>
</template>
<script>
import mixinX from './minx.js'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  mixins: [mixinX],
  components: { Treeselect },
  name: 'deptTreeSelect',
  props: ["deptId", "clearable", "disabled"],
  data() {
    return {
      reportOrgId: null
    };
  },
  watch: {
    deptId(val) {
      this.reportOrgId = val;
      if (val) {
        this.getDeptIdList(this.reportOrgId);
      } else {
        this.getDeptList();
      }
    },
    reportOrgId(val) {
      this.$emit("getDeptId", val)
    }
  },
  methods: {

  },
};
</script>
<style lang='scss' scoped>
.vueTreeSelectSmall {
  height: 28px;
  line-height: 28px;
  ::v-deep .vue-treeselect__control {
    height: 100%;
    line-height: 28px;
  }
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    line-height: 28px;
  }
}
.vue-treeselect--append-to-body {
  .vue-treeselect__menu-container {
    ::v-deep .vue-treeselect__label {
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>