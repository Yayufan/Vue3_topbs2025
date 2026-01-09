<!--  -->
<template>
  <div class="content">
    <BasicComponent title="繳費確認管理" :totalCount="memberList.total + '人'">
      <template #search-box>
        <div class="search-bar">
          <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
            @input="getMember(currentPage, 10)" />
        </div>
      </template>

      <template #data-table>
        <MemberTable :member-data="memberList.records" view-page="review" @update-unpaid-member="updateUnpaidMember">
        </MemberTable>
      </template>

      <template #pagination-box>
        <el-pagination layout="prev, pager, next" :page-count="Number(memberList.pages)"
          :default-page-size="Number(memberList.size)" v-model:current-page="currentPage"
          :hide-on-single-page="false" />
      </template>
    </BasicComponent>
  </div>
</template>

<script setup lang='ts'>
import BasicComponent from '@/layout/components/Basic/index.vue'

import { ref, reactive } from 'vue'
import { getMemberCountByOrderStatusApi, getUnpaidMemberApi, updateUnpaidMemberApi } from '@/api/member'
import MemberTable from './components/MemberTable.vue'

/**--------------顯示數據相關---------------------------- */

//設定分頁組件,currentPage當前頁數
let currentPage = ref(1)

//獲取未審核的同意書
let memberCount = ref(0)

//查詢內容
let input = ref('')


//獲取未審核的同意書List
let memberList = reactive<Record<string, any>>({})


const getMember = async (page: number, size: number) => {
  // let res = await getMemberOrder(page, size, "1", input.value)
  let res = await getUnpaidMemberApi(page, input.value);
  memberList
  Object.assign(memberList, res.data)
}

const getMemberCount = async () => {
  let res = await getMemberCountByOrderStatusApi("1")
  memberCount.value = res.data
}


//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  getMember(value, 10)
})

/** --------- 審核通過/駁回 相關variable及function -------------- */

const updateUnpaidMember = async (memberId: string) => {
  let res: any = await updateUnpaidMemberApi(memberId)
  if (res.code === 200) {
    ElMessage.success("審核通過")
    getMember(currentPage.value, 10)
  } else {
    ElMessage.error(res.msg)
  }
}

/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  getMemberCount()
  getMember(1, 10)
})




</script>

<style scoped lang="scss">
.member-section {
  width: 95%;
  margin: 0 auto;

  .member-card {
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
  text-align: right;
  margin-bottom: 1%;


  .display-count {
    margin-left: 1%;
  }

}

.search-bar {
  margin-left: 1%;
}

.news-table {
  width: 100%;
  height: auto;
}


.news-pagination {
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
