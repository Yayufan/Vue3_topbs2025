<!--  -->
<template>
  <div class="content">

    <BasicComponent title="會員管理" :totalCount="memberRes.total + '人'">
      <template v-slot:option-box>
        <div class="btn-box">

          <el-button type="primary" @click="toggleAddDialog">
            新增<el-icon class="el-icon--right">
              <Plus />
            </el-icon>
          </el-button>

          <el-button type="danger" @click="batchDeleteMember"
            :disabled="selectedDeleteMemberList.length > 0 ? false : true">
            刪除<el-icon class="el-icon--right">
              <Delete />
            </el-icon>
          </el-button>

          <el-button type="success" @click="downloadExcel">下載Excel</el-button>
        </div>
      </template>

      <template v-slot:search-box>
        <div class="search-bar">
          <el-input v-model="fetchConditions.input" style="width: 240px" placeholder="輸入內容,Enter查詢"
            @input="fetchMemberListWithPaginationAndStatus" />

          <el-select v-model="fetchConditions.filterStatus" style="width: 240px;" class="filter-status"
            placeholder="請選擇">
            <el-option label="全選" value="">
              <span>全選</span>
            </el-option>
            <el-option label="未繳費" :value="0">
              <span>未繳費</span>
            </el-option>
            <el-option label="待審核" :value="1">
              <span style="color:gray;">已繳費-待確認</span>
            </el-option>
            <el-option label="繳費成功" :value="2">
              <span style="color:green;">繳費成功</span>
            </el-option>
            <el-option label="繳費失敗" :value="3">
              <span style="color:red;">繳費失敗</span>
            </el-option>

            <template #label="{ label, value }">
              <span
                :style="{ color: value == '1' ? 'gray' : value == '2' ? 'green' : value == '3' ? 'red' : 'black' }">{{
                  label }}</span>
            </template>
          </el-select>

        </div>
      </template>

      <template v-slot:data-table>
        <el-table class="member-table" :data="memberRes.records" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />

          <el-table-column fixed prop="firstName" label="名字" width="90" />
          <el-table-column fixed prop="lastName" label="姓氏" width="90" />
          <el-table-column prop="email" label="信箱" width="250" />
          <el-table-column prop="country" label="國家" width="100" />
          <el-table-column prop="remitAccountLast5" label="帳戶後五碼" width="100" />


          <el-table-column prop="status" label="繳費狀態" width="120">
            <template #default="scope">
              <span v-if="scope.row.status == 1" style="color: gray;">已繳費-待確認</span>
              <span v-else-if="scope.row.status == 2" style="color: green;">繳費成功</span>
              <span v-else-if="scope.row.status == 3" style="color: red;">繳費失敗</span>
              <span v-else>未繳費</span>
            </template>
          </el-table-column>

          <el-table-column prop="tagSet" label="標籤" min-width="40" align="center" width="150">
            <template #default="scope">
              <el-popover v-if="scope.row.tagSet.length > 0" placement="left-start" title="標籤" :width="200"
                trigger="hover" class="tag-popover">
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


          <el-table-column label="操作" width="200">
            <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
            <template #default="scope">
              <el-button link type="success" size="small" @click="toggleTagsDialog(scope.row)">
                Tags
              </el-button>
              <el-button link type="primary" size="small" @click="editRow(scope.row)">
                View
              </el-button>
              <el-button link type="danger" size="small" @click="deleteMember(scope.row.memberId)">
                Delete</el-button>

            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-slot:pagination-box>
        <el-pagination layout="prev, pager, next" @current-change="handlePageChange"
          :page-count="Number(memberRes.pages)" :default-page-size="Number(memberRes.size)"
          :hide-on-single-page="false" />
      </template>
    </BasicComponent>
    <el-dialog v-model="tagsDialogIsOpen" title="編輯標籤" width="70%">
      <h1>{{ assignMember.name }}</h1>
      <div class="transfer-box">
        <el-transfer ref="transferPanelRef" v-model="assignMember.tagList" :data="transferDataList"
          :titles="['未擁有', '已擁有']">
          <template #default="{ option }">
            <el-popover v-if="option.isOverParentElementWidth" class="box-item" placement="top" :width="option.width">
              <template #reference>
                <el-tag :color="option.color" size="large" round>{{ option.label }}</el-tag>
              </template>
              <template #default>
                <el-tag :color="option.color" size="large" round>{{ option.label }}</el-tag>
              </template>
            </el-popover>
            <el-tag v-else :color="option.color" size="large" round>{{ option.label }}</el-tag>
          </template>
          <template #left-empty>
            <el-empty :image-size="60" description="No data" />
          </template>
          <template #right-empty>
            <el-empty :image-size="60" description="No data" />
          </template>
        </el-transfer>
      </div>
      <template #footer>
        <el-button @click="cancelTransfer">取消</el-button>
        <el-button type="primary" @click="submitTagsList">保存</el-button>
      </template>
    </el-dialog>



    <!-- 修改時的Drawer -->
    <el-drawer v-model="drawer" title="I am the title" :size="drawerSize">

      <template #header>
        <h4>檢視資料</h4>
      </template>

      <template #default>
        <el-form label-position="top" label-width="auto" :model="updateMemberForm" ref="updateMemberFormRef">

          <el-form-item label="E-Mail" prop="email">
            <el-input disabled v-model="updateMemberForm.email" />
          </el-form-item>

          <el-form-item label="名字" prop="firstName">
            <el-input disabled v-model="updateMemberForm.firstName" />
          </el-form-item>

          <el-form-item label="姓氏" prop="lastName">
            <el-input disabled v-model="updateMemberForm.lastName" />
          </el-form-item>

          <el-form-item label="中文姓名" prop="chineseName">
            <el-input disabled v-model="updateMemberForm.chineseName" placeholder="中文名" style="width: 240px;" />
          </el-form-item>

          <el-form-item label="國家" prop="country">
            <el-input disabled v-model="updateMemberForm.country" />
          </el-form-item>

          <el-form-item label="身份證字號/護照號碼" prop="idCard">
            <el-input disabled v-model="updateMemberForm.idCard" />
          </el-form-item>

          <el-form-item label="飲食偏好" prop="email">
            <el-radio-group disabled v-model="updateMemberForm.food" style="margin-left: 1rem;">
              <el-radio value="葷">葷</el-radio>
              <el-radio value="素">素</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="食物禁忌" prop="foodTaboo">
            <el-input disabled v-model="updateMemberForm.foodTaboo" placeholder="食物禁忌" style="width: 240px;" />
          </el-form-item>

          <el-form-item label="帳號末五碼" prop="remitAccountLast5">
            <el-input disabled v-model="updateMemberForm.remitAccountLast5" />
          </el-form-item>

          <el-form-item label="抬頭" prop="receipt">
            <el-input disabled v-model="updateMemberForm.receipt" />
          </el-form-item>


          <el-form-item label="註冊費" prop="amount">
            <el-input disabled v-model="updateMemberForm.amount" />
          </el-form-item>

          <el-form-item label="會員類別">
            <el-select disabled v-model="updateMemberForm.category">
              <el-option v-for="item in 7" :label="memberEnums[item]" :value="item"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="單位" prop="affiliation">
            <el-input disabled v-model="updateMemberForm.affiliation">
            </el-input>
          </el-form-item>

          <el-form-item label="職稱" prop="jobTitle">
            <el-input disabled v-model="updateMemberForm.jobTitle" />
          </el-form-item>

          <el-form-item label="連絡電話" prop="phone">
            <el-input disabled v-model="updateMemberForm.phone" />
          </el-form-item>

          <el-form-item label="繳費狀態" prop="status">
            <el-select v-model="updateMemberForm.status" disabled placeholder="Select" style="width: 240px;">
              <el-option label="未繳費" :value="0">
                <span>未繳費</span>
              </el-option>
              <el-option label="待審核" :value="1">
                <span style="color:gray;">已繳費-待確認</span>
              </el-option>
              <el-option label="繳費成功" :value="2">
                <span style="color:green;">繳費成功</span>
              </el-option>
              <el-option label="繳費失敗" :value="3">
                <span style="color:red;">繳費失敗</span>
              </el-option>

              <template #label="{ label, value }">
                <span
                  :style="{ color: value == '1' ? 'gray' : value == '2' ? 'green' : value == '3' ? 'red' : 'black' }">{{
                    label }}</span>
              </template>
            </el-select>

          </el-form-item>


        </el-form>
      </template>


      <template #footer>
        <div style="flex: auto">
        </div>
      </template>

    </el-drawer>


    <el-dialog v-model="dialogFormVisible" title="新增會員" :width="dialogWidth">
      <InsertMemberForm @close="closeInsertDialog" />
    </el-dialog>
  </div>




  <!-- </section> -->

