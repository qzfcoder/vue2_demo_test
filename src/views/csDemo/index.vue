<template>
  <div>
    <!-- // 计算公式部分处理-----页面 -->
    <hr />
    SUM(合同金额) (#SUM#$F8hu1nobfwn31p:1|Fk2p1noc8fblh3$)
    <hr />
    <div v-for="i in 10" :key="i">
      <span v-for="(item, index) in allList" :key="index">
        <el-button :disabled="isFlag" @click="addnum(item, i)">{{
          item.label
        }}</el-button>
      </span>
      <hr />
      <span v-for="(item, index) in allList2" :key="index + 'ff'">
        <el-button :disabled="!isFlag" @click="addfs(item, i)">{{
          item.label
        }}</el-button>
      </span>
      <div contenteditable :ref="`content${i}`"></div>
      <el-button @click="show(null, i)"></el-button>
    </div>

    <!-- // 计算公式部分处理-----ending -->
    <el-form ref="form" :rules="rules" :model="form">
      <el-table ref="table" :data="form.tableData" border>
        <el-table-column>
          <template slot="header">
            <p>
              姓名
              <span style="color: red; font-size: 16px">*</span>
            </p>
          </template>
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.name'"
              :rules="rules.name"
            >
              <el-input v-model="scope.row.name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <p>
              年龄
              <span style="color: red; font-size: 16px">*</span>
            </p>
          </template>
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.age'"
              :rules="rules.age"
            >
              <el-input v-model="scope.row.age"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="身高">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model="scope.row.height"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="年龄+身高" prop="other" />
      </el-table>
      <div class="add-btn" @click="addTabColunm">+</div>
    </el-form>
    <el-button @click="save">保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 计算公式部分处理-----变量
      newValue: '',
      realValue: '',
      allList: [
        {
          label: '1',
          value: '1zxcxzc',
        },
        {
          label: '2',
          value: '2sdxzc',
        },
        {
          label: '3',
          value: '3xczc',
        },
        {
          label: '4',
          value: '4zvvzc',
        },
        {
          label: '5',
          value: '5cxnnzc',
        },
      ],
      allList2: [
        {
          label: 'sum()',
          value: '#sum#',
          need: 1,
        },
        {
          label: 'all()',
          value: '#all#',
          need: 2,
        },
      ],
      isFlag: true,
      tempArrLength: 2,
      tempArr: [],
      tempValue: [],
      realTempArr: [],
      // 计算公式部分处理-----ending
      form: {
        tableData: [
          {
            name: '',
            age: '',
            height: '',
            other: '',
          },
        ],
      },
      rules: {
        name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 计算公式部分处理-----方法
    // 转义
    setValue(ShowEncode, Realencode) {
      // 给计算公式中匹配对应公式来更改数据
      var regex = /all|sum/gi;
      let str = Realencode.replace(regex, (match) => {
        return '#' + match + '#';
      }).replace(/\(|\)/g, '$');
      // realTempArr中存储需要替换的真实数据
      this.realTempArr.push({
        label: ShowEncode,
        real: '(' + str + ')',
      });
    },
    addnum(e, index) {
      console.log(e);
      this.tempArr.push(e.label);
      this.tempValue.push(e.value);
      // this.tempArr.push(e.label);
      // this.realTempArr.push(e.value);
      if (this.tempArr.length == this.tempArrLength) {
        this.isFlag = !this.isFlag;
        let encode = this.newValue;
        let ShowEncode = encode.replace(
          '()',
          '(' + this.tempArr.join(',') + ')'
        );
        let realEncode = encode.replace(
          '()',
          '(' + this.tempValue.join(',') + ')'
        );
        console.log(encode, 'encode');
        // 设置数据转义
        this.setValue(ShowEncode, realEncode);
        this.show(ShowEncode, index);
      }
    },
    addfs(e, index) {
      this.isFlag = !this.isFlag;
      this.tempArr = [];
      // 需要的数组长度
      this.tempArrLength = e.need;
      console.log(e, '00');
      this.newValue = e.label;
      this.realValue = e.value;
    },
    // 设置数据展示控制，div中数据展示内容
    show(e, index) {
      // str魏获取到所有的内容
      let str = this.$refs[`content${index}`].innerText;
      // realStr为返回后端所需要的真实数据
      let realStr = '';
      // 通过遍历realTempArr替换realTempArr中所存在的数据，显示
      console.log(str, this.realTempArr, 111111111);
      for (let i = 0; i < this.realTempArr.length; i++) {
        str = str.replace(this.realTempArr[i].label, this.realTempArr[i].real);
      }
      console.log(realStr, str, '111111111111');
      // 创建span标签，控制span标签直接删除控制
      var input = document.createElement('span');
      // contenteditable="false"
      input.setAttribute('contenteditable', 'false');
      input.textContent = e;
      this.$refs[`content${index}`].appendChild(input);
    },
    // 计算公式部分处理-----ending
    del(index) {
      this.form.tableData.splice(index, 1);
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('通过');
          console.log(this.form.tableData);
        }
      });
    },
    addTabColunm() {
      this.form.tableData.push({
        name: '',
        age: '',
        height: '',
        other: '',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-btn {
  /* margin-top: 20px; */
  color: #1790ff;
  line-height: 54px;
  height: 54px;
  text-align: center;
  cursor: pointer;
  border: 1px dashed #1790ff;

  .el-icon-plus {
    font-size: 20px;
  }
}
</style>
