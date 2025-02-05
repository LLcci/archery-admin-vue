<template>
  <div
    v-for="(group, groupIndex) in groupArr"
    :key="groupIndex"
    class="not-first:mt grid grid-cols-3"
  >
    <div class="flex ml" v-for="(item, index) in singleGroupArr" :key="index">
      <span>{{ index + 1 }}:&ensp;</span
      ><el-input :disabled="props.disabled" v-model="modelValue![groupIndex][index]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { paths } from '@/types/Schema'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ groupNum: number; singleGroupArrowNum: number; disabled?: boolean }>(),
  {
    groupNum: 0,
    singleGroupArrowNum: 0,
    disabled: false
  }
)

const modelValue =
  defineModel<
    paths['/admin/archery/scoring/save']['post']['requestBody']['content']['application/json']['values']
  >()

const updateGroup = () => {
  const oldValue = [...modelValue.value!]
  modelValue.value!.length = 0
  let arr = []
  for (let index = 0; index < props.groupNum; index++) {
    if (oldValue[index]) {
      modelValue.value?.push(oldValue[index])
    } else {
      modelValue.value?.push([])
    }
    arr.push(index.toString())
  }
  return arr
}

const groupArr = computed(() => updateGroup())

const updateItem = () => {
  let arr = []
  for (let index = 0; index < props.singleGroupArrowNum; index++) {
    arr.push(index.toString())
  }
  for (const item of modelValue.value!) {
    const oldValue = [...item]
    item.length = 0
    for (let index = 0; index < props.singleGroupArrowNum; index++) {
      if (oldValue[index]) {
        item.push(oldValue[index])
      }
    }
  }
  return arr
}

const singleGroupArr = computed(() => updateItem())
</script>

<style scoped></style>
