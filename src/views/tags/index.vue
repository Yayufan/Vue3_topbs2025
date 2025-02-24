<template>
  <section class="tags-section">
    <el-card class="tags-card">
      <h1>標籤管理</h1>

      <div class="function-bar">
        <div class="search-bar">
          <!-- <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢" @keydown.enter="" /> -->
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

      <el-table empty-text="No Data" class="tags-table" :data="tagsList.records"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="name" label="名稱" width="200">
          <template #default="{ row }">
            <el-tag :color="row.color" round size="large">{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否啟用" width="100">
          <template #default="{ row }">
            <span v-if="row.status === 0">是</span>
            <span v-if="row.status === 1">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="類別" width="100">
          <template #default="{ row }">
            <span>{{ typeEnums.tagType[row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column fit prop="description" label="描述" />

        <el-table-column fixed="right" label="操作" width="150">
          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">
            <el-button link type="success" size="small" @click="toggleMemberDialog(scope.row)">
              Add
            </el-button>
            <el-button link type="primary" size="small" @click="editRow(scope.row)">
              Edit
            </el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.row.tagId)">
              Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增對話框 -->
      <ElDialog v-model="dialogFormVisible" title="新增標籤" width="400">

        <div class="tag-preview">
          <h4>預覽效果 :</h4>
          <div class="tag-box">
            <el-tag v-if="insertTagFormData.color" :color="insertTagFormData.color" round size="large">{{
              insertTagFormData.name
            }}</el-tag>
          </div>
        </div>

        <el-form :model="insertTagFormData" ref="form" :rules="insertTagRules">
          <el-form-item label="名稱" :label-width="formLabelWidth" prop="name">
            <el-input v-model="insertTagFormData.name" />
          </el-form-item>

          <el-form-item label="類別" :label-width="formLabelWidth" prop="type">
            <el-select v-model="insertTagFormData.type" placeholder="請選擇類別">
              <el-option label="會員" value="member" />
            </el-select>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
            <el-input type="textarea" v-model="insertTagFormData.description" />
          </el-form-item>

          <el-form-item label="顏色" :label-width="formLabelWidth" prop="color">
            <el-color-picker v-model="insertTagFormData.color" />
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

      <el-drawer v-model="drawer" title="編輯標籤">

        <div class="tag-preview">
          <h4>預覽效果 :</h4>
          <div class="tag-box">
            <el-tag :color="updateTagForm.color" round size="large">{{
              updateTagForm.name
            }}</el-tag>
          </div>
        </div>
        <el-form label-position="top" label-width="auto" :model="updateTagForm" :rules="updateTagFormRules"
          ref="updateTagFormRef">

          <el-form-item label="是否啟用" :label-width="formLabelWidth" prop="status">
            <el-switch v-model="updateTagForm.status" active-text="啟用" inactive-text="停用" :active-value="0"
              :inactive-value="1" />
          </el-form-item>

          <el-form-item label="名稱" prop="name">
            <el-input v-model="updateTagForm.name" />
          </el-form-item>

          <el-form-item label="類別" prop="type">
            <el-select v-model="updateTagForm.type" placeholder="請選擇類別">
              <el-option label="會員" value="member" />
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="updateTagForm.description" />
          </el-form-item>

          <el-form-item label="顏色" prop="color">
            <el-color-picker v-model="updateTagForm.color" />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="confirmClick()">送出</el-button>
          </div>
        </template>
      </el-drawer>

      <el-dialog v-if="addMemberDialogIsVisible" v-model="addMemberDialogIsVisible" title="新增會員"
        :before-close="cancelAdd">
        <h3>標籤: <el-tag :color="addMemberTag.color" class="tag-box" round>{{ addMemberTag.name }}</el-tag></h3>

        <div class="search-bar">
          <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
            @keydown.enter="getMemberListByPagination(currentPage, 10)" />

          <el-select v-model="filterStatus" style="width: 240px;" class="filter-status" placeholder="請選擇">
            <el-option label="全選" value="">
              <span>全選</span>
            </el-option>
            <el-option label="未審核" value="0">
              <span>未審核</span>
            </el-option>
            <el-option label="審核通過" value="1">
              <span style="color:green;">審核通過</span>
            </el-option>
            <el-option label="駁回申請" value="2">
              <span style="color:red;">駁回申請</span>
            </el-option>

            <template #label="{ label, value }">
              <span :style="{ color: value == '1' ? 'green' : value == '-1' ? 'red' : 'black' }">{{ label }}</span>
            </template>
          </el-select>

        </div>
        <el-table :data="allMemberList.records" ref="memberTableRef" :row-key="getRowKey" @select="handleMemberSelect"
          empty-text="查無資料">
          <el-table-column type="selection" width="55" :reserve-selection="true" />
          <el-table-column prop="name" label="名稱" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="phone" label="電話" />
        </el-table>

        <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
        <div class="example-pagination-block member-pagination">
          <el-pagination layout="prev, pager, next" :page-count="Number(allMemberList.pages)"
            :default-page-size="Number(allMemberList.size)" v-model:current-page="memberCurrentPage"
            :hide-on-single-page="true" />
        </div>

        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="cancelAdd">取消</ElButton>
            <ElButton type="primary" @click="cliclAddMember">
              保存
            </ElButton>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </section>
</template>
<script lang="ts" setup>
import { addTagApi, assignMemberToTagApi, deleteTagApi, getAllTagsApi, getTagsByPaginationApi, updateTagApi } from '@/api/tag'
import { getMemberByPaginationApi, getMemberByPaginationByStatusApi } from '@/api/member'
import type { FormInstance, FormRules } from 'element-plus'
import { typeEnums } from '@/enums/TypeEnum'
import { s } from 'vite/dist/node/types.d-aGj9QkWt'

const formLabelWidth = '70px'
const route = useRoute()
const router = useRouter()



//是否顯示表單dialog
const dialogFormVisible = ref(false)

const toggleAddDialog = () => {
  dialogFormVisible.value = true
  console.log('觸發', dialogFormVisible.value)
}

/** --------- 新增相關 --------------  */

const form = ref()

const insertTagFormData = reactive({
  type: 'member',
  name: '',
  description: '',
  color: '',
  status: '0'
})

const insertTagRules = reactive({
  type: [
    { required: true, message: '請選擇類型', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '請輸入名稱', trigger: 'blur' }
  ],
})

//送出表單方法
const submitInsertForm = (form: FormInstance | undefined) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        //呼叫父組件給的新增function API
        let res = await addTagApi(insertTagFormData)
        ElMessage.success('新增成功');
        // router.push(`${route.fullPath}`)
        dialogFormVisible.value = false
        getTagsByPagination(1, 10)

        form.resetFields()

      } catch (err: any) {
        console.log(err)
      }
    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}
/** --------- 更新相關 --------------  */
let drawer = ref(false)

const updateTagFormRef = ref()

const updateTagForm = reactive({
  type: '',
  name: '',
  description: '',
  color: '',
  status: 0
})

const updateTagFormRules = reactive({
  type: [
    { required: true, message: '請選擇類型', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '請輸入名稱', trigger: 'blur' }
  ],
})

const editRow = (tag: any) => {
  Object.assign(updateTagForm, tag)
  drawer.value = true
}

const confirmClick = async () => {
  updateTagFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        console.log(updateTagForm)
        await updateTagApi(updateTagForm)
        ElMessage.success('更新成功');
        getTagsByPagination(1, 10)
        drawer.value = false
      } catch (err: any) {
        console.log(err)
      }
    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}

