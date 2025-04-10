<!--  -->
<template>

  <div class="mail-template-box">

    <div class="function-bar">
      <el-button type="info" @click="back">返回</el-button>
      <el-button type="primary" @click="save" :disabled="isDisabled">保存</el-button>
    </div>

    <el-form :model="emailTemplate" class="emailTemplate-form" :rules="emailTemplateRules" ref="emailTemplateForm"
      label-position="top">
      <div class="text-input-box">
        <el-form-item label="模板名稱" prop="name">
          <el-input v-model="emailTemplate.name" placeholder="模板名稱" />
        </el-form-item>
        <el-form-item label="模板描述" prop="description">
          <el-input v-model="emailTemplate.description" placeholder="模板描述" type="textarea" />
        </el-form-item>

      </div>
    </el-form>

    <!-- <div id="bar">

      <button v-on:click="saveDesign">Save Design</button>
      <button v-on:click="exportHtml">Export HTML</button>
      <button v-on:click="exportPlainText">Export Text</button>
    </div> -->

    <EmailEditor :tools="tools" locale='zh-TW' class="vue-email-editor" ref="emailEditor"
      v-on:load="getDataAndEditorLoaded" :options="emailOptions" />


  </div>

</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { EmailEditor, } from 'vue-email-editor'
import { getEmailTemplateApi, updateEmailTemplateApi } from '@/api/emailTemplate'

const router = useRouter()

let emailTemplate = reactive<Record<string, any>>({})
let isDisabled = ref(true)

//獲取動態路由參數
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
    console.log('editor:ready')

    emailEditor.value.editor.setMergeTags(mergeTags);

    isDisabled.value = false;
  });


}

/**-------------------------------- */



/**----------------校驗Email Template資料------------------------------ */

const emailTemplateRules = reactive({
  name: [
    {
      required: true,
      message: '模板名稱不能為空',
      trigger: 'blur',
    },
  ],

})


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






/**-------------------- Function Bar 功能 ---------------------- */




const back = () => {
  router.back()
}

const save = async () => {
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
        }
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
  emailTemplate.design = jsonDesign
  emailTemplate.htmlContent = htmlContent
  emailTemplate.plainText = plainText
  console.log("emailTemplate資料: ", emailTemplate)

  await updateEmailTemplateApi(emailTemplate)

  ElMessage.success("儲存成功")

}



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
</style>
