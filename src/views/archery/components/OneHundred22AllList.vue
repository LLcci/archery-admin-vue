<template>
  <div class="flex items-center justify-center w-full overflow-hidden">
    <div :style="{ width: appWidth + 'px', height: appWidth + 'px' }" id="container"></div>
  </div>
  <div class="mt">
    <el-button class="w-full" type="primary" round @click="reset">重置样式</el-button>
  </div>
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
  <div class="mt flex items-center justify-around">
    <div class="text-green text-xl font-black">{{ total }}</div>
    <div>X + 10 共 {{ xTenNum }} 支</div>
    <div>X 共 {{ xNum }} 支</div>
  </div>
  <el-divider />
  <div>
    <div
      v-for="item in arrowList"
      :key="item.ellipse.id"
      class="flex items-center justify-around border-b border-b-gray border-b-solid mt pb"
    >
      <div class="text-lg ml underline decoration-green underline-offset-4">
        {{ item.value }}
      </div>
      <el-button class="mr" type="primary" @click="handleFocuse(item.ellipse as Ellipse)"
        >聚焦</el-button
      >
    </div>
  </div>
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

const handleChange = (currentPage: number) => {
  currentValue.value = currentPage
  remove()
  for (const item of currentHoles.value) {
    if (item.length === 2 && item[0] && item[1]) {
      addArrow({ x: item[0], y: item[1] })
    }
  }
}

const {
  appWidth,
  boxWidth,
  ringMap,
  arrowList,
  total,
  xNum,
  xTenNum,
  box,
  reset,
  remove,
  getTextPos,
  handleFocuse,
  addArrow
} = useDistribute()

boxWidth.value = 1240

ringMap.set('1', 1220)
ringMap.set('2', 1098)
ringMap.set('3', 976)
ringMap.set('4', 854)
ringMap.set('5', 732)
ringMap.set('6', 610)
ringMap.set('7', 488)
ringMap.set('8', 366)
ringMap.set('9', 244)
ringMap.set('10', 122)
ringMap.set('X', 61)

onMounted(async () => {
  const one = new Ellipse({
    width: ringMap.get('1'),
    height: ringMap.get('1'),
    fill: '#7A7A7A',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const oneTextPos = getTextPos(ringMap.get('1')!, boxWidth.value, boxWidth.value, 40, 40)
  const oneText = new Text({
    text: '1',
    fontSize: 40,
    ...oneTextPos,
    fill: '#323333'
  })
  box.value.add(one)
  box.value.add(oneText)

  const two = new Ellipse({
    width: ringMap.get('2'),
    height: ringMap.get('2'),
    fill: '#7A7A7A',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const twoTextPos = getTextPos(ringMap.get('2')!, boxWidth.value, boxWidth.value, 40, 40)
  const twoText = new Text({
    text: '2',
    fontSize: 40,
    ...twoTextPos,
    fill: '#323333'
  })
  box.value.add(two)
  box.value.add(twoText)

  const three = new Ellipse({
    width: ringMap.get('3'),
    height: ringMap.get('3'),
    fill: '#424142',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const threeTextPos = getTextPos(ringMap.get('3')!, boxWidth.value, boxWidth.value, 40, 40)
  const threeText = new Text({
    text: '3',
    fontSize: 40,
    fill: '#7A7A7A',
    ...threeTextPos
  })
  box.value.add(three)
  box.value.add(threeText)

  const four = new Ellipse({
    width: ringMap.get('4'),
    height: ringMap.get('4'),
    fill: '#424142',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const fourTextPos = getTextPos(ringMap.get('4')!, boxWidth.value, boxWidth.value, 40, 40)
  const fourText = new Text({
    text: '4',
    fontSize: 40,
    fill: '#7A7A7A',
    ...fourTextPos
  })
  box.value.add(four)
  box.value.add(fourText)

  const five = new Ellipse({
    width: ringMap.get('5'),
    height: ringMap.get('5'),
    fill: '#26617B',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const fiveTextPos = getTextPos(ringMap.get('5')!, boxWidth.value, boxWidth.value, 40, 40)
  const fiveText = new Text({
    text: '5',
    fontSize: 40,
    fill: '#323333',
    ...fiveTextPos
  })
  box.value.add(five)
  box.value.add(fiveText)

  const six = new Ellipse({
    width: ringMap.get('6'),
    height: ringMap.get('6'),
    fill: '#26617B',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const sixTextPos = getTextPos(ringMap.get('6')!, boxWidth.value, boxWidth.value, 40, 40)
  const sixText = new Text({
    text: '6',
    fontSize: 40,
    fill: '#323333',
    ...sixTextPos
  })
  box.value.add(six)
  box.value.add(sixText)

  const seven = new Ellipse({
    width: ringMap.get('7'),
    height: ringMap.get('7'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const sevenTextPos = getTextPos(ringMap.get('7')!, boxWidth.value, boxWidth.value, 40, 40)
  const sevenText = new Text({
    text: '7',
    fontSize: 40,
    fill: '#323333',
    ...sevenTextPos
  })
  box.value.add(seven)
  box.value.add(sevenText)

  const eight = new Ellipse({
    width: ringMap.get('8'),
    height: ringMap.get('8'),
    fill: '#7C3432',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const eightTextPos = getTextPos(ringMap.get('8')!, boxWidth.value, boxWidth.value, 40, 40)
  const eightText = new Text({
    text: '8',
    fontSize: 40,
    fill: '#323333',
    ...eightTextPos
  })
  box.value.add(eight)
  box.value.add(eightText)

  const nine = new Ellipse({
    width: ringMap.get('9'),
    height: ringMap.get('9'),
    fill: '#88862B',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const nineTextPos = getTextPos(ringMap.get('9')!, boxWidth.value, boxWidth.value, 40, 40)
  const nineText = new Text({
    text: '9',
    fontSize: 40,
    fill: '#323333',
    ...nineTextPos
  })
  box.value.add(nine)
  box.value.add(nineText)

  const ten = new Ellipse({
    width: ringMap.get('10'),
    height: ringMap.get('10'),
    fill: '#88862B',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const tenTextPos = getTextPos(ringMap.get('10')!, boxWidth.value, boxWidth.value, 27, 20)
  const tenText = new Text({
    text: '10',
    fontSize: 20,
    fill: '#323333',
    ...tenTextPos
  })
  box.value.add(ten)
  box.value.add(tenText)

  const x = new Ellipse({
    width: ringMap.get('X'),
    height: ringMap.get('X'),
    fill: '#88862B',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2,
    stroke: '#323333'
  })
  const xText = new Text({
    text: '+',
    fontSize: 40,
    fill: '#323333',
    around: 'center',
    x: boxWidth.value / 2,
    y: boxWidth.value / 2
  })
  box.value.add(x)
  box.value.add(xText)

  await execute()
  if (error.value) return
  for (const item of currentHoles.value) {
    if (item.length === 2 && item[0] && item[1]) {
      addArrow({ x: item[0], y: item[1] })
    }
  }
})
</script>

<style scoped></style>
