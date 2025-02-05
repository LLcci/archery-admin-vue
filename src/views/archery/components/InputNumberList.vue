<template>
  <div>
    <div>
      <el-button class="w-full" @click="addInput" :icon="Plus" />
    </div>
    <div class="mt grid grid-cols-3 grid-gap-2">
      <div class="flex" v-for="(item, index) in modelValue" :key="index">
        <el-input-number
          v-bind="props.inputNumberProps"
          :disabled="props.disabled"
          v-model="modelValue![index]"
        >
        </el-input-number>
        <el-button @click="deleteInput(index)" :icon="Minus" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue'
import type { InputNumberProps } from 'element-plus'

const props = withDefaults(
  defineProps<{ disabled?: boolean; inputNumberProps?: Partial<InputNumberProps> }>(),
  {
    disabled: false
  }
)

const modelValue = defineModel<number[]>()

const addInput = () => {
  modelValue.value?.push(1)
}

const deleteInput = (index: number) => {
  console.log('🚀 ~ deleteInput ~ index:', index)
  modelValue.value?.splice(index, 1)
}
</script>

<style scoped></style>
