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
        <el-input v-model="input" style="width: 240px" placeholder="輸入內容,Enter查詢" @input="getPaperList()" />

        <el-select v-model="filterAbsType" style="width: 240px;" class="filter-abs-type" placeholder="請選擇投稿類型"
          @change="getPaperList()">
          <el-option value="Poster Presentation"></el-option>
          <el-option value="Video Presentation"></el-option>
          <el-option value="Young Investigator"></el-option>
          <el-option value="" label="All"></el-option>
        </el-select>
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
            <span v-else-if="scope.row.status == 1" style="color: green;">審核通過</span>
            <span v-else-if="scope.row.status == 2" style="color: red;">駁回申請</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="150">
          <template #default="scope">
            <el-button link type="success" @click="toggleEdit(scope.row)">
              Edit
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
        <!-- <el-form-item label="審核狀態" prop="status">
          <el-select v-model="updateForm.status" placeholder="請選擇審核狀態" style="width: 100%">
            <el-option label="未審核" :value="0">
              <span>未審核</span>
            </el-option>
            <el-option label="審核通過" :value="1">
              <span style="color:green;">審核通過</span>
            </el-option>
            <el-option label="駁回申請" :value="2">
              <span style="color:red;">駁回申請</span>
            </el-option>

            <template #label="{ label, value }">
              <span :style="{ color: value == '1' ? 'green' : value == '-1' ? 'red' : 'black' }">{{ label }}</span>
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="updatePaper">更新</el-button>
          <el-button @click="isEdit = false">關閉</el-button>
        </el-form-item>
      </el-form>


    </el-drawer>
  </section>


</template>
<script lang="ts" setup>
import { getPaperPageApi, updatePaperApi } from '@/api/abstract';



const currentPage = ref(1)

const input = ref('')
const filterStatus = ref()
const filterAbsType = ref('')
const filterAbsProp = ref('')

const paperList = reactive<any>([])
const getPaperList = async () => {
  let res = await getPaperPageApi(currentPage.value, 10, input.value, filterStatus.value, filterAbsType.value, filterAbsProp.value);
  console.log(res)
  Object.assign(paperList, res.data)
}

watch(filterStatus, (value, oldValue) => {
  getPaperList()
})

watch(currentPage, (value, oldValue) => {
  getPaperList()
})

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
  justify-content: flex-start;
  margin-bottom: 20px;

}

:deep(.el-tag__content) {
  color: white;
  font-size: 14px;
}

:deep(.el-tag__close) {
  color: red;
}
</style>