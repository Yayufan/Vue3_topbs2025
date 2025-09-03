<!--  -->
<template>

  <section class="member-section">
    <el-card class="member-card">
      <h1>會員管理</h1>

      <!-- 如果要用兩種註冊方式再考慮使用這個 -->
      <div class="function-bar">
        <div class="display-count">
          <div class="total-count">總數量為： {{ memberCount }} 人</div>
          <div>當前查詢數量為： {{ memberList.total }} 人</div>
        </div>

        <div class="btn-box">

          <el-button type="primary" @click="toggleAddDialog">
            新增<el-icon class="el-icon--right">
              <Plus />
            </el-icon>
          </el-button>

          <el-button type="danger" @click="deleteList" :disabled="deleteSelectList.length > 0 ? false : true">
            刪除<el-icon class="el-icon--right">
              <Delete />
            </el-icon>
          </el-button>

          <el-button type="success" @click="downloadExcel">下載Excel</el-button>
        </div>
      </div>

      <div class="search-bar">
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢"
          @keydown.enter="getMemberByPagination(currentPage, 10)" />

        <el-select v-model="filterStatus" style="width: 240px;" class="filter-status" placeholder="請選擇">
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
            <span :style="{ color: value == '1' ? 'gray' : value == '2' ? 'green' : value == '3' ? 'red' : 'black' }">{{
              label }}</span>
          </template>
        </el-select>

      </div>

      <el-table class="member-table" :data="memberList.records" @selection-change="handleSelectionChange">
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
              <!-- <el-input v-model="updateMemberForm.food" disabled /> -->
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
            <!-- <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="confirmClick()">送出</el-button> -->
          </div>
        </template>

      </el-drawer>


      <el-dialog v-model="dialogFormVisible" title="新增會員" :width="dialogWidth">
        <el-form class="insert-form" label-position="top" label-width="auto" :model="insertMemberFormData" ref="form"
          :rules="insertFormRules" :show-message="true">
          <el-form-item label="國家" prop="country">
            <el-select v-model="insertMemberFormData.country" filterable @change="changedCountry" placeholder="國家">
              <el-option v-for="item in countries" :value="item" :label="item" :key="item"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="title-form-item" label="稱謂" prop="title">
            <el-radio-group class="title-radio-group" v-model="insertMemberFormData.title" placeholder="稱謂">
              <el-radio label="Prof." value="Prof."></el-radio>
              <el-radio label="Dr." value="Dr."></el-radio>
              <el-radio label="Mr." value="Mr."></el-radio>
              <el-radio label="Ms." value="Ms."></el-radio>
            </el-radio-group>

          </el-form-item>
          <el-form-item v-if="insertMemberFormData.country === 'Taiwan'" label="中文姓名" prop="chineseName">
            <el-input v-model="insertMemberFormData.chineseName" placeholder="中文名" />
          </el-form-item>
          <el-form-item label="英文名" prop="firstName">
            <el-input v-model="insertMemberFormData.firstName" placeholder="名字" />
          </el-form-item>
          <el-form-item label="英文姓氏" prop="lastName">
            <el-input v-model="insertMemberFormData.lastName" placeholder="姓氏" />
          </el-form-item>
          <el-form-item v-if="insertMemberFormData.country !== 'Taiwan'" label="中文姓名">
            <el-input v-model="insertMemberFormData.chineseName" placeholder="中文名" />
          </el-form-item>
          <el-form-item label="E-mail" prop="email">
            <el-input v-model="insertMemberFormData.email" placeholder="E-mail" />
          </el-form-item>
          <el-form-item label="密碼" prop="password">
            <el-input v-model="insertMemberFormData.password" placeholder="密碼" type="password" />
          </el-form-item>
          <el-form-item label="確認密碼" prop="confirmPassword">
            <el-input v-model="insertMemberFormData.confirmPassword" placeholder="確認密碼" type="password" />
          </el-form-item>
          <el-form-item label="所屬機構" prop="affiliation">
            <el-input v-model="insertMemberFormData.affiliation" placeholder="單位" />
          </el-form-item>
          <el-form-item label="職稱" prop="jobTitle">
            <el-input v-model="insertMemberFormData.jobTitle" placeholder="職稱" />
          </el-form-item>
          <el-form-item label="身份證字號/護照號碼" prop="idCard">
            <el-input v-model="insertMemberFormData.idCard" placeholder="身份證字號/護照號碼" />
          </el-form-item>
          <div class="phone-section">
            <el-form-item label="國碼" prop="countryCode" class="country-code">
              <el-input v-model="insertMemberFormData.countryCode" />
            </el-form-item>
            -
            <el-form-item label="連絡電話" prop="phone" class="phone">
              <el-input v-model="insertMemberFormData.phone" placeholder="連絡電話" />
            </el-form-item>
          </div>
          <el-form-item label="食物偏好" prop="food">
            <el-radio-group v-model="insertMemberFormData.food" style="margin-left: 1rem;">
              <el-radio value="葷">葷</el-radio>
              <el-radio value="素">素</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="食物禁忌" prop="foodTaboo">
            <el-input v-model="insertMemberFormData.foodTaboo" placeholder="食物禁忌" style="width: 240px;" />
          </el-form-item>
          <el-form-item label="抬頭" prop="receipt">
            <el-input v-model="insertMemberFormData.receipt" placeholder="抬頭" />
          </el-form-item>
          <el-form-item class="category required" label="類別" prop="category">
            <el-select v-model="insertMemberFormData.category">
              <el-option label="MVP" :value="4"></el-option>
              <el-option label="講者" :value="5"></el-option>
              <el-option label="座長" :value="6"></el-option>
              <el-option label="Staff" :value="7"></el-option>
            </el-select>
          </el-form-item>


        </el-form>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submitInsertForm(form)">送出</el-button>
          </div>
        </template>

      </el-dialog>
    </el-card>

  </section>

