<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-props="tableProps"
    :table-form="tableForm"
    :api="api"
  ></schemaTableForm>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type { Api, SchemaTableFormInstance } from '@/components/schemaTableForm/types'
import type SchemaTableForm from '@/components/schemaTableForm/types'
import type { paths } from '@/types/Schema'
import { ElInput, ElOption, ElSelect } from 'element-plus'
import { h, ref } from 'vue'
import { useMenuList } from './api'
import { useMenuTree } from './hooks/useMenuTree'
import FormTreeOpr from '@/components/formTree/FormTreeOpr.vue'
import { useDictSchema } from '@/hooks/useDict'

const api = ref<Api>({
  page: '/admin/sys/role/page',
  list: '/admin/sys/role/list',
  id: '/admin/sys/role/id',
  create: '/admin/sys/role/save',
  update: '/admin/sys/role/save',
  import: '/admin/sys/role/import',
  delete: '/admin/sys/role/delete'
})

const searchFormModel = ref<
  paths['/admin/sys/role/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/sys/role/save']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const tableProps = ref<SchemaTableFormInstance['$props']['tableProps']>({
  props: { showOverflowTooltip: true }
})

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/sys/role/id']['get']['responses']['200']['content']['application/json']
  >
>({
  name: {
    table: {
      label: '名称',
      align: 'center'
    },
    editForm: {
      rule: [{ required: true, message: '请输入名称' }],
      props: {
        label: '名称'
      },
      component: h(ElInput, { placeholder: '请输入名称' })
    },
    searchForm: {
      props: {
        label: '名称'
      },
      component: h(ElInput, { placeholder: '请输入名称' })
    }
  },
  code: {
    table: {
      label: '编码',
      align: 'center'
    },
    editForm: {
      rule: [{ required: true, message: '请输入编码' }],
      props: {
        label: '编码'
      },
      component: h(ElInput, { placeholder: '请输入编码' })
    },
    searchForm: {
      props: {
        label: '编码'
      },
      component: h(ElInput, { placeholder: '请输入编码' })
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
  },
  menuIds: {
    editForm: {
      props: {
        label: '权限'
      }
    }
  }
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
})

const { data: menuList, onFetchResponse: onMenuListResponse } = useMenuList()
onMenuListResponse(() => {
  const options = useMenuTree(menuList.value)
  tableForm.value.menuIds!.editForm!.component = h(FormTreeOpr, {
    allNodes: menuList.value!.map((item) => item.id) as string[],
    treeProps: {
      data: options,
      checkStrictly: true,
      defaultExpandAll: true
    }
  })
})
</script>
<style scoped></style>
