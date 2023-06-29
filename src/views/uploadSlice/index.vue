<template>
  <div id="app">
    <div class="upload-wrap">
      <UploadSlice
        :action="uploadInfoSlice.actionChunk"
        :headers="uploadInfoSlice.headers"
        :limit="uploadInfoSlice.limit"
        :accept="uploadInfoSlice.accept"
        :show-file-list="false"
        cancelable
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :on-cancel="handleCancel"
        :on-upload-pre="handleUploadPre"
        :on-upload-merge="handleUploadMerge"
        :on-form-data="genFormData"
      />
    </div>
  </div>
</template>

<script>
import UploadSlice from '@/base-ui/UploadSlice';
// import { uploadPre, uploadMerge } from '@/api/upload-slice';

export default {
  name: 'App',
  components: {
    UploadSlice,
  },
  data() {
    return {
      // 上传部分
      uploadInfoSlice: {
        actionChunk: process.env.VUE_APP_BASE_API + '/storage/file/v3/chunk', // 切片请求上传路径
        headers: { Authorization: 'Bearer XXX' },
      },
    };
  },
  methods: {
    // 分片预请求
    async handleUploadPre(file) {
      const form = new FormData();
      form.append('fileSource', 'APPLICATION');
      form.append('originFileName', file.name);
      let res = '';
      try {
        // res = await uploadPre(form);
        console.log(form);
      } catch (error) {
        throw new Error(error);
      }
    },
    // 构造分片参数
    genFormData(chunks, uid) {
      const prepareId = this.getCurrentPrepareId(uid);
      return chunks.map((chunk) => {
        const form = new FormData();
        form.append('chunk', chunk.file);
        form.append('uploadId', prepareId);
        form.append('partNumber', chunk.index);
        return form;
      });
    },
    // 合并请求
    async handleUploadMerge(file, uid) {
      const prepareId = this.getCurrentPrepareId(uid);
      const form = new FormData();
      form.append('fileSource', 'APPLICATION');
      form.append('hash', prepareId);
      form.append('filename', file.name);
      // return 建议使用, 用于handleSuccess获取数据
      try {
        console.log(form);
        return;
        const res = await uploadMerge(form);
        return res;
      } catch (error) {
        return error;
      }
    },
    // 判断当前处理prepareId
    getCurrentPrepareId(uid) {
      for (const item of this.progressFileList) {
        if (item.uid === uid) {
          return item.prepareId;
        }
      }
    },
  },
};
</script>
