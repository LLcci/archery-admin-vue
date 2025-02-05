<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    ref="tableFormRef"
    :table-form="tableForm"
    :api="api"
  >
    <template #tableButtons="scope">
      <el-button
        type="success"
        v-permissions="api.id"
        text
        size="default"
        @click="handleDialog(scope.row)"
        >查看</el-button
      >
      <el-button
        type="primary"
        v-permissions="api.id"
        text
        size="default"
        @click="handleHolesDialog(scope.row)"
        >查看箭孔</el-button
      >
    </template>
  </schemaTableForm>
  <el-dialog
    v-model="dialogVisible"
    title="查看"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
    width="60%"
    destroy-on-close
  >
    <ScoringItem v-if="data" :item="data"></ScoringItem>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogHolesVisible"
    title="箭孔"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
    width="60%"
    destroy-on-close
  >
    <component :is="component" :id="selectHolesId"></component>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogHolesVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
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
import ScoringItem from './components/ScoringItem.vue'
import { useSystem } from '@/stores/useSystem'
import FortyAllList from './components/FortyAllList.vue'
import EightyAllList from './components/EightyAllList.vue'
import EightyHalfList from './components/EightyHalfList.vue'
import OneHundred22AllList from './components/OneHundred22AllList.vue'
import SixtyAllList from './components/SixtyAllList.vue'
import SixtyHalfList from './components/SixtyHalfList.vue'
import ThreeHundredList from './components/ThreeHundredList.vue'
import FortyThreeUnoinList from './components/FortyThreeUnoinList.vue'

const tableFormRef = ref<SchemaTableFormInstance>()

const ValuesInputRef = shallowRef(ValuesInput)

const api = ref<Api>({
  list: '',
  page: '/admin/archery/scoring/trainer/page',
  id: '/admin/archery/scoring/id',
  create: '',
  update: '',
  import: '',
  delete: ''
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
    editForm: {
      props: {
        label: '学员',
        rules: [{ required: true, message: '请选择学员' }]
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
      formatter(row, column, cellValue, index) {
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

  tableForm.value.studentId!.editForm!.component = component
  tableForm.value.studentId!.searchForm!.component = component
})

const selectId = ref('')
const idUrl = computed(() => `${api.value.id}?id=${selectId.value}`)
const { data, execute, error } = useFetch<
  paths['/admin/archery/scoring/id']['get']['responses']['200']['content']['application/json']
>(idUrl, { immediate: false }).get()
const dialogVisible = ref(false)
const handleDialog = async (
  row: paths['/admin/archery/scoring/trainer/page']['post']['responses']['200']['content']['application/json']['records'][0]
) => {
  selectId.value = row.id as string
  await execute()
  if (error.value) return
  dialogVisible.value = true
}

const dialogHolesVisible = ref(false)
const selectHolesId = ref('')
const component = ref()
const handleHolesDialog = async (
  row: paths['/admin/archery/scoring/trainer/page']['post']['responses']['200']['content']['application/json']['records'][0]
) => {
  selectHolesId.value = row.id as string
  switch (row.targetPaper) {
    case '122全环':
      component.value = h(OneHundred22AllList)
      break
    case '40三联':
      component.value = h(FortyThreeUnoinList)
      break
    case '40全环':
      component.value = h(FortyAllList)
      break
    case '60全环':
      component.value = h(SixtyAllList)
      break
    case '60半环':
      component.value = h(SixtyHalfList)
      break
    case '80全环':
      component.value = h(EightyAllList)
      break
    case '80半环':
      component.value = h(EightyHalfList)
      break
    case '完美300':
      component.value = h(ThreeHundredList)
      break
    default:
      break
  }
  dialogHolesVisible.value = true
}
</script>

<style scoped></style>