</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { Delete, Phone, Plus } from '@element-plus/icons-vue'
import { scrollbarProps, type FormInstance, type FormRules } from 'element-plus'
import { getMemberByPaginationByStatusApi, getMemberCountApi, updateMemberApi, deleteMemberApi, batchDeleteMemberApi, downloadMemberExcelApi, assignTagsToMember, addVipMemberApi } from '@/api/member'
import { getAllTagsApi } from '@/api/tag'

import countriesData from '@/assets/data/countries.json'

import { memberEnums } from '@/enums/memberEnum'

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

//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()
//formLabel 寬度
const formLabelWidth = '140px'

//查詢內容
let input = ref('')

//篩選審核狀態,預設找已經過審的
let filterStatus = ref('')

//獲取同意書總數
let memberCount = ref(0)



/**--------------顯示數據相關---------------------------- */


const getMemberCount = async () => {
  let res = await getMemberCountApi()
  memberCount.value = res.data
}

const setTagEffect = (status: number) => {
  if (status === 1) {
    return 'light'
  }
}


//獲取會員List

let memberList = reactive<Record<string, any>>({
  records: [{
    memberId: 0,
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    idCard: "",
    remitAccountLast5: "",
    affiliation: "",
    jobTitle: "",
    phone: "",
    status: "",
    tagSet: [],
  }]
})

//設定分頁組件,currentPage當前頁數
let currentPage = ref(1)



const getMemberByPagination = async (page: number, size: number) => {
  let res = await getMemberByPaginationByStatusApi(page, size, filterStatus.value, input.value)
  Object.assign(memberList, res.data)
}


//監聽當前頁數的變化,如果有更動就call API 獲取數組數據
watch(currentPage, (value, oldValue) => {
  getMemberByPagination(value, 10)
})


watch(filterStatus, (value, oldValue) => {
  getMemberByPagination(currentPage.value, 10)
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

//刪除同意書
const deleteRow = (id: number): void => {
  ElMessageBox.confirm(`確定要刪除此資料嗎？`, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await deleteMemberApi(id)
    getMemberByPagination(currentPage.value, 10)

    ElMessage.success('刪除成功');
  }).catch((err) => {
  });
}

//批量刪除同意書的function
const deleteList = () => {
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}個會員資料嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      let deleteIdList = deleteSelectList.map((item: { memberId: string }) => item.memberId)
      await batchDeleteMemberApi(deleteIdList)
      getMemberByPagination(currentPage.value, 10)
      ElMessage.success('刪除成功');
    }).catch((err) => {
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
  title: 'Prof.',
  firstName: '',
  lastName: '',
  chineseName: '',
  email: '',
  password: '',
  confirmPassword: '',
  affiliation: '',
  jobTitle: '',
  idCard: '',
  country: '',
  receipt: '',
  phone: '',
  countryCode: '',
  phoneNum: '',
  food: '葷',
  foodTaboo: '',
  category: 4,
  categoryExtra: '',
  verificationCode: '',
  verificationKey: ''
})

const changedCountry = () => {

}

const checkChineseName = (rule: any, value: string, callback: any) => {
  if (insertMemberFormData.country === 'Taiwan' && !value) {
    callback(new Error('請輸入中文姓名'))
  } else {
    callback()
  }
}

const checkConfirmPassword = (rule: any, value: string, callback: any) => {
  if (insertMemberFormData.password !== value) {
    callback(new Error('兩次密碼不一致'))
  } else {
    callback()
  }
}

const codeMap: Record<string, number> = {
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 34,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  O: 35,
  P: 23,
  Q: 24,
  R: 25,
  S: 26,
  T: 27,
  U: 28,
  V: 29,
  W: 32,
  X: 30,
  Y: 31,
  Z: 33,
};

