<template>
  <QuestionHeader :label="props.field.label" :fieldType="props.field.fieldType" @update:label="handleLabelInput"
    @update:fieldType="handleTypeSelected" @blur="commitLabel"></QuestionHeader>

  <div class="text-box">
    <el-input v-model="text" :disabled="true" placeholder="簡答文字" />
  </div>


  <QuestionFooter :index="props.index" :total="props.total" :is-required="props.field.isRequired"
    @update:isRequired="handleRequiredChange" @delete="handleFieldDelete" @copy="handleFieldCopy"
    @move-up="handleMoveUp" @move-down="handleMoveDown">
  </QuestionFooter>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormField, FieldType, NumericBoolean } from "@/api/formField/types";
import { patchByFieldTypeChange } from "@/api/formField/fieldTypeTransition";
import QuestionHeader from "@/components/FormField/FormFieldCommon/QuestionHeader.vue";
import QuestionFooter from "@/components/FormField/FormFieldCommon/QuestionFooter.vue";

let text = ref("");

// 誰能進來 父 -> 子
const props = defineProps<{
  field: FormField,
  index: number;
  total: number;
}>();

// 誰能出去 子 -> 父
const emit = defineEmits<{
  (e: "update-local", patch: Partial<FormField>): void;
  (e: "commit"): void;
  (e: "copy"): void;
  (e: "delete"): void;
  (e: "move-up"): void;
  (e: "move-down"): void;
}>();

/** QestionHeader事件 */

/**
 * 處理題目名稱變換 - 本地
 * @param newLabel 
 */
const handleLabelInput = (newLabel: string) => {
  emit("update-local", { label: newLabel });
};

/**
 * 處理題目名稱變換 - 同步Server
 */
const commitLabel = () => {
  emit("commit");
};

/**
 * 處理 題型切換
 * @param newType 
 */
const handleTypeSelected = (newType: FieldType) => {
  emit("update-local", patchByFieldTypeChange(props.field, newType));
  emit("commit"); // select 本身就是完成操作
};

/** QuestionFooter 事件 */

/**
 * 處理 必填切換
 * @param value 
 */
const handleRequiredChange = (value: NumericBoolean) => {
  emit("update-local", { isRequired: value });
  emit("commit"); // select 本身就是完成操作
}

const handleFieldDelete = () => {
  emit("delete");
}

const handleFieldCopy = () => {
  emit("copy");
}

const handleMoveUp = () => {
  emit("move-up");
};

const handleMoveDown = () => {
  emit("move-down");
};

</script>

<style lang="scss" scoped>
.text-box {
  margin-bottom: 5%;
}
</style>
