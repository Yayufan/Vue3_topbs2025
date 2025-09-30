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
        <el-table class="news-table" :data="memberList.records">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="chineseName" label="中文姓名" width="100"></el-table-column>
          <el-table-column prop="country" label="國家" width="100" />
          <el-table-column prop="remitAccountLast5" label="戶頭末五碼" width="100" />
          <el-table-column label="繳費金額" width="150" prop="amount">
          </el-table-column>
          <el-table-column prop="idCard" label="身分證字號" width="200" />
          <el-table-column prop="category" label="會員類別" width="200">
            <template #default="scope">
              {{ memberEnums[scope.row.category] }}

            </template>
          </el-table-column>

          <el-table-column prop="email" label="信箱" />
          <el-table-column prop="phone" label="手機" width="140" />

          <el-table-column fixed="right" label="操作" width="150">
            <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
            <template #default="scope">
              <el-button type="primary" size="small" @click="updateUnpaidMember(scope.row.memberId)">
                通過
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

import { memberEnums } from '@/enums/memberEnum'

import { getMemberOrder, getMemberCountByOrderStatusApi, updateMemberApi, batchUpdateMemberApi, getUnpaidMemberApi, updateUnpaidMemberApi } from '@/api/member'

import { updateOrdersApi } from '@/api/order'


//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'

const earlyBirdDate = ref(new Date('2025/9/31'))

const isEarlyBird = ref(false)

const checkEarlyBird = (date: Date) => {
  const now = new Date()
  const earlyBird = new Date(date)
  if (now <= earlyBird) {
    isEarlyBird.value = true
  } else {
    isEarlyBird.value = false
  }
}


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

/**------------編輯內容相關操作---------------------- */




/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  getMemberCount()
  getMember(1, 10)
  checkEarlyBird(earlyBirdDate.value)
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
