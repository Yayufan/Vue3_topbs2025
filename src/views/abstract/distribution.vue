<template>
  <section class="destribution-section">

    <el-button @click="downloadAllAbstractFile"> Download All</el-button>

    <el-card>
      <el-table :data="paperList.records" style="width: 100%">
        <el-table-column prop="absType" label="投稿類別" width="100"></el-table-column>
        <el-table-column prop="absProp" label="文章屬性" width="100"></el-table-column>
        <el-table-column prop="absTitle" label="稿件主題"></el-table-column>
        <el-table-column prop="firstAuthor" label="第一作者" width="150"></el-table-column>
        <el-table-column label="審稿委員" width="150">
          <template #default="scope">
            <span v-if="scope.row.reviewerList.length == 0" style="color: gray;">無</span>
            <span v-else>
              <el-tag v-for="item in scope.row.reviewerList" :key="item.id" size="small" type="info">
                {{ item.name }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="新增審稿委員" width="150" align="center">
          <template #default="scope">
            <el-button link type="success" @click="toggleTransfer(scope.row)">
              Add
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <el-dialog body-class="add-dialog" v-model="isEdit" title="新增審稿委員" :close-on-click-modal="false"
      :before-close="closeTranfer">
      <el-transfer class="transfer" v-model="editPaper.reviewerList" :data="transferDataList" :titles="['可選老師', '已選老師']"
        :filterable="true">
        <template #default="{ option }">
          <el-text>{{ option.name }}</el-text>
        </template>
        <template #left-footer>
          <div class="pagination-box">
            <el-pagination layout="prev, pager, next" :total="Number(reviewerList.total)" :current-page="reviewerPage"
              @current-change="handleCurrentChange" />
          </div>
        </template>
      </el-transfer>
      <template #footer>
        <el-button type="danger" @click="closeTranfer()">取消</el-button>
        <!-- <el-button>確定</el-button> -->
      </template>
    </el-dialog>
  </section>
</template>
<script lang="ts" setup>
import { getPaperPageApi, downloadAllAbstractFileApi } from '@/api/abstract';
import { getPaperReviewerPageApi } from '@/api/abstract-reviewer';


const currentPage = ref(1)
const paperList = reactive<any>([])
const getPaperList = async () => {
  let res = await getPaperPageApi(currentPage.value, 10);
  Object.assign(paperList, res.data)

  paperList.records.forEach((item: any) => {
    item.reviewerList = [];
  })
}

const downloadAllAbstractFile = async () => {
  // let res = await new Promise<any>((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(
  //       `${import.meta.env.VITE_APP_BASE_API}/paper/download-all-abstructs`
  //     );
  //   }, 1000);
  // });
  // window.open(res, '_blank');
  downloadAllAbstractFileApi()
}

/**-------------------穿梭框---------------- */
const isEdit = ref(false);
const editPaper = reactive<any>({})
const toggleTransfer = (paper: any) => {
  isEdit.value = true
  getReviewerList()
  Object.assign(editPaper, paper)
}

const closeTranfer = () => {
  isEdit.value = false
  reviewerPage.value = 0

}

const reviewerPage = ref(0)

const handleCurrentChange = (val: number) => {
  reviewerPage.value = val
  getReviewerList()
}

const reviewerList = reactive<any>([])
let transferDataList = reactive<any>([]);

const getReviewerList = async () => {
  let res = await getPaperReviewerPageApi(reviewerPage.value, 10);
  reviewerList.length = 0
  transferDataList.length = 0
  res.data.records.forEach((item: any) => {
    transferDataList.push({
      id: item.id,
      name: item.name,
      label: item.name,
    })
  })
  Object.assign(reviewerList, res.data)
}

/**------------------------------------------- */
onMounted(() => {
  // getPaperList()
})
</script>
<style lang="scss" scoped>
.destribution-section {
  .add-dialog {
    .transfer {
      display: flex !important;

      justify-content: center !important;
    }

  }

  .pagination-box {
    display: flex;
    justify-content: center;
    // margin-top: 20px;

    // .el-pagination {
    //   margin: 0 auto;
    // }

  }
}
</style>