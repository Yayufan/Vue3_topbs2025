<!--  -->
<template>
  <div>
    <BasicComponent title="信件寄送">
      <template #main-section>
        <div class="top-btn-box">
          <el-button type="info" @click="back">返回</el-button>
          <el-button type="primary" @click="sendMail(sendMailFormRef)" :disabled="isDisabled"
            v-loading.fullscreen.lock="fullscreenLoading">寄送</el-button>
        </div>
        <el-card class="top">
          <div class="email-quota" type="warning">剩餘{{ emailQuota }}封信件</div>
          <el-form label-position="top" :model="sendEmailDto" :rules="sendMailRules" ref="sendMailFormRef">
            <el-form-item label="主旨" prop="subject">
              <el-input v-model="sendEmailDto.subject" />
            </el-form-item>

            <el-form-item label="信件選項" prop="emailOptions">
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <el-checkbox v-model="sendEmailDto.isTest" label="是否為測試信件" name="emailOptions" />

                  <el-input v-if="sendEmailDto.isTest" v-model="sendEmailDto.testEmail" placeholder="請輸入測試信箱" />
                </div>
                <div class="checkbox-item">
                  <el-checkbox v-model="sendEmailDto.isSchedule" label="是否排程寄送" name="emailOptions" />
                  <el-date-picker v-if="sendEmailDto.isSchedule" v-model="sendEmailDto.scheduleTime" type="datetime"
                    placeholder="選擇日期時間" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                </div>
                <div class="checkbox-item">
                  <el-checkbox v-model="sendEmailDto.includeOfficialAttachment" label="是否附帶公文" name="emailOptions" />
                </div>
              </div>
            </el-form-item>

            <el-button class="add-tag-button" @click="openDialog">
              <div class="btn-box">
                <el-icon>
                  <PriceTag />
                </el-icon>選擇標籤
              </div>
            </el-button>

            <el-form-item label="本次發送對象">
              <div class="tag-box">
                <div class="tag-item" v-for="(item, index) in selectTags">
                  <el-tag :color="item.color">{{ item.name }}</el-tag>
                  <span v-if="index !== selectTags.length - 1">,</span>
                </div>
              </div>
            </el-form-item>
          </el-form>

        </el-card>

        <EmailEditor :tools="tools" locale='zh-TW' class="vue-email-editor" ref="emailEditor"
          v-on:load="getDataAndEditorLoaded" :options="emailOptions" />
      </template>

    </BasicComponent>
    <el-dialog v-model="isOpen" title="選擇標籤" width="70%" :before-close="cancelTransfer">
      <el-transfer v-if="optionList" ref="transferPanelRef" class="transfer" v-model="selectTags" :data="optionList"
        :titles="['可選標籤', '已選標籤']" :filterable="true">
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
        <template #left-footer>
          <div class="pagination-box">
            <el-pagination layout="prev, pager, next" :total="Number(tagList.length)" @current-change="" />
          </div>
        </template>
      </el-transfer>
      <template #footer>
        <el-button type="primary" @click="closeDialog">確定</el-button>
        <el-button @click="cancelTransfer">取消</el-button>
      </template>
    </el-dialog>
  </div>


</template>

<script setup lang='ts'>
import { EmailEditor, } from 'vue-email-editor'
import { fetchEmailQuotaApi, getEmailTemplateApi, sendEmailApi, sendEmailByCategoryAndTagApi, updateEmailTemplateApi } from '@/api/emailTemplate'
import { ref, reactive } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { getAllTagsApi, getTagsByPaginationApi } from '@/api/tag'
import { stubObject } from 'lodash'
import { tryCatch } from '@/utils/tryCatch'

import BasicComponent from '@/layout/components/Basic/index.vue'

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


/**------------------------------
 * 獲取本日寄信餘額
 * 
 */

