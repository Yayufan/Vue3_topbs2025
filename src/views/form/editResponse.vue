<template>
  <main class="common-section">
    <h1 class="title">{{ fillableForm.title }}</h1>

    <div class="function-bar">
      <el-button type="info" @click="back">
        返回表單回覆頁
      </el-button>
      <el-button type="success" @click="submit">
        保存
      </el-button>
    </div>

    <div class="form-box">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
        <template v-for="field in validFormFields" :key="field.formFieldId">
          <el-form-item :label="field.label" :prop="field.formFieldId">
            <component :is="resolveComponent(field)" v-model="formModel[field.formFieldId]" :field="field" />
          </el-form-item>
        </template>

      </el-form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { type FormDto, type FormField, FieldType } from '@/api/formField/types';
import { getEditableResponseApi, updateResponseApi } from "@/api/formResponse/index";

// 組件導入 (保持不變)
import TextQuestion from "@/components/FormResponse/FormText.vue";
import TextareaQuestion from "@/components/FormResponse/FormTextarea.vue";
import SelectQuestion from "@/components/FormResponse/FormSelect.vue";
import CheckboxQuestion from "@/components/FormResponse/FormCheckbox.vue";
import RateQuestion from "@/components/FormResponse/FormRate.vue";
import RadioQuestion from "@/components/FormResponse/FormRadio.vue";

import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();

const props = defineProps({
  responseId: {
    type: String,
    required: true,
  },
});

/** ---------------- 類型定義與收窄 --------------------------*/

// 1. 定義一個局部類型，強迫 formFieldId 為必填 string
type ValidFormField = FormField & { formFieldId: string };

const formRef = ref<FormInstance>();

let fillableForm = reactive<FormDto>({
  formId: '',
  title: '',
  description: '',
  status: '',
  requireLogin: 0,
  requiredForCheckout: 0,
  allowMultipleSubmissions: 0,
  startTime: '',
  endTime: '',
  formFields: []
});

// 2. 建立計算屬性：過濾掉無效欄位並排序
// 使用 Type Guard (field is ValidFormField) 讓 TS 知道過濾後的結果
const validFormFields = computed<ValidFormField[]>(() => {
  return fillableForm.formFields
    .filter((field): field is ValidFormField => !!field.formFieldId)
    .sort((a, b) => a.fieldOrder - b.fieldOrder);
});

/**-------------------------------------------------------- */

const formModel = reactive<Record<string, any>>({});
const formRules = reactive<FormRules>({});

const initForm = () => {
  validFormFields.value.forEach(field => {
    const key = field.formFieldId;
    // 取得現有的答案值 (從 field.answer.answerValue 中提取)
    const existingAnswer = (field as any).answer?.answerValue;

    switch (field.fieldType) {
      case FieldType.CHECKBOX:
        // 如果有舊答案，將 "A,B,C" 轉為 ["A", "B", "C"]；否則給空陣列
        formModel[key] = existingAnswer ? existingAnswer.split(',') : [];
        break;

      case FieldType.RATE:
        // Rate 通常需要數字類型，將字串轉為數字
        formModel[key] = existingAnswer !== undefined ? Number(existingAnswer) : (field.validationRules?.min ?? 0);
        break;

      case FieldType.RADIO:
      case FieldType.SELECT:
      case FieldType.TEXT:
      case FieldType.TEXTAREA:
      default:
        // 其餘類型直接使用字串，若無則給空字串
        formModel[key] = existingAnswer ?? '';
        break;
    }

    // 驗證規則初始化 (保持不變)
    if (field.isRequired) {
      formRules[key] = [
        {
          required: true,
          message: `${field.label} 為必填`,
          trigger: ['blur', 'change']
        }
      ];
    }
  });
};

const getFillableForm = async () => {
  let res = await getEditableResponseApi(props.responseId);
  Object.assign(fillableForm, res.data);
  console.log(res.data)
};

const componentMap: Record<string, any> = {
  [FieldType.TEXT]: TextQuestion,
  [FieldType.TEXTAREA]: TextareaQuestion,
  [FieldType.RADIO]: RadioQuestion,
  [FieldType.CHECKBOX]: CheckboxQuestion,
  [FieldType.SELECT]: SelectQuestion,
  [FieldType.RATE]: RateQuestion,
  [FieldType.NUMBER]: TextQuestion,
  [FieldType.EMAIL]: TextQuestion,
  [FieldType.DATE]: TextQuestion,
  [FieldType.SECTION]: TextQuestion,
  [FieldType.IMAGE]: TextQuestion,
};

const resolveComponent = (field: ValidFormField) => {
  return componentMap[field.fieldType];
};

// 監聽有效欄位的變化來初始化
watch(validFormFields, initForm, { immediate: true });

const buildSubmitPayload = () => {
  const list = validFormFields.value
    .map(field => {
      const val = formModel[field.formFieldId];

      // 判斷當前是否有輸入內容
      const isEmpty = Array.isArray(val) ? val.length === 0 : (val === '' || val === null);

      // 既沒有舊答案，現在也沒填 -> 跳過
      if (!field.answer && isEmpty) return null;

      return {
        // 重要：如果有舊 ID 就帶上，沒有就 null，讓後端去判斷是 Insert 還是 Update
        responseAnswerId: field.answer?.responseAnswerId || null,
        formFieldId: field.formFieldId, // 務必帶上，否則後端不知道這筆答案是哪題的
        answerValue: Array.isArray(val) ? val.join(',') : String(val ?? '')
      };
    })
    .filter(Boolean); // 過濾掉 null

  return {
    formId: fillableForm.formId,
    formResponseId: props.responseId,
    responseAnswerList: list
  };
};

/**
 * 返回表單頁
 */
const back = () => {
  router.push({
    name: "FormResponse",
    params: {
      formId: fillableForm.formId
    }
  })
}

/**
 * 保存
 */
const submit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  const payload = buildSubmitPayload();
  console.log("Submit Payload: ", payload);
  // 呼叫 API 邏輯...
  await updateResponseApi(payload)

  ElMessage.success("更新完畢")

  getFillableForm();
};

onMounted(() => {
  getFillableForm();
});
</script>

<style lang="scss" scoped>
.common-section {
  width: 70%;
  margin: 0 auto;

  .title {
    text-align: center;
  }

  .function-bar {
    text-align: right;
    margin: 2% 0;
  }

  .form-box {
    margin: 3% auto;

    @media screen and (max-width:800px) {
      width: 90%;
    }


  }
}
</style>