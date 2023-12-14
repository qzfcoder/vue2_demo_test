<template>
  <div>
    <moduleSun
      :chartData="item"
      :index="item.id"
      v-for="(item, index) in chartData"
      :key="index"
      @add="add"
      @del="del"
      ref="all"
    />
    <el-button @click="submit">提交</el-button>
  </div>
</template>

<script>
import moduleSun from './moduleSun';
export default {
  components: { moduleSun },
  data() {
    return {
      chartData: [
        {
          type: '1',
          formular: '',
          remarks: '',
          id: 1,
          children: [],
          // children: [
          //   {
          //     type: '1',
          //     id: '1-1',
          //     pid: 1,
          //     formular: 'en222',
          //     remarks: '',
          //     children: [],
          //     // children: [
          //     //   {
          //     //     type: '1',
          //     //     formular: 'en222-111',
          //     //     remarks: '',
          //     //     id: '1-1-1',
          //     //     pid: '1-1',
          //     //     children: [
          //     //       {
          //     //         id: '1-1-1-1',
          //     //         pid: '1-1-1',
          //     //         type: '0',
          //     //         formular: 'en222-111',
          //     //         remarks: '',
          //     //       },
          //     //     ],
          //     //   },
          //     // ],
          //   },
          //   {
          //     id: '1-2',
          //     pid: 1,
          //     type: '333',
          //     formular: 'en333',
          //     remarks: '我是333',
          //     children: [],
          //   },
          // ],
        },
      ],
    };
  },
  methods: {
    add(e) {
      console.log(e);
      this.chartData = this.addNext(e, this.chartData);
    },
    del(e) {
      console.log(e);
      this.chartData = this.delNext(e, this.chartData);
    },
    async submit() {
      let validateArr = [];
      let res = await this.$refs.all[0].$el.__vue__.validateFn(); // 第一个
      validateArr.push(res);
      let tem = this.$refs.all[0];
      // 后续的校验
      let func = async (tree, tem) => {
        if (tem) {
          for (let i = 0; i < tree.length; i++) {
            console.log('tem', tem, i + 1);
            if (tree[i]?.children.length) {
              for (let j = 0; j < tree[i].children.length; j++) {
                try {
                  let res = await tem.$el.__vue__.$children[
                    j + 1
                  ]?.validateFn();
                  console.log(res, '11111111111');
                  validateArr.push(res);
                } catch (e) {
                  console.log(e);
                }
                await func(
                  tree[i].children,
                  tem?.$el?.__vue__?.$children[j + 1]
                );
              }
            }
          }
        }
      };
      await func(this.chartData, tem);
      // this.$refs.all[0].$el.__vue__.$children[1].validate((valid) => {
      //   console.log(valid);
      // });
      console.log(
        validateArr.filter((item) => item !== undefined).every((item) => item),
        '111111111111'
      );
    },
    addNext(key, node) {
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === key) {
          console.log(node[i]);
          if (!node[i].children) {
            node[i].children = [];
          }
          node[i].children.push({
            // id: this.$uuid.v1(),
            id:
              new Date().getTime() +
              String(Math.floor(Math.random() * 100) + 1),
            pid: node[i].id,
            type: '1',
            children: [],
          });
          break;
        } else {
          if (node[i].children) {
            this.addNext(key, node[i].children);
          }
        }
      }
      console.log(node, 'node');
      return node;
    },
    // delNext(id, data) {
    //   var newTree = data.filter((x) => {
    //     return id !== x.id;
    //   });
    //   newTree.forEach(
    //     (x) => x.children && (x.children = this.del(x.children, id))
    //   );
    //   console.log(newTree)
    //   return newTree;
    // },
    delNext(id, data) {
      var newTree = data.filter((x) => x.id !== id);
      newTree.forEach(
        (x) => x.children && (x.children = this.delNext(id, x.children))
      );
      return newTree;
    },
  },
};
</script>