const emailQuota = ref<number>(0)
const fetchEmailQuota = async () => {
  const { res, error }: any = await tryCatch(fetchEmailQuotaApi())
  if (error || res.code !== 200) {
    ElMessage.error(res.msg || error || '獲取寄信餘額失敗');
    return;
  }

  emailQuota.value = res.data;
}




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
    res.data.design = objDesign
  }

  Object.assign(emailTemplate, res.data)

  if (objDesign == null) {
  } else {
    emailEditor.value.editor.loadDesign(objDesign)
  }


  emailEditor.value.editor.setBodyValues({
    // 背景色改為透明
    backgroundColor: "TRANSPARENT",
    //容器寬度改為100%
    contentWidth: "100%"
  })


  // emailEditor.value.editor.registerCallback('image', function (file: any, done: any) {
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
      tagType.value = 'paper-reviewer'
      sendUrl.value = '/paper-reviewer/send-email'

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
    }
  )
}

const exportHtml = () => {
  emailEditor.value.editor.exportHtml(
    (data: any) => {
    }, {
    //壓縮html大小
    minify: true
  })
}

const exportPlainText = () => {
  emailEditor.value.editor.exportPlainText((data: any) => {
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
  "isSchedule": false,
  "scheduleTime": "",
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
          let maxWidth = content.values.src.width > 600 ? 600 : content.values.src.width;
          if (content.values.src.maxWidth) {
            let widthPercent = Number(content.values.src.maxWidth.replace('%', '')) / 100;
            maxWidth = Math.round(content.values.src.width * widthPercent) > 600 ? 600 : Math.round(content.values.src.width * widthPercent);
          }
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
    getImageSizeFromDesign(JSON.parse(jsonDesign))
  }
  // sendMailFormData.htmlContent = optimizeForOutlook(htmlContent);
  // sendMailFormData.plainText = plainText
  // sendMailFormData.tagList = selectTags.value
  sendEmailDto.htmlContent = optimizeForOutlook(htmlContent);
  sendEmailDto.plainText = plainText
  returnData.tagIdList = selectTags.value.map((item: any) => {
    return item.tagId
  })

  if (!sendMailFormRef) return;
  returnData.sendEmailDTO = sendEmailDto

  sendMailFormRef.validate(async (valid) => {
    if (valid) {
      try {
        //呼叫父組件給的新增function API
        await sendEmailByCategoryAndTagApi(returnData, sendUrl.value);
        await loading()
        ElMessage.success('寄送成功');
        tempSelectedTagList.value = []
        router.back()
      } catch (err: any) {
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

const tempSelectedTagList = ref<any>([]);

const getTagList = async () => {
  let res = await getTagsByPaginationApi(tagCurrentPage.value, 10, tagType.value)
  tagList.length = 0
  selectTags.value.length = 0
  Object.assign(tagList, res.data.records)
  tagList.forEach((item: any) => {
    if (tempSelectedTagList.value.find((tag: any) => tag.tagId === item.tagId)) {
      selectTags.value.push(item);

    }
  })
  optionList.length = 0
  tagList.forEach((item: any) => {
    optionList.push({
      key: item,
      label: item.name,
      color: item.color,
    })
  })
}

watch(tagType, (newVal) => {
  getTagList()
})


const isOpen = ref(false)
const openDialog = () => {

  isOpen.value = true
}

const closeDialog = () => {
  tempSelectedTagList.value.push(...selectTags.value);
  isOpen.value = false
}

const cancelTransfer = () => {
  isOpen.value = false
  getTagList()
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
          let foundTag = optionList.find((tag: any) => tag.label === item.textContent);
          foundTag.isOverParentElementWidth = true;
          foundTag.width = width + 40;
        }
      });

    });
  }
});


onMounted(() => {
  fetchEmailQuota();
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



}

.vue-email-editor {
  // min-height: 500px;
  height: 800px;
  margin: 3% auto;
}

:deep(.el-tag__content) {
  color: white !important;
  font-size: 14px;
}

.transfer {
  display: flex !important;

  justify-content: center !important;
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

.email-quota {
  padding: 1rem;
  margin: 1rem 0;
  color: #a14508;
  background-color: #fffbeb;
  border-radius: 8px;
}

.top-btn-box {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.top {
  margin-bottom: 1rem;

  .add-tag-button {
    margin-bottom: 1rem;

    .btn-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        rotate: -45deg;
      }
    }
  }

  .checkbox-group {
    display: flex;
    width: 70%;
    justify-content: space-between;
    gap: 0.5rem;

    .checkbox-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 1rem;

      .el-input {
        width: 200px;
      }
    }
  }

  .tag-box {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
}
</style>
