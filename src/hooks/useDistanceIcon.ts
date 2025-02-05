import type { paths } from '@/types/Schema'

/**
 * 根据射箭距离获取图标名称
 * @param distance 射箭距离
 * @returns 图标名称
 */
export const useDistanceIcon = (
  distance: paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']['distance']
) => {
  let icon = ''
  switch (distance) {
    case '8':
      icon = 'icon icon-m8'
      break
    case '10':
      icon = 'icon icon-m10'
      break
    case '18':
      icon = 'icon icon-m18'
      break
    case '25':
      icon = 'icon icon-m18'
      break
    case '30':
      icon = 'icon icon-m30'
      break
    case '50':
      icon = 'icon icon-m50'
      break
    case '70':
      icon = 'icon icon-m70'
      break
    case '90':
      icon = 'icon icon-m90'
      break
    default:
      break
  }
  return icon
}