</template>

<script setup lang='ts'>
import BasicComponent from '@/layout/components/Basic/index.vue'

import { ref, reactive } from 'vue'
import { Delete, Phone, Plus } from '@element-plus/icons-vue'
import { scrollbarProps, type FormInstance, type FormRules } from 'element-plus'
import { fetchMembersWithPaginationAndStatusApi, getMemberCountApi, updateMemberApi, deleteMemberApi, batchDeleteMemberApi, downloadMemberExcelApi, assignTagsToMember, addVipMemberApi } from '@/api/member'
import { getAllTagsApi } from '@/api/tag'

import countriesData from '@/assets/data/countries.json'

import { memberEnums } from '@/enums/memberEnum'

import { Member } from '@/api/member/type'
import { tryCatch } from '@/utils/tryCatch'
import InsertMemberForm from './components/InsertMemberForm.vue'

const countries = ref(countriesData)



const downloadExcel = async () => {
  let res = await downloadMemberExcelApi()
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '會員列表.xlsx');
  document.body.appendChild(link);
  link.click();
}

//查詢內容
let input = ref('')

//篩選審核狀態,預設找已經過審的
let filterStatus = ref('')





/**---------------------------
 * @description 管理獲取資料 
 *
 * @returns fetchConditions, memberRes, fetchMemberListWithPaginationAndStatus, handlePageChange
 * 
*/
const useFetchDataManagement = () => {

  // 會員列表返回的數據結構
  interface MemberResInterface {
    current: number;
    pages: number;
    records: Array<Member>;
    size: number;
    total: number;
  }

  // 分頁及篩選條件
  const fetchConditions = ref({
    currentPage: 1,
    input: '',
    filterStatus: ''
  })

  // 會員列表數據
  const memberRes = ref<MemberResInterface>({
    current: 1,
    pages: 1,
    records: [],
    size: 10,
    total: 0
  })

  // 根據分頁及篩選條件獲取會員列表
  const fetchMemberListWithPaginationAndStatus = async () => {
    const { res, error }: any = await tryCatch(fetchMembersWithPaginationAndStatusApi(fetchConditions.value.currentPage, 10, fetchConditions.value.filterStatus, fetchConditions.value.input));
    if (error || res.code !== 200) {
      ElMessage.error(error || res.msg || '獲取會員列表失敗');
    }
    memberRes.value = res.data;
  }

  // 頁碼改變時的處理函數
  const handlePageChange = (page: number) => {
    fetchConditions.value.currentPage = page;
    fetchMemberListWithPaginationAndStatus();
  }

  // 監聽輸入框變化，重置頁碼並重新獲取會員列表
  watch(() => fetchConditions.value.filterStatus, (newVal, oldVal) => {
    fetchConditions.value.currentPage = 1;
    fetchMemberListWithPaginationAndStatus();
  })

  return {
    fetchConditions,
    memberRes,
    fetchMemberListWithPaginationAndStatus,
    handlePageChange
  }
}

