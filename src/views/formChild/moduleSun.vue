<template>
  <div class="chart-layout">
    {{ index }}
    <el-form
      :model="chartData"
      :ref="'formRef' + index"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="公式/字段" prop="type">
        <el-radio-group v-model="chartData.type">
          <el-radio label="1">公式</el-radio>
          <el-radio label="0">字段</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            label="公式选择"
            prop="formular"
            v-if="chartData.type == 1"
          >
            <el-select v-model="chartData.formular" placeholder="请选择公式">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="字段选择"
            prop="fileId"
            v-if="chartData.type == 0"
          >
            <el-select v-model="chartData.fileId" placeholder="请选择字段">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-button @click="add()" v-if="chartData.type == 1"
            >增加字段</el-button
          >
          <el-button @click="del()" v-if="index != 1">删除当前字段</el-button>
        </el-col>
      </el-row>
    </el-form>
    <moduleSun
      :chartData="item"
      v-for="(item, index) in chartData.children"
      :key="index"
      :index="item.id"
      style="margin-left: 40px"
      @add="add"
      @del="del"
    />
  </div>
</template>

<script>
export default {
  name: 'moduleSun',
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: {
      type: Number | String,
      required: true,
    },
  },
  data() {
    return {
      rules: {
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        formular: [{ required: true, message: '请选择', trigger: 'change' }],
        fileId: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    };
  },
  methods: {
    add(e) {
      if (e) {
        this.$emit('add', e);
      } else {
        this.$emit('add', this.index);
      }
      // this.chartData
    },
    del(e) {
      if (e) {
        this.$emit('del', e);
      } else {
        this.$emit('del', this.index);
      }
      // this.chartData
    },
    async validateFn() {
      console.log('1111111111', 'formRef' + this.index, this.$refs);
      let res = await this.$refs['formRef' + this.index]
        .validate()
        .catch((err) => {
          return err;
        });
      if (res == true) {
        console.log(res, '11');
        return true;
      } else {
        console.log(res, '11231');
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chart-main {
  // width: 100px;
  border: 1px solid #000;

  > div {
    margin-top: 5px;
  }
}
.chart-layout {
  text-align: left;
}
</style>
