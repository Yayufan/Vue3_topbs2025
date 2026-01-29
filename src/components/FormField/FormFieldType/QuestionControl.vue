<template>
  <div>
    <component :is="componentMap[props.field.fieldType]" :field="props.field" :index="props.index" :total="props.total"
      @update-local="emitUpdateLocal" @commit="emitCommit(props.field.formFieldId!)"
      @delete="emitDelete(props.field.formFieldId!)" @copy="emitCopy(props.field.formFieldId!)" @move-up="emitMoveUp"
      @move-down="emitMoveDown" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import TextQuestionEditor from "@/components/FormField/FormFieldType/TextQuestionEditor.vue";
import TextareaQuestionEditor from "@/components/FormField/FormFieldType/TextareaQuestionEditor.vue";
import RadioQuestionEditor from "@/components/FormField/FormFieldType/RadioQuestionEditor.vue";
import CheckboxQuestionEditor from "@/components/FormField/FormFieldType/CheckboxQuestionEditor.vue";
import NumberQuestionEditor from "@/components/FormField/FormFieldType/NumberQuestionEditor.vue";
import EmailQuestionEditor from "@/components/FormField/FormFieldType/EmailQuestionEditor.vue";
import SelectQuestionEditor from "@/components/FormField/FormFieldType/SelectQuestionEditor.vue";
import RateQuestionEditor from "@/components/FormField/FormFieldType/RateQuestionEditor.vue";
import DateQuestionEditor from "@/components/FormField/FormFieldType/DateQuestionEditor.vue";

import { FieldType, type FormField } from "@/api/formField/types";

// 誰能進來 父 -> 子
const props = defineProps<{
  field: FormField,
  index: number;
  total: number;
}>();
// 誰能出去 子 -> 父
const emit = defineEmits<{
  (e: "update-local", patch: Partial<FormField>): void;
  (e: "commit", fieldId: string): void;
  (e: "copy", fieldId: string): void;
  (e: "delete", fieldId: string): void;
  (e: "move-up"): void;
  (e: "move-down"): void;
}>();


/**
 * 本地更新
 * @param patch 
 */
const emitUpdateLocal = (patch: Partial<FormField>) => {
  emit("update-local", patch);
};

/**
 * 觸發提交
 * @param fieldId 
 */
const emitCommit = (fieldId: string) => {
  emit("commit", fieldId);
};

/**
 * 觸發刪除
 * @param fieldId 
 */
const emitDelete = (fieldId: string) => {
  emit("delete", fieldId);
};

/**
 * 觸發複製
 * @param fieldId 
 */
const emitCopy = (fieldId: string) => {
  emit("copy", fieldId);
};

/**
 * 觸發上移
 */
const emitMoveUp = () => {
  emit("move-up");
};

/**
 * 觸發下移
 */
const emitMoveDown = () => {
  emit("move-down");
};

const componentMap: Record<FieldType, any> = {
  [FieldType.TEXT]: TextQuestionEditor,
  [FieldType.TEXTAREA]: TextareaQuestionEditor,
  [FieldType.RADIO]: RadioQuestionEditor,
  [FieldType.CHECKBOX]: CheckboxQuestionEditor,
  [FieldType.NUMBER]: NumberQuestionEditor,
  [FieldType.EMAIL]: EmailQuestionEditor,
  [FieldType.SELECT]: SelectQuestionEditor,
  [FieldType.RATE]: RateQuestionEditor,
  [FieldType.DATE]: DateQuestionEditor,
  // 尚未製作
  [FieldType.SECTION]: CheckboxQuestionEditor,
  [FieldType.IMAGE]: CheckboxQuestionEditor,
};
</script>

<style lang="scss" scoped></style>
