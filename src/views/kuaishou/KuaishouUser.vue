<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-form="tableForm"
    :edit-form-props="editFormProps"
    :table-props="tableProps"
    :api="api"
    @on-table-id-success="onTableIdSuccess"
  ></schemaTableForm>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type SchemaTableForm from '@/components/schemaTableForm/types'
import type { Api } from '@/components/schemaTableForm/types'
import { useDictSchema } from '@/hooks/useDict'
import type { paths } from '@/types/Schema'
import { ElInput, type FormProps, type TableColumnInstance, type TableInstance } from 'element-plus'

const api = ref<Api>({
  page: '/admin/kuaishou/user/page',
  list: '',
  id: '/admin/kuaishou/user/info',
  create: '/admin/kuaishou/user/add',
  update: '/admin/kuaishou/user/update',
  import: '',
  delete: '/admin/kuaishou/user/delete'
})

const searchFormModel = ref<
  paths['/admin/kuaishou/user/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormProps = ref<Partial<FormProps>>({
  labelWidth: '150px'
})

const editFormModel = ref<
  paths['/admin/kuaishou/user/add']['post']['requestBody']['content']['application/json'] & {
    id?: string
  }
>({
  kuaishouId: '',
  username: '',
  cookies: '',
  tianyanCookies: ''
})

const tableProps = ref<{
  props?: Partial<Omit<TableInstance['$props'], 'data'>>
  actionProps?: Omit<TableColumnInstance['$props'], 'prop'>
}>({
  props: {
    showOverflowTooltip: true
  }
})

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/kuaishou/user/info']['get']['responses']['200']['content']['application/json']
  >
>({
  kuaishouId: {
    table: {
      label: '快手id'
    },
    searchForm: {
      props: {
        label: '快手id'
      },
      component: h(ElInput, { placeholder: '请输入快手id', clearable: true })
    },
    editForm: {
      rule: [{ required: true, message: '请输入快手id' }],
      props: {
        label: '快手id'
      },
      component: h(ElInput, { placeholder: '请输入快手id', clearable: true })
    }
  },
  username: {
    table: {
      label: '用户名'
    },
    searchForm: {
      props: {
        label: '用户名'
      },
      component: h(ElInput, { placeholder: '请输入用户名', clearable: true })
    },
    editForm: {
      rule: [{ required: true, message: '请输入用户名' }],
      props: {
        label: '用户名'
      },
      component: h(ElInput, { placeholder: '请输入用户名', clearable: true })
    }
  },
  cookies: {
    table: {
      label: 'cookies'
    },
    editForm: {
      rule: [{ required: true, message: '请输入cookies' }],
      props: {
        label: 'cookies'
      },
      component: h(ElInput, {
        placeholder: '请输入cookies',
        type: 'textarea',
        autosize: true,
        clearable: true
      })
    }
  },
  tianyanCookies: {
    table: {
      label: '天眼cookies'
    },
    editForm: {
      rule: [{ required: true, message: '请输入天眼cookies' }],
      props: {
        label: '天眼cookies'
      },
      component: h(ElInput, {
        placeholder: '请输入天眼cookies',
        type: 'textarea',
        autosize: true,
        clearable: true
      })
    }
  }
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
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
}
</script>
<style scoped></style>
