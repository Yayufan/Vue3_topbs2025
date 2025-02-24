<!--  -->
<template>
  <section class="education-surgery-section">
    <el-card>
      <h1>衛教手術類別管理</h1>

      <!-- 自定義的類別管理組件
      需傳遞轉換過的table對象, 格式必須為 
      {
        id: string
        label: string,
        description: string
        parentId: string,
        children: [] | null
      }
      saveOrUpdateCategory, 新增/更新的回調函數
      deleteCategory, 刪除的回調函數
      batchDeleteCategory, 批量刪除的回調函數
      
      -->
      <CategoryTable :categoryTable="categoryTable" :saveOrUpdateCategory="saveOrUpdateEducationSurgeryCategory"
        :deleteCategory="deleteCategory" :batchDeleteCategory="batchDeleteCategory" :group="GROUP">
      </CategoryTable>


    </el-card>
  </section>
</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import CategoryTable from '@/components/CategoryTable/index.vue'
import { saveArticleCategoryApi, getAllArticleCategoryByGroupApi, deleteArticleCategoryApi, batchDeleteArticleCategoryApi } from '@/api/articleCategory'

const GROUP = "educationSurgery"


/**
 * 一個轉換function , 因為後端已經定義好資料庫了這邊要進行轉換,放進element plus組件才比較好處理
 * 
 * @param arr 
 */
const transformArray = (arr: Record<string, any>[]): Record<string, any>[] => {
  //在遍歷的每個item直接進行解構賦值,提取articleCategoryId改名為id,以及其他屬性
  //因為我們是要直接返回對象,對象的寫法為{},這個跟箭頭函數後面方法體的符號衝突,所以用()括號起來,避免解析錯誤
  return arr.map(({ articleCategoryId: id, name: label, ...rest }) => ({
    id,
    label,
    ...rest,
    children: rest.children ? transformArray(rest.children) : null
  }));
}

// 定义转换函数
function transformForm(form: Record<string, any>) {
  return {
    articleCategoryId: form.id,
    name: form.label,
    description: form.description,
    parentId: form.parentId,
    groupType: form.group
  };
}


/**--------------------------------------------------------------- */

//根據組別獲取所有類別
const getAllEducationSurgeryCategory = async () => {
  let res = await getAllArticleCategoryByGroupApi(GROUP)
  //重置數組
  categoryTable.length = 0
  //從後端獲取嵌套table後,進行轉換後賦值
  let transformCategoryTable = transformArray(res.data);
  Object.assign(categoryTable, transformCategoryTable)

}

const categoryTable = reactive([])


//給子組件的新增/修改回調函數
const saveOrUpdateEducationSurgeryCategory = async (data: any) => {
  //子組件回傳的數據,還需轉換成後端接收的格式
  let newData = transformForm(data)
  await saveArticleCategoryApi(newData)
  //重新獲取資料
  ElMessage.success('新增成功')
  getAllEducationSurgeryCategory()
}

//給子組件的刪除函數
const deleteCategory = async (id: number) => {
  await deleteArticleCategoryApi(id)
  //重新獲取資料
  ElMessage.success('刪除成功')
  getAllEducationSurgeryCategory()
}

//給子組件的批量刪除函數
const batchDeleteCategory = async (arr: any[]) => {
  await batchDeleteArticleCategoryApi(arr)
  ElMessage.success('刪除成功')
  getAllEducationSurgeryCategory()

}

//頁面掛載時執行
onMounted(() => {
  getAllEducationSurgeryCategory()
})

</script>

<style scoped lang="scss">
.education-surgery-section {
  width: 95%;
  margin: 1% auto;

  h1 {
    text-align: center;
  }

}
</style>
