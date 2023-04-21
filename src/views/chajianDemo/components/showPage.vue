<template>
  <div class="demo">
    {{ form }}
    <agel-form ref="formRef" v-model="form" v-if="showForm"> </agel-form>
    <el-button style="margin-left: 50px" type="primary" @click="submit"
      >提交</el-button
    >
    <el-button type="primary" @click="getAllMsg">获取相关信息</el-button>
    <el-button type="primary" @click="rest">重置</el-button>
    <el-button type="primary" @click="clear">清除验证</el-button>
    <el-button type="primary" @click="getRef">获取组件实例</el-button>
    <el-button type="primary" @click="getItem">获取Item</el-button>
  </div>
</template>

<script>
import rule from '@/utils/rule';
import { mainStore } from '@/store';
import { getData } from './index';
const divider = (title, position) => {
  return {
    component: 'el-divider',
    labelWidth: '0px',
    contentPosition: position,
    slots: title,
  };
};
export default {
  data() {
    return {
      showForm: true,
      form: {
        span: 16,
        items: [
          {
            prop: 'user',
            label: '活动名称',
          },
          {
            prop: 'region',
            label: '活动区域',
            component: 'el-input',
            type: 'textarea',
          },
          {
            prop: 'address',
            label: '项目地址',
            required: true,
          },
          {
            prop: 'evaluate',
            label: '评价',
            component: 'el-radio',
            options: ['很棒', '一般', '糟糕'],
            on: {
              change: (v) => {
                this.$message.info('给个好评吧');
              },
            },
          },
        ],
        on: {
          validate: (v) => {
            console.log('验证字段：' + v);
          },
        },
      },
    };
  },
  async mounted() {
    console.log('1');
    let res = await getData();
    console.log(res);
  },
  methods: {
    getAllMsg() {
      this.showForm = false;
      let temArr = mainStore().getCommonMsg;
      let tem = [];
      let pz = [];
      temArr.items.map(async (item, index) => {
        if (item.component == 'label') {
          tem.push({
            index: index,
            content: item.labelTitle,
            labelPosition: item.labelPosition,
          });
        }
        if (item.controllerPz?.allChoose) {
          pz = [...pz, ...item.controllerPz.allChoose];
        }
        item.props = { label: 'label', value: 'value' };
        if (item.apiSwitch) {
          item.options = await getData();
        }
        item.rules = rule(item.ruleSwitch, item.ruleContent ?? null);
        return item;
      });
      console.log(pz);

      tem.forEach((item) => {
        temArr.items.splice(
          item.index,
          1,
          divider(item.content, item.labelPosition)
        );
      });
      pz.forEach((item) => {
        for (let i = 0; i < temArr.items.length; i++) {
          if (item.chooseKey == temArr.items[i].prop) {
            temArr.items[i].display = (data) => data[item.prop] == item.value;
          }
        }
      });
      console.log(tem, temArr.items);
      this.form.items = temArr.items;
      this.$nextTick(() => {
        this.showForm = true;
      });
    },
    submit() {
      console.log(this.$refs.formRef);
      // 与 eleForm validate 有点不同，第一个参数为成功回调，第二个参数为失败回调
      this.$refs.formRef.validate(
        () => this.$notify.success('提交成功'),
        (errInfo) => {
          this.$notify.error('验证失败');
          console.log(errInfo);
        }
      );
    },
    rest() {
      this.$refs.formRef.resetFields();
    },
    clear() {
      this.$refs.formRef.clearValidate();
    },
    // 获取组件实例
    getRef() {
      this.$message.success('获取成功，查看控制台');
      console.log('form:', this.$refs.formRef.getRef('elForm'));
      console.log('layout:', this.$refs.formRef.getRef('agLayout'));
      console.log('user input:', this.$refs.formRef.getRef('user'));
    },
    // 在 items 为数组的情况下，可使用该方法快速获取 item 对象进行修改
    getItem() {
      this.$message.success('获取成功，查看控制台');
      console.log('user input:', this.$refs.formRef.getItem('user'));
    },
  },
};
</script>
