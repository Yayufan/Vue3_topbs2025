<!--  -->
<template>
  <section class="member-section">
    <el-card class="member-card">
      <h1>與會者列表</h1>

      <!-- 如果要用兩種註冊方式再考慮使用這個 -->
      <div class="function-bar">
        <div class="display-count">
          與會人數為： {{ attendeeList.total }} 人
        </div>
        <div class="btn-box">


          <el-button type="danger" @click="deleteAttendeeList" :disabled="selectList.length > 0 ? false : true">
            批量刪除<el-icon class="el-icon--right">
              <Delete />
            </el-icon>
          </el-button>
          <el-button type="success" @click="downloadExcel">
            下載Excel
          </el-button>
        </div>
      </div>

      <div class="search-bar">
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢" @input="getAttendeeList()" />
      </div>

      <el-table class="news-table" :data="attendeeList.records" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="firstName" label="名字" width="90">
          <template #default="scope">
            {{ scope.row.member.firstName }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="lastName" label="姓氏" width="90">
          <template #default="scope">
            {{ scope.row.member.lastName }}
          </template>
        </el-table-column>

        <el-table-column fixed prop="idCard" label="身分證" width="190">
          <template #default="scope">
            {{ scope.row.member.idCard }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="lastName" label="飲食偏好" width="100">
          <template #default="scope">
            {{ scope.row.member.food }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="信箱">
          <template #default="scope">
            {{ scope.row.member.email }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手機" width="140">
          <template #default="scope">
            {{ scope.row.member.phone }}
          </template>
        </el-table-column>
        <el-table-column prop="tagSet" label="標籤" min-width="40" align="center">
          <template #default="scope">
            <el-popover v-if="scope.row.tagSet.length > 0" placement="left-start" title="標籤" :width="200"
              trigger="hover">
              <template #reference>
                <el-tag v-if="findFirstVaildTag(scope.row.tagSet)" size="large" round
                  :color="findFirstVaildTag(scope.row.tagSet).color" effect="light">{{
                    findFirstVaildTag(scope.row.tagSet).name }}</el-tag>
              </template>
              <template #default>
                <div class="tag-popover-box">
                  <div v-for="tag in scope.row.tagSet" :key="tag.tagId" class="tag-item">
                    <el-tag v-if="tag.status === 0" size="large" round :color="tag.color">{{
                      tag.name }}</el-tag>
                  </div>
                </div>
              </template>
            </el-popover>

          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button link type="danger" @click="deleteAttendee(scope.row.attendeesId)">Delete</el-button>
          </template>

        </el-table-column>

      </el-table>


      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block news-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(attendeeList.pages)"
          :default-page-size="Number(attendeeList.size)" v-model:current-page="currentPage"
          :hide-on-single-page="true" />
      </div>


    </el-card>
  </section>
</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'


import { updateOrdersApi } from '@/api/order'
import { batchDeleteAttendeesApi, deleteAttendeeApi, downloadAttendeeExcelApi, getAttendeeListByTagAndPaginationApi } from '@/api/attendees'


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





//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  getAttendeeList()
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




/**------------編輯內容相關操作---------------------- */

let updateMemberRegistrationFeeOrder = reactive<Record<string, any>>({

})

const attendeeList = reactive<any>([])

const getAttendeeList = async () => {
  let res = await getAttendeeListByTagAndPaginationApi(currentPage.value, input.value)

  Object.assign(attendeeList, res.data)
}

const findFirstVaildTag = (tagSet: any) => {
  for (let i = 0; i < tagSet.length; i++) {
    if (tagSet[i].status === 0) {
      return tagSet[i];
    }
  }
  return '';
}
/**------------------刪除資料---------------------- */
const deleteAttendee = async (attendeesId: number) => {
  try {
    await ElMessageBox.confirm('確定要刪除這個與會者嗎?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteAttendeeApi(attendeesId)
    getAttendeeList()
    ElMessage.success('刪除成功')
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消刪除')
      return
    }
    console.error("刪除與會者失敗: ", error)
    ElMessage.error('刪除失敗')
    return
  }
}

// 批量刪除
const deleteAttendeeList = async () => {
  selectList = selectList.map((item: any) => item.attendeesId)
  try {
    await ElMessageBox.confirm('確定要批量刪除這些與會者嗎?', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await batchDeleteAttendeesApi(selectList)
    getAttendeeList()
    ElMessage.success('批量刪除成功')
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消批量刪除')
      return
    }
    console.error("批量刪除與會者失敗: ", error)
    ElMessage.error('批量刪除失敗')
    return
  }
}

/**------------------刪除資料---------------------- */
const downloadExcel = async () => {
  try {
    let res = await downloadAttendeeExcelApi()
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '與會者列表.xlsx');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    ElMessage.error("下載失敗" + error)
  }
}








/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {

  getAttendeeList()
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

:deep(.el-tag__content) {
  color: white;
  font-size: 14px;
}

// 設置 table 內的標籤顯示為可滑動區塊
.tag-popover-box {
  overflow: scroll !important;
}
</style>
