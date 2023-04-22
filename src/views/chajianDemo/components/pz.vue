<template>
  <div>
    <el-button @click="confirm">确认</el-button>
    <el-button @click="addHang">增加一行</el-button>
    <el-form :model="formData" ref="formRef">
      <div v-for="(item, index) in formData.items" :key="item.key">
        <el-button @click="deleteHang(index)">删除行</el-button>
        <el-form-item label="类型选择">
          <el-select
            v-model="item.component"
            placeholder="请选择"
            @change="(e) => changeType(e, index)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="item.component">
          <template v-if="item.component == 'label'">
            <el-form-item
              label="标签名称"
              :prop="'items.' + index + '.labelTitle'"
              :key="'items.' + index + '.labelTitle'"
              :rules="rules.require"
            >
              <el-input v-model="item.labelTitle"></el-input>
            </el-form-item>
            <el-form-item label="类型位置">
              <el-select
                v-model="item.labelPosition"
                :prop="'items.' + index + '.labelPosition'"
                :key="'items.' + index + '.labelPosition'"
                :rules="rules.require"
              >
                <el-option
                  v-for="item in labelPositionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item
              label="设置的key"
              :prop="'items.' + index + '.prop'"
              :key="'items.' + index + '.prop'"
              :rules="rules.require"
            >
              <el-input v-model="item.prop"></el-input>
            </el-form-item>
            <el-form-item
              label="名称label"
              :prop="'items.' + index + '.label'"
              :key="'items.' + index + '.label'"
              :rules="rules.require"
            >
              <el-input v-model="item.label"></el-input>
            </el-form-item>
            <el-form-item
              label="是否校验"
              :prop="'items.' + index + '.ruleSwitch'"
              :key="'items.' + index + '.ruleSwitch'"
              :rules="rules.requireBoolean"
            >
              <el-switch v-model="item.ruleSwitch"></el-switch>
            </el-form-item>
            <el-form-item
              v-if="item.ruleSwitch"
              label="校验规则"
              :prop="'items.' + index + '.ruleContent'"
              :key="'items.' + index + '.ruleContent'"
              :rules="rules.require"
            >
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
          </template>
          <template v-if="item.component == 'el-date-picker'">
            <el-form-item label="选择日期格式">
              <el-select v-model="item.type" placeholder="请选择">
                <el-option
                  v-for="item in dateOptionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择日期禁用范围">
              <el-select v-model="item.dateDisabled" placeholder="请选择">
                <el-option
                  v-for="item in dateDisabledOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template
            v-if="item.component == 'el-select' || item.component == 'el-radio'"
          >
            <el-form-item label="是否字典获取">
              <el-switch v-model="item.apiSwitch"></el-switch>
            </el-form-item>
            <el-form-item label="options设置" v-if="!item.apiSwitch">
              <el-button @click="addoptions(index)">增加一行</el-button>
              <el-table :data="item.options" border style="width: 100%">
                <el-table-column prop="label" label="label" width="180">
                  <template slot-scope="scope">
                    <el-input
                      type="text"
                      v-model="scope.row.label"
                      v-show="scope.row.iseditor"
                    />
                    <span v-show="!scope.row.iseditor">{{
                      scope.row.label
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="地址">
                  <template slot-scope="scope">
                    <el-input
                      type="text"
                      v-model="scope.row.value"
                      v-show="scope.row.iseditor"
                    />
                    <span v-show="!scope.row.iseditor">{{
                      scope.row.value
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button type="warning" @click="edit(scope.row, scope)"
                      >编辑</el-button
                    >
                    <el-button
                      type="warning"
                      @click="del(scope.row, scope.$index, index)"
                      >删除</el-button
                    >
                    <el-button type="danger" @click="save(scope.row)"
                      >保存</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item
              label="字典名称"
              v-else
              :prop="'items.' + index + '.apiName'"
              :key="'items.' + index + '.apiName'"
              :rules="rules.require"
            >
              <el-input v-model="item.apiName"></el-input>
            </el-form-item>
            <el-form-item label="关联选项">
              <el-button
                :disabled="!(formData.items.length > 1)"
                @click="connectBtn(item, index)"
                >关联</el-button
              >
            </el-form-item>
          </template>
        </template>
      </div>
    </el-form>
    <el-dialog title="配置xxxxx" :visible.sync="dialogVisible" width="70%">
      <el-form :model="pzForm">
        <el-button @click="addConnect()">增加关联项目</el-button>
        <div v-for="(item, index) in pzForm.allChoose" :key="item.key">
          <el-form-item :label="'选择'">
            <el-select
              v-model="item.chooseKey"
              :prop="'item.' + index + '.chooseKey'"
              :key="'item.' + index + '.chooseKey'"
              :rules="rules.require"
              placeholder="请选择"
            >
              <el-option
                v-for="i in getAllFieldList"
                :key="i.prop"
                :label="i.label"
                :value="i.prop"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'选择checkbox'">
            <el-radio-group
              v-model="item.value"
              :prop="'item.' + index + '.value'"
              :key="'item.' + index + '.value'"
              :rules="rules.require"
            >
              <el-radio
                v-for="i in getFieldChooseList"
                :key="i.value"
                :label="i.value"
                >{{ i.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChoose()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mainStore } from '@/store';
import { deepClone } from '@/utils/deepclone.js';
import rule from '@/utils/rule';
export default {
  data() {
    return {
      rules: {
        require: rule(true),
        requireBoolean: rule(true, null, null, null, 'boolean'),
      },
      chooseMsgList: [],
      dateDisabledOptions: [
        {
          value: 1,
          label: '大于当前时间',
        },
        {
          value: 2,
          label: '小于当前时间',
        },
      ],
      dateOptionList: [
        {
          value: undefined,
          label: '时间',
        },
        {
          value: 'daterange',
          label: '时间范围',
        },
        {
          value: 'datetimerange',
          label: '时间范围2-包含时间',
        },
        {
          value: 'datetime',
          label: '时间-包含时间',
        },
        {
          value: 'month',
          label: '时间-到月',
        },
        {
          value: 'monthrange',
          label: '时间范围-到月',
        },
        {
          value: 'year',
          label: '时间年',
        },
      ],
      options: [
        {
          value: 'label',
          label: '标题',
        },
        {
          value: 'el-input',
          label: '输入框',
        },
        {
          value: 'el-radio',
          label: '单选',
        },
        {
          value: 'el-checkbox',
          label: '多选框',
        },
        {
          value: 'el-select',
          label: '下拉选择',
        },
        {
          value: 'el-date-picker',
          label: '时间选择',
        },
        {
          value: 'el-switch',
          label: '开关',
        },
        {
          value: 'el-cascader',
          label: '级联',
        },
      ],
      labelPositionList: [
        {
          value: 'left',
          label: '左',
        },
        {
          value: 'center',
          label: '中',
        },
        {
          value: 'right',
          label: '右',
        },
      ],
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
      inputOptions: [
        {
          value: 'text',
          label: '文本',
        },
        {
          value: 'password',
          label: '密码',
        },
        {
          value: 'textarea',
          label: '文本域',
        },
      ],
      // 配置化数据相关内容
      formData: {
        items: [
          {
            options: [
              { label: '展示', value: '1', iseditor: false },
              { key: '', value: '0', iseditor: false, label: '不展示' },
            ],
            ruleSwitch: false,
            component: 'el-select',
            prop: 'show',
            label: 'as ',
            props: { label: 'label', value: 'value' },
            rules: [
              {
                required: false,
                trigger: 'blur',
                message: '该字段为必填项',
                type: 'string',
              },
            ],
          },
          {
            options: [{ label: '', value: '', iseditor: false }],
            ruleSwitch: false,
            component: 'el-input',
            prop: '1dsa',
            label: '2',
            props: { label: 'label', value: 'value' },
            rules: [
              {
                required: false,
                trigger: 'blur',
                message: '该字段为必填项',
                type: 'string',
              },
            ],
          },
        ],
      },
      // 关联相关
      dialogVisible: false,
      getAllFieldList: [],
      getFieldChooseList: [],
      pzForm: { allChoose: [] },
      chooseIndex: null,
      nowProp: '',
    };
  },
  mounted() {},
  methods: {
    changeType(e, index) {
      if (e == 'el-date-picker') {
        this.formData.items[index].prop = 'date';
      } else {
        this.formData.items[index].prop = null;
      }
    },
    addHang() {
      this.formData.items.push({
        options: [{ label: '', value: '', iseditor: false }],
        ruleSwitch: false,
      });
    },
    deleteHang(e) {
      this.formData.items.splice(e, 1);
    },
    confirm() {
      mainStore().setCommonMsg(deepClone(this.formData));
      this.$refs.formRef.validate((valid) => {
        console.log(valid);
      });
    },

    async connectBtn(e, f) {
      this.chooseIndex = null;
      console.log(e);
      this.nowProp = e.prop;
      if (e.options.length && e.prop && e.label) {
        this.chooseIndex = f;
        console.log(Boolean(e.controllerPz));
        if (e.controllerPz) {
          this.formData.items[this.chooseIndex].controllerPz = deepClone(
            e.controllerPz
          );
        } else {
          this.pzForm.allChoose = [];
          this.pzForm.allChoose.push({
            prop: e.prop,
            chooseKey: '',
            value: '',
          });
        }
        let tem = await deepClone(this.formData.items);
        // this.getAllFieldList
        let index = await tem.findIndex((item) => item.prop == e.prop);
        console.log(tem, index, 111);
        await tem.splice(index, 1);
        this.getAllFieldList = tem;
        this.getFieldChooseList = [...e.options];
        this.$nextTick(() => {
          this.dialogVisible = true;
        });
      } else {
        this.$message.error('请填写完成');
      }
    },

    // options 部分
    edit(row, index) {
      row.iseditor = true;
    },
    save(row, index) {
      row.iseditor = false;
    },
    del(row, tableindex, index) {
      console.log(row, index);
      this.formData.items[index].options.splice(tableindex, 1);
    },
    addoptions(index) {
      this.formData.items[index].options.push({
        key: '',
        value: '',
        iseditor: false,
      });
    },
    addConnect() {
      let tem = { prop: this.nowProp, chooseKey: '', value: '' };
      this.pzForm.allChoose.push(tem);
    },
    confirmChoose() {
      this.formData.items[this.chooseIndex].controllerPz = this.pzForm;
    },
  },
};
</script>

<style lang="scss" scoped></style>
