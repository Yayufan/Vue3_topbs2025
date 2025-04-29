<!--  -->
<template>
  <!-- <h1>我是信件寄送</h1>  -->



  <div class="mail-template-box">
    <h1>信件寄送</h1>
    <div class="mail-count">
      <span>剩餘 email 數量: {{ emailTemplate.count }}</span>
    </div>
    <div class="function-bar">
      <el-button type="info" @click="back">返回</el-button>
      <el-button type="primary" @click="sendMail(sendMailFormRef)" :disabled="isDisabled"
        v-loading.fullscreen.lock="fullscreenLoading">寄送</el-button>
    </div>

    <el-form class="subject-form" ref="sendMailFormRef" :rules="sendMailRules" :model="sendEmailDto" label-width="80px"
      label-position="top">
      <el-form-item label="主旨" prop="subject">
        <el-input v-model="sendEmailDto.subject" />
      </el-form-item>
      <el-form-item prop="testEmail">
        <el-checkbox v-model="sendEmailDto.isTest" label="是否為測試信件" />
        <el-input v-if="sendEmailDto.isTest" v-model="sendEmailDto.testEmail" placeholder="請輸入測試信箱" />
      </el-form-item>


      <el-button type="primary" @click="openDialog">選擇標籤</el-button>
    </el-form>
    <el-tag color="black">本次發送對象 :</el-tag>
    <el-tag v-for="item in selectTags" :color="item.color">{{ item.name }}</el-tag>

    <EmailEditor :tools="tools" locale='zh-TW' class="vue-email-editor" ref="emailEditor"
      v-on:load="getDataAndEditorLoaded" :options="emailOptions" />

    <el-dialog v-model="isOpen" title="選擇標籤" width="50%">
      <el-transfer v-if="optionList" class="transfer" v-model="selectTags" :data="optionList" :titles="['可選標籤', '已選標籤']"
        :filterable="true">
        <template #default="{ option }">
          <el-tag :color="option.color" round>{{ option.label }}</el-tag>
        </template>
        <template #left-footer>
          <div class="pagination-box">
            <el-pagination layout="prev, pager, next" :total="Number(tagList.length)" @current-change="" />
          </div>
        </template>
      </el-transfer>
      <template #footer>
        <el-button type="primary" @click="closeDialog">確定</el-button>
        <el-button @click="isOpen = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { EmailEditor, } from 'vue-email-editor'
import { getEmailTemplateApi, sendEmailApi, sendEmailByCategoryAndTagApi, updateEmailTemplateApi } from '@/api/emailTemplate'
import { ref, reactive } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { getAllTagsApi, getTagsByPaginationApi } from '@/api/tag'
import { stubObject } from 'lodash'

const router = useRouter()

const back = () => {
  router.back()
}

/**-----------寄送資料----------- */
const sendMailFormData = reactive<any>({
  subject: '',
  htmlContent: '',
  plainText: ''
})

const sendMailFormRef = ref()

const sendMailRules = reactive<FormRules>({
  subject: [
    { required: true, message: '請輸入主旨', trigger: 'blur' }
  ]
})


/**------------------------------ */

let emailTemplate = reactive<Record<string, any>>({})
let isDisabled = ref(true)

let tagType = ref('')
let sendUrl = ref('')

let { id } = defineProps(['id'])