const checkIdCard = (rule: any, value: string, callback: any) => {
  if (insertMemberFormData.country !== 'Taiwan') {
    if (!value) {
      return callback(new Error("請輸入身份證字號/護照號碼"));
    } else {
      return callback();
    }
  } else {

    if (!/^[A-Z][0-9]{9}$/.test(value)) {
      callback({ valid: false, message: "身份證格式不正確" });
    }

    const placeCode = codeMap[value[0]];
    if (!placeCode) {
      callback({ valid: false, message: "首碼無效" });
    }

    const bodyCode = value.substring(1, 9);
    const lastCode = value[9];
    const calHead = (num: number): number =>
      Math.floor(num / 10) * 1 + (num % 10) * 9;
    const calBody = (code: string): number => {
      let sum = 0;
      for (let i = 0; i < code.length; i++) {
        sum += parseInt(code[i]) * (8 - i);
      }
      return sum;
    };
    const idSum =
      calHead(placeCode) + calBody(bodyCode) + parseInt(lastCode) * 1;
    const isValid = idSum % 10 === 0;
    if (!isValid) {
      callback({ valid: false, message: "身分證號不合法" });
    } else {
      callback();
    }
  }
}

const insertFormRules = reactive<FormRules>({
  firstName: [
    {
      required: true,
      message: '名字不能為空',
      trigger: 'blur',
    },
  ],
  lastName: [
    {
      required: true,
      message: '姓氏不能為空',
      trigger: 'blur',
    },
  ],
  country: [
    {
      required: true,
      message: '國家不能為空',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'E-mail不能為空',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '請輸入正確的E-mail格式',
      trigger: 'blur',
    },
  ],
  affiliation: [
    {
      required: true,
      message: '單位不能為空',
      trigger: 'blur',
    },
  ],
  jobTitle: [
    {
      required: true,
      message: '職稱不能為空',
      trigger: 'blur',
    },
  ],

  chineseName: {
    required: true,
    message: '中文姓名不能為空',
    trigger: 'blur',
  },

  password: [
    {
      required: true,
      message: '密碼不能為空',
      trigger: 'blur',
    },
  ],

  confirmPassword: [
    {
      required: true,
      message: '請再次輸入密碼',
      trigger: 'blur',
    },
    {
      validator: checkConfirmPassword,
      trigger: 'blur',
    },
  ],
  idCard: {
    required: true,
    // message: '身份證字號/護照號碼不能為空',
    validator: checkIdCard,
    trigger: 'blur',
  },
  categoryExtra: {
    required: true,
    message: '請選擇類別',
    validator: (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('請選擇類別'))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  },
  category: {
    required: true,
    message: '請選擇類別',
    trigger: 'blur',
  },
  countryCode: {
    required: true,
    message: '國碼不能為空',
    trigger: 'change',
  },
  phone: {
    required: true,
    message: '連絡電話不能為空',
    trigger: 'blur',
  },
  title: {
    required: true,
    message: '稱謂不能為空',
    trigger: 'blur',
  },
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
        await addVipMemberApi(insertMemberFormData)
        ElMessage.success('新增成功');
        form.resetFields()
        dialogFormVisible.value = false
        getMemberByPagination(currentPage.value, 10)

      } catch (err: any) {
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

//編輯表單的校驗規則
const updateMemberFormRules = reactive<FormRules>({
  firstName: [
    {
      required: true,
      message: '名字不能為空',
      trigger: 'change',
    },
  ],
  lastName: [
    {
      required: true,
      message: '姓氏不能為空',
      trigger: 'change',
    },
  ],
  country: [
    {
      required: true,
      message: '國家不能為空',
      trigger: 'change',
    },
  ],

  phone: [
    {
      required: true,
      message: '手機號碼不能為空',
      trigger: 'change',
    }
  ],
  email: [
    {
      required: true,
      message: 'E-mail不能為空',
      trigger: 'change',
    },
    {
      type: 'email',
      message: '請輸入正確的E-mail格式',
      trigger: 'change',
    },
  ],
  affiliation: [
    {
      required: true,
      message: '單位不能為空',
      trigger: 'change',
    },
  ],
  jobTitle: [
    {
      required: true,
      message: '職稱不能為空',
      trigger: 'change',
    },
  ],
  status: [
    {
      required: true,
      message: '請選擇審核狀態',
      trigger: 'change',
    },
  ],
  chineseName: {
    required: true,
    message: '中文姓名不能為空',
    trigger: 'change',
  },
  title: {
    required: true,
    message: '稱謂不能為空',
    trigger: 'change',
  },

})

//drawer內,確認按鈕
const confirmClick = async () => {
  //沒有抓到的這個Dom直接返回
  updateMemberFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await updateMemberApi(updateMemberForm)
      drawer.value = false
      ElMessage.success("修改完成")
      await getMemberByPagination(currentPage.value, 10)


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
  getMemberByPagination(currentPage.value, 10);
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
  getMemberByPagination(1, 10)
  getMemberCount()
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
