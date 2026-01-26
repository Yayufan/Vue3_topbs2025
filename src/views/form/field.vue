<template>
  <section class="field-section">
    <h1>表單欄位編輯</h1>
    <el-card class="field-card" v-for="(formField, index) in formFieldList" :key="formField.formFieldId">
      <QuestionControl :field="formField" @update-local="patch => updateLocalField(index, patch)"
        @commit="fieldId => commitField(fieldId)" @delete="fieldId => handleDeleteField(fieldId)"
        @copy="fieldId => handleCopyField(fieldId)">
      </QuestionControl>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import QuestionControl from "@/components/FormField/FormFieldType/QuestionControl.vue";
import { ref, reactive, computed, watch } from "vue";
import { Delete, Plus } from "@element-plus/icons-vue";
import {
  type FormInstance,
  type FormRules,
  type UploadRawFile,
  type UploadProps,
  ElMessageBox,
  ElMessage,
  UploadUserFile,
} from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { getFormFieldApi, copyFormFieldApi, updateFormFieldApi, deleteFormFieldApi } from "@/api/formField";
import { FieldType, type FormField } from "@/api/formField/types";

const envAPI = import.meta.env.VITE_APP_BASE_API;
//獲取路由
const route = useRoute();
//獲取路由器
const router = useRouter();
//formLabel 寬度
const formLabelWidth = "140px";

/** ---------------- 從路由中取出 formId 參數 --------------------------*/
const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
});

/**----------------- formField相關 -------------------------------- */

// 預設問題
let createDefaultField = () => {
  return <FormField>{
    fieldType: FieldType.TEXT,
    label: "問題",
    description: "說明(選填)",
    placeholder: "簡答文字",
    imageUrl: "",
    imageCaption: "",
    isRequired: 0,
    fieldOrder: 0,
    options: null,
    validationRules: null,
  };
};

let formFieldList = reactive<FormField[]>([]);

const getFormFieldList = async (formId: string) => {
  let res = await getFormFieldApi(props.formId);
  // 清理過去資料
  formFieldList.length = 0;
  // 重新賦值資料
  Object.assign(formFieldList, res.data);
  // 如果裡面沒有元素則要內建一個元素給它
  if (formFieldList.length < 1) {
    formFieldList.push(createDefaultField());
  }

  console.log(formFieldList);
};

/**------------------------------------------------------------------- */

/**
 * 在本地更新表單欄位
 * @param index 
 * @param patch 
 */
const updateLocalField = (index: number, patch: Partial<FormField>) => {
  Object.assign(formFieldList[index], patch);
  // 修改後的資料
  console.log("本地更新: ", formFieldList[index]);
};

/**
 * 送出當前localData的表單欄位至Server更新
 * @param fieldId 
 */
const commitField = async (fieldId: string) => {
  const formData = new FormData();
  let targetField = formFieldList.find(field => field.formFieldId === fieldId);

  formData.append(
    "data",
    JSON.stringify(targetField)
  );

  await updateFormFieldApi(formData);
  // 修改後的資料
  console.log("更新至Server: ", targetField);

};

const handleCopyField = async (fieldId: string) => {
  console.log("fieldId: ", fieldId, "觸發Server複製")
  let targetField = formFieldList.find(field => field.formFieldId === fieldId);

  // 複製表單欄位
  await copyFormFieldApi(targetField)

  // 重新獲取表單所有欄位
  await getFormFieldList(props.formId);

}

/**
 * 刪除表單欄位
 * @param fieldId 
 */
const handleDeleteField = async (fieldId: string) => {
  console.log("fieldId: ", fieldId, "觸發Server刪除")
  // 刪除表單欄位
  await deleteFormFieldApi(fieldId)
  ElMessage.success("刪除成功")

  // 重新獲取表單所有欄位
  await getFormFieldList(props.formId);
}

/**--------------------------------------------------------------------- */

let formInfo = reactive<Record<string, any>>({});

// 掛載時讀取
onMounted(() => {
  // 獲取表單欄位列表
  getFormFieldList(props.formId);
});
</script>

<style scoped lang="scss">
.field-section {
  width: 95%;
  margin: 0 auto;

  .field-card {
    max-width: 768px;
    margin: 1% auto;
  }

  h1 {
    text-align: left;
    font-size: 2rem;
    margin: 1% 0;
  }
}
</style>
