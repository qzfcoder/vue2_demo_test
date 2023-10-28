// import { listDeptSearch, newListDept, getDept } from "@/api/system/dept";
export default {
  data() {
    return {
      Isasync: false,
      defaultLevel: 0,
      deptOptions: []
    };
  },
  created() {
    this.getDeptList();
    this.reportOrgId = this.deptId;
    if (this.reportOrgId) {
      this.getDeptIdList(this.reportOrgId);
    }
  },
  async mounted() { },
  methods: {
    assetTreeKeydownFun() {
      this.Isasync = true;
      this.defaultLevel = 1;
    },
    onpropertychange() {
      this.Isasync = true;
      this.defaultLevel = 1;
    },
    itemopen(index) {
      this.Isasync = false;
      this.defaultLevel = 0;
    },
    itemClose(index) {
      this.Isasync = false;
      this.defaultLevel = 0;
    },
    assetTreeKeyupFun(e) {
      if (!e.target.value) {
        this.Isasync = false;
        this.defaultLevel = 0;
        this.getDeptList();
      }
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 处理节点
    setNodeData(data) {
      let arr = [];
      for (let list of data) {
        let chiledModeInfo = list;
        if (list.hasChildren) {
          chiledModeInfo.children = null;
        } else {
          delete chiledModeInfo.children;
        }
        arr.push(chiledModeInfo);
      }
      return arr;
    },
    // 获取初始化数据
    getDeptList(deptId = 0) {
      // newListDept({ deptId }).then(response => {
      //   let data = response.data || [];
      //   this.deptOptions = this.setNodeData(data)
      //   // this.deptOptions = this.handleTree(response.data, "deptId");
      //   // this.formList[4].options = this.handleTree(response.data, "deptId");
      // });
      this.deptOptions = this.setNodeData([{
        deptId: 1,
        deptName: '1',
        hasChildren: true
      }])
    },
    // 编辑详情回显
    getDeptIdList(deptId) {
      getDept(deptId).then(response => {
        let data = response.data ? [response.data] : [];
        this.deptOptions = this.setNodeData(data)
      });

    },
    // 初始化
    initOptions() {
      newListDept({ deptId: 0 }).then(response => {
        parentNode.children = this.setNodeData(response.data);
      })
    },
    // 搜索
    asyncOptions({ action, searchQuery, callback }) {
      if (action === 'ASYNC_SEARCH') {
        
          let tem = [{
            deptId: 2,
            deptName: '2',
            hasChildren: true
          }]
          callback(null, this.setNodeData(tem));
      }
    },
    //treeselect 树懒加载
    loadOptions({ action, parentNode, callback }) {
      console.log(action, parentNode, callback, 2);
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        //加载点击节点的 子节点
        newListDept({ deptId: parentNode.deptId }).then(response => {
          parentNode.children = this.setNodeData(response.data);
        })
        // lazyTreeselect({ code: parentNode.code }).then((response) => {
        //   let arr = [];
        //   for (let index of response.data) {
        //     let chiledModeInfo = {};
        //     chiledModeInfo.id = index.id;
        //     chiledModeInfo.code = index.code;
        //     chiledModeInfo.label = index.name;
        //     chiledModeInfo.name = index.name;
        //     chiledModeInfo.children = null;
        //     if (index.hasLeaf == "1") {
        //       delete chiledModeInfo.children;
        //     }
        //     arr.push(chiledModeInfo);
        //   }
        // });
        callback();
      }
    },
    beforeClearAll() {
      this.getDeptList();
      return true
    }
  },
};
