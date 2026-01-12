<template>
  <div class="content">
    <BasicComponent title="標籤管理">
      <template #option-box>
        <el-button type="primary" @click="toggleInsertDialog">
          新增
          <el-icon class="el-icon--right">
            <Plus />
          </el-icon>
        </el-button>
      </template>

      <template #data-table>
        <el-table empty-text="No Data" class="tags-table" :data="tagsList.records"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="name" label="名稱" width="200" :show-overflow-tooltip="true">
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
              <el-button link type="success" size="small" @click="getAssociationIdListByTagId(scope.row)">
                Add
              </el-button>
              <!-- <el-button link type="success" size="small" @click="toggleAssignTagDialog(scope.row)">
                Add
              </el-button> -->
              <el-button link type="primary" size="small" @click="editRow(scope.row)">
                Edit
              </el-button>
              <el-button link type="danger" size="small" @click="deleteRow(scope.row.tagId)">
                Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #pagination-box>
        <el-pagination layout="prev, pager, next" :page-count="Number(tagsTotalPages)"
          v-model:current-page="currentPage" :hide-on-single-page="true" @current-change="handlePageChange" />

      </template>

    </BasicComponent>
    <!-- 新增對話框 -->
    <ElDialog v-model="isInsertDialogVisible" title="新增標籤" width="400">

      <div class="tag-preview">
        <h4>預覽效果 :</h4>
        <div class="tag-box">
          <el-tag v-if="insertTagFormData.color" :color="insertTagFormData.color" round size="large">{{
            insertTagFormData.name
          }}</el-tag>
        </div>
      </div>

      <el-form :model="insertTagFormData" ref="form" :rules="tagRules">
        <el-form-item label="名稱" :label-width="formLabelWidth" prop="name">
          <el-input v-model="insertTagFormData.name" />
        </el-form-item>

        <el-form-item label="類別" :label-width="formLabelWidth" prop="type">
          <el-select v-model="insertTagFormData.type" placeholder="請選擇類別">
            <el-option label="會員" value="member" />
            <el-option label="與會者" value="attendees" />
            <el-option label="稿件" value="paper" />
            <el-option label="審稿委員" value="paperReviewer" />
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
          <ElButton @click="isInsertDialogVisible = false">取消</ElButton>
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
      <el-form label-position="top" label-width="auto" :model="updateTagForm" :rules="tagRules" ref="updateTagFormRef">

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

    <el-dialog v-if="assignTagDialogVisible" v-model="assignTagDialogVisible" :title="assignTagTitle"
      :before-close="cancelAdd">
      <h3>標籤: <el-tag :color="assignTag.color" class="tag-box" round>{{ assignTag.name }}</el-tag></h3>

      <div class="search-bar">
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
          @input="getData(assignTag.type, assignTagCurrentPage)" />
        <div v-if="assignTag.type === 'paper'" class="filter-box">
          <!-- <el-select v-model="filterStatus" style="width: 240px;" class="filter-status" placeholder="請選擇狀態"
              @change="getPaperListByPagination(assignTagCurrentPage, 10)">
              <el-option label="全選" value="">
                <span>全選</span>
              </el-option>
              <el-option label="未審核" :value="0">
                <span>未審核</span>
              </el-option>
              <el-option label="已入選" :value="1">
                <span style="color:green;">已入選</span>
              </el-option>
              <el-option label="未入選" :value="2">
                <span style="color:red;">未入選</span>
              </el-option>

              <template #label="{ label, value }">
                <span :style="{ color: value == '1' ? 'green' : value == '-1' ? 'red' : 'black' }">{{ label }}</span>
              </template>
            </el-select>

            <el-select v-model="absType" style="width: 240px;" placeholder="請選擇稿件類型"
              @change="getPaperListByPagination(assignTagCurrentPage, 10)">
            </el-select>
            <el-select v-model="absProp" style="width: 240px;" placeholder="請選擇稿件屬性"
              @change="getPaperListByPagination(assignTagCurrentPage, 10)">
            </el-select> -->
        </div>

      </div>
      <el-table v-if="assignTag.type === 'member'" :data="allMemberList.records" ref="memberTableRef"
        :row-key="getRowKey" @select="handleMemberSelect" empty-text="查無資料">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="chineseName" label="名稱">
          <template #default="{ row }">
            <span v-if="row.chineseName && row.chineseName !== ''">{{ row.chineseName }}</span>
            <span v-else>{{ row.firstName + ' ' + row.lastName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="電話" />
      </el-table>

      <el-table v-if="assignTag.type === 'attendees'" :data="attendeeList.records" ref="attendeeTableRef"
        :row-key="getRowKey" @select="handleAttendeesSelect" empty-text="查無資料">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="name" label="名稱">
          <template #default="scope">
            {{ scope.row.member.chineseName }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email">
          <template #default="scope">
            {{ scope.row.member.email }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="電話">
          <template #default="scope">
            {{ scope.row.member.phone }}
          </template>
        </el-table-column>
      </el-table>

      <el-table v-if="assignTag.type === 'paper'" :data="paperList.records" ref="paperTableRef" :row-key="getRowKey"
        @select="handlePaperSelect" empty-text="查無資料">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="absType" label="類型" width="200" />
        <el-table-column prop="absProp" label="屬性" width="100" />
        <el-table-column prop="absTitle" label="標題" />
        <el-table-column prop="firstAuthor" label="第一作者" width="100" />
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.status == 1 ? 'green' : row.status == 2 ? 'red' : 'black' }">
              {{ row.status == 1 ? '已入選' : row.status == 2 ? '未入選' : '未審核' }}
            </span>
          </template>
        </el-table-column>

      </el-table>

      <el-table v-if="assignTag.type === 'paperReviewer'" :data="paperReviewerList.records" ref="paperReviewerTableRef"
        :row-key="getRowKey" @select="handlePaperReviewerSelect" empty-text="查無資料">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="name" label="名稱" width="100" />
        <el-table-column label="信箱">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.emailList" :key="index">
              {{ item.email }}<span v-if="index != scope.row.emailList.length - 1">, </span>
            </span>
          </template>
        </el-table-column> <el-table-column prop="phone" label="連絡電話" />

      </el-table>

      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block member-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(totalPage)"
          v-model:current-page="assignTagCurrentPage" :hide-on-single-page="true" />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="cancelAdd">取消</ElButton>
          <ElButton type="primary" @click="submitTagSet">
            保存
          </ElButton>
        </div>
      </template>
    </el-dialog>
  </div>


  <!-- <section class="tags-section">
    <el-card class="tags-card">




    </el-card>
  </section> -->
</template>
<script lang="ts" setup>
import BasicComponent from '@/layout/components/Basic/index.vue'

import { addTagApi, assignMemberToTagApi, assignPaperReviewerToTagApi, assignPaperToTagApi, deleteTagApi, findAttendeesIdListByTagIdApi, findMemberIdListByTagIdApi, findPaperIdListByTagIdApi, findPaperReviewerIdListByTagIdApi, getAllTagsApi, getAssociationIdListByTagIdApi, getTagsByPaginationApi, updateTagApi } from '@/api/tag'
import { getMemberByPaginationApi, fetchMembersWithPaginationAndStatusApi } from '@/api/member'
import type { FormInstance, FormRules } from 'element-plus'
import { typeEnums } from '@/enums/TypeEnum'
import { assignTagToAttendeeApi, getAttendeeListByTagAndPaginationApi } from '@/api/attendees'
import { tryCatch } from '@/utils/tryCatch'
import { getPaperPageApi } from '@/api/abstract'
import { getPaperReviewerPageApi } from '@/api/abstract-reviewer'

const formLabelWidth = '70px'
const route = useRoute()
const router = useRouter()



//是否顯示表單dialog
const isInsertDialogVisible = ref(false)

const toggleInsertDialog = () => {
  isInsertDialogVisible.value = true
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

const tagRules = reactive({
  type: [
    { required: true, message: '請選擇類型', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '請輸入名稱', trigger: 'blur' }
  ],
})

//送出表單方法
const submitInsertForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        //呼叫父組件給的新增function API
        await addTagApi(insertTagFormData)
        ElMessage.success('新增成功');
        isInsertDialogVisible.value = false
        getTagsByPagination(1, 10)

        form.resetFields()

      } catch (err: any) {
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

const editRow = (tag: any) => {
  Object.assign(updateTagForm, tag)
  drawer.value = true
}

const confirmClick = async () => {
  updateTagFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await updateTagApi(updateTagForm)
        ElMessage.success('更新成功');
        getTagsByPagination(1, 10)
        drawer.value = false
      } catch (err: any) {
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
let tagsTotalPages = ref<number>(0)

let tagsList = reactive<Record<string, any>>([])


const asscoitedIdList = ref<Array<string>>([])
const getAssociationIdListByTagId = async (tag: any) => {

  const { res, error }: any = await tryCatch(getAssociationIdListByTagIdApi(tag.tagId));
  console.log('tag association ids', res)
  if (error || res.code !== 200) {
    ElMessage.error('查詢失敗: ' + error || res.msg)
    return [];
  }
  asscoitedIdList.value = res.data

  Object.assign(assignTag, tag)
  // getListByTagType(tag)
  changedTag(tag) // 根據 tag 類型獲取資料
  getData(tag.type, assignTagCurrentPage.value)
  assignTagDialogVisible.value = true

}

const getTagsByPagination = async (page: number, size: number) => {
  const res = await getTagsByPaginationApi(page, size)
  Object.assign(tagsList, res.data)
  console.log('tagsList', tagsList)
  tagsTotalPages.value = res.data.pages
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  getTagsByPagination(page, 10)
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
      let deleteIdList = deleteSelectList.map((item: { emailTemplateId: string }) => item.emailTemplateId)
      // await batchDeleteEmailTemplateApi(deleteIdList)
      // getEmailTemplateByPagination(currentPage.value, 10)
      ElMessage.success('刪除成功');
    }).catch((err) => {
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}

/**-------------------查詢會員-------------------- */

const assignTagTitle = ref('')




const memberTableRef = ref()
const attendeeTableRef = ref()

const assignTagCurrentPage = ref(1)
const totalPage = ref(0)
// const

//查詢內容
let input = ref('')

//篩選審核狀態,預設找已經過審的
let filterStatus = ref('')

watch(filterStatus, (value, oldValue) => {
  getMemberListByPagination(assignTagCurrentPage.value, 10)
})

const resetQueryText = (): void => {
  filterStatus.value = ''
  input.value = ''
}


watch(assignTagCurrentPage, (value, oldValue) => {
  getData(assignTag.type, value)
})


const allMemberIdHasSet = new Set(); // 儲存所有已經有的 member ID
const getData = async (option: string, page: number) => {
  switch (option) {
    case 'member':
      getMemberListByPagination(page, 10)
      break
    case 'attendees':
      getAttendeeByPagination()
      break
    case 'paper':
      getPaperListByPagination(page, 10)
      break
    case 'paperReviewer':
      getPaperReviewerList(page, 10)
      break
  }
}




const getRowKey = (row: any) => {
  switch (assignTag.type) {
    case 'member':
      return row.memberId
    case 'attendees':
      return row.attendeesId
    case 'paper':
      return row.paperId
    case 'paperReviewer':
      return row.paperReviewerId
  }
}

// 1. 獲取該分頁所有 member 
let allMemberList = reactive<Record<string, any>>([]);
let submitMemeberSet = new Set()
const getMemberListByPagination = async (page: number, size: number) => {
  let res = await fetchMembersWithPaginationAndStatusApi(page, size, filterStatus.value, input.value);
  allMemberList.length = 0
  if (res.data.records == null) {
    allMemberList.records = []
    ElMessage.error('查無資料')
    return
  };
  // submitMemeberSet.clear()
  Object.assign(allMemberList, res.data)
  totalPage.value = res.data.pages

  /** 確認獲取到 table */
  if (!memberTableRef.value) return;

  /** 每次獲取新 member 資料 清空 ref內 selection 資料 */
  memberTableRef.value.clearSelection();


  /** 判斷獲得的回傳資料是否已擁有該 tag 或是目前已經新增至已勾選的 set 內 */
  res.data.records.forEach((record: any) => {
    if (allMemberIdHasSet.has(record.memberId)) {
      memberTableRef.value.toggleRowSelection(record, true);
    }
  })
}


/**----------------------------與會者-------------------------------- */
let attendeeList = reactive<any>([]);
let attendeeIdSet = new Set(); // 儲存不重複的ID值

const getAttendeeByPagination = async () => {
  try {
    let res = await getAttendeeListByTagAndPaginationApi(assignTagCurrentPage.value, input.value)
    attendeeList.length = 0 // 清空 attendeeList 內的資料
    Object.assign(attendeeList, res.data)
    totalPage.value = res.data.pages

    /** 確認獲取到 table */
    if (!attendeeTableRef.value) return;
    attendeeTableRef.value.clearSelection(); // 清空選擇的資料
    res.data.records.forEach((record: any) => {
      if (attendeeIdSet.has(record.attendeesId)) {
        attendeeTableRef.value.toggleRowSelection(record, true);
      }
    })
  } catch (err: any) {
    ElMessage.error('查詢失敗', err.message)
  }
}

const handleAttendeesSelect = (selection: any, row: any) => {
  if (selection.some((item: any) => item.attendeesId === row.attendeesId)) {
    attendeeIdSet.add(row.attendeesId)
  } else {
    attendeeIdSet.delete(row.attendeesId)
  }
}
/**--------------------------------稿件--------------------------- */
const paperList = reactive<any>([]);
const paperTableRef = ref<any>();
const paperFilterStatus = ref<number>();
const absType = ref<string>('')
const absProp = ref<string>('')

let paperIdSet = new Set(); // 儲存不重複的ID值


const getPaperListByPagination = async (page: number, size: number) => {
  const { res, error } = await tryCatch(getPaperPageApi(page, size, input.value, paperFilterStatus.value, absType.value, absProp.value))
  if (error) {
    ElMessage.error('查詢失敗: ' + error.message)
    return
  }
  Object.assign(paperList, res.data)

  totalPage.value = res.data.pages

  /** 確認獲取到 table */
  if (!paperTableRef.value) return;
  paperTableRef.value.clearSelection(); // 清空選擇的資料
  res.data.records.forEach((record: any) => {
    if (paperIdSet.has(record.paperId)) {
      paperTableRef.value.toggleRowSelection(record, true);
    }
  })
}

const handlePaperSelect = (selection: any, row: any) => {
  if (selection.some((item: any) => item.paperId === row.paperId)) {
    paperIdSet.add(row.paperId)
  } else {
    paperIdSet.delete(row.paperId)
  }
}

/**--------------------------------審稿--------------------------- */
const paperReviewerList = reactive<any>([]);
const paperReviewerTableRef = ref<any>();
const paperReviewerIdSet = new Set(); // 儲存不重複的ID值


const getPaperReviewerList = async (page: number, size: number) => {
  const { res, error } = await tryCatch(getPaperReviewerPageApi(page, size));

  if (error) {
    ElMessage.error('查詢失敗: ' + error.message)
    return
  }

  /** 確認獲取到 table */
  if (!paperReviewerTableRef.value) return;
  totalPage.value = res.data.pages
  paperReviewerTableRef.value.clearSelection(); // 清空選擇的資料
  res.data.records.forEach((item: any) => {
    item.emailList = item.emailList.map((email: any) => ({ email }));

    if (paperReviewerIdSet.has(item.paperReviewerId)) {
      paperReviewerTableRef.value.toggleRowSelection(item, true);
    }
  })

  Object.assign(paperReviewerList, res.data)
}

const handlePaperReviewerSelect = (selection: any, row: any) => {

  /** 判斷已勾選的資料內是否有該 member 有的話新增至 set內， 沒有的話從 set 移除 */
  if (selection.some((item: any) => item.paperReviewerId === row.paperReviewerId)) {
    paperReviewerIdSet.add(row.paperReviewerId) // 確認該 member 已經有這個 tag
  } else {
    paperReviewerIdSet.delete(row.paperReviewerId) // 確認該 member 已經沒有這個 tag
  }
}







/**---------------------------------------------------------------------- */

/** 處理勾選
 * @param selection: 全部已勾選資料
 * @param row: 目前勾選的資料 row
 */
const handleMemberSelect = (selection: any, row: any) => {

  /** 判斷已勾選的資料內是否有該 member 有的話新增至 set內， 沒有的話從 set 移除 */
  if (selection.some((item: any) => item.memberId === row.memberId)) {
    allMemberIdHasSet.add(row.memberId) // 確認該 member 已經有這個 tag
  } else {
    allMemberIdHasSet.delete(row.memberId) // 確認該 member 已經沒有這個 tag
  }
}

const submitTagSet = async () => {
  let data;
  switch (assignTag.type) {
    case 'member':
      data = {
        tagId: assignTag.tagId,
        targetMemberIdList: Array.from(allMemberIdHasSet)
      }
      const { res: memberRes, error: memberError } = await tryCatch(assignMemberToTagApi(data));
      if (memberError) {
        ElMessage.error('更新失敗: ' + memberError.message)
        return;
      }
      submitMemeberSet.clear()
      break
    case 'attendees':
      data = {
        tagId: assignTag.tagId,
        targetAttendeesIdList: Array.from(attendeeIdSet)
      }
      const { res: attendeeRes, error: attendeeError } = await tryCatch(assignTagToAttendeeApi(data));
      if (attendeeError) {
        ElMessage.error('更新失敗: ' + attendeeError.message)
        return;
      }
      attendeeIdSet.clear()
      break
    case 'paper':
      data = {
        tagId: assignTag.tagId,
        targetPaperIdList: Array.from(paperIdSet)
      }
      const { res: paperRes, error: paperError } = await tryCatch(assignPaperToTagApi(data));
      if (paperError) {
        ElMessage.error('更新失敗: ' + paperError.message)
        return;
      }
      paperIdSet.clear()
      break;
    case 'paperReviewer':
      data = {
        tagId: assignTag.tagId,
        targetPaperReviewerIdList: Array.from(paperReviewerIdSet)
      }
      const { res: paperReviewerRes, error: paperReviewerError } = await tryCatch(assignPaperReviewerToTagApi(data));
      if (paperReviewerError) {
        ElMessage.error('更新失敗: ' + paperReviewerError.message)
        return;
      }
      paperReviewerIdSet.clear()
      break;

  }
  assignTagDialogVisible.value = false
  assignTagCurrentPage.value = 1
  resetQueryText()
}



const cancelAdd = () => {
  assignTagDialogVisible.value = false
  submitMemeberSet.clear()
  resetQueryText();
}

/**-----------------------Tag---------------------- */
const assignTagDialogVisible = ref(false) // 是否顯示新增標籤 Dialog

// 要設置的 Tag
let assignTag = reactive({
  tagId: '',
  type: '',
  name: '',
  description: '',
  color: '',
})

/** 開啟新增會員 Dialog */
const toggleAssignTagDialog = async (tag: any) => {
  Object.assign(assignTag, tag)
  // getListByTagType(tag)
  changedTag(tag) // 根據 tag 類型獲取資料
  getData(tag.type, assignTagCurrentPage.value)
  assignTagDialogVisible.value = true
}

const changedTag = async (tag: any) => {
  allMemberIdHasSet.clear() // 清空所有已經有的 member ID
  attendeeIdSet.clear(); // 清空與會者 ID set
  assignTagCurrentPage.value = 1 // 重置當前頁數
  switch (tag.type) {
    case 'member':
      assignTagTitle.value = '新增會員'
      // const { res: memberRes, error: memberError } = await tryCatch(findMemberIdListByTagIdApi(tag.tagId));
      // if (memberError) {
      //   ElMessage.error('查詢失敗: ' + memberError.message)
      //   return;
      // }
      asscoitedIdList.value.forEach((id: string) => {
        allMemberIdHasSet.add(id)
      })
      break;
    case 'attendees':
      assignTagTitle.value = '新增與會者'
      // const { res: attendeeRes, error: attendeeError } = await tryCatch(findAttendeesIdListByTagIdApi(tag.tagId));
      // if (attendeeError) {
      //   ElMessage.error('查詢失敗: ' + attendeeError.message)
      //   return;
      // }
      asscoitedIdList.value.forEach((id: string) => {
        attendeeIdSet.add(id)
      })
      break;
    case 'paper':
      assignTagTitle.value = '新增稿件'
      // const { res: paperRes, error: paperError } = await tryCatch(findPaperIdListByTagIdApi(tag.tagId));
      // if (paperError) {
      //   ElMessage.error('查詢失敗: ' + paperError.message)
      //   return;
      // }
      asscoitedIdList.value.forEach((id: string) => {
        paperIdSet.add(id)
      })

      break;
    case 'paperReviewer':
      assignTagTitle.value = '新增審稿人'
      // const { res: paperReviewerRes, error: paperReviewerError } = await tryCatch(findPaperReviewerIdListByTagIdApi(tag.tagId));
      // if (paperReviewerError) {
      //   ElMessage.error('查詢失敗: ' + paperReviewerError.message)
      //   return;
      // }
      asscoitedIdList.value.forEach((id: string) => {
        paperReviewerIdSet.add(id)
      })
      break;
  }
}












/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  // getMemberListByPagination(1, 10)
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
