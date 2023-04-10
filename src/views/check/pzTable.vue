<template>
  <div>
    <el-row class="pzPad">
      <el-col class="PersonPz">
        <div class="PersonPz-left">
          <label for=""><span>*</span>人员配置：</label>
          <span style="padding-right: 15px">
            {{ tableForm.examineUserName }}
          </span>
          <div>
            <el-button
              type="primary"
              @click="showChooseUser(null, null, null, true)"
              >{{
                tableForm.examineUserName ? '更改人员' : '配置人员'
              }}</el-button
            >
          </div>
        </div>
        <div>
          <el-button type="primary" @click="saveConfig">保存</el-button>
          <el-button type="primary" plain @click="$router.go(-1)"
            >取消</el-button
          >
        </div>
      </el-col>
      <el-col class="PersonPz" style="margin-top: 15px">
        <el-button type="primary" @click="addPort">增加端</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <template v-for="(item, index) in tableForm.PortList">
      <div :key="index">
        <FormItem
          :tableForm="item"
          :index="index + 1"
          :ref="'tableForm' + index"
        >
          <template #rightBox>
            <el-button type="danger" plain @click="delPort(index)"
              >删除端</el-button
            >
          </template>
        </FormItem>
        <el-divider></el-divider>
      </div>
    </template>
    <!-- <div class="bottom-btn-group">
      <div class="kong"></div>
      <div>
        <el-button type="primary" @click="saveConfig">保存</el-button>
        <el-button type="primary" plain @click="$router.go(-1)">取消</el-button>
      </div>
    </div> -->
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
import { deepClone } from '@/utils/deepclone.js';
import Reviewer from './reviewer.vue';
import { getUser } from '@/api/system/user.js';
import { getConfig, insertParentNodeConfig } from '@/api/policyCheck';
import FormItem from './c-cpns/FormItem';
export default {
  components: { Reviewer, FormItem },

  data() {
    return {
      // 判断是否是父级节点控制
      isFlag: false,
      dialogTableVisible: false,
      bindReviewerId: [],
      reviewRoles: [],
      reviewers: [],
      queryParams: {},
      tableForm: {
        examineUserName: '朱历明',
        examineUserId: 184,
        PortList: [
          {
            capitalApplyParentNodeConfigList: [
              {
                id: 1,
                parentProcessNodeName: '审核组11111111',
                createTime: '2022-10-20 14:38:24',
                createBy: 'admin',
                capitalApplyNodeConfigs: [
                  {
                    id: 245,
                    nodeName: '审核1',
                    nodeTag: 1,
                    nodePersonnel: '[{"userName":"审核01","userId":"1907"}]',
                    nodeUserName: '审核01',
                    nodeUserId: 1907,
                    groupLeader: 0,
                    createTime: '2022-11-29 19:32:35',
                    createBy: '朱历明',
                    parentNodeConfigId: 1,
                  },
                  {
                    id: 246,
                    nodeName: '审核2',
                    nodePersonnel: '[{"userName":"审核02","userId":"1908"}]',
                    nodeUserName: '审核02',
                    nodeUserId: 1908,
                    groupLeader: 0,
                    createTime: '2022-11-29 19:32:35',
                    createBy: '朱历明',
                    parentNodeConfigId: 1,
                  },
                  {
                    id: 247,
                    nodeName: '组1审核4',
                    nodePersonnel: '[{"userName":"审核01","userId":"1907"}]',
                    nodeUserName: '审核01',
                    nodeUserId: 1907,
                    groupLeader: 1,
                    createTime: '2022-11-29 19:32:35',
                    createBy: '朱历明',
                    parentNodeConfigId: 1,
                  },
                  {
                    id: 248,
                    nodeName: '组1审核5',
                    nodePersonnel: '[{"userName":"复核01","userId":"1905"}]',
                    nodeUserName: '复核01',
                    nodeUserId: 1905,
                    groupLeader: 0,
                    createTime: '2022-11-29 19:32:35',
                    createBy: '朱历明',
                    parentNodeConfigId: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      // 用于判断一个组，必须有组员和组长
      isGroupLength: true,
      // 用于判断一个节点必须配人
      isGroupPersonnel: true,
      AllFormArr: [],
    };
  },

  mounted() {
    // this.getTableConfig();
  },
  methods: {
    // 删除端逻辑
    delPort(e) {
      let res = deepClone(this.tableForm);
      console.log(e);
      res.PortList.splice(e, 1);
      this.tableForm = res;
    },
    // 增加端逻辑
    addPort() {
      if (this.tableForm.PortList.length > 4) {
        this.$message.error('最多添加5个端');
      } else {
        let res = deepClone(this.tableForm);
        res.PortList.push({
          capitalApplyParentNodeConfigList: [
            {
              parentProcessNodeName: '',
              capitalApplyNodeConfigs: [
                {
                  date: 1,
                  nodeName: '',
                  groupLeader: 1,
                  nodePersonnel: '[]',
                },
              ],
            },
          ],
        });
        this.tableForm = res;
        console.log(this.tableForm);
      }
    },
    // 增加端逻辑ending
    //分配用户
    showChooseUser(index, tableIndex, row, isFlag = false) {
      this.dialogTableVisible = true;
      this.bindReviewerId = [Number(this.tableForm.examineUserId)];
      // console.log("this.bindReviewerId", this.bindReviewerId);
      this.nowIndex = index;
      this.tableIndex = tableIndex;
    },
    async getTableConfig() {
      let res = await getConfig();
      if (res.code == 200) {
        this.tableForm = {
          ...res.data,
        };
      }
    },
    // 以数组值为键，持续向一个对象里面加值，
    isRepeat(arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },
    async saveConfig() {
      let flag = false;
      let result = [];
      for (const key in this.$refs) {
        let tem = await this.$refs[key][0].formItemValidate();
        result.push(tem);
      }
      console.log(result);
      console.log(this.tableForm);
      // 判断表单校验
      flag = await result.every((result) => {
        console.log(result);
        return result == true;
      });
      console.log(flag);
      let isNoSamePerson = true;
      if (flag) {
        this.AllFormArr = [];
        console.log(this.tableForm);
        if (this.tableForm.examineUserName == '') {
          this.$message.error('人员未配置');
          return;
        }

        this.tableForm.PortList.forEach((item) => {
          item.capitalApplyParentNodeConfigList.forEach((tem) => {
            if (tem.capitalApplyNodeConfigs.length < 2) {
              this.isGroupLength = false;
            }
            this.isGroupPersonnel = tem.capitalApplyNodeConfigs.every((i) => {
              return JSON.parse(i.nodePersonnel).length != 0;
            });
          });

          item.capitalApplyParentNodeConfigList.forEach(async (z) => {
            z.allArr = [];
            await z.capitalApplyNodeConfigs.forEach((g) => {
              z.allArr.push(Number(g.nodeUserId));
            });
            this.AllFormArr.push(...[...new Set(z.allArr)]);
          });
        });
        isNoSamePerson = this.isRepeat(this.AllFormArr);
        console.log('this.AllFormArr', this.AllFormArr, isNoSamePerson);
        if (!this.isGroupLength) {
          this.$message.error('一个组中必须包含组长和组员');
          return;
        }
        if (!this.isGroupPersonnel) {
          this.$message.error('存在节点人员未配置');
          return;
        }
      }

      // this.$refs.tableFormRef.validate(async (valid) => {
      //   if (valid) {
      //     if (!this.tableForm.examineUserName) {
      //       this.$message.error("人员未配置");
      //       return;
      //     }
      //     let isFlag = true;
      //     let isGroupLength = true;
      //     let isNoSamePerson = true;
      //     this.tableForm.capitalApplyParentNodeConfigList.forEach((item) => {
      //       if (item.capitalApplyNodeConfigs.length < 2) {
      //         isGroupLength = false;
      //       }
      //       isFlag = item.capitalApplyNodeConfigs.every((i) => {
      //         return JSON.parse(i.nodePersonnel).length != 0;
      //       });
      //     });
      //     this.tableForm.capitalApplyParentNodeConfigList.map((item) => {
      //       item.allArr = [];
      //       item.capitalApplyNodeConfigs.forEach((i) => {
      //         item.allArr.push(Number(i.nodeUserId));
      //       });
      //     });
      //     let AllArr = [];
      //     this.tableForm.capitalApplyParentNodeConfigList.forEach((item) => {
      //       AllArr.push(...[...new Set(item.allArr)]);
      //     });
      //     isNoSamePerson = this.isRepeat(AllArr);
      //     // console.log(AllArr, !isNoSamePerson);
      //     if (isFlag && isGroupLength && !isNoSamePerson) {
      //       let result = await insertParentNodeConfig(
      //         JSON.stringify(this.tableForm)
      //       );
      //       if (result.code == 200) {
      //         this.$message.success("保存成功");
      //         this.getTableConfig();
      //       }
      //     } else {
      //       if (!isGroupLength) {
      //         this.$message.error("一个组中必须包含组长和组员");
      //       } else if (isNoSamePerson) {
      //         this.$message.error("存在两个组中人员相同");
      //       } else {
      //         this.$message.error("存在节点人员未配置");
      //       }
      //     }
      //   }
      // });
    },
    // dialog部分
    //选择审批人
    selectReviewer(selection) {
      this.reviewers = selection;
      // console.log(this.reviewers);
      this.queryParams = {
        nowIndex: this.nowIndex,
        tableIndex: this.tableIndex,
        ids: this.reviewers.join(','),
      };
    },
    reset() {
      this.bindReviewRoleId = [];
      this.bindReviewerId = [];
    },

    //确认分配审批人
    async submitReviewer() {
      let res = deepClone(this.tableForm);
      this.dialogTableVisible = false;
      const { nowIndex, tableIndex } = this.queryParams;
      let tem = [];
      new Promise((resolve, reject) => {
        this.queryParams.ids.split(',').forEach(async (item) => {
          let userName = await getUser(item);
          tem.push({
            userName: userName.data.nickName,
            userId: item,
          });
          resolve();
        });
      }).then(() => {
        res.nodePersonnel = JSON.stringify(tem);
        res.examineUserName = tem[0].userName;
        res.examineUserId = tem[0].userId;
        this.tableForm = res;
        // console.log(this.tableForm);
      });
    },
    // ending
  },
};
</script>

<style lang="scss" scoped>
.chooseRy:hover {
  color: #1790ff;
  .choose_img {
    background-image: url('../../../assets/image/zczcsh/choose.png');
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
    background-image: url('../../../assets/image/zczcsh/choose_active.png');
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
  justify-content: space-between;
  .PersonPz-left {
    flex: 1;
    display: flex;
    align-items: center;
  }
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
