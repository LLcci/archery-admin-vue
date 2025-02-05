<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-form="tableForm"
    :api="api"
    @on-table-id-success="onTableIdSuccess"
  ></schemaTableForm>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type { Api } from '@/components/schemaTableForm/types'
import type SchemaTableForm from '@/components/schemaTableForm/types'
import type { paths } from '@/types/Schema'
import { ElDatePicker, ElImage, ElInput, ElMessage, ElSelectV2, dayjs } from 'element-plus'
import { h, ref } from 'vue'
import { useDictSchema } from '@/hooks/useDict'
import { useFetch } from '@/hooks/useFetch'
import FormImgListUpload from '@/components/formImgListUpload/FormImgListUpload.vue'
import { useUser } from '@/stores/useUser'

const api = ref<Api>({
  page: '/admin/archery/note/page',
  list: '',
  id: '/admin/archery/note/id',
  create: '/admin/archery/note/save',
  update: '/admin/archery/note/save',
  import: '',
  delete: '/admin/archery/note/delete'
})

const searchFormModel = ref<
  paths['/admin/archery/note/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/archery/note/save']['post']['requestBody']['content']['application/json']
>({
  status: '1',
  address: '',
  content: '',
  imgList: []
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
    paths['/admin/archery/note/id']['get']['responses']['200']['content']['application/json'] & {
      studentName: string
      studentId: string
      noteDate: [string, string]
    }
  >
>({
  studentName: {
    table: {
      label: '学员姓名',
      formatter(row, column, cellValue, index) {
        return row.createUser.realname
      }
    }
  },
  studentId: {
    searchForm: {
      props: {
        label: '学员'
      }
    }
  },
  address: {
    editForm: {
      rule: [{ required: true, message: '请输入训练地点' }],
      props: {
        label: '训练地点'
      },
      component: h(ElInput, { placeholder: '请输入训练地点' })
    },
    table: {
      label: '训练地点'
    },
    searchForm: {
      props: {
        label: '训练地点'
      },
      component: h(ElInput, { placeholder: '请输入训练地点' })
    }
  },
  content: {
    table: {
      label: '内容',
      showOverflowTooltip: true
    },
    editForm: {
      rule: [{ required: true, message: '请输入内容' }],
      props: {
        label: '内容'
      },
      component: h(ElInput, { placeholder: '请输入内容', type: 'textarea' })
    },
    searchForm: {
      props: {
        label: '内容'
      },
      component: h(ElInput, { placeholder: '请输入内容' })
    }
  },
  imgList: {
    editForm: {
      props: {
        label: '图片'
      },
      component: h(FormImgListUpload, {
        uploadProps: {
          action: `${import.meta.env.VITE_API_URL}/admin/sys/upload/img`,
          headers: { Authorization: `Bearer ${useUser().token}` },
          name: 'file',
          'on-error': (err) => {
            ElMessage.error(JSON.parse(err.message).message)
          }
        }
      })
    },
    table: {
      label: '图片',
      formatter(row, column, cellValue, index) {
        if (!cellValue || cellValue.length === 0) {
          return ''
        }
        return h(ElImage, {
          src: `${import.meta.env.VITE_UPLOAD_URL}/${cellValue[0]}`,
          previewSrcList: cellValue.map(
            (item: string) => `${import.meta.env.VITE_UPLOAD_URL}/${item}`
          ),
          zIndex: 99,
          previewTeleported: true,
          style: 'height:60px'
        })
      }
    }
  },
  noteDate: {
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
  }
})

useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
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
  data: paths['/admin/archery/note/id']['get']['responses']['200']['content']['application/json']
) => {
  // @ts-ignore
  editFormModel.value.createTime = undefined
  // @ts-ignore
  editFormModel.value.updateTime = undefined
  // @ts-ignore
  editFormModel.value.deleteTime = undefined
  // @ts-ignore
  editFormModel.value.reply = undefined
  // @ts-ignore
  editFormModel.value.replyTime = undefined
  // @ts-ignore
  editFormModel.value.createUser = undefined
  // @ts-ignore
  editFormModel.value.replyUser = undefined
}
</script>
<style scoped></style>
