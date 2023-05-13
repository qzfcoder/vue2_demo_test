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
      realTempArr: [],
    };
  },
  methods: {
    addnum(e) {
      console.log(e);
      this.tempArr.push(e.label);
      // this.realTempArr.push(e.value);
      if (this.tempArr.length == this.tempArrLength) {
        this.isFlag = !this.isFlag;
        let encode = this.newValue;
        encode = encode.replace('()', '(' + this.tempArr.join(',') + ')');
        console.log(encode);
        var regex = /all|sum/gi;
        let str = encode
          .replace(regex, (match) => {
            return '#' + match + '#';
          })
          .replace(/\(|\)/g, '$');
        this.realTempArr.push({
          label: encode,
          real: '(' + str + ')',
        });
        this.show(encode);

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
      console.log(e);
      this.newValue = e.label;
      this.realValue = e.value;
    },
    show(e) {
      let str = this.$refs.content.innerText;
      let realStr = '';
      console.log(str, this.realTempArr);
      for (let i = 0; i < this.realTempArr.length; i++) {
        str = str.replace(this.realTempArr[i].label, this.realTempArr[i].real);
      }
      console.log(realStr, str);
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
