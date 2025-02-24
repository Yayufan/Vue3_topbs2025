<!--  -->
<template>

  <div class="function-bar">
    <el-button type="primary" @click="toggleAddDialog">
      新增文章<el-icon class="el-icon--right">
        <Plus />
      </el-icon>
    </el-button>

    <el-button type="danger" @click="deleteList" :disabled="deleteSelectList.length > 0 ? false : true">
      刪除文章<el-icon class="el-icon--right">
        <Delete />
      </el-icon>
    </el-button>
  </div>

  <el-table class="article-table" :data="articleList.records" @selection-change="handleSelectionChange"
    max-height="1200" empty-text="Empty">
    <el-table-column type="selection" width="55" />

    <el-table-column fixed label="縮圖" width="150">
      <template #default="scope">
        <div class="demo-image__preview">
          <el-image style="width: 100px; height: 100px" loading="lazy"
            :src="protocol + '//' + hostname + '/minio' + scope.row.coverThumbnailUrl" fit="fill" />
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="type" label="類別" width="120" />
    <el-table-column prop="title" label="標題" min-width="200" />
    <el-table-column prop="description" label="描述" min-width="120" />

    <el-table-column fixed="right" label="操作" width="120">
      <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
      <template #default="scope">
        <el-button link type="primary" size="small" @click="editRow(scope.row.id)">
          Edit
        </el-button>
        <el-button link type="danger" size="small" @click="deleteRow(scope.row.id, scope.row.title)">
          Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
  <div class="example-pagination-block article-pagination">
    <el-pagination layout="prev, pager, next" :page-count="Number(articleList.pages)"
      :default-page-size="Number(articleList.size)" v-model:current-page="currentPage" :hide-on-single-page="true" />
  </div>



  <!-- 創建活動對話框 -->
  <ElDialog v-model="dialogFormVisible" title="創建文章" width="500">

    <el-form :model="articleFormData" ref="form" :rules="articleRules" label-position="top">

      <el-form-item label="文章類別" :label-width="formLabelWidth" prop="type">
        <el-input v-model="articleFormData.type" autocomplete="off" placeholder="一般公告" />
      </el-form-item>

      <el-form-item label="文章標題" :label-width="formLabelWidth" prop="title">
        <el-input v-model="articleFormData.title" autocomplete="off" />
      </el-form-item>

      <el-form-item label="文章描述" :label-width="formLabelWidth" prop="description">
        <el-input type="textarea" v-model="articleFormData.description" autocomplete="off" />
      </el-form-item>

      <el-form-item :label="'縮圖上傳(建議解析度 800*600)'" :label-width="formLabelWidth">

        <el-upload class="thumbnail-uploader" :action="envAPI + '/upload/img'" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>

      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogFormVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submitForm(form)">
          建立
        </ElButton>
      </div>
    </template>
  </ElDialog>


</template>

<script setup lang='ts'>

import { ref, reactive, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type UploadRawFile, type UploadProps, ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';

//獲取父組件傳來的variable 和 funciton
const props = defineProps({
  table: {
    type: Object, // 假設 table 是一個數據數組
    required: true,
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
  batchDeleteApi: {
    type: Function,
    required: true,
  },
  group: {
    type: String,
    required: true
  }
});

//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()


/**----------------圖片顯示相關------------------- */
const protocol = window.location.protocol; // 获取当前协议 (例如 "http:" 或 "https:")
const hostname = window.location.hostname; // 获取当前域名 (例如 "www.example.com")

const envAPI = import.meta.env.VITE_APP_BASE_API;


/** ---------------- 一般資料顯示 --------------------- */

//分頁組件， 從查詢參數中獲取初始值从查询参数中獲取初始值
let currentPage = ref<number>(parseInt(route.query.page as string) || 1);


//獲取的文章List初始化
let articleList = reactive<Record<string, any>>({})
//獲取父組件給的資料並賦值
articleList = props.table

//更新URL會帶動頁面更新,
const updateURL = (page: number, size: number) => {
  router.push({ query: { ...route.query, page, size } })
}

//如果父組件的資料為異步傳遞就使用watch
watch(() => { return props.table }, (newValue, oldValue) => {
  articleList = newValue
})

//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  let pageSize = ref<number>(parseInt(route.query.size as string) || 10);
  updateURL(value, pageSize.value)
})

