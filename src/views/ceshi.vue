<template>
  <div class="app-container">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :file-list="fileList"
      list-type="picture-card"
    >
      {{ imgIndex }}
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <el-image
          class="el-upload-list__item-thumbnail"
          ref="previewImg"
          :src="file.url"
          :preview-src-list="previewList(fileList)"
          :initial-index="imgIndex"
        ></el-image>
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url: 'https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750',
        },
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imgIndex: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    previewList(list) {
      return list.map((item) => item.url);
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      console.log(file.url, 'handlePictureCardPreview');
      for (let i = 0; i < this.fileList.length; i++) {
        console.log(this.fileList[i].url, 'handlePictureCard');
        // this.imgList.push(dom[i].src);
        // 当前选择的文件对象如果等于当前界面图片的某项src，就知道当前选择的哪张图片了
        if (file.url == this.fileList[i].url) {
          this.imgIndex = i;
        }
      }
      this.$refs.previewImg.showViewer = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>

<style scoped lang="scss"></style>
