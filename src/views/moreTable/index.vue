<template>
  <div>
    <el-button @click="save()">保存</el-button>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      >
        <el-form :ref="item.value + 'Ref'" :model="form">
          <el-form-item>
            <el-table :data="form[item.value]">
              <el-table-column>
                <template slot="header">
                  {{ item.value }}
                  <span style="color: red; font-size: 16px">*</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="item.value + '.' + scope.$index + '.ratio'"
                    :rules="rules.required"
                  >
                    <el-input v-model="scope.row.ratio"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot="header">
                  {{ item.value }}222222222222
                  <span style="color: red; font-size: 16px">*</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="item.value + '.' + scope.$index + '.aaa'"
                    :rules="rules.required"
                  >
                    <el-input v-model="scope.row.aaa"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Rule from '@/utils/rule';
export default {
  data() {
    return {
      activeName: 'zjs',
      tabList: [
        {
          label: '浙江省',
          value: 'zjs',
        },
        {
          label: '杭州市',
          value: 'hzs',
        },
        {
          label: '西湖区',
          value: 'xhq',
        },
      ],
      form: {},
      rules: {
        required: Rule(true),
      },
    };
  },
  mounted() {
    this.form = {
      zjs: [{}],
      hzs: [{}],
      xhq: [{}],
    };
  },
  methods: {
    handleClick(e) {
      console.log(e);
    },
    async save() {
      let tem = [];
      for (let i = 0; i < this.tabList.length; i++) {
        console.log(this.$refs[this.tabList[i].value + 'Ref']);
        let p1 = new Promise((resolve, reject) => {
          this.$refs[this.tabList[i].value + 'Ref'][0]?.validate((valid) => {
            if (valid) {
              return resolve(true);
            } else {
              return reject({ label: this.tabList[i].label });
            }
          });
        });
        tem.push(p1);
      }
      console.log(tem);
      // this.$refs[]
      Promise.all(tem)
        .then((result) => {
          console.log(result);
          // this.postProcedureAdd();
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.label + '错误');
          return error;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
