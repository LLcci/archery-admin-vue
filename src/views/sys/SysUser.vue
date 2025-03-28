<template>
  <schemaTableForm
    ref="schemaTableFormRef"
    v-model:search-form-model="searchFormModel"
    v-model:edit-form-model="editFormModel"
    :table-props="tableProps"
    :table-form="tableForm"
    :api="api"
    @on-table-save-success="trainerExecute"
  >
    <template #tableButtons="scope">
      <el-button
        type="success"
        v-permissions="api.id"
        text
        size="default"
        @click="schemaTableFormRef?.handleDialog('查看', scope.row)"
        >查看</el-button
      >
      <el-button
        type="primary"
        v-permissions="api.update"
        text
        size="default"
        @click="handleInfo(scope.row)"
        >编辑</el-button
      >
      <el-button
        type="primary"
        v-permissions="`/admin/sys/user/password`"
        text
        size="default"
        @click="handlePsw(scope.row)"
        >修改密码</el-button
      >
      <el-button
        type="primary"
        v-permissions="`/admin/sys/user/update/trainer`"
        text
        size="default"
        @click="handleTrainer(scope.row)"
        >设置教练</el-button
      >
      <el-popconfirm title="确定删除？" @confirm="schemaTableFormRef?.handleDelete(scope.row)">
        <template #reference>
          <el-button v-permissions="api.delete" type="danger" text size="default">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </schemaTableForm>
  <el-dialog
    v-model="pswDialogShow"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
    :title="`${updatePswUser}：修改密码`"
  >
    <schemaForm
      v-loading="pswConfirmLoading"
      ref="updatePswFormRef"
      v-model="updatePswModel"
      :form="updatePswForm"
    ></schemaForm>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="pswConfirmLoading" @click="pswDialogShow = false">取消</el-button>
        <el-button :loading="pswConfirmLoading" type="primary" @click="confirmUpdatePassword"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="infoDialogShow"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
    :title="`${updateInfoUser}：修改信息`"
  >
    <schemaForm
      v-loading="infoConfirmLoading"
      ref="updateInfoFormRef"
      v-model="updateInfoModel"
      :form="updateInfoForm"
    ></schemaForm>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="infoConfirmLoading" @click="infoDialogShow = false">取消</el-button>
        <el-button :loading="infoConfirmLoading" type="primary" @click="confirmUpdateInfo"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="trainerDialogShow"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
    :title="`${trainerUser}：修改信息`"
  >
    <schemaForm
      v-loading="trainerConfirmLoading"
      ref="trainerFormRef"
      v-model="trainerModel"
      :form="trainerForm"
    ></schemaForm>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="trainerConfirmLoading" @click="trainerDialogShow = false"
          >取消</el-button
        >
        <el-button :loading="trainerConfirmLoading" type="primary" @click="confirmTrainer"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import schemaTableForm from '@/components/schemaTableForm/SchemaTableForm.vue'
import schemaForm from '@/components/schemaForm/SchemaForm.vue'
import type {
  Api,
  SchemaTableForm,
  SchemaTableFormInstance
} from '@/components/schemaTableForm/types'
import type { paths } from '@/types/Schema'
import {
  ElAvatar,
  ElDatePicker,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTag,
  type FormItemRule
} from 'element-plus'
import { h, ref, type VNode } from 'vue'
import { useRoleList } from './api/role'
import FormAvatarUpload from '@/components/formAvatarUpload/FormAvatarUpload.vue'
import { useUser } from '@/stores/useUser'
import type SchemaForm from '@/components/schemaForm/types'
import type { SchemaFormInstance } from '@/components/schemaForm/types'
import { useFetch } from '@/hooks/useFetch'
import { omit } from 'lodash'
import { useSystem } from '@/stores/useSystem'
import DictSelectVue from '@/components/dictSelect/DictSelect.vue'
import { useDictSchema } from '@/hooks/useDict'
import dayjs from 'dayjs'