//獲取數據，並將EmailEditor進行渲染
const getDataAndEditorLoaded = async () => {

  let res = await getEmailTemplateApi(id)


  let objDesign = null;
  if (res.data.design != null) {
    objDesign = JSON.parse(res.data.design)
    console.log(res.data)
    res.data.design = objDesign
  }

  Object.assign(emailTemplate, res.data)
  console.log("獲取模板數據 ", emailTemplate)
  console.log("這是emailEditor", emailEditor.value)

  if (objDesign == null) {
    console.log("沒有design數據")
  } else {
    console.log("有design數據,進行載入")
    emailEditor.value.editor.loadDesign(objDesign)
  }


  emailEditor.value.editor.setBodyValues({
    // 背景色改為透明
    backgroundColor: "TRANSPARENT",
    //容器寬度改為100%
    contentWidth: "100%"
  })


  // emailEditor.value.editor.registerCallback('image', function (file: any, done: any) {
  //   console.log('file為', file)
  //   console.log('done', done)
  //   done({ progress: 100, url: "https://png.pngtree.com/png-clipart/20230108/original/pngtree-super-cute-cartoon-vector-bear-png-image_8887896.png" })
  //   // Handle file upload here
  // })

  let mergeTags = {}
  switch (emailTemplate.category) {
    case 'poster':
      tagType.value = 'paper'
      sendUrl.value = '/paper/send-email'
      mergeTags = {
        absType: {
          name: '稿件類型',
          value: '{{absType}}',
        },
        absProp: {
          name: '文章性質',
          value: '{{absProp}}',
        },
        absTitle: {
          name: '文章標題',
          value: '{{absTitle}}',
        },
        absAuthor: {
          name: '第一作者',
          value: '{{firstAuthor}}',
        },
        speaker: {
          name: '講者',
          value: '{{speaker}}',
        },
        speakerAffiliation: {
          name: '講者所屬單位',
          value: '{{speakerAffiliation}}',
        },
        correspondingAuthor: {
          name: '通訊作者',
          value: '{{correspondingAuthor}}',
        },
        correspondingAuthorEmail: {
          name: '通訊作者信箱',
          value: '{{correspondingAuthorEmail}}',
        },
        correspondingAuthorAffiliation: {
          name: '通訊作者所屬單位',
          value: '{{correspondingAuthorAffiliation}}',
        },
      }
      break;
    case 'all':
      tagType.value = 'member'
      sendUrl.value = '/member/send-email'
      mergeTags = {
        member: {
          name: '會員頭銜',
          value: '{{title}}',
        },
        firstName: {
          name: '會員姓名',
          value: '{{firstName}}',
        },
        lastName: {
          name: '會員姓氏',
          value: '{{lastName}}',
        },
        email: {
          name: '會員信箱',
          value: '{{email}}',
        },
        phone: {
          name: '會員電話',
          value: '{{phone}}',
        },
        country: {
          name: '會員國家',
          value: '{{country}}',
        },
        affliation: {
          name: '會員所屬單位',
          value: '{{affiliation}}',
        },
        jobTitle: {
          name: '會員職稱',
          value: '{{jobTitle}}',
        },
        category: {
          name: '會員類別',
          value: '{{category}}',
        },
      }
      break;
    case 'reviewer':
      tagType.value = 'paperReviewer'
      sendUrl.value = '/paperReviewer/send-email'

      mergeTags = {
        absTypeList: {
          name: '稿件類型',
          value: '{{absTypeList}}',
        },
        email: {
          name: '審稿人信箱',
          value: '{{email}}',
        },
        name: {
          name: '審稿人姓名',
          value: '{{name}}',
        },
        phone: {
          name: '審稿人電話',
          value: '{{phone}}',
        },
        account: {
          name: '審稿人帳號',
          value: '{{account}}',
        },
        password: {
          name: '審稿人密碼',
          value: '{{password}}',
        }
      }


  }
  //當編輯器載入完成,解鎖save按鈕
  emailEditor.value.editor.addEventListener('editor:ready', function () {
    console.log("合併標籤", mergeTags)
    console.log('editor:ready')

    emailEditor.value.editor.setMergeTags(mergeTags);
    isDisabled.value = false;
  });




}
/**------------------ */

const emailEditor = ref()

const emailOptions = {
  locale: 'zh-TW',
}


const tools = {
  form: {
    enabled: false
  }
}

const saveDesign = () => {
  emailEditor.value.editor.saveDesign(
    (design: any) => {
      console.log('saveDesign', design);
    }
  )
}

const exportHtml = () => {
  emailEditor.value.editor.exportHtml(
    (data: any) => {
      console.log('exportHtml', data);
    }, {
    //壓縮html大小
    minify: true
  })
}

const exportPlainText = () => {
  emailEditor.value.editor.exportPlainText((data: any) => {
    console.log('exportHtml', data);
  }, {
    //忽略各種連結和圖片
    ignoreLinks: true,
    ignoreImages: true,
    ignorePreheader: true,

    //合併標籤
    // mergeTags: {
    //   first_name: 'John',
    //   last_name: 'Doe'
    // }
  })
}

/**-------------------信件寄送--------------- */

const sendEmailDto = reactive<any>({
  "subject": "",
  "htmlContent": "",
  "plainText": "",
  "isTest": false,
  "testEmail": "",
  "includeOfficialAttachment": false
})



const fullscreenLoading = ref(false)
const loading = () => {
  return new Promise<void>((resolve) => {
    fullscreenLoading.value = true;
    setTimeout(() => {
      fullscreenLoading.value = false;
      resolve();
    }, 3000);
  });
}

function optimizeForOutlook(html: any): string {
  let imgIndex = 0;
  const optimizedHtml = html.replace(
    /<img([^>]*)>/g,
    (match: any, attributes: any) => {
      return `
        <table width="600" align="${imageInfoList[imgIndex].position}" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <img${attributes} style="display: block; height: auto;" width=${imageInfoList[imgIndex++].maxWidthString} height="auto">
            </td>
          </tr>
        </table>
      `;
    }
  );
  return optimizedHtml;
}

/** 用於儲存各個圖片資訊 */
const imageInfoList = reactive<Array<{ position: string, maxWidthString: string }>>([]);

