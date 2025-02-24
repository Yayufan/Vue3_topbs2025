<!--  -->
<template>
  <section class="member-section">
    <el-card class="member-card">
      <h1>會員申請審核</h1>

      <!-- 如果要用兩種註冊方式再考慮使用這個 -->
      <div class="function-bar">
        <el-button type="primary" @click="approvalList" :disabled="selectList.length > 0 ? false : true">
          批量通過<el-icon class="el-icon--right">
            <Plus />
          </el-icon>
        </el-button>

        <el-button type="danger" @click="failedList" :disabled="selectList.length > 0 ? false : true">
          批量否決<el-icon class="el-icon--right">
            <Delete />
          </el-icon>
        </el-button>
      </div>

      <el-table class="news-table" :data="memberList.records" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="name" label="姓名" width="90" />
        <el-table-column prop="email" label="信箱" min-width="150" />
        <el-table-column prop="department" label="院所" min-width="150" />
        <el-table-column prop="jobTitle" label="職稱" width="120" />
        <el-table-column prop="phone" label="手機" width="120" />



        <el-table-column fixed="right" label="操作" width="150">
          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">
            <el-button type="primary" size="small" @click="approvalRow(scope.row)">
              通過
            </el-button>
            <el-button type="danger" size="small" @click="failedRow(scope.row.memberId)">
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
import { getMemberApi, getMemberByPaginationApi, getMemberByPaginationByStatusApi, addMemberApi, updateMemberApi, batchUpdateMemberApi, deleteMemberApi, batchDeleteMemberApi } from '@/api/member'


//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'



/**--------------顯示數據相關---------------------------- */

//設定分頁組件,currentPage當前頁數
let currentPage = ref(1)


//獲取的最新會員List
let memberList = reactive<Record<string, any>>({
  records: [{
    name: '孫悟空',
    email: 'kamikazey2200@gmail.com',
    department: '長庚泌尿科',
    jobTitle: '主治醫師',
    phone: '0985225586'

  }]
})

const getMember = async (page: number, size: number) => {
  let res = await getMemberByPaginationByStatusApi(page, size, "0")
  Object.assign(memberList, res.data)
}


//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  getMember(value, 10)
})

/** --------- 審核通過/駁回 相關variable及function -------------- */

//要刪除的對象列表
let selectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  console.log("checkBox狀態", val)
  //重製selectList,移除所有屬性
  selectList.length = 0
  Object.assign(selectList, val)
}

//駁回會員申請
const failedRow = (id: number): void => {
  ElMessageBox.confirm(`確定要駁回此會員申請嗎？`, '確認駁回', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    console.log(id)
    await deleteMemberApi(id)
    ElMessage.success('刪除成功');
    getMember(1, 10)
  }).catch((err) => {
    console.log(err)
  });
}

//批量駁回會員申請的function
const failedList = () => {
  if (selectList.length >= 1) {
    ElMessageBox.confirm(`確定要駁回這${selectList.length}個會員申請嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //提取idList
      let deleteIdList = selectList.map((item: { memberId: string }) => item.memberId)
      await batchDeleteMemberApi(deleteIdList)
      ElMessage.success('批量刪除成功');
      getMember(1, 10)
    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}


/**------------編輯內容相關操作---------------------- */

let updateMember = reactive({
  status: ""
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

    //從List 中透過map方法映射資料, 修改status狀態傳給後端
    let transData = selectList.map(item => {
      return { ...(item as object), status: "1" };
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
  text-align: right;
  margin-bottom: 1%;
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
