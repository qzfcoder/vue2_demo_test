<template>
  <div>
    <el-form
      :model="tableForm"
      ref="tableFormRef"
      :label-position="labelPosition"
      label-width="140px"
    >
      <el-row class="pzPad-father">
        <el-col class="pzPad-top-title">
          <div>端{{ index }}</div>
          <div class="title-right">
            <slot name="rightBox"></slot>
          </div>
        </el-col>
        <el-col>
          <el-button type="primary" @click="addFatherNode" icon="el-icon-plus"
            >添加父节点</el-button
          >
        </el-col>
      </el-row>
      <el-row
        v-for="(item, index) in tableForm.capitalApplyParentNodeConfigList"
        :key="index"
        class="pzBG"
      >
        <el-col class="pzBG-father">
          <el-form-item
            class="pzBG-father-input"
            :label="'父节点名称' + Number(index + 1) + '：'"
            :prop="
              'capitalApplyParentNodeConfigList.' +
              index +
              '.parentProcessNodeName'
            "
            :rules="rules.isRequired"
          >
            <el-input
              v-model="item.parentProcessNodeName"
              maxlength="5"
              :style="{ width: '90%' }"
            ></el-input>
          </el-form-item>
          <el-button
            v-if="index != 0"
            class="pzBG-father-btn"
            type="text"
            @click="del(index)"
            ><i class="el-icon-delete"></i>删除</el-button
          >
        </el-col>
        <el-col class="pzTable-border">
          <el-table
            :data="item.capitalApplyNodeConfigs"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" label="子节点" width="120">
            </el-table-column>
            <el-table-column
              v-for="i in tableConfig"
              :key="i.lable"
              :prop="i.valueKey"
              :label="i.label"
            >
              <template slot-scope="scope">
                <el-form-item
                  v-if="i.type == 'Input'"
                  :prop="
                    'capitalApplyParentNodeConfigList.' +
                    index +
                    '.capitalApplyNodeConfigs.' +
                    scope.row.row_index +
                    '.nodeName'
                  "
                  :rules="rules.isRequired"
                >
                  <el-input
                    v-model="scope.row[i.valueKey]"
                    placeholder="请输入内容"
                    :style="{ width: '90%' }"
                  ></el-input>
                </el-form-item>

                <span v-else-if="i.type == 'pz'">
                  <div
                    class="chooseRy"
                    v-if="JSON.parse(scope.row.nodePersonnel).length == 0"
                  >
                    <div class="choose_img"></div>
                    <span
                      @click="showChooseUser(index, scope.$index, scope.row)"
                      class="hoverCouser"
                      >选择审查人</span
                    >
                  </div>
                  <div class="chooseRy" v-else>
                    <div class="choose_img"></div>
                    <span
                      style="margin-right: 5px"
                      class="hoverCouser"
                      @click="showChooseUser(index, scope.$index, scope.row)"
                      >更换</span
                    >
                    <span style="margin: 0 5px; color: black">{{
                      JSON.parse(scope.row.nodePersonnel)[0].userName
                    }}</span>
                    <el-tag v-if="scope.row.groupLeader" type="success"
                      >组长</el-tag
                    >
                  </div>
                </span>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  v-show="!scope.row.isEdit && !scope.row.groupLeader"
                  @click="setLeader(index, scope.$index, scope.row)"
                  type="text"
                  size="small"
                  class="btn"
                >
                  设为组长
                </el-button>
                <el-button
                  v-if="scope.$index != 0"
                  @click="deleteRow(index, scope.$index, scope.row)"
                  type="text"
                  size="small"
                  class="btn"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="add-btn" @click="addTabColunm(index)">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="分配审批人"
      :visible.sync="dialogTableVisible"
      v-if="dialogTableVisible"
    >
      <reviewer
        @selectReviewer="selectReviewer"
        :selectId="bindReviewerId"
      ></reviewer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReviewer">确 定</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import rule from "@/utils/rule";
// import { deepClone } from "@/utils/deepclone.js";
import Reviewer from "../reviewer.vue";
import { getUser } from "@/api/system/user.js";

