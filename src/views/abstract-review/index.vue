<template>
  <main class="main-section">
    <el-card class="main-card" shadow="hover">
      <div class="main-header">
        <h1>Abstract Review</h1>
      </div>
      <div class="function-bar">
        <el-form-item class="stage-select-form" label="審核階段:">
          <el-select class="stage-select" placeholder="Select Review Stage" v-model="reviewStage"
            @change="getPaperListByReviewer">
            <el-option label="第一階段" value="first_review"></el-option>
            <el-option label="第二階段" value="second_review"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="main-content">
        <el-table :data="paperList.records" style="width: 100%">
          <el-table-column prop="absTitle" label="標題"></el-table-column>
          <el-table-column prop="absType" label="類型" width="200"></el-table-column>
          <el-table-column prop="firstAuthor" label="第一作者"></el-table-column>
          <el-table-column prop="score" label="分數" width="80"></el-table-column>
          <el-table-column prop="option" label="操作">
            <template #default="scope">
              <el-button v-for="item in scope.row.fileList" link type="primary"
                @click="downloadFileFromMinio(item)">開啟{{
                  " " +
                  item.type.split("_")[1]
                }}</el-button>
              <el-button link type="success" @click="toggleSeeMoreDialog(scope.row)">查看更多</el-button>
              <el-button link type="warning" @click="openRatePaperDialog(scope.row)">評分</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>

    <el-drawer v-model="isSeeMoreDialogVisible">
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
    </el-drawer>

    <el-dialog v-model="isRatePaperDialogVisible" title="評分" width="10%">
      <el-form-item>
        <el-input-number v-model="submitRateData.score" type="number" :max="maxScore" :min="minScore"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="ratePaperFn">確定</el-button>
        <el-button @click="isRatePaperDialogVisible = false">取消</el-button>
      </el-form-item>
    </el-dialog>
  </main>
</template>
<script lang="ts" setup>
import { getPaperListByReviewerApi, paperReviewApi } from '@/api/abstract-reviewer';
import { useUserStore } from '@/store';
import { tryCatch } from '@/utils/tryCatch';

const maxScore = 100;
const minScore = 0;

const router = useRouter();

const userStore = useUserStore();


const paperList = reactive<any>({});

const currentPage = ref(1);
const reviewStage = ref('first_review');

const getPaperListByReviewer = async () => {
  const { res, error } = await tryCatch(getPaperListByReviewerApi(currentPage.value, 10, reviewStage.value))
  if (error) {
    console.error('Error fetching paper list:', error);
    return;
  }

  console.log(res);

  Object.assign(paperList, res.data);
}

const downloadFileFromMinio = (file: any) => {
  const minioUrl = import.meta.env.VITE_MINIO_API_URL;
  const fileUrl = minioUrl + file.path;
  const link = document.createElement('a');
  link.href = fileUrl;
  document.body.appendChild(link);
  link.setAttribute('download', '');
  window.open(fileUrl, '_blank');
  document.body.removeChild(link);
}

/**-------------------------------------------------------- */
const isSeeMoreDialogVisible = ref(false);

const reviewPaper = reactive<any>({});

const toggleSeeMoreDialog = (row: any) => {
  isSeeMoreDialogVisible.value = true;

  Object.assign(reviewPaper, row);
};
/**-------------------------------------------------------- */
const isRatePaperDialogVisible = ref(false);
const ratePaper = reactive<any>({});

const submitRateData = reactive({
  paperAndPaperReviewerId: '',
  score: 0,
  paperReviewerId: ''
})

const openRatePaperDialog = (row: any) => {
  isRatePaperDialogVisible.value = true;
  submitRateData.score = row.score;
  submitRateData.paperAndPaperReviewerId = row.paperAndPaperReviewerId;
  submitRateData.paperReviewerId = userStore.user.paperReviewerId;
  Object.assign(ratePaper, row);
};

const ratePaperFn = async () => {
  const { res, error } = await tryCatch(paperReviewApi(submitRateData));
  if (error) {
    console.error('Error rating paper:', error);
    return;
  }
  isRatePaperDialogVisible.value = false;
  getPaperListByReviewer();
}

onMounted(() => {
  getPaperListByReviewer();
});

</script>

<style lang="scss" scoped>
.main-card {
  width: 100%;
  min-height: 100vh;
}

.stage-select-form {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 1rem;
}

.stage-select {
  width: 200px;
  margin-right: 20px;
}
</style>