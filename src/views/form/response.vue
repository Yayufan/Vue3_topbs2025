<template>
  <section class="file-section">
    <el-card class="file-card">
      <h1>回覆管理</h1>
      <div class="function-bar">
        <el-button type="info" @click="back">
          返回表單頁
        </el-button>
        <el-button type="success" @click="downloadExcel">
          下載表單回覆
        </el-button>
      </div>

      <el-table class="no-img-article-table" :data="responseList.records" empty-text="No Data">

        <el-table-column label="編號" min-width="40">
          <template #default="scope">
            <div>{{ scope.$index + 1 }}
            </div>
          </template>
        </el-table-column>


        <!-- 動態前三個問題欄位 -->
        <el-table-column v-for="question in topThreeQuestions" :key="question.formFieldId" :label="question.label"
          min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            {{ getAnswer(row, question.formFieldId) || '—' }}
          </template>
        </el-table-column>

        <el-table-column>
          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">

            <div style="display: flex;align-items: center;">

              <el-button link type="primary" size="small" @click="editRow(scope.row)">
                修改
              </el-button>
              <el-button link type="danger" size="small" @click="deleteRow(scope.row.formResponseId, scope.row.title)">
                刪除
              </el-button>

            </div>
          </template>

        </el-table-column>
      </el-table>


      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block no-img-article-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(responseList.pages)"
          :default-page-size="Number(responseList.size)" v-model:current-page="currentPage"
          :hide-on-single-page="true" />
      </div>


    </el-card>

  </section>


</template>

<script setup lang='ts'>

import { ref, reactive, computed, watch } from 'vue'
import { More, Delete, Plus } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type UploadRawFile, type UploadProps, ElMessageBox, ElMessage, UploadUserFile } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { fetchResponsePageApi, deleteResponseApi, downloadExcelApi } from "@/api/formResponse"

const envAPI = import.meta.env.VITE_APP_BASE_API;
//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'

/** ---------------- 從路由中取出 formId 參數 --------------------------*/
const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
});

//顯示表單dialog變量
const dialogFormVisible = ref(false)

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}


/** --------------- 表單API功能封裝 ----------------- */

const getResponsePage = async (page: number, size: number, formId: string) => {
  let responsePage = await fetchResponsePageApi(page, size, formId);
  Object.assign(responseList, responsePage.data)
  console.log(responseList)
}

// ★ 這就是使用 computed() 定義的前三個問題標題
const topThreeQuestions = computed(() => {
  if (!responseList.records?.length) return []

  const first = responseList.records[0]
  if (!first?.formFields?.length) return []

  return [...first.formFields]
    .sort((a, b) => a.fieldOrder - b.fieldOrder)
    .slice(0, 4)
    .map(field => ({
      label: field.label,
      formFieldId: field.formFieldId
    }))
})

// 取得答案的函式
const getAnswer = (row: any, formFieldId: string) => {
  if (!row?.formFields) return null
  const field = row.formFields.find((f: any) => f.formFieldId === formFieldId)
  return field?.answer?.answerValue ?? null
}


/** --------------- 表單回覆操作 --------------------------*/

/**
 * 返回表單頁
 */
const back = () => {
  router.push("/form")
}

/**
 * 下載表單回覆Excel
 */
const downloadExcel = async () => {
  ElMessage.success("正在準備下載")
  try {
    let res = await downloadExcelApi(props.formId)
    if (res.data !== null) {
      const url = envAPI + res.data
      // 開新分頁避免當前頁面跳走
      window.open(url, '_blank')
    }
  } catch (err) {
    ElMessage.error("下載失敗，請稍後再試")
    console.error(err)
  }

}


/**
 * 編輯表單
 * @param id 
 */
const editRow = (row: any): void => {

  //response/:responseId
  // 跳轉至可編輯的表單回覆頁面
  router.push({
    name: "EditResponse",
    params: {
      responseId: row.formResponseId,
    }
  })

}

/**
 * 刪除表單回覆
 * @param id 
 * @param title 
 */
const deleteRow = (id: string, title: string): void => {
  ElMessageBox.confirm(`確定要刪除此表單回覆嗎？ `, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await deleteResponseApi(id)

    ElMessage.success('刪除成功');
    // 重新獲取資料
    getResponsePage(currentPage.value, 10, props.formId)

  }).catch((err) => {
    console.log(err)
  });
}


/**--------------顯示數據相關---------------------------- */

//分頁組件， 從查詢參數中獲取初始值从查询参数中獲取初始值
let currentPage = ref<number>(parseInt(route.query.page as string) || 1);

//獲取的最新表單回覆List
let responseList = reactive<Record<string, any>>({})


//更新URL會帶動頁面更新,
const updateURL = (page: number, size: number) => {
  router.push({ query: { ...route.query, page, size } })
}

//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  let pageSize = ref<number>(parseInt(route.query.size as string) || 10);
  updateURL(value, pageSize.value)
})



// 掛載時讀取
onMounted(() => {
  getResponsePage(currentPage.value, 10, props.formId)
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

.thumbnail-uploader {
  width: 100%;
}

.avatar-uploader {
  position: relative;
  width: 40%;
  aspect-ratio: 1 / 1;
  margin-inline: auto;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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