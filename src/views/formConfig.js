export const searchFormConfig = {
  labelWidth: '120px',
  itemstyle: {
    padding: '10px 40px',
  },
  // colLayout: {
  //   span: 8
  // },
  formItems: [
    {
      field: 'id',
      type: 'input',
      label: 'id',
      placeholder: '请输入id',
    },
    {
      field: 'name',
      type: 'input',
      label: '角色名称',
      placeholder: '请输入角色名称',
    },
    {
      field: 'intro',
      type: 'input',
      label: '权限介绍',
      placeholder: '请输入权限介绍',
    },
    {
      field: 'roleId',
      type: 'select',
      label: '选择角色',
      placeholder: '请选择角色',
      options: [
        {
          value: '选项1',
          title: '黄金糕',
        },
        {
          value: '选项2',
          title: '双皮奶',
        },
        {
          value: '选项3',
          title: '蚵仔煎',
        },
        {
          value: '选项4',
          title: '龙须面',
        },
        {
          value: '选项5',
          title: '北京烤鸭',
        },
      ],
    },
    {
      field: 'createTime',
      type: 'datepicker',
      label: '创建时间',
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange',
      },
    },
  ],
};
