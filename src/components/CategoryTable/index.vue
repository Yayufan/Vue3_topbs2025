<!--  -->
<template>
  <!-- <el-button @click="currentForm">獲取</el-button> -->

  <div class="function-bar">
    <el-button type="primary" @click="addCategory('0')">
      新增類別<el-icon class="el-icon--right">
        <Plus />
      </el-icon>
    </el-button>

    <el-button type="danger" @click="batchDeleteCategory()" :disabled="deleteSelectList.length > 0 ? false : true">
      刪除類別<el-icon class="el-icon--right">
        <Delete />
      </el-icon>
    </el-button>

  </div>

  <el-divider />
  <el-table :data="categoryTable" style="width: 100%; margin-bottom: 20px" row-key="id"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="label" label="類別名稱" width="250px" sortable />
    <el-table-column prop="description" label="類別描述" sortable />
    <el-table-column label="操作" fixed="right" width="200px">
      <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
      <template #default="scope">
        <el-button link type="primary" size="small" :icon="Plus" @click="addCategory(scope.row)">
          新增
        </el-button>
        <el-button link type="primary" size="small" :icon="Edit" @click="editCategory(scope.row)">
          編輯
        </el-button>
        <el-button link type="danger" size="small" :icon="Delete" @click="deleteCategory(scope.row, scope.row.title)">
          刪除</el-button>
      </template>

    </el-table-column>
  </el-table>

  <!-- 新增/修改時的drawer -->
  <el-drawer v-model="drawer" title="I am the title">

    <template #header>
      <h4>{{ drawerTitle }}</h4>
    </template>


    <template #default>
      <el-form label-position="top" label-width="auto" :model="categoryForm" :rules="categoryFormRules"
        ref="categoryFormRef">
        <el-form-item label="上級類別" prop="parentId">
          <el-tree-select v-model="categoryForm.parentId" value-key="id" :data="categoryList" check-strictly
            :render-after-expand="false" style="width: 240px" :empty-values="[null, undefined]" :value-on-clear=null>
          </el-tree-select>
        </el-form-item>

        <el-form-item label="類別名稱" prop="label">
          <el-input v-model="categoryForm.label" />
        </el-form-item>
        <el-form-item label="類別描述" prop="description">
          <el-input v-model="categoryForm.description" />
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


</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { Plus, Delete, Edit } from "@element-plus/icons-vue"
import type { FormInstance, FormRules, UploadRawFile, UploadProps } from 'element-plus'

const props = defineProps(['categoryTable', 'saveOrUpdateCategory', 'deleteCategory', 'batchDeleteCategory', 'group'])
const categoryFormRef = ref()

//類別表單,用於新增/修改
let categoryForm = reactive({
  id: null,
  parentId: null,
  label: '',
  description: '',
  group: ''
})

categoryForm.group = props.group

//初始化類別表單,在某些function中對表單進行初始化
let initCategoryForm = { ...categoryForm }

/**
 * 表單校驗規則
 */
const categoryFormRules = reactive<FormRules>({
  parentId: [
    {
      type: 'string',
      message: '必須要有parentId',
      trigger: 'blur',
    },
  ],
  label: [
    {
      required: true,
      message: '名稱不能為空',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: '描述不能為空',
      trigger: 'blur',
    }
  ]
})


//初始化一個類別table
let categoryTable = reactive<any>([])

//初始化類別數組,他具有一個頂級類別,這是後端沒有的
let categoryList = reactive([
  {
    id: '0',
    label: "頂層類別",
    children: <any>[]
  }
])

//如果傳給組件時就賦值
categoryList[0].children = props.categoryTable
categoryTable = props.categoryTable

//如果父組件的資料為異步傳遞就使用watch
watch(() => { return props.categoryTable }, (newValue, oldValue) => {
  categoryList[0].children = newValue
})

//如果父組件的資料為異步傳遞就使用watch
watch(() => { return props.categoryTable }, (newValue, oldValue) => {
  categoryTable = newValue
})

/** ------------------關於抽屜顯示表單,以及送出及取消的回調 ---------------- */

//drawer的開關
const drawer = ref(false)
//drawer title 的顯示詞句
const drawerTitle = ref("")

//drawer內,取消按鈕
const cancelClick = () => {
  drawer.value = false
}

//drawer內,確認按鈕
const confirmClick = () => {
  //沒有抓到的這個Dom直接返回
  categoryFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      console.log("送出前的表單", categoryForm)
      await props.saveOrUpdateCategory(categoryForm)
      drawer.value = false
    } else {
      ElMessage.error("請完整填入資訊")
    }
  })

}

/**--------------------------------------------------------- */


//Table中新增類別按鈕的回調函數
const addCategory = (row: any) => {
  //如果傳來的參數為空字串, 則parentId為空字串, 否則parentId 為 row.id
  let parentId = row === "0" ? "0" : row.id
  drawerTitle.value = "新增類別"
  drawer.value = true
  Object.assign(categoryForm, initCategoryForm)
  categoryForm.parentId = parentId

}

//Table中編輯類別按鈕的回調函數
const editCategory = (row: any) => {
  drawerTitle.value = "修改類別"
  drawer.value = true
  ElMessage.success("正在編輯")
  console.log("展開單個數據", row)

  categoryForm.id = row.id
  categoryForm.parentId = row.parentId
  categoryForm.label = row.label
  categoryForm.description = row.description
}

//Table中刪除類別按鈕的回調函數
const deleteCategory = async (row: any, title: string) => {
  let confirmMessage = ""
  if (row.children === null) {
    confirmMessage = "確定要刪除此類別嗎？"
  } else {
    confirmMessage = "此操作會連其子類別一併刪除，確定要刪除嗎？"
  }
  ElMessageBox.confirm(confirmMessage, '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户選擇確認，繼續操作
    await props.deleteCategory(row.id)
  }).catch((err) => {
    // 用户選擇取消，中止上傳操作
    console.log(err)
  });

}

//Table 上方刪除多個類別按鈕的回調函數
const batchDeleteCategory = () => {
  ElMessageBox.confirm("選擇的類別中，當底下仍有子類別，子類別將被一併刪除，確定要刪除嗎？", '確認刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const idList = deleteSelectList.map(item => (item as { id: string }).id);
    // 用户選擇確認，繼續操作
    await props.batchDeleteCategory(idList)
  }).catch((err) => {
    // 用户選擇取消，中止上傳操作
    console.log(err)
  });

}

/**------------------------------------------------- */
//要刪除的id集合
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性,並重新賦值
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}

</script>

<style scoped lang="scss">
.function-bar {
  text-align: right;
  margin-bottom: 1%;
}
</style>
