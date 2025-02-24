<!--  -->
<template>
  <div class="article-attachment-box">
    <el-table empty-text="No Data" :data="tableData" style="width: 100%" max-height="250">
      <el-table-column prop="name" label="檔案名稱" width="200" />
      <el-table-column prop="type" label="檔案類型" width="200" />
      <el-table-column prop="createTime" label="創建時間" />

      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <a :href="protocol + '//' + hostname + '/minio' + scope.row.path" target="_blank" style="margin-right: 12px;">
            <el-button link type="primary" size="small">
              預覽
            </el-button>
          </a>
          <el-button link type="danger" size="small" @click.prevent="deleteAttachment(scope.row)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="add-attachment-btn" type="primary" plain @click="toggleAddDialog">
      新增附件
    </el-button>

    <!-- 創建活動對話框 -->
    <ElDialog v-model="dialogFormVisible" title="新增附件" width="500">

      <el-text class="mx-1" type="danger">注意!!! 點擊 <span style="font-weight: bold">'建立'</span> 檔案上傳會直接完成 </el-text>
      <br><br>

      <el-form :model="articleAttachmentFormData" ref="form" :rules="articleAttachmentRules" label-position="top">

        <el-form-item label="檔案名稱" :label-width="formLabelWidth" prop="name">
          <el-input v-model="articleAttachmentFormData.name" autocomplete="off" placeholder="" />
        </el-form-item>

        <el-form-item :label="'檔案上傳(單個檔案不超過10MB)'" :label-width="formLabelWidth">

          <el-upload :on-change="handleChange" v-model:file-list="fileList" class="thumbnail-uploader"
            :action="envAPI + '/upload/img'" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <el-button type="primary">上傳檔案</el-button>
            <template #tip>

            </template>
          </el-upload>

        </el-form-item>

      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="backAndClearFileList">取消</ElButton>
          <ElButton type="primary" @click="addAttachment(form)">
            建立
          </ElButton>
        </div>
      </template>
    </ElDialog>





  </div>

</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { type FormInstance, type FormRules, type UploadRawFile, UploadUserFile, type UploadProps, ElMessage, ElMessageBox } from 'element-plus'


/**--------------------Prop相關------------------------- */

// 定義 props 接收articleId
const props = defineProps({
  articleId: {
    type: String,
    required: true
  },
  getApi: {
    type: Function,
    required: true,
  },
  addApi: {
    type: Function,
    required: true,
  },
  deleteApi: {
    type: Function,
    required: true,
  },
})

console.log("父組件傳來的articleId: ", props.articleId)

/**-----------------------Table功能相關-------------------------------------- */
const tableData = reactive<Record<string, any>[]>([])

const getData = async () => {
  let res = await props.getApi(props.articleId);
  console.log("獲得的響應 ", res)

  //如果列表不為空
  if (res.data.length > 0) {
    //先清空
    tableData.length = 0
    //在賦值
    Object.assign(tableData, res.data)
  } else {
    tableData.length = 0
  }

}


//是否顯示表單dialog
const dialogFormVisible = ref(false)

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}

const deleteAttachment = (row: any) => {

  ElMessageBox.confirm(`確定要刪除此附件嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 使用父組件的刪除API
    await props.deleteApi(row.articleAttachmentId)

    //並且重新獲取檔案列表
    getData()

    ElMessage.success("刪除成功")

  }).catch((err) => {
    // 用户選擇取消，中止上傳操作
    console.log(err)
  });


}


/**----------------圖片顯示相關------------------- */
const protocol = window.location.protocol; // 获取当前协议 (例如 "http:" 或 "https:")
const hostname = window.location.hostname; // 获取当前域名 (例如 "www.example.com")
const envAPI = import.meta.env.VITE_APP_BASE_API;


/**----------------檔案上傳相關-------------------- */

//圖片實際數據
let imgFile = <UploadRawFile>{}

const fileList = ref<UploadUserFile[]>([

])


//檔案上傳成功的回調
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // console.log(uploadFile)
  //將檔案傳給接收圖片的數據
  imgFile = uploadFile.raw!
  articleAttachmentFormData.type = imgFile.type

  console.log("當前檔案: ", imgFile)
  console.log("當前表單 ", articleAttachmentFormData)
}

//檔案上傳前的回調
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('File Size can not exceed 10MB!')
    return false
  }
  return true
}

//控制檔案列表的呈現
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  //只保留最新的三個檔案
  // fileList.value = fileList.value.slice(-3)

  //只保留最新的檔案
  fileList.value = [uploadFile]

}


/**------------------Dialog表單相關-------------------------------- */

//表單實例
const form = ref()

//formLabel 寬度
const formLabelWidth = '140px'

//表單數據
const articleAttachmentFormData = reactive({
  articleId: '',
  name: '',
  type: ''
})

//獲取父組件傳的articleId
articleAttachmentFormData.articleId = props.articleId

//表單校驗規則
const articleAttachmentRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '名稱不能為空',
      trigger: 'blur',
    },
  ],

})



/**
 * 返回
 */

const backAndClearFileList = () => {
  //清理檔案列表
  fileList.value.length = 0

  //重製上傳的檔案
  imgFile = <UploadRawFile>{}

  //重製檔名
  articleAttachmentFormData.name = ""

  //關閉dialog
  dialogFormVisible.value = false

}

/**
 * 送出表單方法
 */
const addAttachment = (form: FormInstance | undefined) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        let formData = new FormData()
        // 將響應式對象轉換為普通對象，然後轉換為 JSON 字符串
        const jsonData = JSON.stringify(articleAttachmentFormData)
        formData.append('data', jsonData)
        formData.append('file', imgFile)

        // //呼叫父組件的新增API
        await props.addApi(formData)

        //重製表單
        form.resetFields()
        //重製上傳的檔案
        imgFile = <UploadRawFile>{}

        ElMessage.success("上傳成功")

      } catch (err: any) {
        console.log(err)
      }

      //最終都將這個dialog關掉
      dialogFormVisible.value = false

      //並將檔案列表清零
      fileList.value.length = 0

      //並且重新獲取檔案列表
      getData()

    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}


//頁面加載時使用
onMounted(() => {
  getData()
})

</script>

<style scoped lang="scss">
.article-attachment-box {
  margin: 2% 0;

  .add-attachment-btn {
    width: 100%;
  }
}
</style>
