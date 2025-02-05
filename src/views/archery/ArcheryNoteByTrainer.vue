<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-form="tableForm"
    :api="api"
    ref="tableFormRef"
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
        v-permissions="api.id"
        text
        size="default"
        @click="handleDialog(scope.row)"
        >回复</el-button
      >
    </template>
  </schemaTableForm>
  <el-dialog
    v-model="dialogVisible"
    title="回复"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
    width="60%"
    destroy-on-close
  >
    <el-form :model="replyFormModel" label-width="auto" ref="replyFormRef" label-suffix="：">
      <el-form-item label="学员">
        <div>{{ data?.createUser?.realname }}</div>
      </el-form-item>
      <el-form-item label="训练地点">
        <div>{{ data?.address }}</div>
      </el-form-item>
      <el-form-item label="内容">
        <div>{{ data?.content }}</div>
      </el-form-item>
      <el-form-item label="图片">
        <div class="grid grid-cols-5 gap-4">
          <div class="w-50" v-for="(item, index) in data?.imgList" :key="index">
            <el-image :src="item" :zIndex="9999" :preview-src-list="[item]"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="创建时间">
        <div>{{ dayjs(data?.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </el-form-item>
      <el-form-item
        prop="reply"
        label="回复"
        :rules="[{ required: true, message: '请输入回复内容' }]"
      >
        <el-input
          v-model="replyFormModel.reply"
          type="textarea"
          placeholder="请输入回复内容"
          clearable
          autosize
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="replyIsFetching" type="primary" @click="handleReply">回复</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type { Api, SchemaTableFormInstance } from '@/components/schemaTableForm/types'
import type SchemaTableForm from '@/components/schemaTableForm/types'
import type { paths } from '@/types/Schema'
import {
  ElDatePicker,
  ElImage,
  ElInput,
  ElMessage,
  ElSelectV2,
  dayjs,
  type FormInstance
} from 'element-plus'
import { h, ref } from 'vue'
import { useDictSchema } from '@/hooks/useDict'
import { useFetch } from '@/hooks/useFetch'
import FormImgListUpload from '@/components/formImgListUpload/FormImgListUpload.vue'
import { useUser } from '@/stores/useUser'
import { useSystem } from '@/stores/useSystem'

const tableFormRef = ref<SchemaTableFormInstance>()

const api = ref<Api>({
  page: '/admin/archery/note/trainer/page',
  list: '',
  id: '/admin/archery/note/id',
  create: '',
  update: '',
  import: '',
  delete: ''
})

const searchFormModel = ref<
  paths['/admin/archery/note/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/archery/note/save']['post']['requestBody']['content']['application/json'] & {
    studentId?: string
    replyUser?: string
    createTime?: string
    replyTime?: string
    reply?: string
  }
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
    editForm: {
      rule: [{ required: true, message: '请选择学员' }],
      props: {
        label: '学员'
      }
    },
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
      component: h(ElInput, { placeholder: '请输入内容', type: 'textarea', autosize: true })
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
        if (!cellValue.length) return ''
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
  },
  createTime: {
    table: {
      label: '创建时间',
      width: 170,
      formatter(row, column, cellValue, index) {
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    editForm: {
      props: {
        label: '创建时间'
      },
      component: h(ElInput)
    }
  },
  reply: {
    table: {
      label: '回复',
      align: 'center',
      showOverflowTooltip: true
    },
    editForm: {
      props: {
        label: '回复'
      },
      vIf: (value) => {
        if (value.reply) return true
        return false
      },
      component: h(ElInput, { type: 'textarea', autosize: true })
    }
  },
  replyUser: {
    table: {
      label: '回复人',
      align: 'center',
      formatter(row, column, cellValue, index) {
        if (!cellValue) return ''
        return cellValue.realname
      }
    },
    editForm: {
      props: {
        label: '回复人'
      },
      vIf: (value) => {
        if (value.replyUser) return true
        return false
      },
      component: h(ElInput)
    }
  },
  replyTime: {
    table: {
      label: '回复时间',
      width: 170,
      formatter(row, column, cellValue, index) {
        if (!cellValue) return ''
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    editForm: {
      props: {
        label: '回复时间'
      },
      vIf: (value) => {
        if (value.replyTime) return true
        return false
      },
      component: h(ElInput)
    }
  }
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
  tableForm.value.studentId!.editForm!.component = component
})

const onTableIdSuccess = (
  data: paths['/admin/archery/note/id']['get']['responses']['200']['content']['application/json']
) => {
  editFormModel.value.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')
  editFormModel.value.replyUser = data.replyUser?.realname ?? ''
  editFormModel.value.replyTime = data.replyTime
    ? dayjs(data.replyTime).format('YYYY-MM-DD HH:mm:ss')
    : ''
  editFormModel.value.studentId = data.createUser!.id as string
}

const selectId = ref('')
const idUrl = computed(() => `${api.value.id}?id=${selectId.value}`)
const { data, execute, error } = useFetch<
  paths['/admin/archery/note/id']['get']['responses']['200']['content']['application/json']
>(idUrl, { immediate: false }).get()
const dialogVisible = ref(false)
const handleDialog = async (
  row: paths['/admin/archery/note/trainer/page']['post']['responses']['200']['content']['application/json']['records'][0]
) => {
  selectId.value = row.id as string
  replyFormModel.value.id = row.id as string
  await execute()
  if (error.value) return
  replyFormModel.value.reply = data.value?.reply ?? ''
  if (data.value?.imgList?.length) {
    data.value.imgList = data.value?.imgList?.map(
      (item: string) => `${import.meta.env.VITE_UPLOAD_URL}/${item}`
    )
  }
  dialogVisible.value = true
}

const replyFormRef = ref<FormInstance>()
const replyFormModel = ref<
  paths['/admin/archery/note/trainer/reply']['post']['requestBody']['content']['application/json']
>({
  id: '',
  reply: ''
})
const {
  execute: replyExecute,
  error: replyError,
  isFetching: replyIsFetching
} = useFetch('/admin/archery/note/trainer/reply', {
  immediate: false
}).post(replyFormModel)
const handleReply = async () => {
  try {
    await replyFormRef.value?.validate()
    await replyExecute()
    if (replyError.value) return
    ElMessage.success('回复成功')
    dialogVisible.value = false
    tableFormRef.value?.handleSearch()
  } catch (error) {
    console.error(error)
  }
}
</script>
<style scoped></style>
