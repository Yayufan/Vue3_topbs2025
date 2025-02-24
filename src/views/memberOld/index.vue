<!--  -->
<template>

  <section class="member-section">
    <el-card class="member-card">
      <h1>會員管理</h1>

      <!-- 如果要用兩種註冊方式再考慮使用這個 -->
      <div class="function-bar">
        <el-button type="primary" @click="toggleAddDialog">
          新增會員<el-icon class="el-icon--right">
            <Plus />
          </el-icon>
        </el-button>

        <el-button type="danger" @click="deleteList" :disabled="deleteSelectList.length > 0 ? false : true">
          刪除會員<el-icon class="el-icon--right">
            <Delete />
          </el-icon>
        </el-button>
      </div>

      <el-table class="member-table" :data="memberList.records" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="name" label="姓名" width="90" />
        <el-table-column prop="email" label="信箱" min-width="150" />
        <el-table-column prop="department" label="院所" min-width="150" />
        <el-table-column prop="jobTitle" label="職稱" width="120" />
        <el-table-column prop="phone" label="手機" width="120" />



        <el-table-column fixed="right" label="操作" width="120">
          <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editRow(scope.row)">
              Edit
            </el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.row.memberId)">
              Delete</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 
      分頁插件 total為總資料數(這邊設置20筆),  default-page-size代表每頁顯示資料(預設為10筆,這邊設置為5筆) 
      current-page當前頁數,官方建議使用v-model與current-page去與自己設定的變量做綁定,
    -->
      <div class="example-pagination-block member-pagination">
        <el-pagination layout="prev, pager, next" :page-count="Number(memberList.pages)"
          :default-page-size="Number(memberList.size)" v-model:current-page="currentPage" :hide-on-single-page="true" />
      </div>



      <!-- 新增對話框 -->
      <ElDialog v-model="dialogFormVisible" title="新增會員" width="500">

        <el-form :model="insertMemberFormData" ref="form" :rules="insertMemberRules">

          <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
            <el-input v-model="insertMemberFormData.email" autocomplete="off" />
          </el-form-item>

          <el-form-item label="密碼" :label-width="formLabelWidth" prop="password">
            <el-input v-model="insertMemberFormData.password" autocomplete="off" />
          </el-form-item>

          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="insertMemberFormData.name" autocomplete="off" />
          </el-form-item>

          <el-form-item label="院所" :label-width="formLabelWidth" prop="department">
            <el-input v-model="insertMemberFormData.department" autocomplete="off" />
          </el-form-item>

          <el-form-item label="職稱" :label-width="formLabelWidth" prop="jobTitle">
            <el-input v-model="insertMemberFormData.jobTitle" autocomplete="off" />
          </el-form-item>

          <el-form-item label="聯絡電話" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="insertMemberFormData.phone" autocomplete="off" />
          </el-form-item>


        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="dialogFormVisible = false">取消</ElButton>
            <ElButton type="primary" @click="submitInsertForm(form)">
              送出
            </ElButton>
          </div>
        </template>
      </ElDialog>



      <!-- 修改時的Drawer -->
      <!-- 新增/修改時的drawer -->
      <el-drawer v-model="drawer" title="I am the title">

        <template #header>
          <h4>會員資料修改</h4>
        </template>


        <template #default>
          <el-form label-position="top" label-width="auto" :model="updateMemberForm" :rules="updateMemberFormRules"
            ref="updateMemberFormRef">
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="updateMemberForm.email" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="updateMemberForm.name" />
            </el-form-item>
            <el-form-item label="院所" prop="department">
              <el-input v-model="updateMemberForm.department" />
            </el-form-item>
            <el-form-item label="職稱" prop="jobTitle">
              <el-input v-model="updateMemberForm.jobTitle" />
            </el-form-item>
            <el-form-item label="聯絡電話" prop="phone">
              <el-input v-model="updateMemberForm.phone" />
            </el-form-item>
          </el-form>
        </template>


        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="confirmClick()">送出</el-button>
          </div>
        </template>


      </el-drawer>




    </el-card>

  </section>

</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getMemberApi, getMemberByPaginationApi, getMemberByPaginationByStatusApi, addMemberApi, updateMemberApi, deleteMemberApi, batchDeleteMemberApi } from '@/api/member'

