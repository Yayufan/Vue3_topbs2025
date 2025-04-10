<template>
  <section class="abstract-reviewer-section">
    <el-card class="abstract-reviewer-card">
      <h1>審稿委員列表</h1>
      <div class="function-bar">
        <div class="display-count">
          <div>當前查詢數量為： {{ reviewerList.total }} 人</div>
        </div>

        <div class="btn-box">
          <el-button type="danger" @click="deleteList">批量刪除</el-button>
          <el-button type="primary" @click="toggleAddReviewer">新增審稿委員</el-button>
        </div>
      </div>
      <el-table :data="reviewerList.records" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="姓名" prop="name" width="150"></el-table-column>
        <el-table-column label="審稿類別" prop="absTypeList" width="150"></el-table-column>
        <el-table-column label="電話" prop="phone" width="150"></el-table-column>
        <el-table-column label="信箱">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.emailList" :key="index">
              {{ item.email }}<span v-if="index != scope.row.emailList.length - 1">, </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="" width="150">
          <template #default="scope">
            <el-button link type="success" @click="toggleEditReviewer(scope.row)">Edit</el-button>
            <el-button link type="danger" @click="deleteReviewer(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="isAdd" title="新增審稿委員" width="450">
      <el-form class="add-form" :model="addReviewerForm" ref="addReviewerFormRef" label-position="top">
        <el-form-item label="稿件類別" prop="absTypeList" :rules="addReviewerFormRules.absTypeList">
          <el-select v-model="addReviewerForm.absTypeList" multiple placeholder="請選擇">
            <el-option label="類別1" value="1"></el-option>
            <el-option label="類別2" value="2"></el-option>
            <el-option label="類別3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :rules="addReviewerFormRules.name">
          <el-input v-model="addReviewerForm.name" placeholder="填寫姓名"></el-input>
        </el-form-item>
        <div>
          <el-form-item v-for="(item, index) in addReviewerForm.emailList" :label="`信箱 ${index + 1}`"
            :prop="'emailList.' + index + '.email'" :rules="addReviewerFormRules.email">
            <div class="email-form-item">
              <el-input v-model="item.email" placeholder="填寫信箱"></el-input>
              <el-button v-if="index != 0" @click="removeEmail(addReviewerForm, index)" type="danger" circle><el-icon>
                  <ElIconMinus />
                </el-icon></el-button>
              <el-button v-if="index === addReviewerForm.emailList.length - 1"
                @click="addReviewerForm.emailList.push({ email: '' })" type="success" circle>
                <el-icon>
                  <ElIconPlus />
                </el-icon>
              </el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="連絡電話" prop="phone" :rules="addReviewerFormRules.phone">
          <el-input v-model="addReviewerForm.phone" placeholder="填寫連絡電話"></el-input>
        </el-form-item>
        <el-form-item label="帳號" prop="account" :rules="addReviewerFormRules.account">
          <el-input v-model="addReviewerForm.account" placeholder="填寫帳號"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password" :rules="addReviewerFormRules.password">
          <el-input v-model="addReviewerForm.password" placeholder="填寫密碼"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPaperReviewer(addReviewerFormRef)">確定</el-button>
          <el-button @click="isAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-drawer v-model="isEdit" title="編輯審稿委員" :with-header="false">
      <el-form class="edit-form" :model="editReviewerForm" ref="editReviewerFormRef" label-position="top">
        <el-form-item label="稿件類別" prop="absTypeList" :rules="addReviewerFormRules.absTypeList">
          <el-select v-model="editReviewerForm.absTypeList" multiple placeholder="請選擇">
            <el-option label="類別1" value="1"></el-option>
            <el-option label="類別2" value="2"></el-option>
            <el-option label="類別3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :rules="addReviewerFormRules.name">
          <el-input v-model="editReviewerForm.name" placeholder="填寫姓名"></el-input>
        </el-form-item>
        <div>
          <el-form-item v-for="(item, index) in editReviewerForm.emailList" :label="`信箱 ${index + 1}`"
            :prop="'emailList.' + index + '.email'" :rules="addReviewerFormRules.email">
            <div class="email-form-item">
              <el-input v-model="item.email" placeholder="填寫信箱"></el-input>
              <el-button v-if="index != 0" @click="removeEmail(editReviewerForm, index)" type="danger" circle><el-icon>
                  <ElIconMinus />
                </el-icon></el-button>
              <el-button v-if="index === editReviewerForm.emailList.length - 1"
                @click="editReviewerForm.emailList.push({ email: '' })" type="success" circle>
                <el-icon>
                  <ElIconPlus />
                </el-icon>
              </el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="連絡電話" prop="phone" :rules="addReviewerFormRules.phone">
          <el-input v-model="editReviewerForm.phone" placeholder="填寫連絡電話"></el-input>
        </el-form-item>
        <el-form-item label="帳號" prop="account" :rules="addReviewerFormRules.account">
          <el-input v-model="editReviewerForm.account" placeholder="填寫帳號"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password" :rules="addReviewerFormRules.password">
          <el-input v-model="editReviewerForm.password" placeholder="填寫密碼"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editReviewer(editReviewerFormRef)">確定</el-button>
          <el-button @click="isEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>


  </section>
