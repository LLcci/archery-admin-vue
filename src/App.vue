<template>
  <el-config-provider :locale="locale">
    <el-scrollbar height="100vh"><RouterView /></el-scrollbar>
  </el-config-provider>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSystem } from './stores/useSystem'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref } from 'vue'

const locale = ref(zhCn)
useSystem().checkBreakpointsResize()

window.onresize = () => {
  useSystem().checkBreakpointsResize()
}
</script>
<style>
.el-form--inline {
  .el-form-item {
    .el-select {
      flex: 1 1 0%;
      min-width: 100px;
    }
  }
}
</style>
