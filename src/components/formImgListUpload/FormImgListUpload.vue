<template>
  <el-upload
    v-bind="props.uploadProps"
    :disabled="props.disabled"
    v-model:file-list="fileList"
    list-type="picture-card"
    @success="handleSuccess"
    @preview="handlePreview"
    @remove="handleRemove"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog
    v-model="dialogVisible"
    :fullscreen="['xs', 'sm', 'md'].includes(useSystem().breakpoints)"
  >
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup lang="ts">
import type { Awaitable } from '@vueuse/core'
import type {
  UploadUserFile,
  UploadRawFile,
  UploadFile,
  UploadFiles,
  UploadProgressEvent,
  UploadRequestOptions
} from 'element-plus'
import { computed, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useSystem } from '@/stores/useSystem'

const props = defineProps<{
  disabled?: boolean
  uploadProps?: {
    action: string
    headers?: Record<string, string>
    method?: string
    multiple?: boolean
    data?:
      | Record<string, any>
      | Awaitable<Record<string, any>>
      | ((rawFile: UploadRawFile) => Awaitable<Record<string, any>>)
    name: string
    'with-credentials'?: boolean
    'show-file-list'?: boolean
    drag?: boolean
    accept?: string
    crossorigin?: '' | 'anonymous' | 'use-credentials'
    'on-preview'?: (uploadFile: UploadFile) => void
    'on-remove'?: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    'on-error'?: (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    'on-progress'?: (
      evt: UploadProgressEvent,
      uploadFile: UploadFile,
      uploadFiles: UploadFiles
    ) => void
    'on-exceed'?: (files: File[], uploadFiles: UploadUserFile[]) => void
    'before-upload'?: (
      rawFile: UploadRawFile
    ) => Awaitable<void | undefined | null | boolean | File | Blob>
    'before-remove'?: (uploadFile: UploadFile, uploadFiles: UploadFiles) => Awaitable<boolean>
    'list-type'?: 'text' | 'picture' | 'picture-card'
    'auto-upload'?: boolean
    'http-request'?: (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>
    'on-handle-delete'?: (imageName?: string) => void
  }
}>()

const imgList = defineModel<string[]>({ required: false })

const fileList = computed({
  get() {
    let fileList = []
    if (imgList.value?.length) {
      for (const item of imgList.value) {
        fileList.push({
          name: item,
          url: `${import.meta.env.VITE_UPLOAD_URL}/${item}`
        } as UploadFile)
      }
    }
    return fileList
  },
  set() {}
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (file: UploadFile) => {
  const index = imgList.value!.indexOf(file.name)
  imgList.value!.splice(index as number, 1)
}

const handlePreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleSuccess = (res: any) => {
  imgList.value?.push(res.data)
}
</script>

<style scoped></style>