const { fetchConditions, memberRes, fetchMemberListWithPaginationAndStatus, handlePageChange } = useFetchDataManagement();



/** --------- 刪除相關variable及function -------------- */
const useDeleteMemberManagement = () => {

  const selectedDeleteMemberList = ref<Member[]>([])

  const deleteMember = async (memberId: string) => {
    ElMessageBox.confirm(`確定要刪除此資料嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // 用户選擇確認，繼續操作
      const { res, error }: any = await tryCatch(deleteMemberApi(memberId));
      if (error || res.code !== 200) {
        ElMessage.error(error || res.msg || '刪除會員失敗');
        return;
      }
      fetchMemberListWithPaginationAndStatus();
      ElMessage.success('刪除成功');
    }).catch((err) => {
    });
  }

  const handleSelectionChange = (val: Member[]) => {
    selectedDeleteMemberList.value = val;
  }

  const batchDeleteMember = async () => {
    if (selectedDeleteMemberList.value.length < 1) {
      ElMessage.error("請至少勾選一筆資料進行刪除");
      return;
    }
    ElMessageBox.confirm(`確定要刪除這${selectedDeleteMemberList.value.length}個會員資料嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      let deleteIdList = selectedDeleteMemberList.value.map(item => item.memberId);
      const { res, error }: any = await tryCatch(batchDeleteMemberApi(deleteIdList));
      if (error || res.code !== 200) {
        ElMessage.error(error || res.msg || '批量刪除會員失敗');
        return;
      }
      fetchMemberListWithPaginationAndStatus();
      ElMessage.success('刪除成功');
    }).catch((err) => {
    });
  }

  return {
    selectedDeleteMemberList,
    deleteMember,
    handleSelectionChange,
    batchDeleteMember
  }
}

