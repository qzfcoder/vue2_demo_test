<template>
  <div>
    <span v-for="(item, index) in allList" :key="index">
      <el-button :disabled="isFlag" @click="addnum(item)">{{
        item.label
      }}</el-button>
    </span>
    <hr />
    <span v-for="(item, index) in allList2" :key="index + 'ff'">
      <el-button :disabled="!isFlag" @click="addfs(item)">{{
        item.label
      }}</el-button>
    </span>
    <hr />
    SUM(合同金额) (#SUM#$F8hu1nobfwn31p:1|Fk2p1noc8fblh3$)
    <hr />
    <div contenteditable ref="content"></div>
    <el-button @click="show()"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    };
  },
  methods: {
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
    addnum(e) {
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
        this.show(ShowEncode);

        // var re = /\([^\)]+\)/g;
        // console.log(encode.match(re));
        // return;
        // encode = encode.match(re)[0];
        // encode = encode.substring(1, encode.length - 1);
        // console.log(encode);
      }
    },
    addfs(e) {
      this.isFlag = !this.isFlag;
      this.tempArr = [];
      // 需要的数组长度
      this.tempArrLength = e.need;
      console.log(e, '00');
      this.newValue = e.label;
      this.realValue = e.value;
    },
    // 设置数据展示控制，div中数据展示内容
    show(e) {
      // str魏获取到所有的内容
      let str = this.$refs.content.innerText;
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
      this.$refs.content.appendChild(input);
    },
  },
};
</script>

<style lang="scss" scoped></style>
