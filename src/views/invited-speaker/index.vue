<template>
  <section class="speaker-section">
    <!-- <h1>受邀講者</h1> -->
    <el-card class="speaker-card">
      <h1>受邀講者</h1>

      <div class="function-btn">
        <el-button type="primary" @click="openAddDialog">
          新增講者
        </el-button>
        <el-button type="danger" @click="deleteList">
          批量刪除
        </el-button>
      </div>

      <!-- Data table -->
      <el-table :data="speakerList.records" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="照片" width="150">
          <template #default="scope">
            <div class="demo-image__preview">
              <el-image style="width: 100px; height: 100px" loading="lazy" :src="envMinio + scope.row.photoUrl"
                fit="fill" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="國籍" prop="country"></el-table-column>
        <el-table-column label="任職單位" prop="affiliation"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="openEditDialog(scope.row)">Edit</el-button>
            <el-button type="danger" link @click="deleteSpeaker(scope.row.invitedSpeakerId)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="toggleAddDialog" title="新增講者">
        <el-form ref="addFormRef" class="form" :model="addFormData" label-position="top" :rules="formRules">

          <div class="top">
            <div class="top-left">
              <el-form-item label="姓名:" prop="name">
                <el-input v-model="addFormData.name"></el-input>
              </el-form-item>
              <el-form-item label="國籍:" prop="country">
                <el-select v-model="addFormData.country" placeholder="Select a Country or Location" filterable>
                  <el-option v-for="item in countries" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所屬機構:" prop="affiliation">
                <el-input v-model="addFormData.affiliation"></el-input>
              </el-form-item>
            </div>
            <div class="top-right">
              <el-form-item :label="'縮圖上傳(建議解析度 800*600)'">

                <el-upload class="thumbnail-uploader" :action="envAPI + '/upload/img'" :show-file-list="false"
                  :on-success="handleImageUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>

              </el-form-item>
            </div>
          </div>

          <el-form-item class="education-label" :label="`教育背景${index + 1}:`"
            v-for="(item, index) in addFormData.educationalBackground" prop="`educationalBackground`">
            <div class="text-area-item-box">
              <el-input v-model="addFormData.educationalBackground[index]" type="textarea"></el-input>
              <el-button v-if="index === addFormData.educationalBackground.length - 1" type="primary"
                @click="addFormData.educationalBackground.push('')">新增教育背景</el-button>
              <el-button type="danger" @click="addFormData.educationalBackground.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>

          <el-divider></el-divider>
          <el-form-item class="workExperience-label" :label="`工作經驗${index + 1}:`"
            v-for="(item, index) in addFormData.workExperience" :prop="`workExperience+${index}`">
            <div class="text-area-item-box">
              <el-input v-model="addFormData.workExperience[index]" type="textarea"></el-input>
              <el-button v-if="index === addFormData.workExperience.length - 1" type="primary"
                @click="addFormData.workExperience.push('')">新增工作經驗</el-button>
              <el-button type="danger" @click="addFormData.workExperience.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>
          <el-divider></el-divider>


          <el-form-item class="publication-label" :label="`發表作品${index + 1}:`"
            v-for="(item, index) in addFormData.publication" :prop="`publication+${index}`">
            <div class="text-area-item-box">
              <el-input v-model="addFormData.publication[index]" type="textarea"></el-input>
              <el-button v-if="index === addFormData.publication.length - 1" type="primary"
                @click="addFormData.publication.push('')">新增發表作品</el-button>
              <el-button type="danger" @click="addFormData.publication.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>
          <el-divider></el-divider>


          <el-form-item class="award-label" :label="`得獎經歷${index + 1}:`" v-for="(item, index) in addFormData.award"
            :prop="`award+${index}`">
            <div class="text-area-item-box">
              <el-input v-model="addFormData.award[index]" type="textarea"></el-input>
              <el-button v-if="index === addFormData.award.length - 1" type="primary"
                @click="addFormData.award.push('')">新增得獎經歷</el-button>
              <el-button type="danger" @click="addFormData.award.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="btn-box">
              <el-button type="primary" @click="addNewSpeaker(addFormRef)">新增</el-button>
              <el-button type="danger" @click="toggleAddDialog = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>


      <el-dialog v-model="toggleEditDialog" title="編輯講者">
        <el-form ref="editRef" class="form" :model="editForm" label-position="top" :rules="formRules">
          <div class="top">
            <div class="top-left">
              <el-form-item label="姓名:" prop="name">
                <el-input v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="國籍:" prop="country">
                <el-select v-model="editForm.country" placeholder="Select a Country or Location" filterable>
                  <el-option v-for="item in countries" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所屬機構:" prop="affiliation">
                <el-input v-model="editForm.affiliation"></el-input>
              </el-form-item>

            </div>
            <div class="top-right">
              <el-form-item :label="'縮圖上傳(建議解析度 800*600)'" prop="photoUrl">

                <el-upload class="thumbnail-uploader" :action="envAPI + '/upload/img'" :show-file-list="false"
                  :on-success="handleImageUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>

              </el-form-item>
            </div>
          </div>
          <el-form-item class="education-label" :label="`教育背景${index + 1}:`"
            v-for="(item, index) in editForm.educationalBackground" :prop="`educationalBackground+${index}`">
            <div class="text-area-item-box">
              <el-input v-model="editForm.educationalBackground[index]" type="textarea"></el-input>
              <el-button v-if="index === editForm.educationalBackground.length - 1" type="primary"
                @click="editForm.educationalBackground.push('')">新增教育背景</el-button>
              <el-button type="danger" @click="editForm.educationalBackground.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item class="workExperience-label" :label="`工作經驗${index + 1}:`"
            v-for="(item, index) in editForm.workExperience" prop="workExperience">
            <div class="text-area-item-box">
              <el-input v-model="editForm.workExperience[index]" type="textarea"></el-input>
              <el-button v-if="index === editForm.workExperience.length - 1" type="primary"
                @click="editForm.workExperience.push('')">新增工作經驗</el-button>
              <el-button type="danger" @click="editForm.workExperience.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item class="publication-label" :label="`發表作品${index + 1}:`"
            v-for="(item, index) in editForm.publication" prop="publication">
            <div class="text-area-item-box">
              <el-input v-model="editForm.publication[index]" type="textarea"></el-input>
              <el-button v-if="index === editForm.publication.length - 1" type="primary"
                @click="editForm.publication.push('')">新增發表作品</el-button>
              <el-button type="danger" @click="editForm.publication.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item class="award-label" :label="`得獎經歷${index + 1}:`" v-for="(item, index) in editForm.award"
            prop="award">
            <div class="text-area-item-box">
              <el-input v-model="editForm.award[index]" type="textarea"></el-input>
              <el-button v-if="index === editForm.award.length - 1" type="primary"
                @click="editForm.award.push('')">新增得獎經歷</el-button>
              <el-button type="danger" @click="editForm.award.splice(index, 1)">刪除</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="btn-box">
              <el-button type="primary" @click="handleEditSpeaker(editRef)">編輯</el-button>
              <el-button type="danger" @click="toggleEditDialog = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>

      </el-dialog>




    </el-card>
  </section>
