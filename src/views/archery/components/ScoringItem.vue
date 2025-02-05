<template>
  <div>
    <div class="flex items-end justify-between">
      <div class="font-size-lg xs:text-base color-gray">
        {{ dayjs(props.item.createTime).format('YYYY年MM月DD日') }}&nbsp;&nbsp;&nbsp;&nbsp;({{
          props.item.groupNum * props.item.singleGroupArrowNum
        }}支/{{ props.item.groupNum }}组)
      </div>
      <div class="text-2xl xs:text-base">{{ props.item.createUser?.realname }}</div>
    </div>
    <div class="mt">
      <div class="flex items-center h-130px">
        <!-- 总分 -->
        <div>
          <div class="text-base">
            {{ dayjs(props.item.createTime).format('HH:mm') }}
          </div>
          <div class="mt ml text-center">
            <div class="text-4xl xs:text-base color-green">{{ item.total }}</div>
            <div class="color-gray text-xs">总分</div>
          </div>
        </div>
        <div class="h-full ml flex-auto flex flex-col justify-around">
          <!-- 类型 -->
          <div class="flex justify-around flex-auto b-b-gray b-b-width-1px b-b-solid">
            <!-- 弓类型 -->
            <div class="flex items-center">
              <i
                :style="{ 'font-size': useSystem().breakpoints == 'xs' ? 16 : 24 }"
                :class="bowTypeIcon"
              ></i>
              <div class="ml text-xl xs:text-base">{{ props.item.bowType }}</div>
            </div>
            <!-- 距离 -->
            <div class="flex items-center">
              <i
                :style="{ 'font-size': useSystem().breakpoints == 'xs' ? 16 : 24 }"
                :class="distanceIcon"
              ></i>
              <div class="ml text-xl xs:text-base">{{ props.item.distance }}米</div>
            </div>
            <!-- 靶纸 -->
            <div class="flex items-center">
              <i
                :class="targetPaperIcon"
                :style="{ 'font-size': useSystem().breakpoints == 'xs' ? 16 : 24 }"
              ></i>
              <div class="ml text-xl xs:text-base">{{ props.item.targetPaper }}</div>
            </div>
          </div>
          <!-- 分析 -->
          <div
            class="flex justify-around items-center flex-auto font-size-2xl xs:text-xs b-b-gray b-b-width-1px b-b-solid"
          >
            <div>
              组均&nbsp;&nbsp;{{
                props.item.groupAverageValue
              }}&nbsp;&nbsp;&nbsp;&nbsp;箭均&nbsp;&nbsp;{{ props.item.arrowAverageValue }}
            </div>
            <div>
              X+10&nbsp;&nbsp;共{{
                item.xNum + item.tenNum
              }}支&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;共{{ item.xNum }}支
            </div>
          </div>
        </div>
      </div>
      <div class="grid gap-4 ml mt" :style="gridTemplateColumns">
        <template v-for="(item, index) in props.item.values" :key="index">
          <!-- 组总分 -->
          <div class="flex items-end">
            <div class="text-lg xs:text-xs color-gray">{{ index + 1 }}:</div>
            <div class="ml font-size-2xl xs:text-base b-b-width-1px b-b-solid b-b-gray">
              {{ groupToalArr[index] }}
            </div>
          </div>
          <!-- 箭分 -->
          <div class="flex items-end" v-for="(i, x) in item.values" :key="x">
            <div class="text-lg xs:text-xs color-gray">{{ x + 1 }}:</div>
            <div class="ml font-size-2xl xs:text-base">{{ i }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useArrowValue2Num } from '@/hooks/useArrowValue2Num'
import { useBowTypeIcon } from '@/hooks/useBowTypeIcon'
import { useDistanceIcon } from '@/hooks/useDistanceIcon'
import { useTargetPaperIcon } from '@/hooks/useTargetPaperIcon'
import { useSystem } from '@/stores/useSystem'
import type { paths } from '@/types/Schema'
import dayjs from 'dayjs'
import { divide, round, add } from 'mathjs'
import { computed } from 'vue'

const props = defineProps<{
  item: paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']
}>()

const gridTemplateColumns = computed(() => {
  return {
    'grid-template-columns': `repeat(${props.item.singleGroupArrowNum + 1}, minmax(0, 1fr))`
  }
})

const groupToalArr = computed(() => {
  const totalArr = []
  for (const item of props.item.values) {
    let total = 0
    for (const i of item.values) {
      total = add(total, useArrowValue2Num(i))
    }
    totalArr.push(total)
  }
  return totalArr
})

const bowTypeIcon = computed(() => {
  return useBowTypeIcon(props.item.bowType)
})

const distanceIcon = computed(() => {
  return useDistanceIcon(props.item.distance)
})

const targetPaperIcon = computed(() => {
  return useTargetPaperIcon(props.item.targetPaper)
})
</script>
<style lang="scss" scoped></style>
