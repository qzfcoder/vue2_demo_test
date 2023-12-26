<template>
  <div>
    <div id="yozoContainer">
      <div
        id="yozo"
        style="width: 45%; float: left; height: 100%; padding-right: 4px"
      ></div>
      <!-- <div id="yozo2" style="width: 45%;float: left;height: 100%;padding-right: 4px;"></div> -->
      <!-- <div id="log" style="float: right;width: 15%;height: 100%;text-align: left;overflow-y: auto;"></div> -->
    </div>
    <br />
    <br />
    <button @click="openYOZO()">打开永中</button>
    <br />
    <br />
    <input
      id="absPath"
      placeholder="请输入要打开的文档的绝对路径"
      type="text"
    />
    <button @click="loadFromLocal(false)">从指定路径加载文档</button>
    <button @click="loadFromLocal(true)">只读模式打开指定路径文档</button>
    <!-- <button @click="loadFromLocal(false, true)">修订模式打开指定路径文档</button> -->
    <button @click="yozoExt.apis.newDoc()">新建文档</button>
    <button @click="openLocalDoc({})">打开本地文档</button>
    <button @click="yozoExt.apis.openRemoteDoc({ url: remoteGetUrl })">
      打开远程文档
    </button>
    <button @click="yozoExt.apis.saveToLocal({ savePath: tmpSavePath })">
      保存到本地
    </button>
    <!-- <button @click="forceSaveToLocal()">保存到本地(直接覆盖)</button> -->
    <!-- <button @click="saveToRemote({url: remoteSaveUrl})a.name}`)">保存到远程</button> -->
    <br />

    <button
      @click="yozoExt.apis.setSelectedTextAsBookmark({ bookmarkName: 'b1' })"
    >
      添加b1书签
    </button>
    <button
      @click="
        yozoExt.apis.setBookmarkValue({
          bookmarkName: 'b1',
          bookmarkValue: '书签1',
        })
      "
    >
      设置b1书签值
    </button>
    <button
      @click="
        yozoExt.apis.deleteBookmark({ bookmarkName: 'b1', keepText: true })
      "
    >
      删除书签(b1)
    </button>
    <button @click="yozoExt.apis.goToBookmark({ bookmarkName: 'b1' })">
      定位书签(b1)
    </button>
    <button @click="yozoExt.apis.showBookmarks({ show: true })">
      显示书签
    </button>
    <button @click="yozoExt.apis.showBookmarks({ show: false })">
      隐藏书签
    </button>
    <button @click="yozoExt.apis.getBookmarkText({ bookmarkName: 'b1' })">
      获取b1书签文本
    </button>
    <button @click="yozoExt.apis.getBookmarkCount({})">获取书签个数</button>
    <button @click="yozoExt.apis.bookmarkExists({ bookmarkName: 'b1' })">
      是否存在书签b1
    </button>
    <button @click="yozoExt.apis.bookmarkExists({ bookmarkName: 'b2' })">
      是否存在书签b2
    </button>
    <button @click="yozoExt.apis.getBookmarkList({})">获取所有书签</button>
    <br />

    <button @click="yozoExt.apis.printPreview({})">打印预览</button>
    <button @click="yozoExt.apis.printDoc({})">打印文档</button>
    <br />

    <button @click="yozoExt.apis.setUserName({ userName: '黄' })">
      设置用户名为 黄
    </button>
    <button
      @click="
        yozoExt.apis.protect({
          protectionType: 3,
          password: '123',
          force: true,
        })
      "
    >
      设置保护
    </button>
    <button @click="yozoExt.apis.unprotect({ password: '123' })">
      取消保护
    </button>
    <button
      @click="yozoExt.apis.findAndReplace({ from: '代理', to: 'dai li' })"
    >
      查找并替换“代理”
    </button>
    <button
      @click="yozoExt.apis.findAndReplace({ from: '接口', to: 'jie kou' })"
    >
      查找并替换“接口”
    </button>
    <button @click="yozoExt.apis.findText({ text: '接口' })">
      查找“接口”二字
    </button>
    <button @click="yozoExt.apis.acceptAllRevisions({})">接受所有修订</button>
    <!-- <button @click="showDialog({wdWordDialog: 174})">弹出提示框</button> -->
    <br />

    <button
      @click="
        yozoExt.apis.setTableCellValue({
          tableIndex: 1,
          colIndex: 4,
          rowIndex: 2,
          text: '123',
        })
      "
    >
      设置单元格值
    </button>
    <button
      @click="
        yozoExt.apis.docProtectExceptCell({
          tableIndex: 1,
          cellList: [
            { colIndex: 1, rowIndex: 1 },
            { colIndex: 3, rowIndex: 3 },
          ],
          password: '123',
        })
      "
    >
      表格保护
    </button>
    <button @click="yozoExt.apis.getProtectionType({})">获取保护类型</button>
    <button
      class="error"
      @click="
        yozoExt.apis.goToTable({ tableIndex: 1, colIndex: 1, rowIndex: 2 })
      "
    >
      定位到表格1-1-2
    </button>
    <button @click="yozoExt.apis.addTableColumn({ tableIndex: 1 })">
      末尾插入列
    </button>
    <button
      class="error"
      @click="yozoExt.apis.addTableColumn({ tableIndex: 1, colIndex: 2 })"
    >
      第二列前插入列
    </button>
    <button @click="yozoExt.apis.addTableRow({ tableIndex: 1 })">
      末尾插入行
    </button>
    <button
      class="error"
      @click="yozoExt.apis.addTableRow({ tableIndex: 1, rowIndex: 2 })"
    >
      第二行前插入行
    </button>
    <button
      class="error"
      @click="yozoExt.apis.deleteTableColumn({ tableIndex: 1, colIndex: 2 })"
    >
      删除第二列
    </button>
    <button
      class="error"
      @click="yozoExt.apis.deleteTableRow({ tableIndex: 1, rowIndex: 2 })"
    >
      删除第二行
    </button>
    <button
      class="error"
      @click="
        yozoExt.apis.getTableCellValue({
          tableIndex: 1,
          colIndex: 1,
          rowIndex: 2,
        })
      "
    >
      获取表格1-1-2值
    </button>
    <button
      class="error"
      @click="yozoExt.apis.getTableRowCount({ tableIndex: 1 })"
    >
      获取表格1行数
    </button>
    <button
      class="error"
      @click="yozoExt.apis.getTableColCount({ tableIndex: 1 })"
    >
      获取表格1列数
    </button>
    <button
      class="error"
      @click="yozoExt.apis.getTableRowCount({ tableIndex: 1, colIndex: 3 })"
    >
      获取表格1-3行数
    </button>
    <button
      class="error"
      @click="yozoExt.apis.getTableColCount({ tableIndex: 1, rowIndex: 2 })"
    >
      获取表格1-2列数
    </button>
    <button class="error" @click="yozoExt.apis.getTableCount({})">
      获取表格数量
    </button>
    <button
      class="error"
      @click="yozoExt.apis.getTableTextIndex({ tableIndex: 1, text: 'here' })"
    >
      获取here索引
    </button>
    <button
      class="error"
      @click="
        yozoExt.apis.getTableTextOccurRowCount({ tableIndex: 1, text: 'here' })
      "
    >
      here出现行数
    </button>
    <br />

    <button @click="insertImage(false)">插入本地非粘贴型图片</button>
    <button @click="insertImage(true)">插入网络上粘贴型图片</button>
    <!-- <button @click="insertImageToFooter({picPath: 'http://192.168.61.3:8808/pic/11.png', height: 100, width: 200, left: 80, top: -2, linkToPrevious: false, toInlineImage: false})"> -->
    <!-- 插入网络上粘贴型图片到最后一节页脚 -->
    <!-- </button> -->
    <!-- <button @click="insertImageToFooter({picPath: 'http://192.168.61.3:8808/pic/11.png', height: 100, width: 200, top: 0, linkToPrevious: false, position: Yozo.enums.WdShapePosition.wdShapeCenter})"> -->
    <!-- 插入网络上嵌入型图片到最后一节页脚 -->
    <!-- </button> -->
    <br />
    <button @click="yozoExt.apis.insertText({ text: '文字' })">插入文字</button>
    <button @click="yozoExt.apis.shadeEditableRanges({ show: true })">
      突出可编辑区域
    </button>
    <button @click="yozoExt.apis.shadeEditableRanges({ show: false })">
      隐藏可编辑区域
    </button>
    <button
      @click="
        yozoExt.apis.insertHyperlink({
          address: 'http://baidu.com',
          text: '百度超链接',
        })
      "
    >
      插入超链接
    </button>
    <button @click="yozoExt.apis.getYOZOVersion()">获取YOZO版本</button>
    <button @click="yozoExt.apis.getSelectedText({})">获取选中文本</button>
    <br />
    <button
      @click="
        yozoExt.apis.setDocProperty({
          name: 'Company',
          value: 'True',
          type: yozoExt.enums.docProperty.msoPropertyString,
        })
      "
    >
      设置文档属性
    </button>
    <button @click="yozoExt.apis.getDocProperty({ name: 'Company' })">
      获取文档属性
    </button>
    <!-- <button @click="deleteDocProperty({name: 'Company'})">删除文档属性</button> -->
    <br />
    <br />
    <button @click="yozoExt.apis.addSection({ page: 2 })">
      文档的第一页末尾加入分节符
    </button>
    <button @click="yozoExt.apis.addSection({})">最后一页末尾插入分节符</button>
    <button @click="yozoExt.apis.saved()">是否已保存</button>
    <!-- <button @click="copy()">复制yozo1到yozo2</button> -->

    <button @click="yozoExt.apis.fitWindowSize()">视图自适应</button>
    <button @click="yozoExt.apis.toggleShowRevision({ show: true })">
      显示修订和批注
    </button>
    <button @click="yozoExt.apis.toggleShowRevision({ show: false })">
      隐藏修订和批注
    </button>
  </div>
