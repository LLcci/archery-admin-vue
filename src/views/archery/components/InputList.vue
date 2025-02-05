<template>
  <div>
    <div>
      <el-button class="w-full" @click="addInput" :icon="Plus" />
    </div>
    <div class="mt grid grid-cols-3 grid-gap-2">
      <el-input
        v-for="(item, index) in modelValue"
        :key="index"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        v-model="modelValue![index]"
      >
        <template #prepend>{{ index + 1 }}</template>
        <template #append>
          <el-button :icon="Minus" @click="deleteInput(index)" />
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{ disabled?: boolean; placeholder?: string }>(), {
  disabled: false
})

const modelValue = defineModel<string[]>()

const addInput = () => {
  modelValue.value?.push('')
}

const deleteInput = (index: number) => {
  console.log('🚀 ~ deleteInput ~ index:', index)
  modelValue.value?.splice(index, 1)
}
</script>

<style scoped></style>
