export const contentTableConfig = {
  title: '用户列表',
  propList: [
    { prop: 'name', label: '菜单名称', minWidth: '100' },
    { prop: 'type', label: '类型', minWidth: '100' },
    { prop: 'url', label: 'url', minWidth: '100' },
    { prop: 'sort', label: '排序', minWidth: '100' },
    { prop: 'icon', label: '图标', minWidth: '100' },
    { prop: 'permission', label: '权限', minWidth: '100' },
    {
      prop: 'createAt',
      label: '创建时间',
      minWidth: '250',
      slotName: 'createAt',
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      minWidth: '250',
      slotName: 'updateAt',
    },
    {
      label: '操作',
      minWidth: '120',
      slotName: 'handle',
    },
  ],
  showIndexCloum: false,
  showSelectCloum: false,
  childrenProps: {
    rowKey: 'id',
    treeProp: {
      children: 'children',
    },
  },
};