export default {
  components: { Reviewer },

  props: {
    tableForm: {
      type: Object,
      required: true,
    },
    index: {
      type: String | Number,
      required: true,
    },
  },
  data() {
    return {
      labelPosition: "left",
      dialogTableVisible: false,
      bindReviewerId: [],
      reviewRoles: [],
      reviewers: [],
      tableConfig: [
        {
          label: "节点名称",
          valueKey: "nodeName",
          type: "Input",
          defauleValue: "",
        },
        {
          label: "人员配置",
          valueKey: "files",
          type: "pz", // input | select | upload | date, 默认input
          dateType: "", // month |  year, 默认 month
          defauleValue: [], // month |  year, 默认 month
        },
      ],
      rules: {
        isRequired: rule(true),
      },
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex;
    },
    // 增加父级节点
    addFatherNode() {
      if (this.tableForm.capitalApplyParentNodeConfigList.length > 4) {
        this.$message.error("最多增加五个父节点");
        return;
      }
      // let res = deepClone(this.tableForm);
      this.tableForm.capitalApplyParentNodeConfigList.push({
        parentProcessNodeName: "",
        capitalApplyNodeConfigs: [
          {
            date: 1,
            nodeName: "",
            groupLeader: 1,
            nodePersonnel: "[]",
          },
        ],
      });
      // this.tableForm = { ...res };
    },
    // 删除父级节点
    del(index) {
      // let res = deepClone(this.tableForm);
      this.tableForm.capitalApplyParentNodeConfigList.splice(index, 1);
      // this.tableForm = res;
    },
    // 添加一行
    addTabColunm(index) {
      console.log("addTabColunm", index);
      // let res = deepClone(this.tableForm);
      this.tableForm.capitalApplyParentNodeConfigList[
        index
      ].capitalApplyNodeConfigs.push({
        date: 1,
        nodeName: "",
        nodePersonnel: "[]",
        groupLeader: 0,
      });
      // this.tableForm = res;
    },
    setLeader(index, tableIndex, e) {
      // let res = deepClone(this.tableForm);
      this.tableForm.capitalApplyParentNodeConfigList[
        index
      ].capitalApplyNodeConfigs.map((item, i) => {
        if (tableIndex == i) {
          item.groupLeader = 1;
        } else {
          item.groupLeader = 0;
        }
        return item;
      });

      this.tableForm = res;
    },
    deleteRow(index, tableIndex, e) {
      // let res = deepClone(this.tableForm);
      this.tableForm.capitalApplyParentNodeConfigList[
        index
      ].capitalApplyNodeConfigs.splice(tableIndex, 1);
      if (
        this.tableForm.capitalApplyParentNodeConfigList[index]
          .capitalApplyNodeConfigs.length == 1
      ) {
        this.tableForm.capitalApplyParentNodeConfigList[
          index
        ].capitalApplyNodeConfigs[0].groupLeader = 1;
      } else {
        if (e.groupLeader == 1) {
          this.tableForm.capitalApplyParentNodeConfigList[
            index
          ].capitalApplyNodeConfigs[0].groupLeader = 1;
        }
      }
      this.tableForm = res;
    },
    //分配用户
    showChooseUser(index, tableIndex, row, isFlag = false) {
      this.isFlag = isFlag;
      this.dialogTableVisible = true;
      let arr = [];
      JSON.parse(row.nodePersonnel).forEach((item) => {
        arr.push(Number(item.userId));
      });
      this.bindReviewerId = [...arr];
      // console.log("this.bindReviewerId", this.bindReviewerId);
      this.nowIndex = index;
      this.tableIndex = tableIndex;
    },
    // dialog部分
    //选择审批人
    selectReviewer(selection) {
      this.reviewers = selection;
      // console.log(this.reviewers);
      this.queryParams = {
        nowIndex: this.nowIndex,
        tableIndex: this.tableIndex,
        ids: this.reviewers.join(","),
      };
    },
    reset() {
      this.bindReviewRoleId = [];
      this.bindReviewerId = [];
    },

    //确认分配审批人
    async submitReviewer() {
      // let res = deepClone(this.tableForm);
      this.dialogTableVisible = false;
      const { nowIndex, tableIndex } = this.queryParams;
      let tem = [];
      new Promise((resolve, reject) => {
        this.queryParams.ids.split(",").forEach(async (item) => {
          let userName = await getUser(item);
          tem.push({
            userName: userName.data.nickName,
            userId: item,
          });
          resolve();
        });
      }).then(() => {
        if (this.isFlag) {
          this.tableForm.nodePersonnel = JSON.stringify(tem);
          this.tableForm.examineUserName = tem[0].userName;
          this.tableForm.examineUserId = tem[0].userId;
        } else {
          this.tableForm.capitalApplyParentNodeConfigList[
            nowIndex
          ].capitalApplyNodeConfigs[tableIndex].nodePersonnel =
            JSON.stringify(tem);
          this.tableForm.capitalApplyParentNodeConfigList[
            nowIndex
          ].capitalApplyNodeConfigs[tableIndex].nodeUserName = tem[0].userName;
          this.tableForm.capitalApplyParentNodeConfigList[
            nowIndex
          ].capitalApplyNodeConfigs[tableIndex].nodeUserId = tem[0].userId;
        }
        // this.tableForm = res;
        // console.log(this.tableForm);
      });
    },
    // ending
    // 数据校验逻辑
    async formItemValidate() {
      let res = false;
      await this.$refs.tableFormRef.validate((e) => {
        res = e;
      });
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.chooseRy:hover {
  color: #1790ff;
  .choose_img {
    background-image: url("../../../../assets/image/zczcsh/choose.png");
  }
}
.chooseRy {
  display: flex;
  align-items: center;
  color: #3e9df6;
  .choose_img {
    margin-right: 5px;
    width: 18px;
    height: 18px;
    // src\assets\image\zczcsh\choose.png
    // src\views\policySupport\zczcCheck\pzTable.vue
    background-image: url("../../../../assets/image/zczcsh/choose_active.png");
  }
}
.add-btn {
  margin-top: 20px;
  color: #1790ff;
  line-height: 54px;
  height: 54px;
  text-align: center;
  cursor: pointer;
  border: 1px dashed #1790ff;

  .el-icon-plus {
    font-size: 20px;
  }
}
::v-deep .cell .el-tag {
  margin-right: 0px !important;
  margin-bottom: 0px !important;
}
::v-deep .el-table .el-table__cell {
  margin: 0px !important;
}
::v-deep .el-table--medium .el-table__cell {
  padding: 0px !important;
}
::v-deep .el-table__row .el-form-item__content {
  margin-left: 0px !important;
  margin-top: 20px;
}
.btn {
  font-size: 16px;
}
.PersonPz {
  display: flex;
  align-items: center;
  label {
    font-size: 16px;
    color: #606266;
    width: 140px;
    span {
      color: red;
      margin-right: 6px;
    }
  }
}
.pzPad {
  padding: 10px 40px;
  padding-top: 0px;
}
.pzPad-father {
  padding: 0px 40px;
  padding-top: 0px;
  .pzPad-top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
}
.pzBG {
  box-sizing: content-box;
  background-color: #f8fafb;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
}
.pzTable-border {
  border: 1px solid #cfe7fe;
  padding: 15px;
  background-color: #fff;
}
::v-deep .el-form-item__label {
  font-size: 16px;
}
::v-deep .el-icon-error {
  cursor: pointer;
  position: absolute;
  right: -6px;
  top: -6px;
  transform: scale(1.5);
  color: #ff8170;
}
.hoverCouser {
  cursor: pointer;
}
.bottom-btn-group {
  padding: 0 20px;
  display: flex;
  .kong {
    flex: 1;
  }
}
.pzBG-father {
  display: flex;
  .pzBG-father-input {
    flex: 1;
  }
  .pzBG-father-btn {
    color: #ff8170;
    width: 20px;
    margin-right: 30px;
  }
}
</style>
