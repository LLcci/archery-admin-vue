<template>
  <schemaTableForm
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-form="tableForm"
    :api="api"
    :show-table-operations="false"
  >
    <template #operationButtons></template>
  </schemaTableForm>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import type { Api, SchemaTableForm } from '@/components/schemaTableForm/types'
import { useFetch } from '@/hooks/useFetch'
import type { paths } from '@/types/Schema'
import dayjs from 'dayjs'
import { ElDatePicker, ElInput, ElSelectV2 } from 'element-plus'

const api = ref<Api>({
  page: '/admin/archery/payment/page',
  list: '',
  id: '',
  create: '',
  update: '',
  import: '',
  delete: ''
})

const searchFormModel = ref<
  paths['/admin/archery/payment/page']['post']['requestBody']['content']['application/json']
>({})

const editFormModel = ref<
  paths['/admin/archery/payment/id']['get']['responses']['200']['content']['application/json']
>({
  mchid: '',
  openid: '',
  transactionId: '',
  goodName: '月会员',
  price: 0,
  oldMemberDate: '',
  newMemberDate: '',
  state: 0,
  outTradeNo: ''
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
    paths['/admin/archery/payment/id']['get']['responses']['200']['content']['application/json'] & {
      studentName: string
      createUserId: string
      payDate: [string, string]
    }
  >
>({
  id: {
    table: {
      label: 'id'
    },
    editForm: {
      props: {
        label: 'id'
      },
      component: h(ElInput)
    }
  },
  transactionId: {
    table: {
      label: 'transactionId'
    },
    searchForm: {
      props: {
        label: 'transactionId'
      },
      component: h(ElInput, {
        placeholder: '请输入transactionId'
      })
    },
    editForm: {
      props: {
        label: 'transactionId'
      },
      component: h(ElInput)
    }
  },
  outTradeNo: {
    table: {
      label: 'outTradeNo'
    },
    searchForm: {
      props: {
        label: 'outTradeNo'
      },
      component: h(ElInput, {
        placeholder: '请输入outTradeNo'
      })
    },
    editForm: {
      props: {
        label: 'outTradeNo'
      },
      component: h(ElInput)
    }
  },
  studentName: {
    table: {
      label: '学员姓名',
      formatter(row, column, cellValue, index) {
        return row.createUser.realname
      }
    }
  },
  openid: {
    table: {
      label: 'openid'
    }
  },
  mchid: {
    table: {
      label: '微信商户号'
    }
  },
  goodName: {
    table: {
      label: '商品名称'
    }
  },
  price: {
    table: {
      label: '支付金额'
    }
  },
  oldMemberDate: {
    table: {
      label: '原会员有效期',
      formatter(row, column, cellValue, index) {
        if (!row.oldMemberDate) return ''
        return dayjs(row.oldMemberDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  newMemberDate: {
    table: {
      label: '新会员有效期',
      formatter(row, column, cellValue, index) {
        if (!row.newMemberDate) return ''
        return dayjs(row.newMemberDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  createUserId: {
    searchForm: {
      props: {
        label: '学员'
      }
    },
    editForm: {
      props: {
        label: '学员'
      }
    }
  },
  payDate: {
    searchForm: {
      props: {
        label: '支付时间'
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
  state: {
    table: {
      label: '支付状态',
      formatter(row, column, cellValue, index) {
        return row.state === '1' ? '已支付' : '未支付'
      }
    },
    searchForm: {
      props: {
        label: '支付状态'
      },
      component: h(ElSelectV2, {
        placeholder: '请选择支付状态',
        options: [
          { value: '1', label: '已支付' },
          { value: '0', label: '未支付' }
        ],
        filterable: true,
        clearable: true
      })
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

  tableForm.value.createUserId!.searchForm!.component = component
})
</script>
<style scoped></style>
