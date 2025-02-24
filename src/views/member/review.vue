<!--  -->
<template>
  <section class="member-section">
    <el-card class="member-card">
      <h1>會員申請審核</h1>

      <!-- 如果要用兩種註冊方式再考慮使用這個 -->
      <div class="function-bar">
        <div class="display-count">
          未審核人數為： {{ memberCount }} 人
        </div>
        <div class="btn-box">
          <el-button type="primary" @click="approvalList" :disabled="selectList.length > 0 ? false : true">
            批量通過<el-icon class="el-icon--right">
              <Plus />
            </el-icon>
          </el-button>

          <el-button type="danger" @click="failedList" :disabled="selectList.length > 0 ? false : true">
            批量駁回<el-icon class="el-icon--right">
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </div>

      <div class="search-bar">
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
          @keydown.enter="getMember(currentPage, 10)" />
      </div>

      <el-table class="news-table" :data="memberList.records" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="name" label="姓名" width="90" />
        <el-table-column label="性別" width="90">
          <template #default="scope">
            <el-text v-if="scope.row.genderOther">{{ scope.row.genderOther }}</el-text>
            <el-text v-else>{{ scope.row.gender }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手機" width="120" />
        <el-table-column prop="birthday" label="生日" width="120">
          <template #default="scope">
            <el-text>{{
              Number(scope.row.birthday.split("-")[0]) - 1911 + "-" + scope.row.birthday.split("-").slice(1).join("-")
            }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份證字號" />
        <!-- <el-table-column prop="email" label="信箱" width="220" /> -->

        <el-table-column fixed="right" label="操作" width="150">
          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">
            <el-button type="primary" size="small" @click="approvalRow(scope.row)">
              通過
            </el-button>
            <el-button type="danger" size="small" @click="failedRow(scope.row)">
              不通過</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block news-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(memberList.pages)"
          :default-page-size="Number(memberList.size)" v-model:current-page="currentPage" :hide-on-single-page="true" />
      </div>


    </el-card>
  </section>
</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
// import { getOrganDonationConsentCountByStatusApi, getOrganDonationConsentByPaginationByStatusApi, updateOrganDonationConsentApi, batchUpdateOrganDonationConsentApi } from '@/api/organDonationConsent'
import { getMemberApi, getAllMemberApi, getMemberByPaginationApi, getMemberByPaginationByStatusApi, getMemberCountApi, getMemberCountByStatusApi, updateMemberApi, batchUpdateMemberApi, deleteMemberApi, batchDeleteMemberApi, downloadMemberExcelApi } from '@/api/member'


//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'


/**--------------顯示數據相關---------------------------- */

//設定分頁組件,currentPage當前頁數
let currentPage = ref(1)

//獲取未審核的同意書
let memberCount = ref(0)

//查詢內容
let input = ref('')


//獲取未審核的同意書List
let memberList = reactive<Record<string, any>>({
  records: [{
    name: '',
    email: '',
    phone: '',
    department: '',
    contactAddress: '',
    jobTitle: '',
    gender: '',
    genderOther: '',
    idCard: '',
    birthday: '',
  }]
})

const getMember = async (page: number, size: number) => {
  let res = await getMemberByPaginationByStatusApi(page, size, "0", input.value)
  Object.assign(memberList, res.data)
}

const getMemberCount = async () => {
  let res = await getMemberCountByStatusApi("0")
  memberCount.value = res.data
}


//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  getMember(value, 10)
})

/** --------- 審核通過/駁回 相關variable及function -------------- */

//勾選的對象列表
let selectList = reactive<Record<string, any>[]>([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製selectList,移除所有屬性
  selectList.length = 0
  Object.assign(selectList, val)
}

//駁回同意書申請
const failedRow = (member: any): void => {
  ElMessageBox.confirm(`確定要駁回此申請嗎？`, '確認廢除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {

    Object.assign(updateMember, member)
    //將審核狀態更改為駁回
    updateMember.status = "2"

    // 用户選擇確認，繼續操作
    await updateMemberApi(updateMember)
    ElMessage.success('廢除成功');

    getMember(1, 10)

  }).catch((err) => {
    console.log(err)
  });
}

//批量駁回同意書申請的function
const failedList = () => {
  if (selectList.length >= 1) {
    ElMessageBox.confirm(`確定要駁回${selectList.length}個申請嗎？`, '確認駁回', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {

      //從List 中透過map方法映射資料, 修改status狀態 和 donateOrgans轉為array 並傳給後端
      let transData = selectList.map(item => {
        return {
          ...(item),
          status: "2",
          // donateOrgans: item.donateOrgans ? item.donateOrgans.split(",") : [] // 確保 donateOrgans 存在
        };
      })

      await batchUpdateMemberApi(transData)
      ElMessage.success("批量審核駁回")


      getMember(1, 10)

    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}


/**------------編輯內容相關操作---------------------- */

let updateMember = reactive<Record<string, any>>({

})

//會員審核通過
const approvalRow = async (member: any) => {

  Object.assign(updateMember, member)
  //將審核狀態更改為通過
  updateMember.status = "1"

  try {
    await updateMemberApi(updateMember)
    ElMessage.success("審核通過")
    getMember(currentPage.value, 10)

  } catch (err) {
    console.log(err)
  }
}

const approvalList = async () => {
  if (selectList.length >= 1) {

    //從List 中透過map方法映射資料, 修改status狀態 和 donateOrgans轉為array 並傳給後端
    let transData = selectList.map(item => {
      return {
        ...(item),
        status: "1",
      };
    })

    try {
      await batchUpdateMemberApi(transData)
      ElMessage.success("批量審核通過")
      getMember(currentPage.value, 10)

    } catch (err) {
      console.log(err)
    }
  } else {
    ElMessage.error("請至少勾選一筆資料進行操作")
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
