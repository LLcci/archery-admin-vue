import type { paths } from '@/types/Schema'

/**
 * 根据靶纸类型获取靶纸图标名称
 * @param targetPaper 靶纸类型
 * @returns 靶纸图标名称
 */
export const useTargetPaperIcon = (
  targetPaper: paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']['targetPaper']
) => {
  let icon = ''
  switch (targetPaper) {
    case '122全环':
    case '40全环':
    case '60全环':
    case '80全环':
      icon = 'icon icon-quan40_60_80_122'
      break
    case '40三联':
      icon = 'icon icon-sanlian40'
      break
    case '60半环':
    case '80半环':
    case '完美300':
      icon = 'icon icon-ban60_80_300'
      break
    default:
      break
  }
  return icon
}
