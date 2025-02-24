<!--  -->
<template>

  <section class="file-section">
    <el-card class="file-card">
      <h1>器捐會刊-檔案管理</h1>
      <FileCenter :table="fileList" :getApi="getFile" :addApi="addFile" :deleteApi="deleteFile"
        :batchDeleteApi="batchDeleteFile" :group="GROUP" :typeOption="typeOption">
      </FileCenter>
    </el-card>

  </section>

</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import FileCenter from '@/components/FileCenter/index.vue'
import { getAllFileByGroupByPaginationApi, addFileApi, deleteFileApi, batchDeleteFileApi } from '@/api/fileCenter'
import { transFormPaginationByFileCenter } from '@/utils/transFormData'

//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()

//設定file_group 
const GROUP = "journalFile"


//後端獲取Page資料後要傳給子組件的數據
let fileList = reactive({})
//子類別選項
let typeOption = reactive(["無"])

//獲取最新消息
const getFile = async (page: number, size: number) => {
  let res = await getAllFileByGroupByPaginationApi(GROUP, page, size)
  console.log("這是響應值", res)
  let transData = transFormPaginationByFileCenter(res.data, "fileId")
  Object.assign(fileList, transData)
  console.log('這是轉換後的數據', fileList)
}

//新增最新消息
const addFile = async (data: any) => {
  console.log('子組件傳來的data', data)
  let res = await addFileApi(data)
  console.log(res)
  getFile(1, 10)
}

//刪除最新消息
const deleteFile = async (id: number) => {
  await deleteFileApi(id)
  getFile(1, 10)
}

//批量刪除最新消息
const batchDeleteFile = async (data: any) => {
  await batchDeleteFileApi(data)
  getFile(1, 10)
}

//頁面掛載時獲取數據
onMounted(() => {
  getFile(1, 10)
})

</script>

<style scoped lang="scss">
.file-section {
  width: 95%;
  margin: 0 auto;

  .file-card {
    margin-top: 2%;
    margin-bottom: 2%;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin: 1% 0;
  }
}
</style>
