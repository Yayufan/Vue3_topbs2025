<template>
  <div>
    <el-upload ref="upload" class="upload-demo" :limit="1" :on-change="handleUpload" :auto-upload="false"
      :on-exceed="handleExceed">
      <el-button size="small" type="primary">Upload</el-button>
      <div slot="tip" class="el-upload__tip">only upload word file with size less than 20mb</div>
    </el-upload>

    <el-progress :percentage="percentage" :stroke-width="15" striped striped-flow />

    <p>hashCode: {{ hashCode }}</p>


  </div>
</template>
<script lang="ts" setup>
import { type UploadProps, type UploadUserFile, type UploadFile, type UploadFiles, type UploadInstance, type UploadRawFile, genFileId } from 'element-plus';
import { hashFile, slideCheck, slideUpload } from '@/utils/sha256';
import { hash } from 'crypto';



const upload = ref<UploadInstance>()

/**-------------------------------------------------------------- */
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/**-------------------------------------------------------------- */
const hashCode = ref<string>('')
const totalChunks = ref<number>(0)
const percentage = ref<number>(0)




const handleUpload: UploadProps['onChange'] = async (file: UploadUserFile, uploadFiles) => {
  if (file.size == 0) {
    ElMessage.error('File is empty');
    return false;
  }


  if (file.status === 'ready' && file.size && file.raw) {
    percentage.value = 0;
    percentage.value += 1;
    let res = await hashFile(file.raw)
    hashCode.value = res.hash;
    totalChunks.value = res.chunks.length;
    percentage.value += 9;
    let checkResult = await slideCheck(hashCode.value)
    await slideUpload(checkResult, res.file, res.hash, res.chunks, percentage)
  }

}
</script>