</template>
<script setup lang="ts">
import { addPaperReviewerApi, batchDeletePaperReviewerApi, deletePaperReviewerApi, editPaperReviewerApi, getPaperReviewerPageApi } from '@/api/abstract-reviewer';
import type { FormInstance, FormRules } from 'element-plus';


const currentPage = ref(1)


const reviewerList = reactive<any>([])
const getReviewerList = async (page: number, size: number) => {
  let res: any = await getPaperReviewerPageApi(page, size)
  res.data.records.forEach((item: any) => {
    item.emailList = item.emailList.map((item: any) => ({ email: item }))
  })

  Object.assign(reviewerList, res.data)



}
/**----------------------------------------------------------------- */

const isAdd = ref(false)
const addReviewerFormRef = ref<FormInstance>()


const removeEmail = (reviewer: any, index: number) => {
  reviewer.emailList.splice(index, 1)
}

const addReviewerForm = reactive<any>({
  absTypeList: [],
  name: '',
  emailList: [{ email: '' }],
  phone: '',
  account: '',
  password: '',
})

const addReviewerFormRules = reactive<FormRules>({
  absTypeList: [
    { required: true, message: '請選擇審稿類別', trigger: 'change' }
  ],
  name: [
    { required: true, message: '請填寫姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '請填寫電話', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '請填寫帳號', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請填寫密碼', trigger: 'blur' }
  ],
  email: [{ required: true, message: '請填寫信箱', trigger: 'blur' }, { type: 'email', message: 'Please input correct email', trigger: 'blur' }],
})

const toggleAddReviewer = () => {
  isAdd.value = !isAdd.value
}

const addPaperReviewer = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addReviewerForm.emailList = addReviewerForm.emailList.map((item: any) => item.email),
        console.log('submit!', addReviewerForm)
      await addPaperReviewerApi(addReviewerForm)
      isAdd.value = false
      getReviewerList(currentPage.value, 10)
      formEl.resetFields()
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**====================================================== */
const isEdit = ref(false)
const editReviewerFormRef = ref<FormInstance>()
const editReviewerForm = reactive<any>({
  paperReviewerId: 0,
  absTypeList: [],
  name: '',
  emailList: [{ email: '' }],
  phone: '',
  account: '',
  password: '',
})

const toggleEditReviewer = (row: any) => {
  Object.assign(editReviewerForm, row)
  isEdit.value = !isEdit.value
}

const editReviewer = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      editReviewerForm.emailList = editReviewerForm.emailList.map((item: any) => item.email),
        console.log('submit!', editReviewerForm)
      await editPaperReviewerApi(editReviewerForm)
      isEdit.value = false
      getReviewerList(currentPage.value, 10)
      formEl.resetFields()
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**===================================================== */
const deleteReviewer = async (paperReviewer: any) => {
  ElMessageBox({
    title: '提示',
    message: `確定要刪除該審稿委員(${paperReviewer.name})嗎？`,
    type: 'warning',
    showCancelButton: true,
  }).then(async () => {
    await deletePaperReviewerApi(paperReviewer.paperReviewerId)
    getReviewerList(currentPage.value, 10)
  }).catch(() => {
    console.log('取消刪除')
  })
}

//要刪除的對象列表
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}

const deleteList = () => {
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}個審稿委員資料嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      console.log(deleteSelectList)
      let deleteIdList = deleteSelectList.map((item: { paperReviewerId: number }) => item.paperReviewerId)
      await batchDeletePaperReviewerApi(deleteIdList)
      getReviewerList(currentPage.value, 10)
      ElMessage.success('刪除成功');
    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}





onMounted(() => {
  getReviewerList(currentPage.value, 10)
})


</script>
<style lang="scss" scoped>
.abstract-reviewer-section {
  width: 95%;
  margin: 0 auto;

  .abstract-reviewer-card {
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
  margin-bottom: 1rem;

  .display-count {
    font-size: 1.2rem;
    color: #333;
  }

  .btn-box {
    display: flex;

    .el-button {
      text-align: center;
    }
  }
}

.email-form-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .el-input {
    width: 15rem;
  }
}
</style>