<template>
  <div class="t-form">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <el-form :label-width="labelWidth" :model="formData">
      <el-row>
        <template v-for="item in formItems">
          <el-col v-bind="colLayout" :key="item.label">
            <el-form-item
              v-if="!item.isHidden"
              :label="item.label"
              :style="itemstyle"
              :prop="item.field"
              :rules="item.rules"
            >
              <template v-if="item.type == 'input' || item.type == 'password'">
                <el-input
                  :placeholder="item.placeholder"
                  :show-password="item.type === 'password'"
                  :type="item.type"
                  :rows="item.type === 'textarea' ? item.rows : 'null'"
                  v-model="formData[`${item.field}`]"
                ></el-input>
              </template>
              <template v-if="item.type == 'textarea'">
                <el-input
                  :placeholder="item.placeholder"
                  :type="item.type"
                  :rows="item.rows ? item.rows : '2'"
                  v-model="formData[`${item.field}`]"
                ></el-input>
              </template>
              <template v-else-if="item.type == 'select'">
                <el-select
                  :placeholder="item.placeholder"
                  v-model="formData[`${item.field}`]"
                >
                  <el-option
                    v-for="option in item.options"
                    :value="option.value"
                    :label="option.title"
                    :key="option.value"
                  ></el-option>
                </el-select>
              </template>
              <template v-else-if="item.type === 'datepicker'">
                <el-date-picker
                  style="width: 100%"
                  v-bind="item.otherOptions"
                  v-model="formData[`${item.field}`]"
                ></el-date-picker>
              </template>
              <template v-else-if="item.type === 'switch'">
                <el-switch
                  v-model="formData[`${item.field}`]"
                  v-bind="{ ...item.otherOptions }"
                >
                </el-switch>
              </template>
              <template v-else-if="item.type === 'cascader'">
                <el-cascader
                  v-model="formData[`${item.field}`]"
                  :options="item.options"
                  :props="{
                    ...item.otherOptions,
                  }"
                  @change="handleChange"
                ></el-cascader>
              </template>
              <template v-else-if="item.type === 'uploadImg'">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="(e, g) => handleAvatarSuccess(e, g, item.field)"
                  :before-upload="
                    (e) => beforeAvatarUpload(e, item.otherOptions)
                  "
                >
                  <img
                    v-if="formData[`${item.field}`]"
                    :src="formData[`${item.field}`]"
                    class="avatar"
                  />
                  <span v-if="formData[`${item.field}`]">{{
                    formData[item.field]
                  }}</span>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </template>
              <template v-else-if="item.type === 'uploadFile'">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="(e, g) => handleRemove(e, g, item.field)"
                  :before-remove="beforeRemove"
                  :before-upload="(e) => beforeUpload(e, item.field)"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="formData[`${item.field}`]"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </el-upload>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formItems: {
      type: Array,
      default: () => [],
    },
    labelWidth: {
      type: String,
      default: '100px',
    },
    itemstyle: {
      type: Object,
      default: () => ({ padding: '10px 40px' }),
    },
    colLayout: {
      type: Object,
      default: () => ({
        xl: 6,
        lg: 8,
        md: 12,
        sm: 24,
        xs: 24,
      }),
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {},
      fileList: [],
    };
  },
  mounted() {
    // console.log(this.value);
    this.formData = { ...this.value };
  },
  methods: {
    // 文件的方法
    handleRemove(file, fileList, asd) {
      console.log(file, fileList, asd);
      this.formData[asd] = fileList;
    },
    handlePreview(file) {
      console.log(file);
      console.log(this.fileList);
    },
    beforeUpload(file, asd) {
      console.log(file, asd, '1');
      this.formData[asd].push(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传头像
    async handleAvatarSuccess(res, file, field) {
      console.log(res, file, field, this.formData[field], '1');
      this.formData[field] = await URL.createObjectURL(file.raw);
      console.log('handleAvatarSuccess', this.formData);
      this.$forceUpdate();
    },
    beforeAvatarUpload(file, options) {
      console.log(file, options, '111');
      console.log(options.imgType);
      let isType;
      if (Array.isArray(options.imgType)) {
        // isType = file.type.indexof(options.imgType) === -1;
        isType = options.imgType.some((item) => {
          return item === file.type;
        });
      } else {
        isType = file.type === options.imgType;
      }
      const isLt2M = file.size / 1024 / 1024 < options.lastM;
      if (!isType) {
        this.$message.error('上传头像图片格式不对!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isType && isLt2M;
    },
    // 级联选择
    handleChange(value) {
      console.log(value);
    },
    // checkForm() {
    //   console.log(this.$refs.elFormRef);
    //   this.$refs.elFormRef.validate((e) => {
    //     console.log(e);
    //   });
    // },
  },
  watch: {
    formData: {
      handler(newV, oldV) {
        this.$emit('input', newV);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