const getImageSizeFromDesign = (design: any) => {
  const images: Array<{ src: string; width: number; height: number }> = [];
  imageInfoList.splice(0, imageInfoList.length);
  // 遍历 design.body.rows
  design.body.rows.forEach((row: any) => {
    // 模板中的每一個 row 板塊
    row.columns.forEach((column: any) => {
      // 模板中的每一個 column 板塊
      column.contents.forEach((content: any) => {
        // 內容
        if (content.type === 'image') {

          // 計算寬度資訊 
          let widthPercent = Number(content.values.src.maxWidth.replace('%', '')) / 100;
          let maxWidth = Math.round(content.values.src.width * widthPercent);
          imageInfoList.push({
            position: content.values.textAlign,
            maxWidthString: maxWidth.toString()
          });
        }
      });
    });
  });
  return images;
};

const returnData = reactive<any>({})
const sendMail = async (sendMailFormRef: FormInstance | undefined) => {
  let jsonDesign;
  let htmlContent;
  let plainText;

  //獲取HTML內容及設計並一同儲存
  // 將 exportHtml 轉換為 Promise
  const exportHtml = () => {
    return new Promise<void>((resolve, reject) => {
      emailEditor.value.editor.exportHtml(
        (data: any) => {
          console.log('exportHtml', data);
          jsonDesign = JSON.stringify(data.design);
          htmlContent = data.html;
          resolve(); // 解析 Promise
        },
        {
          minify: true, // 压缩 HTML 大小
        },
        {
          inlineStyles: true,
        },
      );
    });
  };

  // 等待 exportHtml 完成
  await exportHtml();

  //將exportPlainText轉換為Promise
  const exportPlainText = () => {
    return new Promise<void>((resolve, reject) => {
      emailEditor.value.editor.exportPlainText(
        (data: any) => {
          console.log('exporPlainText', data);
          plainText = data.text
          resolve(); // 解析 Promise
        }, {
        //忽略各種連結和圖片
        ignoreLinks: true,
        ignoreImages: true,
        ignorePreheader: true,

        //合併標籤
        // mergeTags: {
        //   first_name: 'John',
        //   last_name: 'Doe'
        // }
      }

      );
    });
  };


  // 等待 exportPlainText 完成
  await exportPlainText();



  //資料賦值
  if (jsonDesign) {
    console.log(getImageSizeFromDesign(JSON.parse(jsonDesign)))
  }
  // sendMailFormData.htmlContent = optimizeForOutlook(htmlContent);
  // sendMailFormData.plainText = plainText
  // sendMailFormData.tagList = selectTags.value
  sendEmailDto.htmlContent = optimizeForOutlook(htmlContent);
  sendEmailDto.plainText = plainText
  returnData.tagIdList = selectTags.value.map((item: any) => {
    return item.tagId
  })
  // console.log("emailTemplate資料: ", sendMailFormData)
  console.log("emailTemplate資料: ", sendEmailDto)

  if (!sendMailFormRef) return;
  returnData.sendEmailDTO = sendEmailDto
  console.log("returnData", returnData)

  sendMailFormRef.validate(async (valid) => {
    if (valid) {
      try {
        //呼叫父組件給的新增function API
        await sendEmailByCategoryAndTagApi(returnData, sendUrl.value);
        await loading()
        ElMessage.success('寄送成功');
        router.back()
      } catch (err: any) {
        console.log(err)
      }
    } else {
      ElMessage.error("請完整填入資訊")
    }
  })
}

/**======================================================= */
const tagList = reactive<any>([])
const optionList = reactive<any>([])

const selectTags = ref<any>([])

const tagCurrentPage = ref<number>(1)

const getTagList = async () => {
  console.log(tagType.value)
  let res = await getTagsByPaginationApi(tagCurrentPage.value, 10, tagType.value)
  console.log("獲取標籤列表", res.data)
  Object.assign(tagList, res.data.records)
  // console.log("tagList", tagList)
  tagList.forEach((item: any) => {
    optionList.push({
      key: item,
      label: item.name,
      color: item.color,
    })
  })
}

watch(tagType, (newVal) => {
  console.log("tagType", newVal)
  getTagList()
})


const isOpen = ref(false)
const openDialog = () => {

  isOpen.value = true
}

const closeDialog = () => {
  isOpen.value = false
  console.log(selectTags.value)
}


onMounted(() => {
  // getTagList()
})



</script>

<style scoped lang="scss">
.mail-template-box {
  width: 90%;
  margin: 3% auto;

  .function-bar {
    text-align: right;
  }


  .vue-email-editor {
    // min-height: 500px;
    height: 800px;
    margin: 3% auto;
  }

}

:deep(.el-tag__content) {
  color: white !important;
  font-size: 14px;
}

.transfer {
  display: flex !important;

  justify-content: center !important;
}
</style>