</template>
<script>
import Yozo from './yongzhong.js';
export default {
  data() {
    return {
      remoteGetUrl: 'http://192.168.61.3:8080/files/123.docx',
      remoteSaveUrl:
        'http://192.168.61.3:8808/saveServlet/servlets/YozoServlet?path=d:/cesi.doc',
      logMessage: '',
    };
  },
  methods: {
    openYOZO() {
      window.yozoExt = Yozo.createNew(document.getElementById('yozo'));
      let res = Yozo.yozoExt.apis.initYozo('yozo', '100%', '100%');
      if (res == 'gg') {
        return 'gg';
      }
    },
    insertImage(shapeType) {
      const params = {
        height: 40,
        width: 200,
        shapeType: shapeType,
      };

      if (shapeType) {
        params.picPath = 'http://192.168.61.3:8808/pic/11.png';
        params.horizontalPos = 1;
        params.verticalPos = 1;
        params.left = 200;
        params.top = 200;
      } else {
        params.picPath = 'D:\\test.png';
      }

      yozoExt.apis.insertImage(params);
    },

    // window.tmpSavePath = '';

    // let $log;

    log(value) {
      if (!this.logMessage) {
        this.logMessage = document.querySelector('#log');
      }

      if (typeof value === 'string' || value instanceof String) {
        this.logMessage.innerHTML = `${this.logMessage.innerHTML}<br/>${value}`;
        return;
      }

      let toShow = '';
      for (let k in value) {
        toShow = `${toShow}<br />&nbsp;&nbsp;&nbsp;&nbsp;${k}:${value[k]}`;
      }

      this.logMessage.innerHTML = `${this.logMessage.innerHTML}${toShow}`;
    },

    // window.yozo2 = null;
    // window.yozo1 = null;

    loadFromLocal(readOnly, revisionMode) {
      const input = document.querySelector('#absPath');
      const path = input.value;

      yozoExt.apis.openLocalDoc({
        filePath: path,
        readOnly: readOnly,
        revisionMode: revisionMode,
      });
    },

    copy() {
      copyFrom({ filePath: getFilePath() });
    },
    forceSaveToLocal() {
      yozoExt.apis.saveToLocal({ savePath: getFilePath() });
    },
  },
};
</script>

<style></style>