</template>
<script setup lang="ts">
import { addNewInvitedSpeakerApi, batchDeleteInvitedSpeakerApi, deleteInvitedSpeakerApi, getInvitedSpeakerListByPaginationApi, updateNewInvitedSpeakerApi } from '@/api/invited_speaker';
import { FormInstance, FormRules, UploadProps, UploadRawFile } from 'element-plus';

import countriesJson from '@/assets/data/countries.json'
const countries = reactive(countriesJson);



const currentPage = ref(1);


const speakerList = ref<any>([]);
const getInvitedSpeakerByPagination = async () => {
  const res = await getInvitedSpeakerListByPaginationApi(currentPage.value, 10);
  // speakerList.value = res.data;
  console.log(res)
  Object.assign(speakerList.value, res.data);
}


onMounted(() => {
  getInvitedSpeakerByPagination();
})

const envMinio = import.meta.env.VITE_MINIO_API_URL;
const envAPI = import.meta.env.VITE_APP_BASE_API;

/**============================================ */
const educationalBackgroundItem = ('');
const workExperienceItem = ('');
const publicationsItem = ('');
const awardItem = ('');


const addFormRef = ref<FormInstance>();
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '請輸入姓名', trigger: 'blur' },
  ],
  country: [
    { required: true, message: '請輸入國籍', trigger: 'blur' },
  ],
})



const addFormData = reactive({
  name: '',
  country: '',
  affiliation: "",
  educationalBackground: [educationalBackgroundItem],
  workExperience: [workExperienceItem],
  publication: [publicationsItem],
  award: [awardItem],
})


const addNewSpeaker = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let formData = new FormData();
      console.log('addFormData', addFormData);
      formData.append('data', JSON.stringify(addFormData));
      formData.append('file', imgFile);
      console.log('formData', formData.get('data'));
      let res: any = await addNewInvitedSpeakerApi(formData);
      if (res.code === 200) {
        ElMessage.success('新增成功');
        toggleAddDialog.value = false;
        getInvitedSpeakerByPagination();
        formEl.resetFields();
        imageUrl.value = '';
        imgFile = <UploadRawFile>{};
        addFormData.educationalBackground = [educationalBackgroundItem];
        addFormData.workExperience = [workExperienceItem];
        addFormData.publication = [publicationsItem];
        addFormData.award = [awardItem];
      } else {
        ElMessage.error('新增失敗');
      }
    } else {
      console.log('error submit!!');
      ElMessage.error('請完整填入資訊');
    }
  });

}

