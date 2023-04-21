<template>
  <div>
    <el-form label-width="120px">
      <div v-for="(item, index) in chooseMsgList" :key="item.key">
        <el-form-item label="设置的key">
          <el-input v-model="item.field"></el-input>
        </el-form-item>
        <el-form-item label="名称label">
          <el-input v-model="item.label"></el-input>
        </el-form-item>
        <el-form-item label="文案提示">
          <el-input v-model="item.placeholder"></el-input>
        </el-form-item>
        <el-form-item label="类型选择">
          <el-select v-model="item.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="options设置" v-if="item.type == 'select'">
          <el-table :data="item.options" border style="width: 100%">
            <el-table-column prop="label" label="label" width="180">
              <template slot-scope="scope">
                <el-input
                  type="text"
                  v-model="scope.row.label"
                  v-show="scope.row.iseditor"
                />
                <span v-show="!scope.row.iseditor">{{ scope.row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="地址">
              <template slot-scope="scope">
                <el-input
                  type="text"
                  v-model="scope.row.value"
                  v-show="scope.row.iseditor"
                />
                <span v-show="!scope.row.iseditor">{{ scope.row.value }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="warning" @click="edit(scope.row, scope)"
                  >编辑</el-button
                >
                <el-button type="danger" @click="save(scope.row)"
                  >保存</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addHTable(index)">增加一行</el-button>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch v-model="item.ruleSwitch" placeholder="请选择">
          </el-switch>
        </el-form-item>
        <el-form-item label="规则选择" v-if="item.ruleSwitch">
          <el-select v-model="item.ruleContent" placeholder="请选择">
            <el-option
              v-for="item in ruleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否关联">
          <el-switch
            v-model="item.connectSwitch"
            :disabled="!allConnectList.length"
            placeholder="请选择"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="关联选择" v-if="item.connectSwitch">
          <el-button @click="pz(item.field, item.options)">配置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog title="配置xxxxx" :visible.sync="dialogVisible" width="70%">
      <el-form :model="formData">
        <el-form-item :label="'选择'">
          <el-select v-model="xx" placeholder="请选择">
            <el-option
              v-for="i in getAllFieldList"
              :key="i.value"
              :label="i.label"
              :value="i.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'选择checkbox'">
          <el-radio></el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
    <br />
    <el-button @click="addHang">增加一行</el-button>
    <el-button @click="confirmMsg">确认信息</el-button>
  </div>
</template>

<script>
import { mainStore } from '@/store';
import { deepClone } from '@/utils/deepclone.js';
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      options: [
        {
          value: 'input',
          label: '输入框',
        },
        {
          value: 'label',
          label: 'label',
        },
        {
          value: 'password',
          label: '密码',
        },
        {
          value: 'textarea',
          label: '文本框',
        },
        {
          value: 'radio',
          label: '单选',
        },
        {
          value: 'checkbox',
          label: '多选框',
        },
        {
          value: 'select',
          label: '下拉选择',
        },
        {
          value: 'datepicker',
          label: '时间选择',
        },
        {
          value: 'switch',
          label: '开关',
        },
        {
          value: 'cascader',
          label: '级联',
        },
      ],
      pzMsg: {
        labelWidth: '120px',
        itemstyle: {
          padding: '10px 40px',
        },
        colLayout: {
          span: 8,
        },
        formItems: [],
      },
      realChoose: {
        field: '', // key
        type: '', // input类型
        label: '', // 名称
        placeholder: '', // 提示文案
        ruleSwitch: false, // 是否开启必填校验
        ruleContent: '', // 选择的规则
        connectSwitch: false,
        connectArr: [],
        options: [{ label: '', value: '', iseditor: false }],
      },
      allConnectList: [],
      chooseMsgList: [],
      ruleOptions: [
        {
          value: 'true',
          label: 'true',
        },
        {
          value: 'false',
          label: 'false',
        },
        {
          value: 'Phone',
          label: 'Phone',
        },
        {
          value: 'IdCard',
          label: 'IdCard',
        },
      ],
      formData: {},
      getAllFieldList: [],
      xx: '',
      pzOptions: [],
    };
  },
  mounted() {
    this.chooseMsgList = [{ ...this.realChoose }];
  },

  watch: {
    chooseMsgList: {
      handler(oldValue, newVal) {
        let tem = [];
        newVal.forEach((item) => {
          if (item.field && item.label) {
            tem.push({ key: item.field, label: item.label });
          }
        });
        this.allConnectList = tem;
      },
      deep: true, // 深度监听
    },
  },
  methods: {
    addHang() {
      this.chooseMsgList = [...this.chooseMsgList, { ...this.realChoose }];
    },
    addHTable(e) {
      this.chooseMsgList[e].options.push({
        key: '',
        value: '',
        iseditor: false,
      });
    },
    edit(row, index) {
      row.iseditor = true;
    },
    save(row, index) {
      row.iseditor = false;
    },
    confirmMsg() {
      mainStore().setCommonMsg({
        ...this.pzMsg,
        formItems: [...this.chooseMsgList],
      });
    },
    pz(e, f) {
      let tem = [];
      this.allConnectList.forEach((item) => {
        if (e !== item.key) {
          tem.push({
            label: item.label,
            value: item.key,
          });
        }
      });
      this.getAllFieldList = [...tem];
      this.pzOptions = [...f];
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
    },
    confirm() {},
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  flex: 0 0 50%;
}
</style>
