import type { paths } from '@/types/Schema'

/**
 * 根据弓类型获取图标名称
 * @param type 弓类型
 * @returns 图标名称
 */
export const useBowTypeIcon = (
  type: paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']['bowType']
) => {
  let icon = ''
  switch (type) {
    case '传统弓':
      icon = 'icon icon-chuantong'
      break
    case '复合弓':
      icon = 'icon icon-fuhe'
      break
    case '光弓':
      icon = 'icon icon-guanggong'
      break
    case '反曲弓':
      icon = 'icon icon-fanqu'
      break
    default:
      break
  }
  return icon
}