/** -----------------表單相關-------------------- */
//formLabel 寬度
const formLabelWidth = '140px'

//暫存檔案路徑
const imageUrl = ref()
//圖片實際數據
let imgFile = <UploadRawFile>{}

//檔案上傳成功的回調
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // console.log(response)
  // console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  //將檔案傳給接收圖片的數據
  imgFile = uploadFile.raw!
}

//檔案上傳前的回調
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//是否顯示表單dialog
const dialogFormVisible = ref(false)

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}

//表單實例
const form = ref()

//表單數據
const articleFormData = reactive({
  type: '',
  title: '',
  description: null,
  groupType: ''
})

articleFormData.groupType = props.group

//表單校驗規則
const articleRules = reactive<FormRules>({
  type: [
    {
      required: true,
      message: '類型不能為空',
      trigger: 'blur',
    },
  ],
  title: [
    {
      required: true,
      message: '標題不能為空',
      trigger: 'blur',
    },
    {
      max: 255,
      message: '內容長度不能超過 255 字符',
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: true,
      message: '描述不能為空',
      trigger: 'blur',
    },
    {
      max: 255,
      message: '內容長度不能超過 255 字符',
      trigger: 'blur'
    }
  ]
})

/**
 * 送出表單方法
 */
const submitForm = (form: FormInstance | undefined) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        let formData = new FormData()
        // 將響應式對象轉換為普通對象，然後轉換為 JSON 字符串
        const jsonData = JSON.stringify(articleFormData)
        formData.append('data', new Blob([jsonData], { type: "application/json" }))
        formData.append('file', imgFile)

        // //呼叫父組件的新增API
        await props.addApi(formData)
        //重製表單
        form.resetFields()
        //重製上傳的檔案
        imgFile = <UploadRawFile>{}
        //也將回顯的圖片url給重製
        imageUrl.value = ""

        ElMessage.success("創建成功")

      } catch (err: any) {
        console.log(err)
      }

      //最終都將這個dialog關掉
      dialogFormVisible.value = false

    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}


/** -----------------刪除相關操作-----------------  */

//要刪除的對象列表
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}


//刪除醫學新知
const deleteRow = (id: number, title: string): void => {

  ElMessageBox.confirm(`確定要刪除此文章嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 使用父組件的API
    await props.deleteApi(id)
    ElMessage.success("刪除成功")

  }).catch((err) => {
    // 用户選擇取消，中止上傳操作
    console.log(err)
  });
}

//批量刪除醫學新知的function
const deleteList = () => {
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}篇文章嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //使用父組件的API
      let deleteIdList = deleteSelectList.map((item: { id: string }) => item.id)
      await props.batchDeleteApi(deleteIdList)
      ElMessage.success("刪除成功")
    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}

/**-----------編輯相關操作------------------ */
//編輯醫學新知
const editRow = (id: number): void => {
  const currentPath = route.path
  const query = route.query

  router.push({
    path: currentPath + '/' + id, // 目標路徑
    query: query, // 帶上當前的查詢參數
  })

}


</script>

<style scoped lang="scss">
/**
功能欄置右
*/
.function-bar {
  text-align: right;
  margin-bottom: 1%;
}

/**
  使用Vue3 element plus 專屬的改變UI組件CSS 寫法 '深層覆蓋'
  分頁組件引入盒子,重置分頁組件CSS */
:deep(.el-pagination) {

  /**將分頁組件置中 */
  justify-content: center;

  //重製將分頁組件背景色調為 '無'
  .el-pager li {
    background: none !important;
  }

  //按鈕背景色改成 '無'
  button {
    background: none !important;
  }

  &+& {
    margin-top: 10px;
  }

  .example-demonstration {
    margin-bottom: 16px;
  }

}

.article-pagination {
  margin-top: 1%;
  margin-bottom: 1%;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.thumbnail-uploader {
  .avatar {
    width: 100%;
    // height: 178px;
    display: block;
  }

  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

}
</style>
