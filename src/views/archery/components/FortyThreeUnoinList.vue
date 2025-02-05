<template>
  <view class="mt mb">
    <el-tabs v-model="current">
      <el-tab-pane
        v-for="(item, index) in list"
        :key="index"
        :label="item"
        :name="item"
      ></el-tab-pane>
    </el-tabs>
  </view>
  <view v-show="current === '上'">
    <view class="flex items-center justify-center w-full overflow-hidden">
      <view
        :style="{ width: appWidthTop + 'px', height: appWidthTop + 'px' }"
        id="containerTop"
      ></view>
    </view>
    <el-button class="w-full mt" type="primary" round @click="resetTop">重置样式</el-button>
    <div class="mt flex items-center justify-center">
      <el-pagination
        v-model:current-page="currentValue"
        layout="prev, pager, next"
        :page-size="1"
        :total="holesList.length"
        @change="handleChange"
      />
    </div>
    <el-divider />
    <view class="mt flex items-center justify-around">
      <view class="text-green text-xl font-black">{{ totalTop }}</view>
      <view>X + 10 共 {{ xTenNumTop }} 支</view>
      <view>X 共 {{ xNumTop }} 支</view>
    </view>
    <el-divider />
    <div>
      <div
        v-for="item in arrowListTop"
        :key="item.ellipse.id"
        class="flex items-center justify-around border-b border-b-gray border-b-solid mt pb"
      >
        <div class="text-lg ml underline decoration-green underline-offset-4">
          {{ item.value }}
        </div>
        <el-button class="mr" type="primary" @click="handleFocuseTop(item.ellipse as Ellipse)"
          >聚焦</el-button
        >
      </div>
    </div>
  </view>
  <view v-show="current === '中'">
    <view class="flex items-center justify-center w-full overflow-hidden">
      <view
        :style="{ width: appWidthMiddle + 'px', height: appWidthMiddle + 'px' }"
        id="containerMiddle"
      ></view>
    </view>
    <el-button class="w-full mt" type="primary" round @click="resetMiddle">重置样式</el-button>
    <div class="mt flex items-center justify-center">
      <el-pagination
        v-model:current-page="currentValue"
        layout="prev, pager, next"
        :page-size="1"
        :total="holesList.length"
        @change="handleChange"
      />
    </div>
    <el-divider />
    <view class="mt flex items-center justify-around">
      <view class="text-green text-xl font-black">{{ totalMiddle }}</view>
      <view>X + 10 共 {{ xTenNumMiddle }} 支</view>
      <view>X 共 {{ xNumMiddle }} 支</view>
    </view>
    <el-divider />
    <div>
      <div
        v-for="item in arrowListMiddle"
        :key="item.ellipse.id"
        class="flex items-center justify-around border-b border-b-gray border-b-solid mt pb"
      >
        <div class="text-lg ml underline decoration-green underline-offset-4">
          {{ item.value }}
        </div>
        <el-button class="mr" type="primary" @click="handleFocuseMiddle(item.ellipse as Ellipse)"
          >聚焦</el-button
        >
      </div>
    </div>
  </view>
  <view v-show="current === '下'">
    <view class="flex items-center justify-center w-full overflow-hidden">
      <view
        :style="{ width: appWidthBottom + 'px', height: appWidthBottom + 'px' }"
        id="containerBottom"
      ></view>
    </view>
    <el-button class="w-full mt" type="primary" round @click="resetBottom">重置样式</el-button>
    <div class="mt flex items-center justify-center">
      <el-pagination
        v-model:current-page="currentValue"
        layout="prev, pager, next"
        :page-size="1"
        :total="holesList.length"
        @change="handleChange"
      />
    </div>
    <el-divider />
    <view class="mt flex items-center justify-around">
      <view class="text-green text-xl font-black">{{ totalBottom }}</view>
      <view>X + 10 共 {{ xTenNumBottom }} 支</view>
      <view>X 共 {{ xNumBottom }} 支</view>
    </view>
    <el-divider />
    <div>
      <div
        v-for="item in arrowListBottom"
        :key="item.ellipse.id"
        class="flex items-center justify-around border-b border-b-gray border-b-solid mt pb"
      >
        <div class="text-lg ml underline decoration-green underline-offset-4">
          {{ item.value }}
        </div>
        <el-button class="mr" type="primary" @click="handleFocuseBottom(item.ellipse as Ellipse)"
          >聚焦</el-button
        >
      </div>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { Ellipse, Text } from 'leafer-ui'