const api = ref<Api>({
  page: '/admin/sys/user/page',
  list: '/admin/sys/user/list',
  id: '/admin/sys/user/id',
  create: '/admin/sys/user/create',
  update: '/admin/sys/user/update',
  import: '/admin/sys/user/import',
  delete: '/admin/sys/user/delete'
})

const schemaTableFormRef = ref<SchemaTableFormInstance>()

const searchFormModel = ref<
  paths['/admin/sys/user/page']['post']['requestBody']['content']['application/json']
>({
  status: '1'
})

const editFormModel = ref<
  paths['/admin/sys/user/create']['post']['requestBody']['content']['application/json'] & {
    id?: string
  }
>({
  status: '1',
  password: ''
})

const tableProps = ref<SchemaTableFormInstance['$props']['tableProps']>({
  props: { showOverflowTooltip: true },
  actionProps: { width: 500 }
})

type ItemComponent = {
  label: string
  rule?: FormItemRule[]
  component?: VNode
}

const avatarComponent: ItemComponent = {
  label: '头像',
  component: h(FormAvatarUpload, {
    uploadProps: {
      action: `${import.meta.env.VITE_API_URL}/admin/sys/upload/img`,
      headers: { Authorization: `Bearer ${useUser().token}` },
      name: 'file',
      'on-error': (err) => {
        ElMessage.error(JSON.parse(err.message).message)
      }
    }
  })
}

const usernameComponent: ItemComponent = {
  label: '用户账户',
  rule: [{ required: true, message: '请输入用户账户' }],
  component: h(ElInput, { placeholder: '请输入用户账户' })
}

const realnameComponent: ItemComponent = {
  label: '用户姓名',
  rule: [{ required: true, message: '请输入用户姓名' }],
  component: h(ElInput, { placeholder: '请输入用户姓名' })
}

