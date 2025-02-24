<!-- 每個最新消息內容的通用模板 -->
<template>
  <section class="article-item-section">
    <el-card class="article-item-card-box">


      <el-form :model="article" class="article-form" ref="articleForm" :rules="articleRules" label-position="top">

        <div class="outer-input-box">

          <div class="text-input-box">
            <el-form-item label="文章類別" prop="type">
              <el-input v-model="article.type" placeholder="消息類型" />
            </el-form-item>
            <el-form-item label="文章標題" prop="title">
              <el-input v-model="article.title" placeholder="消息標題" />
            </el-form-item>
            <el-form-item label="文章描述" prop="description">
              <el-input type="textarea" v-model="article.description" autocomplete="off" />
            </el-form-item>
          </div>
          <div class="img-box">

            <el-form-item label="縮圖上傳" label-position="top">

              <el-upload class="thumbnail-uploader" :action="envAPI + '/upload/img'" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>

            </el-form-item>

          </div>
        </div>

        <div style="text-align: right;">
          <el-button type="info" @click="back">返回</el-button>
          <el-button type="primary" @click="submitArticleForm(articleForm)">保存</el-button>
        </div>
      </el-form>

      <!-- 文章附件上傳組件 -->
      <AttachmentComponent :articleId="id" :getApi="getAllArticleAttachmentApi" :addApi="addArticleAttachmentApi"
        :deleteApi="deleteArticleAttachmentApi" />

      <!-- CKEditor5 編輯器組件   -->
      <CustomCKEditor :scope="scope" :htmlContent="article.content" :updateContent="updateContent">
      </CustomCKEditor>

    </el-card>

  </section>


</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import CustomCKEditor from '@/components/CustomCKEditor/index.vue'
import type { FormInstance, FormRules, UploadRawFile, UploadProps } from 'element-plus'
import { updateArticleApi, getArticleApi } from '@/api/article'
import AttachmentComponent from '@/components/ArticleAttachment/index.vue'
import { getAllArticleAttachmentApi, addArticleAttachmentApi, deleteArticleAttachmentApi } from '@/api/articleAttachment'


//路由參數,這邊注意解構賦值後,會失去響應式
let { id } = defineProps(['id'])

/**  使用CustomCKEditor組件的配置  */
//數據,父傳子
const scope = ref("newsScope")

const article = reactive<Record<string, any>>({
  articleId: '',
  type: '',
  title: '',
  description: null,
  content: '',
  coverThumbnailUrl: ''

});

//方法,子傳父
const updateContent = (newValue: string) => {
  article.content = newValue;
};

/** 當前組件的配置  */
const protocol = window.location.protocol; // 获取当前协议 (例如 "http:" 或 "https:")
const hostname = window.location.hostname; // 获取当前域名 (例如 "www.example.com")

const envAPI = import.meta.env.VITE_APP_BASE_API;
const imageUrl = ref()

//圖片數據
let imgFile = <UploadRawFile>{}

//獲取路由器
const router = useRouter()
const route = useRoute()

//獲取新增最新消息表單DOM
const articleForm = ref()
//表單校驗規則
const articleRules = reactive({
  type: [
    {
      required: true,
      message: '類型不能為空',
      trigger: 'blur',
    },
  ],
  title: [
    {
      required: true,
      message: '標題不能為空',
      trigger: 'blur',
    },
    {
      max: 255,
      message: '內容長度不能超過 255 字符',
      trigger: 'blur'
    }
  ],
  announcementDate: [
    {
      required: true,
      message: '公告日期不能為空',
      trigger: 'blur',
    }
  ],
  description: [
    {
      required: true,
      message: '描述不能為空',
      trigger: 'blur',
    }
  ]
})


//檔案上傳成功的回調
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  console.log(response)
  console.log(uploadFile)

  imageUrl.value = URL.createObjectURL(uploadFile.raw!)

  //將檔案傳給接收圖片的數據
  imgFile = uploadFile.raw!

}

//檔案上傳前的回調
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//獲取文章
const getArticle = async () => {
  let res = await getArticleApi(id)
  Object.assign(article, res.data)
}

//返回列表
const back = () => {

  // 取得當前路徑
  const currentPath = route.path; // 路徑部分，例如 /background/news-content/news
  const query = route.query; // 查詢參數部分，例如 { page: '3', size: '10' }

  // 取得當前路徑並按 '/' 分割為陣列
  const pathSegments = currentPath.split('/').filter(Boolean);

  // 確保有上層路徑可回
  if (pathSegments.length > 1) {
    // 移除最後一段路徑
    pathSegments.pop();

    // 組合回去並加上 '/'
    const parentPath = '/' + pathSegments.join('/');

    console.log('上層路徑', parentPath)

    // 導航回上層路徑，並保留查詢參數
    router.push({ path: parentPath, query });

  } else {
    // 沒有父路由，返回上一個歷史紀錄
    router.go(-1);
  }
}


//送出表單
const submitArticleForm = (form: FormInstance) => {
  //沒有抓到的這個Dom直接返回
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      //獲取儲存在localStorage的臨時上傳檔案URL路徑
      let tempUploadUrlStr = localStorage.getItem(scope.value)
      //定義變量預設為[]
      let tempUploadUrlList: any[] = [];

      //如果上傳檔案URL路徑不為null,則根據逗號分隔
      if (tempUploadUrlStr !== null) {
        tempUploadUrlList = tempUploadUrlStr.split(",");
      }
      //賦予進article響應式對象中
      article.tempUploadUrl = tempUploadUrlList

      let formData = new FormData();
      // 將響應式對象轉換為普通對象，然後轉換為 JSON 字符串
      const jsonData = JSON.stringify(article)
      formData.append('data', new Blob([jsonData], { type: "application/json" }))
      formData.append('file', imgFile)


      try {
        //呼叫更新API
        await updateArticleApi(formData)
        //移除臨時上傳檔案URL
        localStorage.removeItem(scope.value)
        //重製上傳的檔案
        imgFile = <UploadRawFile>{}
        //保存後返回列表
        back()

        ElMessage.success("儲存成功")
      } catch (err) {
        console.log(err)
      }

    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}


onMounted(async () => {
  await getArticle()
  imageUrl.value = protocol + '//' + hostname + '/minio' + article.coverThumbnailUrl
})

</script>




<style scoped lang="scss">
.article-item-section {
  width: 90%;
  margin: 1% auto;

  .article-item-card-box {
    min-height: 80vh;

    .article-form {
      margin-bottom: 1%;

      .outer-input-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .text-input-box {
          width: 60%;
        }

        .img-box {
          margin-left: -5%
        }
      }

      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
      }

      .thumbnail-uploader {
        .avatar {
          width: 100%;
          max-width: 178px;
          display: block;
        }

        :deep(.el-upload) {
          border: 1px dashed var(--el-border-color);
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
          border-color: var(--el-color-primary);
        }

      }

    }
  }
}
</style>
