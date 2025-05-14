<!-- 會員標籤 -->
<template>
  <div class="member-tag-section">
    <el-dialog v-model="isOpen" title="新增會員" :before-close="cancelAdd" width="800">
      <h3>標籤: <el-tag :color="addTag.color" class="tag-box" round>{{ addTag.name }}</el-tag></h3>
      <div class="search-bar">
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
          @keydown.enter="getMemberListByPagination(memberCurrentPage, 10)" />

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
        <el-table-column prop="firstName" label="名稱" />
        <el-table-column prop="lastName" label="姓氏" width="100" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="電話" width="150" />
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
  </div>
</template>
<script lang="ts" setup>
import { getMemberByPaginationByStatusApi } from '@/api/member'
import { assignMemberToTagApi } from '@/api/tag'

const isOpen = ref(true)
const emit = defineEmits(['close'])

const props = defineProps({
  addTag: {
    type: Object,
    required: true
  }
})






onMounted(() => {
  console.log('Open Member Tag')
  getMemberListByPagination(1, 10)
})

onUnmounted(() => {
  console.log('Close Member Tag')
})

const memberTableRef = ref()

//查詢內容
let input = ref('')

//篩選審核狀態,預設找已經過審的
let filterStatus = ref('')

const memberCurrentPage = ref(1)

watch(filterStatus, (value, oldValue) => {
  getMemberListByPagination(memberCurrentPage.value, 10)
})

const resetQueryText = (): void => {
  filterStatus.value = ''
  input.value = ''
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
    if ((record.tagSet && record.tagSet.some((tag: any) => tag.tagId === props.addTag.tagId)) || submitMemeberSet.has(record.memberId)) {
      memberTableRef.value.toggleRowSelection(record, true);
      /** 新增預設勾選資料進 set 內 */
      submitMemeberSet.add(record.memberId)
    }
  })
}

const getRowKey = (row: any) => {
  return row.memberId
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

const cancelAdd = () => {
  isOpen.value = false
  emit('close', false)
  submitMemeberSet.clear()
  resetQueryText();
}

const cliclAddMember = async () => {
  /** data :
   *  targetMemberIdList: 所有含有這個 tag 的 member
   */
  let data = {
    tagId: props.addTag.tagId,
    targetMemberIdList: Array.from(submitMemeberSet)
  }
  try {
    await assignMemberToTagApi(data)
    ElMessage.success('保存成功')
    isOpen.value = false
    memberCurrentPage.value = 1
    submitMemeberSet.clear()
    emit('close', false)
    resetQueryText()
  } catch (err: any) {
    console.log(err)
  }
}








</script>
<style lang="scss" scoped></style>