const passwordComponent: ItemComponent = {
  label: '密码',
  rule: [
    { required: true, message: '请输入密码' },
    { min: 8, message: '密码长度不能小于8位' },
    { max: 16, message: '密码长度不能大于16位' },
    {
      validator: (rule, value, cb) => {
        if (!/\d/.test(value)) {
          cb('密码必须包含数字')
        }
        if (!/[A-Z]/.test(value)) {
          cb('密码必须包含大写字母')
        }
        if (!/[a-z]/.test(value)) {
          cb('密码必须包含小写字母')
        }
        if (!/[!@#$%^&*()\\/`~\-_=\\[+{};:,<.>_|'"?]/.test(value)) {
          cb('密码必须包含特殊字符')
        }
        cb()
      }
    }
  ],
  component: h(ElInput, { type: 'password', placeholder: '请输入密码', showPassword: true })
}

const roleIdsComponent: ItemComponent = {
  label: '角色'
}

const emailComponent: ItemComponent = {
  label: '邮箱',
  rule: [
    {
      validator: (rule, value, cb) => {
        if (!value) {
          cb()
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          cb('邮箱格式不正确')
        }
        cb()
      }
    }
  ],
  component: h(ElInput, { type: 'email', placeholder: '请输入邮箱', clearable: true })
}

const phoneComponent: ItemComponent = {
  label: '手机号',
  rule: [
    {
      validator: (rule, value, cb) => {
        if (!value) {
          cb()
        }
        if (!/^1[3456789]\d{9}$/.test(value)) {
          cb('手机号格式不正确')
        }
        cb()
      }
    }
  ],
  component: h(ElInput, { type: 'tel', placeholder: '请输入手机号', clearable: true })
}

const statusComponent: ItemComponent = {
  label: '状态',
  rule: [{ required: true, message: '请选择状态' }],
  component: h(DictSelectVue, { code: 'status' })
}

const isTrainerComponent: ItemComponent = {
  label: '是否教练',
  rule: [{ required: true, message: '请选择是否教练' }],
  component: h(ElSwitch)
}

const tableForm = ref<
  SchemaTableForm<
    paths['/admin/sys/user/create']['post']['requestBody']['content']['application/json']
  >
>({
  avatar: {
    table: {
      label: avatarComponent.label,
      formatter(row, column, cellValue) {
        if (cellValue) {
          return h(ElAvatar, { size: 40, src: `${import.meta.env.VITE_UPLOAD_URL}/${cellValue}` })
        }
        return ''
      },
      width: 60
    },
    editForm: {
      props: {
        label: avatarComponent.label
      },
      component: avatarComponent.component
    }
  },
  username: {
    table: {
      label: usernameComponent.label,
      align: 'center'
    },
    editForm: {
      rule: usernameComponent.rule,
      props: {
        label: usernameComponent.label
      },
      component: usernameComponent.component
    },
    searchForm: {
      props: {
        label: usernameComponent.label
      },
      component: usernameComponent.component
    }
  },
  realname: {
    table: {
      label: realnameComponent.label,
      align: 'center'
    },
    editForm: {
      rule: realnameComponent.rule,
      props: {
        label: realnameComponent.label
      },
      component: realnameComponent.component
    },
    searchForm: {
      props: {
        label: realnameComponent.label
      },
      component: realnameComponent.component
    }
  },
  password: {
    editForm: {
      rule: passwordComponent.rule,
      props: {
        label: passwordComponent.label
      },
      component: passwordComponent.component
    }
  },
  roleIds: {
    editForm: {
      props: {
        label: roleIdsComponent.label
      },
      component: roleIdsComponent.component
    }
  },
  email: {
    table: {
      label: emailComponent.label,
      align: 'center'
    },
    editForm: {
      rule: emailComponent.rule,
      props: {
        label: emailComponent.label
      },
      component: emailComponent.component
    }
  },
  phone: {
    table: {
      label: phoneComponent.label,
      align: 'center'
    },
    editForm: {
      rule: phoneComponent.rule,
      props: {
        label: phoneComponent.label
      },
      component: phoneComponent.component
    }
  },
  memberDate: {
    table: {
      label: '会员有效期',
      align: 'center',
      formatter(row, column, cellValue) {
        if (cellValue) {
          return dayjs(cellValue).format('YYYY-MM-DD')
        }
        return ''
      }
    }
  },
  isTrainer: {
    table: {
      label: isTrainerComponent.label,
      align: 'center',
      formatter(row, column, cellValue) {
        if (cellValue) {
          return h(ElTag, { type: 'success' }, { default: () => '是' })
        }
        return h(ElTag, { type: 'warning' }, { default: () => '否' })
      }
    },
    editForm: {
      props: {
        label: isTrainerComponent.label
      },
      component: isTrainerComponent.component
    },
    searchForm: {
      props: {
        label: isTrainerComponent.label
      },
      component: isTrainerComponent.component
    }
  },
  trainerId: {
    table: {
      label: '教练',
      align: 'center',
      formatter(row, column, cellValue, index) {
        if (row.trainer) {
          return row.trainer.realname
        }
        return ''
      }
    },
    editForm: {
      props: {
        label: '教练'
      }
    },
    searchForm: {
      props: {
        label: '教练'
      }
    }
  },
  createTime: {
    table: {
      label: '创建时间',
      align: 'center',
      formatter(row, column, cellValue) {
        if (cellValue) {
          return dayjs(cellValue).format('YYYY-MM-DD')
        }
        return ''
      }
    }
  }
})
useDictSchema('status', { setDefault: true }).then((res) => {
  tableForm.value.status = res
})

const pswDialogShow = ref(false)
const updatePswUser = ref('')
const updatePswFormRef = ref<SchemaFormInstance>()
const updatePswModel = ref<
  paths['/admin/sys/user/password']['post']['requestBody']['content']['application/json']
>({
  id: '',
  password: '',
  confirmPassword: ''
})
const updatePswForm = ref<
  SchemaForm<
    paths['/admin/sys/user/password']['post']['requestBody']['content']['application/json']
  >
>({
  props: {
    labelSuffix: '：',
    labelWidth: '100px',
    labelPosition: 'left',
    rules: {
      password: passwordComponent.rule,
      confirmPassword: [
        { required: true, message: '请确认密码' },
        {
          validator: (rule, value, cb) => {
            if (value !== updatePswModel.value.password) {
              cb('两次密码不一致')
            }
            cb()
          }
        }
      ]
    }
  },
  formItems: {
    password: {
      props: {
        label: '密码'
      },
      component: passwordComponent.component as VNode
    },
    confirmPassword: {
      props: {
        label: '确认密码'
      },
      component: h(ElInput, { type: 'password', placeholder: '请确认密码', showPassword: true })
    }
  }
})
const handlePsw = (
  user: paths['/admin/sys/user/id']['get']['responses']['200']['content']['application/json']
) => {
  pswDialogShow.value = true
  updatePswModel.value.id = user.id as string
  updatePswUser.value = user.username as string
}
const pswConfirmLoading = ref(false)
const confirmUpdatePassword = async () => {
  try {
    pswConfirmLoading.value = true
    await updatePswFormRef.value?.formRef?.validate()
    await useFetch('/admin/sys/user/password', { immediate: false })
      .post(updatePswModel.value)
      .execute(true)
    ElMessage.success('密码修改成功')
    pswDialogShow.value = false
  } catch (error) {
    console.error(error)
  } finally {
    pswConfirmLoading.value = false
  }
}

const infoDialogShow = ref(false)
const infoConfirmLoading = ref(false)
const updateInfoUser = ref('')
const updateInfoFormRef = ref<SchemaFormInstance>()
const updateInfoModel = ref<
  paths['/admin/sys/user/update']['post']['requestBody']['content']['application/json']
>({})
const updateInfoForm = ref<
  SchemaForm<paths['/admin/sys/user/update']['post']['requestBody']['content']['application/json']>
>({
  props: {
    labelSuffix: '：',
    labelWidth: '100px',
    labelPosition: 'left',
    rules: {
      realname: realnameComponent.rule,
      email: emailComponent.rule,
      phone: phoneComponent.rule,
      status: statusComponent.rule
    }
  },
  formItems: {
    avatar: {
      props: {
        label: avatarComponent.label
      },
      component: avatarComponent.component as VNode
    },
    realname: {
      props: {
        label: realnameComponent.label
      },
      component: realnameComponent.component as VNode
    },
    roleIds: {
      props: {
        label: roleIdsComponent.label
      },
      component: roleIdsComponent.component as VNode
    },
    email: {
      props: {
        label: emailComponent.label
      },
      component: emailComponent.component as VNode
    },
    phone: {
      props: {
        label: phoneComponent.label
      },
      component: phoneComponent.component as VNode
    },
    memberDate: {
      props: {
        label: '会员有效期'
      },
      component: h(ElDatePicker, {
        placeholder: '请选择日期',
        type: 'date',
        clearable: true
      })
    },
    isTrainer: {
      props: {
        label: isTrainerComponent.label
      },
      component: isTrainerComponent.component as VNode
    },
    trainerId: {
      props: {
        label: '教练'
      },
      component: null as unknown as VNode
    },
    status: {
      props: {
        label: statusComponent.label
      },
      component: statusComponent.component as VNode
    }
  }
})
const handleInfo = async (
  user: paths['/admin/sys/user/list']['post']['responses']['200']['content']['application/json'][0]
) => {
  const { data, error } = await useFetch<
    paths['/admin/sys/user/id']['get']['responses']['200']['content']['application/json']
  >(`${api.value.id}?id=${user.id}`).get()
  if (error.value) {
    return
  }
  infoDialogShow.value = true
  updateInfoUser.value = data.value?.username as string
  Object.assign(updateInfoModel.value, omit(data.value, ['username']))
}

const confirmUpdateInfo = async () => {
  try {
    infoConfirmLoading.value = true
    await updateInfoFormRef.value?.formRef?.validate()
    if (updateInfoModel.value.memberDate) {
      updateInfoModel.value.memberDate = dayjs(updateInfoModel.value.memberDate)
        .endOf('D')
        .startOf('s')
        .toISOString()
    }
    await useFetch(api.value.update, { immediate: false }).post(updateInfoModel.value).execute(true)
    ElMessage.success('信息修改成功')
    await schemaTableFormRef.value?.handleSearch()
    await trainerExecute()
    infoDialogShow.value = false
  } catch (error) {
    console.error(error)
  } finally {
    infoConfirmLoading.value = false
  }
}

const { data: roleList, onFetchResponse: onRoleListResponse } = useRoleList()
onRoleListResponse(() => {
  const component = h(
    ElSelect,
    {
      placeholder: '请选择角色',
      multiple: true,
      clearable: true,
      filterable: true
    },
    {
      default: () =>
        roleList.value?.map((item) => {
          return h(ElOption, { value: item.id as string, label: item.name })
        })
    }
  )
  tableForm.value.roleIds!.editForm!.component = component
  updateInfoForm.value.formItems.roleIds!.component = component
})

const {
  data: trainerList,
  onFetchResponse: onTrainerListResponse,
  execute: trainerExecute
} = useFetch<
  paths['/admin/sys/user/list']['post']['responses']['200']['content']['application/json']
>('/admin/sys/user/list').post({ isTrainer: true })

onTrainerListResponse(() => {
  const component = h(
    ElSelect,
    {
      placeholder: '请选择教练',
      clearable: true,
      filterable: true
    },
    {
      default: () =>
        trainerList.value?.map((item) => {
          return h(ElOption, { value: item.id as string, label: item.realname })
        })
    }
  )
  tableForm.value.trainerId!.editForm!.component = component
  tableForm.value.trainerId!.searchForm!.component = component
  updateInfoForm.value.formItems.trainerId!.component = component
  trainerForm.value.formItems.trainerId!.component = component
})

const trainerDialogShow = ref(false)
const trainerModel = ref<
  paths['/admin/sys/user/update/trainer']['post']['requestBody']['content']['application/json']
>({ id: '', trainerId: '' })
const trainerUser = ref('')
const trainerConfirmLoading = ref(false)
const trainerFormRef = ref<SchemaFormInstance>()
const trainerForm = ref<
  SchemaForm<
    paths['/admin/sys/user/update/trainer']['post']['requestBody']['content']['application/json']
  >
>({
  props: {
    labelSuffix: '：',
    labelWidth: '100px',
    labelPosition: 'left'
  },
  formItems: {
    trainerId: {
      props: {
        label: '教练'
      },
      component: null as unknown as VNode
    }
  }
})
const handleTrainer = (
  user: paths['/admin/sys/user/list']['post']['responses']['200']['content']['application/json'][0]
) => {
  trainerDialogShow.value = true
  trainerUser.value = user.username as string
  trainerModel.value.id = user.id as string
  trainerModel.value.trainerId = user.trainer?.id
}
const confirmTrainer = async () => {
  try {
    trainerConfirmLoading.value = true
    await trainerFormRef.value?.formRef?.validate()
    await useFetch('/admin/sys/user/update/trainer', { immediate: false })
      .post(trainerModel.value)
      .execute(true)
    ElMessage.success('教练修改成功')
    trainerDialogShow.value = false
    await schemaTableFormRef.value?.handleSearch()
  } catch (error) {
    console.error(error)
  } finally {
    trainerConfirmLoading.value = false
  }
}
</script>
<style scoped></style>
