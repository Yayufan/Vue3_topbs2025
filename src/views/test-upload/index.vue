<template>
  <div>
    <el-upload ref="upload" class="upload-demo" :limit="1" :on-change="handleUpload" :auto-upload="false"
      :on-exceed="handleExceed">
      <el-button size="small" type="primary">Upload</el-button>
      <div slot="tip" class="el-upload__tip">only upload word file with size less than 20mb</div>
    </el-upload>
    <p>hash: {{ hashCode }}</p>
    <p>hash2: {{ hashCode2 }}</p>
    <p>spend: {{ spendTime }}</p>
    <p>spend2: {{ spendTime2 }}</p>

    <el-button @click="reset">reset</el-button>
  </div>
</template>
<script lang="ts" setup>
import { type UploadProps, type UploadUserFile, type UploadFile, type UploadFiles, type UploadInstance, type UploadRawFile, genFileId } from 'element-plus';
import { hashFile } from '@/utils/sha256';

const hashCode = ref<string>('');
const hashCode2 = ref<string>('');
const spendTime = ref<number>(0);
const spendTime2 = ref<number>(0);


const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const reset = () => {
  hashCode.value = '';
  hashCode2.value = '';
  spendTime.value = 0;
  spendTime2.value = 0;
}

const handleUpload: UploadProps['onChange'] = async (file: UploadUserFile, uploadFiles) => {
  console.log('file', file);
  if (file.size == 0) {
    ElMessage.error('File is empty');
    return false;
  }


  if (file.status === 'ready' && file.size && file.raw) {

    hashCode.value = await hashFile(file.raw)
    // console.log('file.raw', file.raw);
    // let start = new Date().getTime();
    // console.log(start)
    // await hashFile(file.raw).then((hash) => {
    //   console.log('File hash:', hash);
    //   hashCode.value = hash;
    // });
    // let end = new Date().getTime();
    // spendTime.value = end - start;
    // start = new Date().getTime();
    // await hashFile2(file.raw).then((hash) => {
    //   console.log('File hash2:', hash);
    //   hashCode2.value = hash;
    // // });
    // console.log(end)
    // end = new Date().getTime();
    // spendTime2.value = end - start;
  }

}
</script>