import '@leafer-in/viewport'
import '@leafer-in/view'
import { useDistribute } from '../hooks/useDistribute'
import type { paths } from '@/types/Schema'
import { useFetch } from '@/hooks/useFetch'

const props = defineProps<{
  id: string
}>()

const currentValue = ref<number>(1)

let round: number

const { data, execute, error } = useFetch<
  paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']
>(`/admin/archery/scoring/id?id=${props.id}`, {
  immediate: false,
  initialData: {
    status: '0',
    bowType: '反曲弓',
    distance: '8',
    targetPaper: '40三联',
    groupNum: 0,
    singleGroupArrowNum: 0,
    total: 0,
    groupAverageValue: 0,
    arrowAverageValue: 0,
    xNum: 0,
    tenNum: 0,
    nineNum: 0,
    eightNum: 0,
    sevenNum: 0,
    sixNum: 0,
    fiveNum: 0,
    fourNum: 0,
    threeNum: 0,
    twoNum: 0,
    oneNum: 0,
    mNum: 0,
    values: []
  }
}).get()

const holesList = computed<[number, number][][]>(() => {
  if (!data.value) return []
  return data.value?.values.map((item) => {
    if (!item.holes) return []
    return JSON.parse(item.holes as string)
  })
})

const currentHoles = computed(() => {
  if (!holesList.value[currentValue.value - 1]) return []
  return holesList.value[currentValue.value - 1]
})

const currentGroupHoles = computed(() => {
  if (round === 0) return []
  const result = []
  for (let i = 0; i < currentHoles.value.length; i += round) {
    result.push(currentHoles.value.slice(i, i + round))
  }
  return result
})

const handleChange = (currentPage: number) => {
  currentValue.value = currentPage
  removeTop()
  removeMiddle()
  removeBottom()
  if (currentGroupHoles.value[0]) {
    for (const item of currentGroupHoles.value[0]) {
      if (item.length === 2 && item[0] && item[1]) {
        addArrowTop({ x: item[0], y: item[1] })
      }
    }
  }
  if (currentGroupHoles.value[1]) {
    for (const item of currentGroupHoles.value[1]) {
      if (item.length === 2 && item[0] && item[1]) {
        addArrowMiddle({ x: item[0], y: item[1] })
      }
    }
  }
  if (currentGroupHoles.value[2]) {
    for (const item of currentGroupHoles.value[2]) {
      if (item.length === 2 && item[0] && item[1]) {
        addArrowBottom({ x: item[0], y: item[1] })
      }
    }
  }
}

const list = ref<string[]>(['上', '中', '下'])

const current = ref('上')

// 上靶纸
const {
  appView: appViewTop,
  appTree: appTreeTop,
  appWidth: appWidthTop,
  boxWidth: boxWidthTop,
  ringMap: ringMapTop,
  arrowList: arrowListTop,
  total: totalTop,
  xNum: xNumTop,
  xTenNum: xTenNumTop,
  box: boxTop,
  reset: resetTop,
  remove: removeTop,
  getTextPos: getTextPosTop,
  handleFocuse: handleFocuseTop,
  handleRemove: handleRemoveTop,
  receiveEvent: receiveEventTop,
  addArrow: addArrowTop
} = useDistribute()

appViewTop.value = 'containerTop'
appTreeTop.value = 'treeTop'

boxWidthTop.value = 220

ringMapTop.set('6', 200)
ringMapTop.set('7', 160)
ringMapTop.set('8', 120)
ringMapTop.set('9', 80)
ringMapTop.set('10', 40)
ringMapTop.set('X', 20)

