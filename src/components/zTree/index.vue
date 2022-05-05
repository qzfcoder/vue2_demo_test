<template>
  <div>
    <ul>
      <item class="item" :model="treeData"></item>
    </ul>
  </div>
</template>

<script>
import Item from './item/index.vue'
export default {
  components: {
    Item
  },
  data() {
    return {
      treeData: {
        title: '第一层',
        children: [
          {
            title: '第二场'
          },
          {
            title: '第二层2',
            children: [
              {
                title: '第三层'
              },
              {
                title: '第三层2'
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
