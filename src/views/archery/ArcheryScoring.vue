<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    ref="tableFormRef"
    :table-form="tableForm"
    :api="api"
    @on-table-id-success="onTableIdSuccess"
    @on-create="onCreate"
  ></schemaTableForm>
</template>

<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type {
  Api,
  SchemaTableForm,
  SchemaTableFormInstance
} from '@/components/schemaTableForm/types'
import { useDictSchema } from '@/hooks/useDict'
import { useFetch } from '@/hooks/useFetch'
import type { paths } from '@/types/Schema'
import { ElDatePicker, ElInputNumber, ElSelectV2, dayjs } from 'element-plus'
import { h, ref, shallowRef } from 'vue'
import ValuesInput from './components/ValuesInput.vue'

const tableFormRef = ref<SchemaTableFormInstance>()

const ValuesInputRef = shallowRef(ValuesInput)

const api = ref<Api>({
  list: '',
  page: '/admin/archery/scoring/page',
  id: '/admin/archery/scoring/id',
  create: '/admin/archery/scoring/save',
  update: '/admin/archery/scoring/save',
  import: '',
  delete: '/admin/archery/scoring/delete'
})

const searchFormModel = ref<
  paths['/admin/archery/scoring/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/archery/scoring/save']['post']['requestBody']['content']['application/json']
>({
  bowType: '反曲弓',
  distance: '8',
  targetPaper: '40三联',
  groupNum: 1,
  singleGroupArrowNum: 1,
  values: [[]]
})

const shortcuts = [
  {
    text: '当天',
    value: () => {
      const start = dayjs().startOf('D').toDate()
      const end = dayjs().endOf('D').toDate()
      return [start, end]
    }
  },
  {
    text: '近一周',
    value: () => {
      const start = dayjs().startOf('D').subtract(1, 'week').toDate()
      const end = dayjs().endOf('D').toDate()
      return [start, end]
    }
  },
  {
    text: '近一个月',
    value: () => {
      const start = dayjs().startOf('D').subtract(1, 'month').toDate()
      const end = dayjs().endOf('D').toDate()
      return [start, end]
    }
  }
]

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json'] & {
      studentId: string
      totalGroup: string
      total: number
      xTen: number
      xNum: number
      scoringDate: string[]
    }
  >
