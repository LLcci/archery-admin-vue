<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    ref="tableFormRef"
    :table-form="tableForm"
    :api="api"
    @on-table-id-success="onTableIdSuccess"
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
import { ElAvatar, ElInput, ElSelectV2 } from 'element-plus'
import { h, ref } from 'vue'

const tableFormRef = ref<SchemaTableFormInstance>()

const api = ref<Api>({
  list: '',
  page: '/admin/archery/trainer/page',
  id: '/admin/archery/trainer/id',
  create: '/admin/archery/trainer/save',
  update: '/admin/archery/trainer/save',
  import: '',
  delete: '/admin/archery/trainer/delete'
})

const searchFormModel = ref<
  paths['/admin/archery/trainer/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/archery/trainer/save']['post']['requestBody']['content']['application/json']
>({
  userId: ''
})

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/archery/trainer/id']['get']['responses']['200']['content']['application/json'] & {
      realname: string
      username: string
      avatar: string
      userId: string
    }
  >
>({
  userId: {
    editForm: {
      rule: [{ required: true, message: '请选择用户' }],
      props: {
        label: '用户'
      }
    },
    searchForm: {
      props: {
        label: '用户'
      }
    }
  },
  avatar: {
    table: {
      label: '头像',
      formatter(row, column, cellValue, index) {
        if (cellValue) {
          return h(ElAvatar, {
            size: 40,
            src: `${import.meta.env.VITE_UPLOAD_URL}/${row.user.avatar}`
          })
        }
        return ''
      },
      width: 60
    }
  },
  realname: {
    table: {
      label: '用户姓名',
      align: 'center',
      formatter(row, column, cellValue, index) {
        return row.user.realname
      }
    }
  },
  username: {
    table: {
      label: '用户账户',
      align: 'center',
      formatter(row, column, cellValue, index) {
        return row.user.username
      }
    }
  },
  description: {
    table: {
      label: '描述',
      align: 'center'
    },
    editForm: {
      props: {
        label: '描述'
      },
      component: h(ElInput, { placeholder: '请输入描述', type: 'textarea' })
    }
  }
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
})

const { data: userList, onFetchResponse } = useFetch<
  paths['/admin/sys/user/list']['post']['responses']['200']['content']['application/json']
>('/admin/sys/user/list', { immediate: true }).post({ status: '1' })

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
    placeholder: '请选择用户',
    options,
    filterable: true
  })

  tableForm.value.userId!.editForm!.component = component
  tableForm.value.userId!.searchForm!.component = component
})

const onTableIdSuccess = (
  value: paths['/admin/archery/trainer/id']['get']['responses']['200']['content']['application/json']
) => {
  editFormModel.value.userId = value.user.id as string
  // @ts-ignore
  editFormModel.value.user = undefined
}
</script>

<style scoped></style>