//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'


/**--------------顯示數據相關---------------------------- */
//最新消息List
let memberList = reactive<Record<string, any>>({
})

//設定分頁組件,currentPage當前頁數
let currentPage = ref(1)


const getMember = async (page: number, size: number) => {
  let res = await getMemberByPaginationByStatusApi(page, size, "1")
  Object.assign(memberList, res.data)
}


//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  getMember(value, 10)
})


/** --------- 刪除相關variable及function -------------- */

//要刪除的對象列表
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}

//刪除最新消息
const deleteRow = (id: number): void => {
  ElMessageBox.confirm(`確定要刪除此會員嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await deleteMemberApi(id)
    getMember(currentPage.value, 10)

    ElMessage.success('刪除成功');
  }).catch((err) => {
    console.log(err)
  });
}

//批量刪除最新消息的function
const deleteList = () => {
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}個消息嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      let deleteIdList = deleteSelectList.map((item: { memberId: string }) => item.memberId)
      await batchDeleteMemberApi(deleteIdList)
      getMember(currentPage.value, 10)
      ElMessage.success('刪除成功');
    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}

/**-------------表單相關variable及function------------------------- */

//是否顯示表單dialog
const dialogFormVisible = ref(false)

//表單實例
const form = ref()

//表單數據
const insertMemberFormData = reactive({
  email: '',
  password: '',
  name: '',
  department: '',
  jobTitle: '',
  phone: '',
})

//表單校驗規則
const insertMemberRules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: 'E-mail不能為空',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '請輸入正確的E-mail格式',
      trigger: 'blur'
    },
  ],
  password: [
    {
      required: true,
      message: '密碼不能為空',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: '姓名不能為空',
      trigger: 'blur',
    }
  ],
  department: [
    {
      required: true,
      message: '院所不能為空',
      trigger: 'blur',
    }
  ],
  jobTitle: [
    {
      required: true,
      message: '職稱不能為空',
      trigger: 'blur',
    }
  ],
  phone: [
    {
      required: true,
      message: '電話不能為空',
      trigger: 'blur',
    },
  ],

})

//顯示新增Dialog
const toggleAddDialog = () => {
  dialogFormVisible.value = true
}

//送出表單方法
const submitInsertForm = (form: FormInstance | undefined) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      try {
        //呼叫父組件給的新增function API
        await addMemberApi(insertMemberFormData)
        ElMessage.success('新增成功');
        getMember(currentPage.value, 10)

      } catch (err: any) {
        console.log(err)
      }
      //最終都將這個dialog關掉
      dialogFormVisible.value = false

    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
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

//編輯的表單內容
let updateMemberForm = reactive({
  email: '',
  name: '',
  department: '',
  jobTitle: '',
  phone: '',

})

//編輯表單的校驗規則
const updateMemberFormRules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: 'E-mail不能為空',
      trigger: 'change',
    },
    {
      type: 'email',
      message: '請輸入正確的E-mail格式',
      trigger: 'change'
    },
  ],
  name: [
    {
      required: true,
      message: '姓名不能為空',
      trigger: 'change',
    }
  ],
  department: [
    {
      required: true,
      message: '院所不能為空',
      trigger: 'change',
    }
  ],
  jobTitle: [
    {
      required: true,
      message: '職稱不能為空',
      trigger: 'change',
    }
  ],
  phone: [
    {
      required: true,
      message: '電話不能為空',
      trigger: 'change',
    },
  ],

})

//drawer內,確認按鈕
const confirmClick = async () => {
  //沒有抓到的這個Dom直接返回
  updateMemberFormRef.value.validate(async (valid: boolean) => {
    if (valid) {

      await updateMemberApi(updateMemberForm)
      drawer.value = false
      ElMessage.success("修改完成")
      await getMember(currentPage.value, 10)

    } else {
      ElMessage.error("請完整填入資訊")
    }
  })

}

//編輯會員資料按鈕
const editRow = (member: any): void => {
  Object.assign(updateMemberForm, member)
  drawer.value = true
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

.member-table {
  width: 100%;
  height: auto;
}


.member-pagination {
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