const { selectedDeleteMemberList, deleteMember, handleSelectionChange, batchDeleteMember } = useDeleteMemberManagement();



/**-------------表單相關variable及function------------------------- */

//是否顯示表單dialog
const dialogFormVisible = ref(false)


const checkConfirmPassword = (rule: any, value: string, callback: any) => {
  // if (insertMemberFormData.password !== value) {
  //   callback(new Error('兩次密碼不一致'))
  // } else {
  //   callback()
  // }
}



//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}

const closeInsertDialog = () => {
  dialogFormVisible.value = false
  fetchMemberListWithPaginationAndStatus()
}


/**------------編輯內容相關操作---------------------- */

//drawer的開關
const drawer = ref(false)

//drawer內,取消按鈕
const cancelClick = () => {
  drawer.value = false
}

//編輯的表單元素本身

const updateMemberFormRef = ref()

let updateMemberForm = reactive({
  memberId: "",
  email: "",
  chineseName: "",
  firstName: "",
  lastName: "",
  country: "",
  remitAccountLast5: "",
  affiliation: "",
  jobTitle: "",
  phone: "",
  status: "",
  food: "",
  foodTaboo: "",
  receipt: "",
  idCard: "",
  category: 1,
  amount: "",
})


//drawer內,確認按鈕
const confirmClick = async () => {
  //沒有抓到的這個Dom直接返回
  updateMemberFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await updateMemberApi(updateMemberForm)
      drawer.value = false
      ElMessage.success("修改完成")
      fetchMemberListWithPaginationAndStatus()

      // await getMemberByPagination(currentPage.value, 10)


    } else {
      ElMessage.error("請完整填入資訊")
    }
  })

}

const editRow = (member: any): void => {
  Object.assign(updateMemberForm, member)
  drawer.value = true
}



/**-------------------標籤-------------------- */
let tagsDialogIsOpen = ref(false);
let assignMember = reactive<any>({});

let tagsList = reactive<any>([]);

let transferDataList = reactive<any>([]);



const getTagsList = async () => {
  let res = await getAllTagsApi()
  Object.assign(tagsList, res.data);
  res.data.forEach((item: any) => {
    transferDataList.push({
      label: item.name,
      key: item.tagId,
      disabled: item.status === 1,
      color: item.color,
      isOverParentElementWidth: false,
      width: 0
    })
  })
}

const findFirstVaildTag = (tagSet: any) => {
  for (let i = 0; i < tagSet.length; i++) {
    if (tagSet[i].status === 0) {
      return tagSet[i];
    }
  }
  return '';
}

