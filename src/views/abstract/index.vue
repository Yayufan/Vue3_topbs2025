<template>
  <section class="abstract-section">
    <el-card class="abstract-card">
      <h1>稿件列表</h1>

      <div class="function-bar">
        <div class="display-count">
          <div>當前查詢數量為： {{ paperList.total }} 件</div>
        </div>

        <div class="btn-box">

        </div>
      </div>

      <div class="search-bar">
        <div>
          <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢" @input="getPaperList()" />
          <el-select v-model="filterAbsType" style="width: 240px;" class="filter-abs-type" placeholder="請選擇投稿類型"
            @change="getPaperList()">
            <el-option value="Poster Presentation"></el-option>
            <el-option value="Video Presentation"></el-option>
            <el-option value="Young Investigator"></el-option>
            <el-option value="" label="All"></el-option>
          </el-select>
        </div>

        <div>
          <el-button @click="openAutoAssignReviewerDialog">
            自動分配審稿委員
          </el-button>

          <el-button type="success" @click="downloadExcel('first_review')">
            下載一階評分Excel
          </el-button>

          <el-button type="success" @click="downloadExcel('second_review')">
            下載二階評分Excel
          </el-button>

          <el-button type="primary" @click="batchDownloadPaperFile">
            下載稿件
          </el-button>
        </div>
        <!-- <el-select v-model="filterAbsProp" style="width: 240px;" class="filter-abs-prop"
          placeholder="請選擇文章屬性"></el-select> -->


        <!-- <el-select v-model="filterStatus" style="width: 240px;" class="filter-status" placeholder="請選擇">
          <el-option label="全選" value="">
            <span>全選</span>
          </el-option>
          <el-option label="未審核" value="0">
            <span>未審核</span>
          </el-option>
          <el-option label="審核通過" value="1">
            <span style="color:green;">審核通過</span>
          </el-option>
          <el-option label="駁回申請" value="2">
            <span style="color:red;">駁回申請</span>
          </el-option>

          <template #label="{ label, value }">
            <span :style="{ color: value == '1' ? 'green' : value == '-1' ? 'red' : 'black' }">{{ label }}</span>
          </template>
