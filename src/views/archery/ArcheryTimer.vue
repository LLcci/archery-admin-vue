<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-props="tableProps"
    ref="tableFormRef"
    :table-form="tableForm"
    :api="api"
    @on-table-id-success="onTableIdSuccess"
  >
    <template #tableButtons="scope">
      <el-button
        type="success"
        v-permissions="api.id"
        text
        size="default"
        @click="tableFormRef?.handleDialog('查看', scope.row)"
        >查看</el-button
      >
      <el-button
        type="primary"
        v-permissions="api.update"
        text
        size="default"
        @click="tableFormRef?.handleDialog('编辑', scope.row)"
        >编辑</el-button
      >
      <el-button
        type="primary"
        v-permissions="'/admin/archery/timer/join'"
        text
        :icon="CirclePlus"
        size="default"
        :loading="joinLoading"
        @click="joinTimer(scope.row.id)"
        >加入</el-button
      >
      <el-button
        type="primary"
        v-permissions="'/admin/archery/timer/join'"
        text
        :icon="Clock"
        size="default"
        :loading="joinLoading"
        @click="goTimer(scope.row.id)"
        >进入倒计时</el-button
      >
      <el-popconfirm title="确定删除？" @confirm="tableFormRef?.handleDelete(scope.row)">
        <template #reference>
          <el-button v-permissions="api.delete" type="danger" text size="default">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </schemaTableForm>
</template>

<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type {
  Api,
  SchemaTableForm,
  SchemaTableFormInstance
} from '@/components/schemaTableForm/types'
import { useDictSchema } from '@/hooks/useDict'
import type { paths } from '@/types/Schema'
import { ElInputNumber, type TableColumnInstance, type TableInstance } from 'element-plus'
import { h, ref } from 'vue'
import InputList from './components/InputList.vue'
import InputNumberList from './components/InputNumberList.vue'
import { useFetch } from '@/hooks/useFetch'
import { CirclePlus, Clock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goTimer = (id: string) => {
  router.push({ path: '/archery/ArcheryTimerDetail', query: { id } })
}

const tableFormRef = ref<SchemaTableFormInstance>()

const tableProps = ref<{
  props?: Partial<Omit<TableInstance['$props'], 'data'>>
  actionProps?: Omit<TableColumnInstance['$props'], 'prop'>
}>({
  actionProps: {
    width: '300px'
  }
})

const api = ref<Api>({
  list: '',
  page: '/admin/archery/timer/page',
  id: '/admin/archery/timer/id',
  create: '/admin/archery/timer/save',
  update: '/admin/archery/timer/save',
  import: '',
  delete: '/admin/archery/timer/delete'
})

const searchFormModel = ref<
  paths['/admin/archery/timer/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/archery/timer/save']['post']['requestBody']['content']['application/json']
>({
  shootList: [],
  roundList: [],
  timerList: []
})

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/archery/timer/id']['get']['responses']['200']['content']['application/json']
  >
>({
  users: {
    table: {
      label: '参加用户',
      formatter(row, column, cellValue, index) {
        return cellValue
          .map(
            (
              item: paths['/admin/sys/user/id']['get']['responses']['200']['content']['application/json']
            ) => item.realname
          )
          .join(',')
      }
    }
  },
  state: {},
  roundList: {
    editForm: {
      props: {
        label: '阶段列表'
      },
      rule: [
        {
          required: true,
          validator(rule, value, cb) {
            if (!(value as string[]).length) {
              cb('请输入阶段列表')
            }
            for (const item of value as string[]) {
              if (!item) {
                cb('阶段列表项目不能为空')
              }
            }
            cb()
          }
        }
      ],
      component: h(InputList, { placeholder: '请输入阶段名称' })
    }
  },
  shootList: {
    editForm: {
      props: {
        label: '射箭列表'
      },
      rule: [
        {
          required: true,
          validator(rule, value, cb) {
            if (!(value as string[]).length) {
              cb('请输入射箭列表')
            }
            if ((value as string[]).length != editFormModel.value.roundList.length) {
              cb('射箭列表与阶段列表长度不一致')
            }
            for (const item of value as string[]) {
              if (!item) {
                cb('射箭列表项目不能为空')
              }
            }

            cb()
          }
        }
      ],
      component: h(InputList, { placeholder: '请输入射箭名称' })
    }
  },
  timerList: {
    editForm: {
      props: {
        label: '定时列表'
      },
      rule: [
        {
          required: true,
          validator(rule, value, cb) {
            if (!(value as number[]).length) {
              cb('请输入定时列表')
            }
            if ((value as string[]).length != editFormModel.value.roundList.length) {
              cb('定时列表与阶段列表长度不一致')
            }
            cb()
          }
        }
      ],
      component: h(InputNumberList, { inputNumberProps: { min: 1 } })
    }
  },
  status: {}
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
})

useDictSchema('roomState', { filterable: true }, { filterable: true }).then((res) => {
  tableForm.value.state!.searchForm = res?.searchForm
  tableForm.value.state!.table = res?.table
})

let joinLoading = ref(false)
const joinTimer = async (id: string) => {
  try {
    joinLoading.value = true
    await useFetch(`/admin/archery/timer/join?id:${id}`, { immediate: false }).get().execute(true)
    await tableFormRef.value?.handleSearch()
  } catch (error) {
    console.error(error)
  } finally {
    joinLoading.value = false
  }
}

const onTableIdSuccess = () => {
  editFormModel.value.createTime = undefined
  editFormModel.value.createUser = undefined
  editFormModel.value.updateTime = undefined
  editFormModel.value.deleteTime = undefined
  // @ts-ignore
  editFormModel.value.state = undefined
  // @ts-ignore
  editFormModel.value.users = undefined
}
</script>

<style scoped></style>