const cancelClick = () => {
  drawer.value = false
}



/** --------- 查詢相關 --------------  */


let currentPage = ref(1)

let tagsList = reactive<Record<string, any>>([])

const getTagsByPagination = async (page: number, size: number) => {
  const res = await getTagsByPaginationApi(page, size)
  Object.assign(tagsList, res.data)
  console.log(tagsList)
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
  ElMessageBox.confirm(`確定要刪除此標籤嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await deleteTagApi(id)
    getTagsByPagination(currentPage.value, 10)

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

/**-------------------查詢會員-------------------- */
const addMemberDialogIsVisible = ref(false)

const memberTableRef = ref()

const memberCurrentPage = ref(1)

//查詢內容
let input = ref('')

//篩選審核狀態,預設找已經過審的
let filterStatus = ref('')

watch(filterStatus, (value, oldValue) => {
  getMemberListByPagination(memberCurrentPage.value, 10)
})

const resetQueryText = (): void => {
  filterStatus.value = ''
  input.value = ''
}


let addMemberTag = reactive({
  tagId: '',
  name: '',
  description: '',
  color: '',
})

watch(memberCurrentPage, (value, oldValue) => {
  getMemberListByPagination(value, 10)
})


/** 開啟新增會員 Dialog */
const toggleMemberDialog = (tag: any) => {
  addMemberDialogIsVisible.value = true
  Object.assign(addMemberTag, tag) // 獲取要新增的標籤
  getMemberListByPagination(1, 10)
}


const getRowKey = (row: any) => {
  return row.memberId
}

// 1. 獲取該分頁所有 member 
let allMemberList = reactive<Record<string, any>>([]);
let submitMemeberSet = new Set()
const getMemberListByPagination = async (page: number, size: number) => {
  let res = await getMemberByPaginationByStatusApi(page, size, filterStatus.value, input.value);
  allMemberList.length = 0
  if (res.data.records == null) {
    allMemberList.records = []
    ElMessage.error('查無資料')
    return
  };
  // submitMemeberSet.clear()
  Object.assign(allMemberList, res.data)

  /** 確認獲取到 table */
  if (!memberTableRef.value) return;

  /** 每次獲取新 member 資料 清空 ref內 selection 資料 */
  memberTableRef.value.clearSelection();


  /** 判斷獲得的回傳資料是否已擁有該 tag 或是目前已經新增至已勾選的 set 內 */
  res.data.records.forEach((record: any) => {
    if ((record.tagSet && record.tagSet.some((tag: any) => tag.tagId === addMemberTag.tagId)) || submitMemeberSet.has(record.memberId)) {
      memberTableRef.value.toggleRowSelection(record, true);
      /** 新增預設勾選資料進 set 內 */
      submitMemeberSet.add(record.memberId)
    }
  })
}

/** 處理勾選
 * @param selection: 全部已勾選資料
 * @param row: 目前勾選的資料 row
 */
const handleMemberSelect = (selection: any, row: any) => {

  /** 判斷已勾選的資料內是否有該 member 有的話新增至 set內， 沒有的話從 set 移除 */
  if (selection.some((item: any) => item.memberId === row.memberId)) {
    submitMemeberSet.add(row.memberId)
  } else {
    submitMemeberSet.delete(row.memberId)
  }
  console.log("memberSet :", submitMemeberSet)
}

const cliclAddMember = async () => {
  /** data :
   *  targetMemberIdList: 所有含有這個 tag 的 member
   */
  let data = {
    tagId: addMemberTag.tagId,
    targetMemberIdList: Array.from(submitMemeberSet)
  }
  try {
    await assignMemberToTagApi(data)
    ElMessage.success('保存成功')
    addMemberDialogIsVisible.value = false
    memberCurrentPage.value = 1
    submitMemeberSet.clear()
    resetQueryText()
  } catch (err: any) {
    console.log(err)
  }
}

const cancelAdd = () => {
  addMemberDialogIsVisible.value = false
  submitMemeberSet.clear()
  resetQueryText();
}

/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  getMemberListByPagination(1, 10)
  getTagsByPagination(1, 10)
})
</script>
<style lang="scss" scoped>
.tags-section {
  width: 95%;
  margin: 0 auto;

  .tags-card {
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

.tag-preview {
  margin-bottom: 1%;
  display: flex;

  h4 {
    margin-right: 1%;
  }

  .tag-box {
    display: flex;
    align-items: center;
    margin-left: 2%;
  }
}

.tags-table {
  width: 100%;
  height: auto;
}


.member-pagination {
  margin-top: 1%;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;

}

:deep(.el-tag__content) {
  color: white;
  font-size: 14px;
}

:deep(.el-table__header-wrapper .el-checkbox) {
  display: none;
}
</style>