</el-select> -->

      </div>


      <el-table :data="paperList.records" style="width: 100%">
        <el-table-column prop="absType" label="投稿類別" width="200"></el-table-column>
        <!-- <el-table-column prop="absProp" label="文章屬性" width="100"></el-table-column> -->
        <el-table-column prop="absTitle" label="稿件主題"></el-table-column>
        <el-table-column prop="tagSet" label="標籤" min-width="40" align="center">
          <template #default="scope">
            <el-popover v-if="scope.row.tagList.length > 0" placement="left-start" title="標籤" :width="200"
              trigger="hover">
              <template #reference>
                <el-tag v-if="findFirstVaildTag(scope.row.tagList)" size="large" round
                  :color="findFirstVaildTag(scope.row.tagList).color" effect="light">{{
                    findFirstVaildTag(scope.row.tagList).name }}</el-tag>
              </template>
              <template #default>
                <div v-for="tag in scope.row.tagList" :key="tag.tagId" class="tag-item">
                  <el-tag v-if="tag.status === 0" size="large" round :color="tag.color">{{
                    tag.name }}</el-tag>
                </div>
              </template>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column prop="firstAuthor" label="第一作者" width="150"></el-table-column>
        <el-table-column prop="status" label="審核狀態" width="100">
          <template #default="scope">
            <span v-if="scope.row.status == 0" style="color: gray;">未審核</span>
            <span v-else-if="scope.row.status == 1" style="color: green;">入選</span>
            <span v-else-if="scope.row.status == 2" style="color: red;">未入選</span>
            <span v-else-if="scope.row.status == 3" style="color: red;">入選(二階段)</span>
            <span v-else-if="scope.row.status == 4" style="color: red;">未入選(二階段)</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="250">
          <template #default="scope">
            <el-button link type="success" @click="toggleEdit(scope.row)">
              Edit
            </el-button>
            <el-button link type="primary" @click="openAssignReviewerDialog(scope.row)">
              分配審稿委員
            </el-button>
            <el-button v-for="item in scope.row.paperFileUpload" type="primary" link @click="openFile(item.path)">下載{{
              item.type.split('_')[1] }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination layout="prev, pager, next" :page-count="Number(paperList.pages)"
          :default-page-size="Number(paperList.size)" v-model:current-page="currentPage" :hide-on-single-page="true" />
      </div>
    </el-card>
    <el-drawer v-model="isEdit" title="詳細資訊">
      <p>投稿類別 : {{ reviewPaper.absType }}</p>
      <el-divider></el-divider>
      <p>稿件主題 : {{ reviewPaper.absTitle }}</p>
      <el-divider></el-divider>
      <p>第一作者 : {{ reviewPaper.firstAuthor }}</p>
      <el-divider></el-divider>
      <p v-if="reviewPaper.absType === 'Young Investigator'">第一作者生日 : {{ reviewPaper.firstAuthorBirthday }}</p>
      <el-divider v-if="reviewPaper.absType === 'Young Investigator'"></el-divider>
      <p>主要講者 : {{ reviewPaper.speaker }}</p>
      <el-divider></el-divider>
      <p>講者單位 : {{ reviewPaper.speakerAffiliation }}</p>
      <el-divider></el-divider>
      <p>通訊作者 : {{ reviewPaper.correspondingAuthor }}</p>
      <el-divider></el-divider>
      <p>通訊作者Email : {{ reviewPaper.correspondingAuthorEmail }}</p>
      <el-divider></el-divider>
      <p>通訊作者電話 : {{ reviewPaper.correspondingAuthorPhone }}</p>
      <el-divider></el-divider>
      <p>所有作者 : {{ reviewPaper.allAuthor }}</p>
      <el-divider></el-divider>
      <p>所有作者單位 : {{ reviewPaper.allAuthorAffiliation }}</p>
      <el-divider></el-divider>
      <!-- <div class="download-box">
        <el-button v-for="item in reviewPaper.paperFileUpload" type="primary" link @click="openFile(item.path)">下載{{
          item.type.split('_')[1] }}</el-button>
      </div> -->

      <el-form :model-="updateForm">
        <el-form-item label="發表編號" prop="publicationNumber">
          <el-input v-model="updateForm.publicationNumber"></el-input>
        </el-form-item>
        <el-form-item label="發表組別" prop="publicationGroup">
          <el-input v-model="updateForm.publicationGroup"></el-input>
        </el-form-item>
        <el-form-item label="報告地點" prop="reportLocation">
          <el-select v-model="updateForm.reportLocation"></el-select>
        </el-form-item>
        <el-form-item label="報告時間" prop="reportTime">
          <el-input v-model="updateForm.reportTime"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePaper">更新</el-button>
          <el-button @click="isEdit = false">關閉</el-button>
        </el-form-item>
      </el-form>


    </el-drawer>


    <el-dialog v-model="isAssignReviewerVisible" title="分配審稿委員" width="50%">
      <div class="stage-btn-bar">
        <el-button class="first-stage" :class="{ 'is-active': reviewStage === 'first_review' }"
          @click="reviewStage = 'first_review'">一階</el-button>
        <el-button class="second-stage" :class="{ 'is-active': reviewStage === 'second_review' }"
          @click="reviewStage = 'second_review'">二階</el-button>
      </div>
      <el-transfer v-model="submitAssignData.targetPaperReviewerIdList" :data="assignPaperReviewData" filterable
        :titles="['可選審稿人', '已選審稿人']" @change="console.log(assignPaperReviewTempList)" />
      <el-button class="submit-btn" @click="submitAssignDataFn">
        確定
      </el-button>
    </el-dialog>

    <el-dialog v-model="isAutoAssignReviewerVisible" title="自動分配審稿委員" width="15%">
      <el-radio-group v-model="reviewStage">
        <el-radio value="first_review">一階審稿</el-radio>
        <el-radio value="second_review">二階審稿</el-radio>
      </el-radio-group>
      <el-button @click="autoAssignPaperReviewers">
        確定
      </el-button>
    </el-dialog>



  </section>


</template>
<script lang="ts" setup>
import { assignPaperReviewersApi, autoAssignPaperReviewersApi, downloadPaperFolderApi, downloadPaperScoreExcelApi, getDownloadPaperFileUrlApi, getPaperPageApi, updatePaperApi } from '@/api/abstract';
import { tryCatch } from '@/utils/tryCatch';



const currentPage = ref(1)

const input = ref('')
const filterStatus = ref()
const filterAbsType = ref('')
const filterAbsProp = ref('')

const paperList = reactive<any>([])
const getPaperList = async () => {
  const { res, error } = await tryCatch(getPaperPageApi(currentPage.value, 10, input.value, filterStatus.value, filterAbsType.value, filterAbsProp.value));
  if (error) {
    console.error('Error fetching paper list:', error);
    return;
  }

  res.data.records.forEach((item: any) => {
    item.paperFileUpload = item.paperFileUpload.filter((file: any) =>
      file.type !== 'supplementary_material'
    )
  })

  console.log(res)
  Object.assign(paperList, res.data)
}

watch(filterStatus, (value, oldValue) => {
  getPaperList()
})

watch(currentPage, (value, oldValue) => {
  getPaperList()
})

/**------------------------------------------------ */
const isAssignReviewerVisible = ref(false);

const assignPaper = reactive<any>({});

const reviewStage = ref('first_review');

const submitAssignData = reactive<any>({
  reviewStage: '',
  targetPaperReviewerIdList: [],
  paperId: '',
})

const assignPaperReviewData = reactive<any>([])
const assignPaperReviewTempList = ref<any>([]);


const openAssignReviewerDialog = (paper: any) => {
  submitAssignData.paperId = '';
  submitAssignData.targetPaperReviewerIdList = [];
  assignPaperReviewData.length = 0;
  Object.assign(assignPaper, paper);
  submitAssignData.paperId = paper.paperId;

  assignPaper.assignedPaperReviewers.forEach((paperReviewer: any) => {
    if (paperReviewer.reviewStage !== reviewStage.value) {
      console.log('Skipping paper reviewer:', paperReviewer.paperReviewerId, 'for stage:', paperReviewer.reviewStage);
      return;
    }
    submitAssignData.targetPaperReviewerIdList.push(paperReviewer.paperReviewerId)
  })

  assignPaper.availablePaperReviewers.forEach((paperReviewer: any) => {
    assignPaperReviewData.push({
      label: paperReviewer.name,
      key: paperReviewer.paperReviewerId,
    })
  })



  isAssignReviewerVisible.value = true;
}

watch(() => reviewStage.value, (value, oldValue) => {
  console.log('submitAssignData changed:', value);
  if (!isAssignReviewerVisible.value) {
    return;
  }
  submitAssignData.targetPaperReviewerIdList.length = 0
  assignPaper.assignedPaperReviewers.forEach((paperReviewer: any) => {
    if (paperReviewer.reviewStage !== reviewStage.value) {
      console.log('Skipping paper reviewer:', paperReviewer.paperReviewerId, 'for stage:', paperReviewer.reviewStage);
      return;
    }
    submitAssignData.targetPaperReviewerIdList.push(paperReviewer.paperReviewerId)
  });

  // submitAssignData.targetPaperReviewerIdList.filter((item: any) => {
  //   console.log(item)
  //   return item.reviewStage === submitAssignData.reviewStage;
  // })



}, { deep: true });

const submitAssignDataFn = async () => {
  submitAssignData.reviewStage = reviewStage.value;
  console.log(submitAssignData)
  // if (submitAssignData.targetPaperReviewerIdList.length === 0) {
  //   isAssignReviewerVisible.value = false;
  //   return;
  // }
  const { res, error } = await tryCatch(assignPaperReviewersApi(submitAssignData));

  if (error) {
    console.error('Error assigning reviewers:', error);
    return;
  }
  console.log(res)
  isAssignReviewerVisible.value = false;
  getPaperList();
}


const isAutoAssignReviewerVisible = ref(false);

const openAutoAssignReviewerDialog = () => {
  isAutoAssignReviewerVisible.value = true;
}

const autoAssignPaperReviewers = async () => {
  let submitData = {
    reviewStage: reviewStage.value,
  }
  const { res, error } = await tryCatch(autoAssignPaperReviewersApi(submitData));
  if (error) {
    console.error('Error auto assigning reviewers:', error);
    return;
  }
  ElMessage.success('自動分配審稿委員成功');
  isAutoAssignReviewerVisible.value = false;
  console.log(res);
}



/**-------------------------------------------- */
const isEdit = ref(false);

const reviewPaper = reactive<any>({})
const toggleEdit = (paper: any) => {
  isEdit.value = !isEdit.value;
  Object.assign(reviewPaper, paper);
  // Object.assign(updateForm, paper);
  updateForm.paperId = paper.paperId;
  updateForm.status = paper.status;
  updateForm.publicationNumber = paper.publicationNumber;
  updateForm.publicationGroup = paper.publicationGroup;
  updateForm.reportLocation = paper.reportLocation;
  updateForm.reportTime = paper.reportTime;
  console.log(updateForm)
}

const openFile = async (filePath: string) => {
  const fileUrl = import.meta.env.VITE_MINIO_API_URL + filePath;
  const link = document.createElement('a');
  link.href = fileUrl;
  document.body.appendChild(link);
  link.setAttribute('download', '');
  window.open(fileUrl, '_blank');
  document.body.removeChild(link);
}
/**-------------------------------------------- */
const updateForm = reactive<any>({
  paperId: '',
  publicationNumber: '',
  publicationGroup: '',
  reportLocation: '',
  reportTime: '',
  status: ''
});

const updatePaper = async () => {
  await updatePaperApi(updateForm)
  isEdit.value = false;
  getPaperList()
}


const findFirstVaildTag = (tagSet: any) => {
  for (let i = 0; i < tagSet.length; i++) {
    if (tagSet[i].status === 0) {
      return tagSet[i];
    }
  }
  return '';
}
/**--------------------------------------------------- */
const downloadExcel = async (reviewStage: string) => {
  let fileName = reviewStage === 'first_review' ? '一階評分.xlsx' : '二階評分.xlsx';
  let res = await downloadPaperScoreExcelApi(reviewStage)
  console.log(res)
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}

const batchDownloadPaperFile = async () => {
  const { res, error }: any = await tryCatch(getDownloadPaperFileUrlApi());
  if (error || res.code !== 200) {
    console.error('Error fetching download URL:', error || res.message);
    return;
  }
  console.log(res.data)
  downloadPaperFolderApi(res.data);
}

onMounted(() => {
  getPaperList()
})

</script>

<style lang="scss" scoped>
.abstract-section {
  width: 95%;
  margin: 0 auto;

  .abstract-card {
    margin-top: 2%;
    margin-bottom: 2%;

    .pagination-box {
      margin-top: 2%;
      display: flex;
      justify-content: center;
    }
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin: 1% 0;
  }


}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

}

:deep(.el-tag__content) {
  color: white;
  font-size: 14px;
}

:deep(.el-tag__close) {
  color: red;
}

.stage-btn-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  .el-button {
    margin: 0;

    &.is-active {
      background-color: #409eff;
      color: white;
    }

    &.first-stage {
      border-radius: 4px 0 0 4px;
    }

    &.second-stage {
      border-radius: 0 4px 4px 0;
    }
  }
}

.el-transfer {
  margin-top: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  // flex-direction: column;
}

.submit-btn {
  display: block;
  margin: 0 0 0 auto;

}
</style>