>({
  studentId: {
    table: {
      label: '学员',
      formatter(row) {
        return row.createUser.realname
      }
    },
    searchForm: {
      props: {
        label: '学员'
      }
    }
  },
  bowType: {},
  distance: {},
  targetPaper: {},
  totalGroup: {
    table: {
      label: '组数/箭数',
      formatter(row) {
        return `${row.groupNum}组/每组${row.singleGroupArrowNum}支/共${Number(row.groupNum) * Number(row.singleGroupArrowNum)}支箭`
      }
    }
  },
  groupNum: {
    editForm: {
      props: {
        label: '组数',
        rules: [{ required: true, message: '请输入组数' }]
      },
      component: h(ElInputNumber, {
        step: 1,
        stepStrictly: true,
        min: 1,
        onChange(value) {
          tableForm.value.values!.editForm!.comProps!.groupNum = value
        }
      })
    }
  },
  singleGroupArrowNum: {
    editForm: {
      props: {
        label: '每组箭数',
        rules: [{ required: true, message: '请输入每组箭数' }]
      },
      component: h(ElInputNumber, {
        step: 1,
        stepStrictly: true,
        min: 1,
        onChange(value) {
          tableForm.value.values!.editForm!.comProps!.singleGroupArrowNum = value
        }
      })
    }
  },
  total: {
    table: {
      label: '总得分'
    }
  },
  xTen: {
    table: {
      label: 'X + 10',
      formatter(row) {
        return (row.xNum + row.tenNum).toString()
      }
    }
  },
  xNum: {
    table: {
      label: 'X'
    }
  },
  tenNum: {
    table: {
      label: '10'
    }
  },
  groupAverageValue: {
    table: {
      label: '组均'
    }
  },
  arrowAverageValue: {
    table: {
      label: '箭均'
    }
  },
  scoringDate: {
    searchForm: {
      props: {
        label: '训练时间'
      },
      component: h(ElDatePicker, {
        type: 'datetimerange',
        defaultTime: [dayjs().startOf('D').toDate(), dayjs().endOf('D').toDate()],
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        shortcuts
      })
    }
  },
  createTime: {
    table: {
      label: '训练时间',
      width: '180px',
      formatter(row, column, cellValue) {
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  values: {
    editForm: {
      props: {
        label: '环值',
        rules: [
          {
            required: true,
            validator(rule, value, callback) {
              if (value.length != editFormModel.value.groupNum) {
                callback('请输入环值')
              }
              for (const group of value) {
                if (group.length != editFormModel.value.singleGroupArrowNum) {
                  callback('请输入环值')
                }
                for (const item of group) {
                  if (
                    !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'X', 'M'].includes(
                      item
                    )
                  ) {
                    callback('环值记录不正确')
                  }
                }
              }
              callback()
            }
          }
        ]
      },
      component: ValuesInputRef,
      comProps: {
        groupNum: editFormModel.value.groupNum,
        singleGroupArrowNum: editFormModel.value.singleGroupArrowNum
      }
    }
  }
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
})

useDictSchema('bowType', { filterable: true }, { filterable: true }).then((res) => {
  tableForm.value.bowType = res
})

useDictSchema('distance', { filterable: true }, { filterable: true }).then((res) => {
  tableForm.value.distance = res
})

useDictSchema('targetPaper', { filterable: true }, { filterable: true }).then((res) => {
  tableForm.value.targetPaper = res
})

const { data: userList, onFetchResponse } =
  useFetch<
    paths['/admin/sys/user/list']['post']['responses']['200']['content']['application/json']
  >('/admin/sys/user/list').post()

onFetchResponse(() => {
  let options: { value: string; label: string }[] = []
  if (userList.value) {
    options = userList.value.map((item) => {
      return {
        value: item.id as string,
        label: item.realname as string
      }
    })
  }
  const component = h(ElSelectV2, {
    placeholder: '请选择学员',
    options,
    filterable: true
  })

  tableForm.value.studentId!.searchForm!.component = component
})

const onTableIdSuccess = (
  value: paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']
) => {
  editFormModel.value.values = value.values.map((item) => item.values)
  tableForm.value.values!.editForm!.comProps = {
    groupNum: value.groupNum,
    singleGroupArrowNum: value.singleGroupArrowNum
  }
  editFormModel.value.createTime = undefined
  editFormModel.value.createUser = undefined
  // @ts-ignore
  editFormModel.value.student = undefined
  // @ts-ignore
  editFormModel.value.groupAverageValue = undefined
  // @ts-ignore
  editFormModel.value.arrowAverageValue = undefined
  // @ts-ignore
  editFormModel.value.xNum = undefined
  // @ts-ignore
  editFormModel.value.tenNum = undefined
  // @ts-ignore
  editFormModel.value.nineNum = undefined
  // @ts-ignore
  editFormModel.value.eightNum = undefined
  // @ts-ignore
  editFormModel.value.sevenNum = undefined
  // @ts-ignore
  editFormModel.value.sixNum = undefined
  // @ts-ignore
  editFormModel.value.fiveNum = undefined
  // @ts-ignore
  editFormModel.value.fourNum = undefined
  // @ts-ignore
  editFormModel.value.threeNum = undefined
  // @ts-ignore
  editFormModel.value.twoNum = undefined
  // @ts-ignore
  editFormModel.value.oneNum = undefined
  // @ts-ignore
  editFormModel.value.xNum = undefined
  // @ts-ignore
  editFormModel.value.total = undefined
  // @ts-ignore
  editFormModel.value.mNum = undefined
  // @ts-ignore
  editFormModel.value.updateTime = undefined
  // @ts-ignore
  editFormModel.value.deleteTime = undefined
}

const onCreate = () => {
  tableForm.value.values!.editForm!.comProps = {
    groupNum: 1,
    singleGroupArrowNum: 1
  }
}
</script>

<style scoped></style>
