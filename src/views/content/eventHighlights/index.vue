<!--  -->
<template>
  <section class="article-section">
    <el-card class="article-card">
      <h1>活動花絮文章管理</h1>
      <ArticleTable :table="articleList" :getApi="getArticle" :addApi="addArticle" :deleteApi="deleteArticle"
        :batchDeleteApi="batchDeleteArticle" :group="GROUP">
      </ArticleTable>
    </el-card>
  </section>
</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import ArticleTable from '@/components/ArticleTable/index.vue'
import { getAllArticleByGroupByPaginationApi, addArticleApi, deleteArticleApi, batchDeleteArticleApi } from '@/api/article'
import { transFormPaginationByArticle } from '@/utils/transFormData'


//獲取路由
const route = useRoute()
//獲取路由器
const router = useRouter()

//設定article_group , 最重要!!!!!!!
const GROUP = "eventHighlights"

//後端獲取Page資料後要傳給子組件的數據
let articleList = reactive({})

let urlPage = ref<number>(parseInt(route.query.page as string) || 1);
let urlSize = ref<number>(parseInt(route.query.size as string) || 10);

//獲取文章
const getArticle = async () => {
  let res = await getAllArticleByGroupByPaginationApi(GROUP, urlPage.value, urlSize.value)
  //固定轉換數據給前端組件使用
  let transData = transFormPaginationByArticle(res.data, "articleId")
  Object.assign(articleList, transData)
  // console.log('這是轉換後的數據', articleList)
}

//新增文章
const addArticle = async (data: any) => {
  // console.log('子組件傳來的data', data)
  let res = await addArticleApi(data)
  const currentPath = route.path
  const query = route.query

  router.push({
    path: currentPath + '/' + res.data,// 目標路徑
    query: query,// 帶上當前的查詢參數
  })

}

//刪除文章
const deleteArticle = async (id: number) => {
  await deleteArticleApi(id)
  getArticle()
}

//批量文章
const batchDeleteArticle = async (data: any) => {
  await batchDeleteArticleApi(data)
  getArticle()
}

//頁面掛載時獲取數據
onMounted(() => {
  getArticle()
})



</script>

<style scoped lang="scss">
//這個組件的setion
.article-section {
  width: 95%;
  margin: 0 auto;


  //這個組件的card
  .article-card {
    margin-top: 2%;
    margin-bottom: 2%;

    //這個組件的標題
    h1 {
      text-align: center;
      font-size: 2rem;
      margin: 1% 0;
    }

  }
}
</style>
