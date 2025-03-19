<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-form="tableForm"
    :edit-form-props="editFormProps"
    :api="api"
    @on-table-id-success="onTableIdSuccess"
  ></schemaTableForm>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type SchemaTableForm from '@/components/schemaTableForm/types'
import type { Api } from '@/components/schemaTableForm/types'
import { useDictSchema } from '@/hooks/useDict'
import { useFetch } from '@/hooks/useFetch'
import type { paths } from '@/types/Schema'
import { ElInput, ElInputNumber, ElOption, ElSelect, type FormProps } from 'element-plus'

const api = ref<Api>({
  page: '/admin/kuaishou/account/page',
  list: '',
  id: '/admin/kuaishou/account/info',
  create: '/admin/kuaishou/account/add',
  update: '/admin/kuaishou/account/update',
  import: '',
  delete: '/admin/kuaishou/account/delete'
})

const searchFormModel = ref<
  paths['/admin/kuaishou/account/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormProps = ref<Partial<FormProps>>({
  labelWidth: '150px'
})

const editFormModel = ref<
  paths['/admin/kuaishou/account/add']['post']['requestBody']['content']['application/json'] & {
    id?: string
  }
>({
  accountId: '',
  userId: '',
  allStation: 0,
  version: 0,
  sort: 0
})

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/kuaishou/account/info']['get']['responses']['200']['content']['application/json'] & {
      userId: string
    }
  >
>({
  userId: {
    table: {
      label: '快手名称',
      formatter(row) {
        return row.user?.username
      }
    },
    searchForm: {
      props: {
        label: '快手名称'
      }
    },
    editForm: {
      props: {
        label: '快手名称',
        rules: [{ required: true, message: '请选择快手名称' }]
      }
    }
  },
  accountId: {
    table: {
      label: '广告账户id'
    },
    searchForm: {
      props: {
        label: '广告账户id'
      },
      component: h(ElInput, { placeholder: '请输入广告账户id', clearable: true })
    },
    editForm: {
      props: {
        label: '广告账户id',
        rules: [{ required: true, message: '请输入广告账户id' }]
      },
      component: h(ElInput, { placeholder: '请输入广告账户id', clearable: true })
    }
  },
  allStation: {
    table: {
      label: '全站数据',
      formatter(row, column, cellValue) {
        return cellValue === 1 ? '显示' : '隐藏'
      }
    },
    editForm: {
      props: {
        label: '全站数据',
        rules: [{ required: true, message: '请选择全站数据' }]
      },
      component: h(
        ElSelect,
        {
          placeholder: '请选择全站数据',
          clearable: true
        },
        {
          default: () =>
            [
              { value: 1, label: '显示' },
              { value: 0, label: '隐藏' }
            ].map((item) => {
              return h(ElOption, { value: item.value, label: item.label })
            })
        }
      )
    }
  },
  allStationType: {
    table: {
      label: '全站数据类型',
      formatter(row, column, cellValue) {
        if (row.allStation === 0) {
          return ''
        }
        return cellValue === 1 ? '全站直播推广(智投版)' : '全站直播推广'
      }
    },
    editForm: {
      props: {
        label: '全站数据类型',
        rules: [{ required: true, message: '请选择全站数据类型' }]
      },
      vIf: () => {
        return editFormModel.value.allStation === 1
      },
      component: h(
        ElSelect,
        {
          placeholder: '请选择全站数据类型',
          clearable: true
        },
        {
          default: () =>
            [
              { value: 1, label: '全站直播推广(智投版)' },
              { value: 0, label: '全站直播推广' }
            ].map((item) => {
              return h(ElOption, { value: item.value, label: item.label })
            })
        }
      )
    }
  },
  version: {
    table: {
      label: '版本',
      formatter(row, column, cellValue) {
        return cellValue === 0 ? '旧版' : '新版'
      }
    },
    editForm: {
      props: {
        label: '版本',
        rules: [{ required: true, message: '请选择版本' }]
      },
      component: h(
        ElSelect,
        {
          placeholder: '请选择版本',
          clearable: true
        },
        {
          default: () =>
            [
              { value: 0, label: '旧版' },
              { value: 1, label: '新版' }
            ].map((item) => {
              return h(ElOption, { value: item.value, label: item.label })
            })
        }
      )
    }
  },
  sort: {
    table: {
      label: '排序'
    },
    editForm: {
      props: {
        label: '排序',
        rules: [{ required: true, message: '请输入排序' }]
      },
      component: h(ElInputNumber)
    }
  }
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
})

const { data: userList, onFetchResponse } = useFetch<
  paths['/admin/kuaishou/user/list']['get']['responses']['200']['content']['application/json']
>('/admin/kuaishou/user/list').get()

onFetchResponse(() => {
  const component = h(
    ElSelect,
    {
      placeholder: '请选择快手用户',
      clearable: true,
      filterable: true
    },
    {
      default: () =>
        userList.value?.map((item) => {
          return h(ElOption, { value: item.id as string, label: item.username })
        })
    }
  )
  tableForm.value.userId!.searchForm!.component = component
  tableForm.value.userId!.editForm!.component = component
})

const onTableIdSuccess = () => {
  // @ts-ignore
  editFormModel.value.createTime = undefined
  // @ts-ignore
  editFormModel.value.updateTime = undefined
  // @ts-ignore
  editFormModel.value.deleteTime = undefined
  // @ts-ignore
  editFormModel.value.createUser = undefined
  // @ts-ignore
  editFormModel.value.replyUser = undefined
  // @ts-ignore
  editFormModel.value.remark = undefined
}
</script>
<style scoped></style>
