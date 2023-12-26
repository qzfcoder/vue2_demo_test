<template>
  <div>
    <div class="list">
      <b> </b>
      <p style="width: 160px">
        <input
          type="button"
          value="JS调用插件示例"
          @click="jsTest()"
          class="btn2"
        />
      </p>
      <p style="width: 160px">
        <input
          type="button"
          value="ActiveX调用插件示例"
          @click="window.open('./show/activexDemo.html')"
          class="btn2"
        />
      </p>
      <p style="width: 160px">
        <input
          type="button"
          value="NPAPI调用插件示例"
          @click="window.open('./show/npapiDemo.html')"
          class="btn2"
        />
      </p>
      <p style="width: 200px">
        <input
          type="button"
          value="EasyUI Dialog调用示例"
          @click="window.open('./show/OFDEUIDemo.html')"
          class="btn4"
        />
      </p>
      <p style="width: 200px">
        <input
          type="button"
          value="LigerUI Tab调用示例"
          @click="window.open('./show/ligerUITab.html')"
          class="btn4"
        />
      </p>
      <p style="width: 200px">
        <input
          type="button"
          value="div嵌套iFrame调用示例"
          @click="window.open('./show/divDemo.html')"
          class="btn4"
        />
      </p>
    </div>

    <div class="list">
      <b> </b>
      <p style="width: 160px">
        <input
          type="button"
          value="基本接口调用演示"
          @click="window.open('./show/OFDDemo.html')"
          class="btn2"
        />
      </p>
    </div>

    <div class="list">
      <b> </b>

      <p style="width: 260px">
        <input
          type="button"
          value="场景1：打开本地文件并上传"
          @click="window.open('./show/scene1.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景2：打开在线文件盖章后上传"
          @click="window.open('./show/scene2.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景3/10：打开可控阅读服务文件"
          @click="window.open('./show/scene3.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景4：打开在线文件并保存到本地"
          @click="window.open('./show/scene4.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景5：简单界面和权限控制"
          @click="window.open('./show/scene5.html')"
          class="btn3"
        />
      </p>

      <p style="width: 260px">
        <input
          type="button"
          value="场景6：设置显示和打印水印"
          @click="window.open('./show/scene6.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景7：下载离线加密信封"
          @click="window.open('./show/scene7.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景8：监听用户操作"
          @click="window.open('./show/scene8.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景9/12：实现打印控制"
          @click="window.open('./show/scene9.html')"
          class="btn3"
        />
      </p>

      <p style="width: 260px">
        <input
          type="button"
          value="场景11/16：套版打印"
          @click="window.open('./show/scene11.html')"
          class="btn3"
        />
      </p>

      <p style="width: 260px">
        <input
          type="button"
          value="场景13：打开文件后以适合比例显示"
          @click="window.open('./show/scene13.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景14：获取打开文档的元数据和语义"
          @click="window.open('./show/scene14.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景15：盖章时自动跳转到预定位置"
          @click="window.open('./show/scene15.html')"
          class="btn3"
        />
      </p>
      <!--
    <p style="width:260px;"><input type="button" value="场景17：在插件中显示多个文档" @click="window.open('./show/scene17.html')" class="btn3"></p>
-->
      <p style="width: 260px">
        <input
          type="button"
          value="场景18：高亮关键词和附加链接"
          @click="window.open('./show/scene18.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景19：转换本地文件并上传"
          @click="window.open('./show/scene19.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景20：从虚拟打印创建文件并上传"
          @click="window.open('./show/scene20.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景21：汉王手写板集成"
          @click="window.open('./show/scene21.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="场景22：网页轻阅读"
          @click="
            window.open(
              'http://localhost:8080/web-reader-ext/v2/reader.html?docID=5'
            )
          "
          class="btn3"
        />
      </p>
    </div>

    <div class="list">
      <b> </b>

      <p style="width: 260px">
        <input
          type="button"
          value="问题1：IE插件页上面弹出窗口被遮盖"
          @click="window.open('./show/answer1.html')"
          class="btn3"
        />
      </p>
      <p style="width: 260px">
        <input
          type="button"
          value="问题2：膜态窗口无法加载阅读插件"
          @click="openMTDialog()"
          class="btn3"
        />
      </p>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.list {
  vertical-align: middle;
  width: 100%;
  margin-bottom: 1px;
  border: solid 1px #00a0da;
  background-color: #f0f5ff;
}

.list:hover {
  background-color: #d9e7f5;
}

/*----------set vertical align middle----------*/
.list p,
.list b {
  vertical-align: middle;
  display: -moz-inline-stack;
  display: inline-block;
  zoom: 1;
  display: inline;
}

.list p {
  padding: 10px;
}

/*----------set min-height----------*/
.list b {
  width: 1px;
  overflow: hidden;
  margin-left: -1px;
  background-color: #009cd0;
}

.btn1 {
  font-size: 9pt;
  color: #003399;
  border: 1px #003399 solid;
  color: #006699;
  border-bottom: #93bee2 1px solid;
  border-left: #93bee2 1px solid;
  border-right: #93bee2 1px solid;
  border-top: #93bee2 1px solid;
  background-color: #e8f4ff;
  cursor: hand;
  font-style: normal;
  width: 60px;
  height: 22px;
}

.btn2 {
  font-size: 9pt;
  color: #003399;
  border: 1px #003399 solid;
  color: #006699;
  border-bottom: #93bee2 1px solid;
  border-left: #93bee2 1px solid;
  border-right: #93bee2 1px solid;
  border-top: #93bee2 1px solid;
  background-color: #e8f4ff;
  font-style: normal;
  width: 120px;
  height: 22px;
}

.btn3 {
  font-size: 9pt;
  color: #003399;
  border: 1px #003399 solid;
  color: #006699;
  border-bottom: #93bee2 1px solid;
  border-left: #93bee2 1px solid;
  border-right: #93bee2 1px solid;
  border-top: #93bee2 1px solid;
  background-color: #e8f4ff;
  font-style: normal;
  width: 220px;
  height: 22px;
  text-align: left;
}

.btn4 {
  font-size: 9pt;
  color: #003399;
  border: 1px #003399 solid;
  color: #006699;
  border-bottom: #93bee2 1px solid;
  border-left: #93bee2 1px solid;
  border-right: #93bee2 1px solid;
  border-top: #93bee2 1px solid;
  background-color: #e8f4ff;
  font-style: normal;
  width: 180px;
  height: 22px;
}
</style>
