import { Box, Ellipse, App, PointerEvent, Point, DragEvent, type IPointData } from 'leafer-ui'
import '@leafer-in/viewport'
import '@leafer-in/view'
import { Animate } from '@leafer-in/animate'
import type { paths } from '@/types/Schema'
import { useSystem } from '@/stores/useSystem'
import { useWindowSize } from '@vueuse/core'

type Arrow = {
  value: paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0]
  ellipse: Ellipse
}

export const useDistribute = (): {
  /**
   * app视图
   */
  appView: Ref<string>
  /**
   * app tree
   */
  appTree: Ref<string>
  /**
   * app宽度
   */
  appWidth: Ref<number>
  /**
   * box宽度
   */
  boxWidth: Ref<number>
  /**
   * 缩放比例
   */
  scale: ComputedRef<number>
  /**
   * 圆环map
   */
  ringMap: Map<
    paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0],
    number
  >
  /**
   * 箭孔列表
   */
  arrowList: Ref<Arrow[]>
  /**
   * 总环值
   */
  total: ComputedRef<number>
  /**
   * X环数量
   */
  xNum: ComputedRef<number>
  /**
   * 10环数量
   */
  tenNum: ComputedRef<number>
  /**
   * X+10环数量
   */
  xTenNum: ComputedRef<number>
  /**
   * app实例
   */
  app: Ref<App>
  /**
   * box实例
   */
  box: Ref<Box>
  /**
   * 箭孔移动事件
   * @param e
   * @returns
   */
  onArrowMove: (e: DragEvent) => void
  /**
   * 点击添加箭孔
   * @param e
   * @returns
   */
  onTap: (e: PointerEvent) => void
  /**
   * 重置样式
   */
  reset: () => void
  /**
   * 清空箭孔
   */
  remove: () => void
  /**
   * 获取文本坐标
   * @param diameter 环值直径
   * @param boxWidth 容器宽度
   * @param boxHeight 容器高度
   * @param fontWidth 字体宽度
   * @param fontHeight 字体高度
   */
  getTextPos: (
    diameter: number,
    boxWidth: number,
    boxHeight: number,
    fontWidth: number,
    fontHeight: number
  ) => { x: number; y: number }
  /**
   * 箭孔聚焦
   * @param arrow 箭孔
   */
  handleFocuse: (arrow: Ellipse) => void
  /**
   * 删除箭孔
   * @param arrow 箭孔
   * @returns
   */
  handleRemove: (arrow: Ellipse) => void
  /**
   * 根据箭孔坐标获取环值
   * @param point 箭孔坐标
   * @param ringMap 圆环map
   * @returns 环值
   */
  getValue: (
    point: Point,
    ringMap: Map<
      paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0],
      number
    >
  ) => paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0]
  /**
   * 小程序端手动接收
   * @param e
   * @returns
   */
  receiveEvent: (e: TouchEvent) => void
  /**
   * 添加箭孔
   * @param point 坐标
   * @returns
   */
  addArrow: (point: IPointData) => void
} => {
  /**
   * app宽度
   */
  const { width } = useWindowSize()
  const appWidth = computed(() => {
    if (width.value > 500) {
      return 500
    } else {
      return width.value - 40
    }
  })

  /**
   * box宽度
   */
  const boxWidth = ref(0)

  /**
   * 缩放比例
   */
  const scale = computed(() => {
    return appWidth.value / boxWidth.value
  })

  const app = ref<App>()

  const box = ref<Box>()

  /**
   * 圆环map
   */
  const ringMap: Map<
    paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0],
    number
  > = new Map<
    paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0],
    number
  >()

  /**
   * 根据箭孔坐标获取环值
   * @param point 箭孔坐标
   * @param ringMap 圆环map
   * @returns 环值
   */
  const getValue = (
    point: Point,
    ringMap: Map<
      paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0],
      number
    >
  ) => {
    const distance =
      point.getDistance(new Point(boxWidth.value / 2, boxWidth.value / 2)) - 1.85 * scale.value
    let value: paths['/admin/archery/scoring/student/save']['post']['requestBody']['content']['application/json']['values'][0][0] =
      'M'
    ringMap.forEach((v, k) => {
      if (distance <= v / 2) {
        value = k
      }
    })
    return value
  }

  /**
   * 箭孔列表
   */
  const arrowList = ref<Arrow[]>([])
  /**
   * 箭孔移动事件
   * @param e
   */
  const onArrowMove = (e: DragEvent) => {
    const thisArrow = arrowList.value.find((item) => item.ellipse.innerId === e.current.innerId)
    const thisArrowPoint = new Point(thisArrow!.ellipse.x, thisArrow!.ellipse.y)
    const value = getValue(thisArrowPoint, ringMap)
    thisArrow!.value = value
  }
  /**
   * 总环值
   */
  const total = computed(() => {
    let num = 0
    arrowList.value.forEach((item) => {
      if (item.value === 'X') {
        num += 10
      } else if (item.value === 'M') {
        num += 0
      } else {
        num += Number(item.value)
      }
    })
    return num
  })
  /**
   * X环数量
   */
  const xNum = computed(() => {
    let num = 0
    arrowList.value.forEach((item) => {
      if (item.value === 'X') {
        num += 1
      }
    })
    return num
  })
  /**
   * 10环数量
   */
  const tenNum = computed(() => {
    let num = 0
    arrowList.value.forEach((item) => {
      if (item.value === '10') {
        num += 1
      }
    })
    return num
  })
  /**
   * X+10环数量
   */
  const xTenNum = computed(() => {
    return xNum.value + tenNum.value
  })

  /**
   * 点击添加箭孔
   * @param e
   * @returns
   */
  const onTap = (e: PointerEvent) => {
    if (!box.value) {
      return
    }
    const arrowPoint = box.value.getBoxPoint(e)
    addArrow(arrowPoint)
  }

  const addArrow = (point: IPointData) => {
    const arrow = new Ellipse({
      width: 3.7,
      height: 3.7,
      around: 'center',
      fill: '#C4D700',
      x: point.x,
      y: point.y,
      scale: scale.value,
      draggable: true
    })
    const mathPoint = new Point(point.x, point.y)
    const value = getValue(mathPoint, ringMap)
    const arrowItem: Arrow = {
      value,
      ellipse: arrow
    }
    arrowList.value.push(arrowItem)
    arrow.on(DragEvent.END, onArrowMove)
    box.value?.add(arrow)
  }

  /**
   * 重置样式
   */
  const reset = () => {
    app.value?.tree.zoom('fit', 0)
  }

  /**
   * 清空箭孔
   */
  const remove = async () => {
    arrowList.value.forEach((item) => {
      box.value?.remove(item.ellipse)
    })
    arrowList.value = []
  }

  /**
   * 获取文本坐标
   * @param diameter 环值直径
   * @param boxWidth 容器宽度
   * @param boxHeight 容器高度
   * @param fontWidth 字体宽度
   * @param fontHeight 字体高度
   */
  const getTextPos = (
    diameter: number,
    boxWidth: number,
    boxHeight: number,
    fontWidth: number,
    fontHeight: number
  ) => {
    const x = (boxWidth - diameter) / 2 + diameter - fontWidth
    const y = boxHeight / 2 - fontHeight
    return { x, y }
  }

  /**
   * 箭孔聚焦
   * @param arrow 箭孔
   */
  const handleFocuse = (arrow: Ellipse) => {
    app.value?.tree.zoom(arrow, 150)
    const animate = new Animate(
      arrow,
      [
        { style: { scale: scale.value * 1.5 }, duration: 0.5 },
        { style: { scale: scale.value }, duration: 0.5 }
      ],
      {
        duration: 2,
        loop: 2,
        join: true
      }
    )
  }

  /**
   * 删除箭孔
   * @param arrow 箭孔
   */
  const handleRemove = (arrow: Ellipse) => {
    box.value?.remove(arrow.innerId)
    arrowList.value = arrowList.value.filter((item) => item.ellipse.innerId !== arrow.innerId)
  }

  const appView = ref<string>('container')

  const appTree = ref<string>('tree')

  const receiveEvent = (event: TouchEvent) => {
    app.value?.receiveEvent(event)
  }

  onMounted(() => {
    app.value = new App({
      width: appWidth.value,
      height: appWidth.value,
      view: appView.value,
      mobile: true,
      touch: { preventDefault: true },
      tree: { type: 'viewport' },
      fill: '#606060'
    })

    box.value = new Box({
      width: boxWidth.value,
      height: boxWidth.value,
      fill: '#606060',
      scale: scale.value,
      draggable: true
    })

    app.value.tree.add(box.value)
  })

  return {
    appView,
    appTree,
    appWidth,
    boxWidth,
    scale,
    ringMap,
    arrowList: arrowList as Ref<Arrow[]>,
    total,
    xNum,
    tenNum,
    xTenNum,
    app: app as Ref<App>,
    box: box as Ref<Box>,
    onArrowMove,
    onTap,
    reset,
    remove,
    getTextPos,
    handleFocuse,
    handleRemove,
    getValue,
    receiveEvent,
    addArrow
  }
}
