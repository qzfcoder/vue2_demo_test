<template>
  <div>
    <hb-t>
      <template #secondTarfet="scope">
        <el-input v-model="scope.row.secondTarfet"></el-input>
      </template>
      <template #threedTarfet="scope">
        <el-input v-model="scope.row.threedTarfet"></el-input>
      </template>
      <template #target="scope">
        <el-input v-model="scope.row.target"></el-input>
      </template>
    </hb-t>
  </div>
</template>

<script>
import hbT from '@/base-ui/hbT/hbTable.vue';
export default {
  components: {
    hbT,
  },
  methods: {},
};
</script>