onMounted(() => {
  const six = new Ellipse({
    width: ringMapTop.get('6'),
    height: ringMapTop.get('6'),
    fill: '#26617B',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2,
    stroke: '#323333'
  })
  const sixTextPos = getTextPosTop(
    ringMapTop.get('6')!,
    boxWidthTop.value,
    boxWidthTop.value,
    10,
    10
  )
  const sixText = new Text({
    text: '6',
    fontSize: 10,
    fill: '#323333',
    ...sixTextPos
  })
  boxTop.value.add(six)
  boxTop.value.add(sixText)

  const seven = new Ellipse({
    width: ringMapTop.get('7'),
    height: ringMapTop.get('7'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2,
    stroke: '#323333'
  })
  const sevenTextPos = getTextPosTop(
    ringMapTop.get('7')!,
    boxWidthTop.value,
    boxWidthTop.value,
    10,
    10
  )
  const sevenText = new Text({
    text: '7',
    fontSize: 10,
    fill: '#323333',
    ...sevenTextPos
  })
  boxTop.value.add(seven)
  boxTop.value.add(sevenText)

  const eight = new Ellipse({
    width: ringMapTop.get('8'),
    height: ringMapTop.get('8'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2,
    stroke: '#323333'
  })
  const eightTextPos = getTextPosTop(
    ringMapTop.get('8')!,
    boxWidthTop.value,
    boxWidthTop.value,
    10,
    10
  )
  const eightText = new Text({
    text: '8',
    fontSize: 10,
    fill: '#323333',
    ...eightTextPos
  })
  boxTop.value.add(eight)
  boxTop.value.add(eightText)

  const nine = new Ellipse({
    width: ringMapTop.get('9'),
    height: ringMapTop.get('9'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2,
    stroke: '#323333'
  })
  const nineTextPos = getTextPosTop(
    ringMapTop.get('9')!,
    boxWidthTop.value,
    boxWidthTop.value,
    10,
    10
  )
  const nineText = new Text({
    text: '9',
    fontSize: 10,
    fill: '#323333',
    ...nineTextPos
  })
  boxTop.value.add(nine)
  boxTop.value.add(nineText)

  const ten = new Ellipse({
    width: ringMapTop.get('10'),
    height: ringMapTop.get('10'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2,
    stroke: '#323333'
  })
  const tenTextPos = getTextPosTop(
    ringMapTop.get('10')!,
    boxWidthTop.value,
    boxWidthTop.value,
    10,
    5
  )
  const tenText = new Text({
    text: '10',
    fontSize: 5,
    fill: '#323333',
    ...tenTextPos
  })
  boxTop.value.add(ten)
  boxTop.value.add(tenText)

  const x = new Ellipse({
    width: ringMapTop.get('X'),
    height: ringMapTop.get('X'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2,
    stroke: '#323333'
  })
  const xText = new Text({
    text: '+',
    fontSize: 20,
    fill: '#323333',
    around: 'center',
    x: boxWidthTop.value / 2,
    y: boxWidthTop.value / 2
  })
  boxTop.value.add(x)
  boxTop.value.add(xText)
})

// 中靶纸
const {
  appView: appViewMiddle,
  appTree: appTreeMiddle,
  appWidth: appWidthMiddle,
  boxWidth: boxWidthMiddle,
  ringMap: ringMapMiddle,
  arrowList: arrowListMiddle,
  total: totalMiddle,
  xNum: xNumMiddle,
  xTenNum: xTenNumMiddle,
  box: boxMiddle,
  reset: resetMiddle,
  remove: removeMiddle,
  getTextPos: getTextPosMiddle,
  handleFocuse: handleFocuseMiddle,
  handleRemove: handleRemoveMiddle,
  receiveEvent: receiveEventMiddle,
  addArrow: addArrowMiddle
} = useDistribute()

appViewMiddle.value = 'containerMiddle'
appTreeMiddle.value = 'treeMiddle'

boxWidthMiddle.value = 220

ringMapMiddle.set('6', 200)
ringMapMiddle.set('7', 160)
ringMapMiddle.set('8', 120)
ringMapMiddle.set('9', 80)
ringMapMiddle.set('10', 40)
ringMapMiddle.set('X', 20)

onMounted(() => {
  const six = new Ellipse({
    width: ringMapMiddle.get('6'),
    height: ringMapMiddle.get('6'),
    fill: '#26617B',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2,
    stroke: '#323333'
  })
  const sixTextPos = getTextPosMiddle(
    ringMapMiddle.get('6')!,
    boxWidthMiddle.value,
    boxWidthMiddle.value,
    10,
    10
  )
  const sixText = new Text({
    text: '6',
    fontSize: 10,
    fill: '#323333',
    ...sixTextPos
  })
  boxMiddle.value.add(six)
  boxMiddle.value.add(sixText)

  const seven = new Ellipse({
    width: ringMapMiddle.get('7'),
    height: ringMapMiddle.get('7'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2,
    stroke: '#323333'
  })
  const sevenTextPos = getTextPosMiddle(
    ringMapMiddle.get('7')!,
    boxWidthMiddle.value,
    boxWidthMiddle.value,
    10,
    10
  )
  const sevenText = new Text({
    text: '7',
    fontSize: 10,
    fill: '#323333',
    ...sevenTextPos
  })
  boxMiddle.value.add(seven)
  boxMiddle.value.add(sevenText)

  const eight = new Ellipse({
    width: ringMapMiddle.get('8'),
    height: ringMapMiddle.get('8'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2,
    stroke: '#323333'
  })
  const eightTextPos = getTextPosMiddle(
    ringMapMiddle.get('8')!,
    boxWidthMiddle.value,
    boxWidthMiddle.value,
    10,
    10
  )
  const eightText = new Text({
    text: '8',
    fontSize: 10,
    fill: '#323333',
    ...eightTextPos
  })
  boxMiddle.value.add(eight)
  boxMiddle.value.add(eightText)

  const nine = new Ellipse({
    width: ringMapMiddle.get('9'),
    height: ringMapMiddle.get('9'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2,
    stroke: '#323333'
  })
  const nineTextPos = getTextPosMiddle(
    ringMapMiddle.get('9')!,
    boxWidthMiddle.value,
    boxWidthMiddle.value,
    10,
    10
  )
  const nineText = new Text({
    text: '9',
    fontSize: 10,
    fill: '#323333',
    ...nineTextPos
  })
  boxMiddle.value.add(nine)
  boxMiddle.value.add(nineText)

  const ten = new Ellipse({
    width: ringMapMiddle.get('10'),
    height: ringMapMiddle.get('10'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2,
    stroke: '#323333'
  })
  const tenTextPos = getTextPosMiddle(
    ringMapMiddle.get('10')!,
    boxWidthMiddle.value,
    boxWidthMiddle.value,
    10,
    5
  )
  const tenText = new Text({
    text: '10',
    fontSize: 5,
    fill: '#323333',
    ...tenTextPos
  })
  boxMiddle.value.add(ten)
  boxMiddle.value.add(tenText)

  const x = new Ellipse({
    width: ringMapMiddle.get('X'),
    height: ringMapMiddle.get('X'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2,
    stroke: '#323333'
  })
  const xText = new Text({
    text: '+',
    fontSize: 20,
    fill: '#323333',
    around: 'center',
    x: boxWidthMiddle.value / 2,
    y: boxWidthMiddle.value / 2
  })
  boxMiddle.value.add(x)
  boxMiddle.value.add(xText)
})

// 下靶纸
const {
  appView: appViewBottom,
  appTree: appTreeBottom,
  appWidth: appWidthBottom,
  boxWidth: boxWidthBottom,
  ringMap: ringMapBottom,
  arrowList: arrowListBottom,
  total: totalBottom,
  xNum: xNumBottom,
  xTenNum: xTenNumBottom,
  box: boxBottom,
  reset: resetBottom,
  remove: removeBottom,
  getTextPos: getTextPosBottom,
  handleFocuse: handleFocuseBottom,
  handleRemove: handleRemoveBottom,
  receiveEvent: receiveEventBottom,
  addArrow: addArrowBottom
} = useDistribute()

appViewBottom.value = 'containerBottom'
appTreeBottom.value = 'treeBottom'

boxWidthBottom.value = 220

ringMapBottom.set('6', 200)
ringMapBottom.set('7', 160)
ringMapBottom.set('8', 120)
ringMapBottom.set('9', 80)
ringMapBottom.set('10', 40)
ringMapBottom.set('X', 20)

onMounted(() => {
  const six = new Ellipse({
    width: ringMapBottom.get('6'),
    height: ringMapBottom.get('6'),
    fill: '#26617B',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2,
    stroke: '#323333'
  })
  const sixTextPos = getTextPosBottom(
    ringMapBottom.get('6')!,
    boxWidthBottom.value,
    boxWidthBottom.value,
    10,
    10
  )
  const sixText = new Text({
    text: '6',
    fontSize: 10,
    fill: '#323333',
    ...sixTextPos
  })
  boxBottom.value.add(six)
  boxBottom.value.add(sixText)

  const seven = new Ellipse({
    width: ringMapBottom.get('7'),
    height: ringMapBottom.get('7'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2,
    stroke: '#323333'
  })
  const sevenTextPos = getTextPosBottom(
    ringMapBottom.get('7')!,
    boxWidthBottom.value,
    boxWidthBottom.value,
    10,
    10
  )
  const sevenText = new Text({
    text: '7',
    fontSize: 10,
    fill: '#323333',
    ...sevenTextPos
  })
  boxBottom.value.add(seven)
  boxBottom.value.add(sevenText)

  const eight = new Ellipse({
    width: ringMapBottom.get('8'),
    height: ringMapBottom.get('8'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2,
    stroke: '#323333'
  })
  const eightTextPos = getTextPosBottom(
    ringMapBottom.get('8')!,
    boxWidthBottom.value,
    boxWidthBottom.value,
    10,
    10
  )
  const eightText = new Text({
    text: '8',
    fontSize: 10,
    fill: '#323333',
    ...eightTextPos
  })
  boxBottom.value.add(eight)
  boxBottom.value.add(eightText)

  const nine = new Ellipse({
    width: ringMapBottom.get('9'),
    height: ringMapBottom.get('9'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2,
    stroke: '#323333'
  })
  const nineTextPos = getTextPosBottom(
    ringMapBottom.get('9')!,
    boxWidthBottom.value,
    boxWidthBottom.value,
    10,
    10
  )
  const nineText = new Text({
    text: '9',
    fontSize: 10,
    fill: '#323333',
    ...nineTextPos
  })
  boxBottom.value.add(nine)
  boxBottom.value.add(nineText)

  const ten = new Ellipse({
    width: ringMapBottom.get('10'),
    height: ringMapBottom.get('10'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2,
    stroke: '#323333'
  })
  const tenTextPos = getTextPosBottom(
    ringMapBottom.get('10')!,
    boxWidthBottom.value,
    boxWidthBottom.value,
    10,
    5
  )
  const tenText = new Text({
    text: '10',
    fontSize: 5,
    fill: '#323333',
    ...tenTextPos
  })
  boxBottom.value.add(ten)
  boxBottom.value.add(tenText)

  const x = new Ellipse({
    width: ringMapBottom.get('X'),
    height: ringMapBottom.get('X'),
    fill: '#88862B',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2,
    stroke: '#323333'
  })
  const xText = new Text({
    text: '+',
    fontSize: 20,
    fill: '#323333',
    around: 'center',
    x: boxWidthBottom.value / 2,
    y: boxWidthBottom.value / 2
  })
  boxBottom.value.add(x)
  boxBottom.value.add(xText)
})

onMounted(async () => {
  await execute()
  if (error.value) return
  round = Math.round(data.value!.singleGroupArrowNum / 3)
  if (currentGroupHoles.value[0]) {
    for (const item of currentGroupHoles.value[0]) {
      if (item.length === 2 && item[0] && item[1]) {
        addArrowTop({ x: item[0], y: item[1] })
      }
    }
  }
  if (currentGroupHoles.value[1]) {
    for (const item of currentGroupHoles.value[1]) {
      if (item.length === 2 && item[0] && item[1]) {
        addArrowMiddle({ x: item[0], y: item[1] })
      }
    }
  }
  if (currentGroupHoles.value[2]) {
    for (const item of currentGroupHoles.value[2]) {
      if (item.length === 2 && item[0] && item[1]) {
        addArrowBottom({ x: item[0], y: item[1] })
      }
    }
  }
})
</script>

<style scoped></style>
