<template>
  <section class="file-section">
    <el-card class="file-card">
      <h1>回覆管理</h1>

      <div class="function-bar">
        <el-button type="primary" @click="createForm()">
          新增表單<el-icon class="el-icon--right">
            <Plus />
          </el-icon>
        </el-button>
      </div>


      <el-table class="no-img-article-table" :data="formList.records" empty-text="No Data">
        <el-table-column prop="title" label="名稱" min-width="120" />
        <el-table-column prop="description" label="描述" min-width="120" />
        <el-table-column prop="status" label="發佈狀態" width="200" />

        <el-table-column fixed="right" label="操作" width="150">


          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">

            <div style="display: flex;align-items: center;">

              <el-button link type="primary" size="small" @click="editRow(scope.row)">
                修改
              </el-button>
              <el-button link type="danger" size="small" @click="deleteRow(scope.row.formId, scope.row.title)">
                刪除
              </el-button>
              <el-dropdown type="info" trigger="click">
                <template #default>
                  <More style="width: 16px; margin-left: 12px;"></More>
                </template>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="jumpToFormField(scope.row.formId)">表單欄位</el-dropdown-item>
                    <el-dropdown-item @click="jumpToFormResponse(scope.row.formId)">表單回覆</el-dropdown-item>
                    <el-dropdown-item @click="copyFillLink(scope.row.formId, scope.row.status)">複製連結</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>

        </el-table-column>
      </el-table>


      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block no-img-article-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(formList.pages)"
          :default-page-size="Number(formList.size)" v-model:current-page="currentPage" :hide-on-single-page="true" />
      </div>



      <!-- 創建活動對話框 -->
      <ElDialog v-model="dialogFormVisible" title="表單資訊" width="500">

        <el-form :model="formInfoData" ref="form" :rules="formInfoRules" label-position="top">

          <el-form-item label="開放填寫時間 (可不填)" prop="startTime">
            <el-date-picker v-model="datetimeRange" type="datetimerange" range-separator="To"
              value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="Start date" end-placeholder="End date"
              :change="timeChanger()" />
          </el-form-item>

          <el-form-item label="名稱" prop="title">
            <el-input v-model="formInfoData.title" autocomplete="off" />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="formInfoData.description" autocomplete="off" />
          </el-form-item>

          <el-form-item v-if="Boolean(formInfoData.formId)" label="發佈狀態" prop="status">
            <el-select v-model="formInfoData.status" placeholder="Select">
              <el-option key="draft" value="draft" />
              <el-option key="published" value="published" />
              <el-option key="closed" value="closed" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否綁定登入狀態">
            <el-radio-group v-model="formInfoData.requireLogin">
              <el-radio :value=1 border>是</el-radio>
              <el-radio :value=0 border>否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否為會後表單 (僅能有一份 會後/簽退 表單)">
            <el-radio-group v-model="formInfoData.requiredForCheckout">
              <el-radio :value=1 border>是</el-radio>
              <el-radio :value=0 border>否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否允許多次填寫">
            <el-radio-group v-model="formInfoData.allowMultipleSubmissions">
              <el-radio :value=1 border>是</el-radio>
              <el-radio :value=0 border>否</el-radio>
            </el-radio-group>
          </el-form-item>


        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="dialogFormVisible = false">取消</ElButton>
            <ElButton type="primary" @click="sumbitForm(form)">
              儲存
            </ElButton>
          </div>
        </template>
      </ElDialog>

    </el-card>

  </section>


</template>

<script setup lang='ts'>

import { ref, reactive, computed, watch } from 'vue'
import { More, Delete, Plus } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, type UploadRawFile, type UploadProps, ElMessageBox, ElMessage, UploadUserFile } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { getFormApi, fetchFormPageByQueryApi, addFormApi, updateFormApi, deleteFormApi } from "@/api/form"

const envAPI = import.meta.env.VITE_APP_BASE_API;
//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'

//顯示表單dialog變量
const dialogFormVisible = ref(false)

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}


/** --------------- 表單API功能封裝 ----------------- */

const getFormPage = async (page: number, size: number, formStatus?: string, queryText?: string) => {
  let formPage = await fetchFormPageByQueryApi(page, size, formStatus, queryText);
  Object.assign(formList, formPage.data)
}


/** --------------- 表單操作 --------------------------*/

