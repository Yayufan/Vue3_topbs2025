<!--  -->
<template>

  <section class="emailTemplate-section">
    <el-card class="emailTemplate-card">
      <h1>信件模板管理</h1>

      <!-- 如果要用兩種註冊方式再考慮使用這個 -->
      <div class="function-bar">
        <div class="search-bar">
          <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢" @keydown.enter="" />
        </div>

        <div class="btn-box">

          <el-button type="danger" @click="deleteList" :disabled="deleteSelectList.length > 0 ? false : true">
            刪除
            <el-icon class="el-icon--right">
              <Delete />
            </el-icon>
          </el-button>

          <el-button type="primary" @click="toggleAddDialog">
            新增
            <el-icon class="el-icon--right">
              <Plus />
            </el-icon>
          </el-button>
        </div>


      </div>



      <el-table empty-text="No Data" class="emailTemplate-table" :data="emailTemplateList.records"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="name" label="名稱" width="200" />
        <el-table-column fit prop="description" label="描述" />
        <el-table-column prop="createTime" label="創建時間" width="200" />
        <el-table-column prop="updateTime" label="修改時間" width="200" />

        <el-table-column fixed="right" label="操作" width="150">
          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">
            <el-button link type="success" size="small" @click="sendEmail(scope.row)">
              Send
            </el-button>
            <el-button link type="primary" size="small" @click="editRow(scope.row)">
              Edit
            </el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.row.emailTemplateId)">
              Delete</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block emailTemplate-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(emailTemplateList.pages)"
          :default-page-size="Number(emailTemplateList.size)" v-model:current-page="currentPage"
          :hide-on-single-page="true" />
      </div>



      <!-- 新增對話框 -->
      <ElDialog v-model="dialogFormVisible" title="新增信件模板" width="400">

        <el-form :model="insertEmailTemplateFormData" ref="form" :rules="insertEmailTemplateRules">

          <el-form-item label="名稱" :label-width="formLabelWidth" prop="name">
            <el-input v-model="insertEmailTemplateFormData.name" />
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
            <el-input type="textarea" v-model="insertEmailTemplateFormData.description" />
          </el-form-item>


        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="dialogFormVisible = false">取消</ElButton>
            <ElButton type="primary" @click="submitInsertForm(form)">
              建立
            </ElButton>
          </div>
        </template>

      </ElDialog>




    </el-card>

  </section>

</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

import { getEmailTemplateApi, getAllEmailTemplateApi, getEmailTemplateByPaginationApi, addEmailTemplateApi, updateEmailTemplateApi, deleteEmailTemplateApi, batchDeleteEmailTemplateApi } from '@/api/emailTemplate'


//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '70px'
//查詢內容
let input = ref('')


/**--------------顯示數據相關---------------------------- */

//設定分頁組件,currentPage當前頁數
let currentPage = ref(1)

//獲取信件模板List
let emailTemplateList = reactive<Record<string, any>>({
})



const getEmailTemplateByPagination = async (page: number, size: number) => {
  let res = await getEmailTemplateByPaginationApi(page, size)
  Object.assign(emailTemplateList, res.data)
  console.log(emailTemplateList)
}



/** --------- 刪除相關variable及function -------------- */

//要刪除的對象列表
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}

//刪除同意書
const deleteRow = (id: number): void => {
  ElMessageBox.confirm(`確定要刪除此資料嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    // await deleteEmailTemplateApi(id)
    // getEmailTemplateByPagination(currentPage.value, 10)

    ElMessage.success('刪除成功');
  }).catch((err) => {
    console.log(err)
  });
}

//批量刪除同意書的function
const deleteList = () => {
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}個同意書嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      console.log(deleteSelectList)
      let deleteIdList = deleteSelectList.map((item: { emailTemplateId: string }) => item.emailTemplateId)
      // await batchDeleteEmailTemplateApi(deleteIdList)
      // getEmailTemplateByPagination(currentPage.value, 10)
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
const insertEmailTemplateFormData = reactive({
  name: '',
  description: '',
})

//表單校驗規則
const insertEmailTemplateRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '名稱不能為空',
      trigger: 'blur',
    }
  ],


})

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
  console.log('觸發', dialogFormVisible.value)
}

//送出表單方法
const submitInsertForm = (form: FormInstance | undefined) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        //呼叫父組件給的新增function API
        let res = await addEmailTemplateApi(insertEmailTemplateFormData)
        ElMessage.success('新增成功');
        router.push(`${route.fullPath}/${res.data}`)

      } catch (err: any) {
        console.log(err)
      }
    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}

/**------------編輯內容相關操作---------------------- */

//跳轉到編輯信件頁面
const editRow = (row: any): void => {
  console.log(row)
  router.push(`${route.fullPath}/${row.emailTemplateId}`)
}


/**-------------------寄信-------------------- */

const sendEmail = (row: any): void => {
  console.log(row)
  router.push(`${route.fullPath}/${'email-send'}/${row.emailTemplateId}`)
}

/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  getEmailTemplateByPagination(1, 10)
})


</script>

<style scoped lang="scss">
.emailTemplate-section {
  width: 95%;
  margin: 0 auto;

  .emailTemplate-card {
    margin-top: 2%;
    margin-bottom: 2%;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin: 1% 0;
  }
}




.function-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1%;

  .total-count {
    font-weight: 600;
  }

}

.filter-status {
  margin-left: 10px;
}


.emailTemplate-table {
  width: 100%;
  height: auto;
}


.emailTemplate-pagination {
  margin-top: 1%;
  margin-bottom: 1%;
}

.gender-other {
  width: 100px;
  margin-left: 1rem;
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
