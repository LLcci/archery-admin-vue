import type { paths } from '@/types/Schema'

export const useArrowValue2Num = (
  value: paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']['values'][0]['values'][0]
) => {
  let num = 0
  if (value === 'X') {
    num = 10
  } else if (value === 'M') {
    num = 0
  } else {
    num = Number(value)
  }
  return num
}