const toggleAddDialog = ref(false);
const openAddDialog = () => {
  toggleAddDialog.value = true;
}

const imageUrl = ref();
let imgFile = <UploadRawFile>{}

const handleImageUpload: UploadProps['onSuccess'] = (response, uploadFile) => {
  console.log('uploadFile', uploadFile);

  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  imgFile = uploadFile.raw!;
}



/**============================================ */

const editSpeaker = ref<any>({});
const toggleEditDialog = ref(false);

const editRef = ref<FormInstance>();

const editForm = reactive<any>({
  invitedSpeakerId: '',
  name: '',
  country: '',
  affiliation: "",
  educationalBackground: [],
  workExperience: [],
  publication: [],
  award: [],
})


const openEditDialog = (row: any) => {
  toggleEditDialog.value = true;
  // Object.assign(editForm, row);
  editForm.invitedSpeakerId = row.invitedSpeakerId;
  editForm.name = row.name;
  editForm.country = row.country;
  editForm.affiliation = row.affiliation;
  editForm.educationalBackground = row.educationalBackground;
  editForm.workExperience = row.workExperience;
  editForm.publication = row.publication;
  editForm.award = row.award;
  if (row.photoUrl) {
    imageUrl.value = envMinio + row.photoUrl;
  } else {
    imageUrl.value = '';
  }
}

const handleEditSpeaker = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (valid) {
      console.log('editForm', editForm);
      let formData = new FormData();
      formData.append('data', JSON.stringify(editForm));
      formData.append('file', imgFile);
      console.log('formData', formData.get('data'));
      let res: any = await updateNewInvitedSpeakerApi(formData);
      if (res.code === 200) {
        ElMessage.success('編輯成功');
        toggleEditDialog.value = false;
        getInvitedSpeakerByPagination();
      } else {
        ElMessage.error('編輯失敗');
      }
    } else {
      console.log('error submit!!');
      ElMessage.error('請完整填入資訊');
    }
  });
}

/**================================ */
const deleteSpeaker = async (id: number) => {
  console.log('刪除id', id);
  await deleteInvitedSpeakerApi(id);
  ElMessage.success('刪除成功');
  getInvitedSpeakerByPagination();
}

//要刪除的對象列表
let deleteSelectList = reactive([])

//當checkbox狀態改變時的function,val是一個數組對象
const handleSelectionChange = (val: any) => {
  //重製deleteSelectList,移除所有屬性
  deleteSelectList.length = 0
  Object.assign(deleteSelectList, val)
}

//批量刪除醫學新知的function
const deleteList = () => {
  console.log('deleteSelectList', deleteSelectList);
  if (deleteSelectList.length >= 1) {
    ElMessageBox.confirm(`確定要刪除這${deleteSelectList.length}位講者嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //使用父組件的API
      let deleteIdList = deleteSelectList.map((item: any) => item.invitedSpeakerId)
      await batchDeleteInvitedSpeakerApi(deleteIdList)
      ElMessage.success("刪除成功")
      getInvitedSpeakerByPagination()
    }).catch((err) => {
      console.log(err)
    })

  } else {
    ElMessage.error("請至少勾選一筆資料進行刪除")
  }
}
</script>
<style scoped lang="scss">
.speaker-section {
  width: 95%;
  margin: 0 auto;

  .speaker-card {
    margin-top: 2%;
    margin-bottom: 2%;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin: 1% 0;
  }

  .function-btn {
    display: flex;
    justify-content: flex-end;
  }


  .form {
    .el-input {
      width: 30rem;
    }

    .el-textarea {
      width: 30rem;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 4rem;
      gap: 2rem;

      .top-left {}

      .top-right {
        height: 15rem;
        width: 15rem;
        display: flex;
        justify-content: center;
        align-items: center;

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



    .text-area-item-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-button {
        margin-left: 1rem;
      }
    }

    .btn-box {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      align-items: center;
      margin-top: 2rem;

      .el-button {
        margin-left: 1rem;
      }
    }

    .education-label {
      :deep(.el-form-item__label) {
        color: #22334b;
      }
    }

    .workExperience-label {
      :deep(.el-form-item__label) {
        color: #79a0d6;
      }
    }

    .publication-label {
      :deep(.el-form-item__label) {
        color: #22334b;
      }
    }

    .award-label {
      :deep(.el-form-item__label) {
        color: #79a0d6;
      }
    }
  }
}
</style>