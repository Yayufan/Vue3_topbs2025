<!-- 會員標籤 -->
<template>
  <div class="member-tag-section">
    <el-dialog v-model="isOpen" title="新增與會者" :before-close="cancelAdd" width="800">
      <h3>標籤: <el-tag :color="addTag.color" class="tag-box" round>{{ addTag.name }}</el-tag></h3>
      <div class="search-bar">
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢" @input="getAttendeeByPagination()" />

      </div>

      <el-table :data="attendeeList.records" ref="attendeeTableRef" :row-key="getRowKey" @select="handleMemberSelect"
        empty-text="查無資料">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="firstName" label="名稱">
          <template #default="scope">
            {{ scope.row.member.firstName }}
          </template>
        </el-table-column>
        <el-table-column prop="lastName" label="姓氏" width="100">
          <template #default="scope">
            {{ scope.row.member.lastName }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email">
          <template #default="scope">
            {{ scope.row.member.email }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="電話" width="150">
          <template #default="scope">
            {{ scope.row.member.phone }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block member-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(attendeeList.pages)"
          :default-page-size="Number(attendeeList.size)" v-model:current-page="assignTagCurrentPage"
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
import { assignTagToAttendeeApi, getAttendeeListByTagAndPaginationApi } from '@/api/attendees'
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





let attendeeTableRef = ref()
onMounted(() => {
  console.log('Open Member Tag')
  getAttendeeByPagination()
})

onUnmounted(() => {
  console.log('Close Member Tag')
})

const memberTableRef = ref()

//查詢內容
let input = ref('')

//篩選審核狀態,預設找已經過審的
let filterStatus = ref('')

const assignTagCurrentPage = ref(1)

watch(filterStatus, (value, oldValue) => {
  getAttendeeByPagination()
})

const resetQueryText = (): void => {
  filterStatus.value = ''
  input.value = ''
}

// 1. 獲取該分頁所有 member 
let attendeeList = reactive<any>([]);
let attendeeIdSet = new Set(); // 儲存不重複的ID值

const getAttendeeByPagination = async () => {
  console.log(input.value, "這是查詢的內容")
  try {
    let res = await getAttendeeListByTagAndPaginationApi(assignTagCurrentPage.value, input.value)
    attendeeIdSet.clear() // 清空 set 內的資料
    attendeeList.length = 0 // 清空 attendeeList 內的資料
    Object.assign(attendeeList, res.data)
    console.log("這是與會者列表: ", attendeeList)

    /** 確認獲取到 table */
    if (!attendeeTableRef.value) return;
    attendeeTableRef.value.clearSelection(); // 清空選擇的資料
    if (res.data.records == null) {
      attendeeList.records = []
      ElMessage.error('查無資料')
      return
    };
    res.data.records.forEach((record: any) => {
      console.log(record.tagSet)
      console.log(props.addTag.tagId)
      if ((record.tagSet && record.tagSet.some((tag: any) => tag.tagId === props.addTag.tagId)) || attendeeIdSet.has(record.attendeesId)) {
        attendeeTableRef.value.toggleRowSelection(record, true);
        /** 新增預設勾選資料進 set 內 */
        attendeeIdSet.add(record.attendeesId)
      }
    })


  } catch (err: any) {
    console.log(err)
    ElMessage.error('查詢失敗', err.message)
  }
}

const getRowKey = (row: any) => {
  return row.attendeesId
}

/** 處理勾選
 * @param selection: 全部已勾選資料
 * @param row: 目前勾選的資料 row
 */
const handleMemberSelect = (selection: any, row: any) => {

  /** 判斷已勾選的資料內是否有該 member 有的話新增至 set內， 沒有的話從 set 移除 */
  if (selection.some((item: any) => item.attendeesId === row.attendeesId)) {
    attendeeIdSet.add(row.attendeesId)
  } else {
    attendeeIdSet.delete(row.attendeesId)
  }
  console.log("memberSet :", attendeeIdSet)
}

const cancelAdd = () => {
  isOpen.value = false
  emit('close', false)
  attendeeIdSet.clear()
  resetQueryText();
}

const cliclAddMember = async () => {
  /** data :
   *  targetMemberIdList: 所有含有這個 tag 的 member
   */
  let data = {
    tagId: props.addTag.tagId,
    targetAttendeesIdList: Array.from(attendeeIdSet)
  }
  try {
    await assignTagToAttendeeApi(data)
    ElMessage.success('保存成功')
    isOpen.value = false
    assignTagCurrentPage.value = 1
    attendeeIdSet.clear()
    emit('close', false)
    resetQueryText()
  } catch (err: any) {
    console.log(err)
  }
}








</script>
<style lang="scss" scoped></style>