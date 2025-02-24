<!-- -->
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


  <el-table class="no-img-article-table" :data="noImgArticleList.records" @selection-change="handleSelectionChange"
    empty-text="No Data">
    <el-table-column type="selection" width="55" />
    <!-- <el-table-column fixed prop="announcementDate" label="公告日期" width="150" /> -->
    <el-table-column prop="type" label="類別" width="120" />
    <el-table-column prop="title" label="標題" min-width="120" />

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
  <div class="example-pagination-block no-img-article-pagination">
    <el-pagination layout="prev, pager, next" :page-count="Number(noImgArticleList.pages)"
      :default-page-size="Number(noImgArticleList.size)" v-model:current-page="currentPage"
      :hide-on-single-page="true" />
  </div>



  <!-- 創建活動對話框 -->
  <ElDialog v-model="dialogFormVisible" title="創建文章" width="500">

    <el-form :model="noImgArticleFormData" ref="form" :rules="noImgArticleRules">

      <el-form-item label="文章類別" :label-width="formLabelWidth" prop="type">
        <el-input v-model="noImgArticleFormData.type" autocomplete="off" placeholder="一般公告" />
      </el-form-item>

      <el-form-item label="文章標題" :label-width="formLabelWidth" prop="title">
        <el-input v-model="noImgArticleFormData.title" autocomplete="off" />
      </el-form-item>

      <el-form-item label="文章描述" :label-width="formLabelWidth" prop="description">
        <el-input type="textarea" v-model="noImgArticleFormData.description" autocomplete="off" />
      </el-form-item>

      <!-- <el-form-item label="公告日期" :label-width="formLabelWidth" prop="announcementDate">
        <el-date-picker v-model="noImgArticleFormData.announcementDate" type="date" placeholder="Pick a Date"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </el-form-item> -->

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

import { ref, reactive, computed, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type UploadRawFile, type UploadProps, ElMessageBox, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';

//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'


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


//如果父組件的資料為異步傳遞就使用watch
watch(() => { return props.table }, (newValue, oldValue) => {
  noImgArticleList = newValue
})

/**--------------顯示數據相關---------------------------- */

//分頁組件， 從查詢參數中獲取初始值从查询参数中獲取初始值
// console.log(route)
let currentPage = ref<number>(parseInt(route.query.page as string) || 1);

//獲取的最新消息List
let noImgArticleList = reactive<Record<string, any>>({})
noImgArticleList = props.table


//更新URL會帶動頁面更新,
const updateURL = (page: number, size: number) => {
  router.push({ query: { ...route.query, page, size } })
}

//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  // console.log("當前頁為 ", value)
  let pageSize = ref<number>(parseInt(route.query.size as string) || 10);
  updateURL(value, pageSize.value)
})


/** --------- 刪除相關variable及function -------------- */

//要刪除的對象列表
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}

//刪除最新消息
const deleteRow = (id: number, title: string): void => {
  ElMessageBox.confirm(`確定要刪除此消息嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await props.deleteApi(id)
    ElMessage.success('刪除成功');
  }).catch((err) => {
    console.log(err)
  });
}

//批量刪除最新消息的function
const deleteList = () => {
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}個消息嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      let deleteIdList = deleteSelectList.map((item: { id: string }) => item.id)
      await props.batchDeleteApi(deleteIdList)
      ElMessage.success('刪除成功');
    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}

/**-------------表單相關variable及function------------------------- */
//是否顯示表單dialog
const dialogFormVisible = ref(false)

//表單實例
const form = ref()

//表單數據
const noImgArticleFormData = reactive({
  type: '一般公告',
  title: '',
  description: null,
  // announcementDate: '',
  groupType: ''
})
//獲取父組件給的group
noImgArticleFormData.groupType = props.group

//表單校驗規則
const noImgArticleRules = reactive<FormRules>({
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
  // announcementDate: [
  //   {
  //     required: true,
  //     message: '公告日期不能為空',
  //     trigger: 'blur',
  //   }
  // ],
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

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}

//送出表單方法
const submitForm = (form: FormInstance | undefined) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        let formData = new FormData()
        // 將響應式對象轉換為普通對象，然後轉換為 JSON 字符串
        const jsonData = JSON.stringify(noImgArticleFormData)
        formData.append('data', new Blob([jsonData], { type: "application/json" }))

        //呼叫父組件給的新增function API
        await props.addApi(formData)
        ElMessage.success('新增成功');
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


/**------------編輯內容相關操作---------------------- */
//編輯最新消息
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
.function-bar {
  text-align: right;
  margin-bottom: 1%;
}

.no-img-article-table {
  width: 100%;
  height: auto;
}


.no-img-article-pagination {
  margin-top: 1%;
  margin-bottom: 1%;
}

/**
  使用Vue3 element plus 專屬的改變UI組件CSS 寫法 '深層覆蓋'
  分頁組件引入盒子,重置分頁組件CSS */
:deep(.el-pagination) {

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
</style>