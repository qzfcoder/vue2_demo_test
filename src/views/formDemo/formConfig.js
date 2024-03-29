export const searchFormConfig = {
  labelWidth: '120px',
  itemstyle: {
    padding: '10px 40px',
  },
  colLayout: {
    span: 8,
  },
  isShowFlag: true,
  formItems: [
    {
      field: 'id',
      type: 'input',
      label: 'id',
      placeholder: '请输入id',
      showKey: 1,
      rules: [{ required: true, message: '请输入活动名称', trigger: 'change' }],
    },
    {
      field: 'name',
      type: 'password',
      label: '角色名称',
      placeholder: '请输入角色名称',
      showKey: 2,
      rules: [{ required: true, message: '请输入活动名称', trigger: 'change' }],
    },
    {
      field: 'textarea',
      type: 'textarea',
      label: 'textarea',
      showKey: 1,
      rows: 2,
      placeholder: '请输入角色名称',
    },
    {
      field: 'asaaaada',
      type: 'radio',
      label: 'aaa',
      placeholder: '请输入权限介绍',
      isChooseItem: true,
      options: [
        {
          label: 'test1',
          value: 1,
        },
        {
          label: 'test2',
          value: 2,
        },
      ],
    },
    {
      field: 'checkboxsa',
      type: 'checkbox',
      label: 'checkbox',
      placeholder: '请输入权限介绍',
      showKey: 1,
      options: [
        {
          label: 'test1',
          value: 1,
        },
        {
          label: 'test2',
          value: 2,
        },
      ],
      boxs: ['上海', '北京', '广州', '深圳'],
    },
    {
      field: 'intro',
      type: 'input',
      label: '权限介绍',
      showKey: 1,
      placeholder: '请输入权限介绍',
    },
    {
      field: 'switch',
      type: 'switch',
      label: 'switch',
      placeholder: '请输入权限介绍',
      showKey: 2,
      otherOptions: {
        'active-color': '#13ce66',
        'inactive-color': '#ff4949',
      },
    },
    {
      field: 'word',
      type: 'uploadFile',
      label: 'uploadFile',
      placeholder: '请输入权限介绍',
      showKey: 1,
    },
    {
      field: 'uploadImg',
      type: 'uploadImg',
      label: 'uploadImg',
      showKey: 2,
      placeholder: '请输dsa入权限介绍',
      otherOptions: {
        lastM: 2,
        imgType: ['image/jpeg', 'image/png'],
      },
    },
    {
      field: 'roleId',
      type: 'select',
      label: '选择角色',
      showKey: 2,
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
      field: 'cascaderId',
      type: 'cascader',
      label: '级联选择',
      placeholder: '级联选择',
      showKey: 1,
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致',
                },
                {
                  value: 'fankui',
                  label: '反馈',
                },
                {
                  value: 'xiaolv',
                  label: '效率',
                },
                {
                  value: 'kekong',
                  label: '可控',
                },
              ],
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航',
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航',
                },
              ],
            },
          ],
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局',
                },
                {
                  value: 'color',
                  label: 'Color 色彩',
                },
                {
                  value: 'typography',
                  label: 'Typography 字体',
                },
                {
                  value: 'icon',
                  label: 'Icon 图标',
                },
                {
                  value: 'button',
                  label: 'Button 按钮',
                },
              ],
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框',
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框',
                },
                {
                  value: 'input',
                  label: 'Input 输入框',
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器',
                },
                {
                  value: 'select',
                  label: 'Select 选择器',
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器',
                },
                {
                  value: 'switch',
                  label: 'Switch 开关',
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块',
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器',
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器',
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器',
                },
                {
                  value: 'upload',
                  label: 'Upload 上传',
                },
                {
                  value: 'rate',
                  label: 'Rate 评分',
                },
                {
                  value: 'form',
                  label: 'Form 表单',
                },
              ],
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格',
                },
                {
                  value: 'tag',
                  label: 'Tag 标签',
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条',
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件',
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页',
                },
                {
                  value: 'badge',
                  label: 'Badge 标记',
                },
              ],
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告',
                },
                {
                  value: 'loading',
                  label: 'Loading 加载',
                },
                {
                  value: 'message',
                  label: 'Message 消息提示',
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框',
                },
                {
                  value: 'notification',
                  label: 'Notification 通知',
                },
              ],
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单',
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页',
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑',
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单',
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条',
                },
              ],
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框',
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示',
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框',
                },
                {
                  value: 'card',
                  label: 'Card 卡片',
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯',
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板',
                },
              ],
            },
          ],
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components',
            },
            {
              value: 'sketch',
              label: 'Sketch Templates',
            },
            {
              value: 'jiaohu',
              label: '组件交互文档',
            },
          ],
        },
      ],
      otherOptions: {
        triggerType: 'click',
        multiple: true,
      },
    },
    {
      field: 'createTime',
      type: 'datepicker',
      showKey: 1,
      label: '创建时间',
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange',
      },
    },
  ],
};
