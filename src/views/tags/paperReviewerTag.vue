<template>
  <el-dialog v-model="isOpen" title="新增審稿委員" :before-close="close">

    <el-table :data="paperReviewer.records" ref="paperReviewerTableRef" :row-key="getRowKey" @select="handlePaperSelect"
      empty-text="查無資料">
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

    <div class="example-pagination-block paper-pagination">
      <el-pagination layout="prev, pager, next" :page-count="Number(paperReviewer.pages)"
        :default-page-size="Number(paperReviewer.size)" v-model:current-page="paperReviewerCurrentPage"
        :hide-on-single-page="true" @current-change="getPaperListByPagination(paperReviewerCurrentPage, 10)" />
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
import { assignPaperReviewerToTagApi, assignPaperToTagApi } from '@/api/tag'
import { getPaperReviewerPageApi } from '@/api/abstract-reviewer'

const props = defineProps({
  addTag: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const isOpen = ref(true)

const paperReviewer = reactive<any>([])

const paperReviewerCurrentPage = ref<number>(1)


// 篩選條件
const input = ref<string>('')

const paperReviewerTableRef = ref<any>()





const getPaperListByPagination = async (page: number, pageSize: number) => {
  let res = await getPaperReviewerPageApi(
    page,
    pageSize,
  )

  res.data.records.forEach((item: any) => {
    item.emailList = item.emailList.map((item: any) => ({ email: item }))
  })
  Object.assign(paperReviewer, res.data)

  paperReviewerTableRef.value.clearSelection();


  /** 判斷獲得的回傳資料是否已擁有該 tag 或是目前已經新增至已勾選的 set 內 */
  res.data.records.forEach((record: any) => {
    console.log(record)
    if ((record.tagList && record.tagList.some((tag: any) => tag.tagId === props.addTag.tagId)) || submitPaperReviewerSet.has(record.memberId)) {
      paperReviewerTableRef.value.toggleRowSelection(record, true);
      /** 新增預設勾選資料進 set 內 */
      submitPaperReviewerSet.add(record.memberId)
    }
  })

  console.log(res)
}

let submitPaperReviewerSet = new Set()
const getRowKey = (row: any) => {
  return row.paperReviewerId
}

/** 處理勾選
 * @param selection: 全部已勾選資料
 * @param row: 目前勾選的資料 row
 */
const handlePaperSelect = (selection: any, row: any) => {

  /** 判斷已勾選的資料內是否有該 member 有的話新增至 set內， 沒有的話從 set 移除 */

  console.log('selection:', selection)
  if (selection.some((item: any) => item.paperReviewerId === row.paperReviewerId)) {
    submitPaperReviewerSet.add(row.paperReviewerId)
  } else {
    submitPaperReviewerSet.delete(row.paperReviewerId)
  }
  console.log("PaperSet :", submitPaperReviewerSet)
}

onMounted(() => {
  console.log('Open Paper Tag')
  getPaperListByPagination(1, 10)
})

onUnmounted(() => {
  console.log('Close Paper Tag')
})

const close = () => {
  isOpen.value = false
  emit('close')
}

const cliclAddPaper = async () => {
  let data = {
    tagId: props.addTag.tagId,
    targetPaperReviewerIdList: Array.from(submitPaperReviewerSet),
  }
  try {
    console.log('data:', data)
    await assignPaperReviewerToTagApi(data)
    ElMessage.success('保存成功')
    // isOpen.value = false
    paperReviewerCurrentPage.value = 1
    submitPaperReviewerSet.clear()
    // emit('close', false)
  } catch (err: any) {
    console.log(err)
  }
}







</script>
<style lang="scss" scoped></style>