const createForm = () => {
  // 1.初始化基本資訊 
  Object.assign(formInfoData, initFormInfo())
  // 2.初始化日期範圍
  datetimeRange.value = []
  // 3.顯示創建Dialog
  toggleAddDialog()

}

/**
 * 跳轉到表單欄位設置
 * @param id 
 */
const jumpToFormField = (id: string) => {
  router.push({
    name: "FormFieldEditor",
    params: {
      formId: id,
    }
  })
}

/**
 * 跳轉到表單響應
 * @param id 
 */
const jumpToFormResponse = (id: string) => {
  const currentPath = route.fullPath
  router.push(currentPath + '/' + id)
}

/**
 * 將表單填寫連結,複製到剪貼簿
 * @param id 
 * @param status 
 */
const copyFillLink = async (id: string, status: string) => {

  if (status !== 'published') {
    ElMessage.error("表單尚未處於發布狀態，無法複製連結")
    return
  }

  const url = new URL(`form/${id}`, import.meta.env.VITE_DOMAIN).toString()
  await navigator.clipboard.writeText(url)
  ElMessage.success("複製連結成功")
}

/**
 * 編輯表單
 * @param id 
 */
const editRow = (row: any): void => {
  console.log("傳入資料: ", row)
  Object.assign(formInfoData, row)
  datetimeRange.value =
    row.startTime && row.endTime
      ? [row.startTime, row.endTime]
      : []
  toggleAddDialog()

}

/**
 * 刪除表單
 * @param id 
 * @param title 
 */
const deleteRow = (id: string, title: string): void => {
  ElMessageBox.confirm(`確定要刪除此表單嗎？ 所有回覆也將一併刪除`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await deleteFormApi(id)

    ElMessage.success('刪除成功');
    // 重新獲取資料
    getFormPage(1, 10)

  }).catch((err) => {
    console.log(err)
  });
}

/** --------------- 表單時間range ------------------- */

// 日期範圍變量
let datetimeRange = ref<[string, string] | []>([]);

// datetime component 監聽器使用的function
const timeChanger = () => {

  // 如果有時間則賦值
  if (datetimeRange.value !== null && datetimeRange.value.length === 2) {
    formInfoData.startTime = datetimeRange.value[0]
    formInfoData.endTime = datetimeRange.value[1]
  } else {
    // 沒有則回歸初始值
    formInfoData.startTime = ""
    formInfoData.endTime = ""
  }


  console.log("起始時間:" + formInfoData.startTime)
  console.log("結束時間:" + formInfoData.endTime)

}



/**--------------顯示數據相關---------------------------- */

//分頁組件， 從查詢參數中獲取初始值从查询参数中獲取初始值
let currentPage = ref<number>(parseInt(route.query.page as string) || 1);

//獲取的最新表單List
let formList = reactive<Record<string, any>>({})


//更新URL會帶動頁面更新,
const updateURL = (page: number, size: number) => {
  router.push({ query: { ...route.query, page, size } })
}

//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  let pageSize = ref<number>(parseInt(route.query.size as string) || 10);
  updateURL(value, pageSize.value)
})


/**-------------表單相關variable及function------------------------- */



//表單實例
const form = ref()

const initFormInfo = () => {
  return {
    formId: '',
    title: '',
    description: null,
    status: 'draft',
    requireLogin: 0,
    requiredForCheckout: 0,
    allowMultipleSubmissions: 0,
    startTime: '',
    endTime: ''
  }
}

//表單數據
let formInfoData = reactive(initFormInfo())


//表單校驗規則
const formInfoRules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: '顯示名稱不能為空',
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
      message: '描述信息不能為空',
      trigger: 'blur',
    },
    {
      max: 255,
      message: '內容長度不能超過 255 字符',
      trigger: 'blur'
    }
  ],

})




//送出表單方法
const sumbitForm = (form: FormInstance | undefined) => {

  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {

      //呼叫父組件給的新增function API
      // await props.addApi(formData)

      //如果formId有值,觸發更新 , 沒有則是新增
      if (Boolean(formInfoData.formId)) {
        await updateFormApi(formInfoData)
      } else {
        await addFormApi(formInfoData)
      }

      //重製表單
      form.resetFields()

      ElMessage.success('送出成功');

      //最終都將這個dialog關掉
      dialogFormVisible.value = false

      // 重新獲取資料
      getFormPage(1, 10)

    }
    // else {
    //   ElMessage.error("請完整填入資訊")
    // }
  })
}


// 掛載時讀取
onMounted(() => {
  getFormPage(1, 10)
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