const toggleTagsDialog = async (member: any) => {
  assignMember = member;
  assignMember.tagList = Array.from(member.tagSet).map((item: any) => item.tagId);
  tagsDialogIsOpen.value = true;
}

const cancelTransfer = () => {
  tagsDialogIsOpen.value = false;
}

const submitTagsList = async () => {
  let data = {
    memberId: assignMember.memberId,
    targetTagIdList: assignMember.tagList
  }
  let res = await assignTagsToMember(data);
  fetchMemberListWithPaginationAndStatus()

  // getMemberByPagination(currentPage.value, 10);
  tagsDialogIsOpen.value = false;
}

/**====================處理新增與修改RWD================== */
const dialogWidth = ref('45%')
const drawerSize = ref('45%')


const handleDialogWidthAndDrawerSize = () => {
  if (window.innerWidth < 768) {
    dialogWidth.value = '90%'
    drawerSize.value = '90%'
  } else {
    dialogWidth.value = '45%'
    drawerSize.value = '45%'
  }

}


const transferPanelRef = ref();
watch(() => transferPanelRef.value, (newVal) => {
  if (newVal) {
    // 獲取所有的 transfer body 元素
    const transferPanelBodyList = transferPanelRef.value.$el.querySelectorAll('.el-transfer-panel__body');
    // 遍歷 body 元素
    transferPanelBodyList.forEach((transferPanelBody: any) => {
      // 獲取 body 寬度
      const transferPanelBodyWidth: number = Number(getComputedStyle(transferPanelBody).width.split('px')[0]);
      //獲取裡面所有的 tag label
      const transferPanelBodyItemTagContent = transferPanelBody.querySelectorAll('.el-tag__content');
      // 遍歷所有的 tag 元素找出寬度超過父元素的
      transferPanelBodyItemTagContent.forEach((item: any, index: number) => {
        const width = Number(getComputedStyle(item).width.split('px')[0]);
        if (width > transferPanelBodyWidth) {
          let foundTag = transferDataList.find((tag: any) => tag.label === item.textContent);
          foundTag.isOverParentElementWidth = true;
          foundTag.width = width + 40;
        }
      });

    });
  }
});

/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  // getMemberByPagination(1, 10)
  fetchMemberListWithPaginationAndStatus()
  getTagsList()

  window.addEventListener('resize', handleDialogWidthAndDrawerSize);

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
  margin-bottom: 1%;

  .total-count {
    font-weight: 600;
  }

}

.filter-status {
  margin-left: 10px;
}


.member-table {
  width: 100%;
  height: auto;
}


.member-pagination {
  margin-top: 1%;
  margin-bottom: 1%;
}

.gender-other {
  width: 100px;
  margin-left: 1rem;
}

.transfer-box {
  display: flex;
  justify-content: center;
}

.tag-item {
  display: flex;
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

:deep(.el-tag__close) {
  color: red;
}

.insert-form {
  padding: 2rem;
  width: 80%;
  margin-inline: auto;

  .el-select {
    width: 100%;
  }

  .el-input {
    width: 100%;
  }

  .category {

    :deep(.el-radio-group) {
      flex-direction: column;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }

    :deep(.el-form-item__error) {
      position: absolute;
      top: 0.5rem;
      left: 10rem;
      width: 20rem;

      @media screen and (max-width: 768px) {
        left: 13rem;
      }
    }

    :deep(.el-select) {
      width: 150px;
    }

  }

  .phone-section {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;

    .country-code {
      width: 30%;
    }

    .phone {
      width: 70%;
    }
  }

  .title-form-item {
    width: 100%;

    .title-radio-group {
      width: 100%
    }
  }


}

// 設置 transfer 面板寬度
:deep(.el-transfer-panel) {
  width: 300px;

  .el-transfer-panel__body {
    overflow: hidden;
  }

}

// 設置 transfer 面板內列表為 column 並設置間距
:deep(.el-transfer-panel__list) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}


// 設置 table 內的標籤顯示為可滑動區塊
.tag-popover-box {
  overflow: scroll !important;
}
</style>
