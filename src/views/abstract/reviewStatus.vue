<template>
  <main class="main-section">
    <el-card class="main-card">
      <h1>稿件審核進度</h1>
      <div class="function-bar">
        <el-form-item label="審核階段:">
          <el-select placeholder="選擇審核階段" v-model="reviewStage" @change="getReviewerScoreStatus" clearable>
            <el-option label="第一階段" value="first_review"></el-option>
            <el-option label="第二階段" value="second_review"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="content">
        <el-table :data="reviewScoreStatusList.records" style="width: 100%">
          <el-table-column prop="reviewerName" label="名稱" width="200"></el-table-column>
          <el-table-column prop="reviewerEmail" label="信箱"></el-table-column>
          <el-table-column prop="reviewStage" label="審核階段" width="120">
            <template #default="scope">
              <span>{{ scope.row.reviewStage === 'first_review' ? '第一階段' : '第二階段' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalReviewCount" label="須審件數" width="80" align="center"></el-table-column>
          <el-table-column prop="completedReviewCount" label="已審件數" width="80" align="center"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination layout="prev, pager, next" :page-count="Number(reviewScoreStatusList.pages)"
            :default-page-size="Number(reviewScoreStatusList.size)" v-model:current-page="currentPage"
            :hide-on-single-page="true" @current-change="handleChangePage" />
        </div>
      </div>
    </el-card>
  </main>
</template>
<script setup lang="ts">
import { getReviewerScoreStatusPageApi } from '@/api/abstract-reviewer';
import { tryCatch } from '@/utils/tryCatch';

let currentPage = ref(1);
let reviewStage = ref<any>(null)

const reviewScoreStatusList = reactive<any>([]);

const handleChangePage = (page: number) => {
  currentPage.value = page;
  getReviewerScoreStatus();
}

const getReviewerScoreStatus = async () => {
  const { res, error }: any = await tryCatch(getReviewerScoreStatusPageApi(currentPage.value, 10, reviewStage.value));

  if (error || res.code !== 200) {
    return;
  }
  Object.assign(reviewScoreStatusList, res.data);
}

onMounted(() => {
  getReviewerScoreStatus();
});

</script>

<style scoped lang="scss">
.main-section {
  width: 95%;
  margin: 0 auto;

  .main-card {
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


  .email-column {
    display: flex;
    // flex-direction: column;
    gap: 0.5rem;
  }

  .function-bar {
    :deep(.el-form-item) {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .el-select {
      width: 200px;
    }
  }
}
</style>