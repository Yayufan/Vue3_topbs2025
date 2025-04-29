<template>
  <el-dialog v-model="isOpen" title="新增稿件" :before-close="close">
    <div class="search-bar">
      <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
        @input="getPaperListByPagination(paperCurrentPage, 10)" />

      <el-select v-model="filterStatus" style="width: 240px;" class="filter-status" placeholder="請選擇狀態"
        @change="getPaperListByPagination(paperCurrentPage, 10)">
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
        @change="getPaperListByPagination(paperCurrentPage, 10)">
      </el-select>
      <el-select v-model="absProp" style="width: 240px;" placeholder="請選擇稿件屬性"
        @change="getPaperListByPagination(paperCurrentPage, 10)">
      </el-select>
    </div>

    <el-table :data="paperList.records" ref="paperTableRef" :row-key="getRowKey" @select="handlePaperSelect"
      empty-text="查無資料">
      <el-table-column type="selection" width="55" :reserve-selection="true" />
      <el-table-column prop="absType" label="類型" width="100" />
      <el-table-column prop="absProp" label="屬性" width="100" />
      <el-table-column prop="absTitle" label="標題" />
      <el-table-column prop="firstAuthor" label="第一作者" width="100" />
      <el-table-column prop="status" label="狀態" width="100">
        <template #default="scope">
          <span :style="{ color: scope.row.status == 1 ? 'green' : scope.row.status == 2 ? 'red' : 'black' }">
            {{ scope.row.status == 1 ? '已入選' : scope.row.status == 2 ? '未入選' : '未審核' }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="example-pagination-block paper-pagination">
      <el-pagination layout="prev, pager, next" :page-count="Number(paperList.pages)"
        :default-page-size="Number(paperList.size)" v-model:current-page="paperCurrentPage" :hide-on-single-page="true"
        @current-change="getPaperListByPagination(paperCurrentPage, 10)" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="close">取消</ElButton>
        <ElButton type="primary" @click="cliclAddPaper">
          保存
        </ElButton>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { assignPaperToTagApi } from '@/api/tag'
import { getPaperPageApi } from '@/api/abstract'

const props = defineProps({
  addTag: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const isOpen = ref(true)

const paperList = reactive<any>([])

const paperCurrentPage = ref<number>(1)


// 篩選條件
const input = ref<string>('')
const filterStatus = ref<number>()
const absType = ref<string>('')
const absProp = ref<string>('')

const paperTableRef = ref<any>()





const getPaperListByPagination = async (page: number, pageSize: number) => {
  let res = await getPaperPageApi(
    page,
    pageSize,
    input.value,
    filterStatus.value,
    absType.value,
    absProp.value
  )

  Object.assign(paperList, res.data)

  paperTableRef.value.clearSelection();


  /** 判斷獲得的回傳資料是否已擁有該 tag 或是目前已經新增至已勾選的 set 內 */
  res.data.records.forEach((record: any) => {
    console.log(record)
    if ((record.tagList && record.tagList.some((tag: any) => tag.tagId === props.addTag.tagId)) || submitPaperSet.has(record.memberId)) {
      paperTableRef.value.toggleRowSelection(record, true);
      /** 新增預設勾選資料進 set 內 */
      submitPaperSet.add(record.memberId)
    }
  })

  console.log(res)
}

let submitPaperSet = new Set()
const getRowKey = (row: any) => {
  return row.paperId
}

/** 處理勾選
 * @param selection: 全部已勾選資料
 * @param row: 目前勾選的資料 row
 */
const handlePaperSelect = (selection: any, row: any) => {

  /** 判斷已勾選的資料內是否有該 member 有的話新增至 set內， 沒有的話從 set 移除 */

  console.log('selection:', selection)
  if (selection.some((item: any) => item.paperId === row.paperId)) {
    submitPaperSet.add(row.paperId)
  } else {
    submitPaperSet.delete(row.paperId)
  }
  console.log("PaperSet :", submitPaperSet)
}

onMounted(() => {
  console.log('Open Paper Tag')
  getPaperListByPagination(1, 10)
})

onUnmounted(() => {
  console.log('Close Paper Tag')
})

const resetQueryText = (): void => {
  filterStatus.value = 0
  input.value = ''
  absType.value = ''
  absProp.value = ''
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const cliclAddPaper = async () => {
  let data = {
    tagId: props.addTag.tagId,
    targetPaperIdList: Array.from(submitPaperSet),
  }
  try {
    await assignPaperToTagApi(data)
    ElMessage.success('保存成功')
    // isOpen.value = false
    paperCurrentPage.value = 1
    submitPaperSet.clear()
    // emit('close', false)
    resetQueryText()
  } catch (err: any) {
    console.log(err)
  }
}







</script>
<style lang="scss" scoped></style>