<template>
  <QuestionHeader :label="props.field.label" :fieldType="props.field.fieldType" @update:label="handleLabelInput"
    @update:fieldType="handleTypeSelected" @blur="commitLabel"></QuestionHeader>
  <el-input v-model="text" :disabled="true" placeholder="簡答文字" />
  <QuestionFooter :isRequired="props.field.isRequired"></QuestionFooter>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormField, FieldType } from "@/api/formField/types";
import { patchByFieldTypeChange } from "@/api/formField/fieldTypeTransition";
import QuestionHeader from "@/components/FormField/FormFieldCommon/QuestionHeader.vue";
import QuestionFooter from "@/components/FormField/FormFieldCommon/QuestionFooter.vue";

let text = ref("");

// 誰能進來 父 -> 子
const props = defineProps<{ field: FormField }>();

// 誰能出去 子 -> 父
const emit = defineEmits<{
  (e: "update-local", patch: Partial<FormField>): void;
  (e: "commit"): void;
}>();

/** QestionHeader事件：把細碎的事件組合起來往上丟 */
const handleLabelInput = (newLabel: string) => {
  emit("update-local", { label: newLabel });
};

const commitLabel = () => {
  emit("commit");
};

const handleTypeSelected = (newType: FieldType) => {
  let res = patchByFieldTypeChange(props.field, newType)
  emit("update-local", patchByFieldTypeChange(props.field, newType));
  emit("commit"); // select 本身就是完成操作
};

</script>

<style lang="scss" scoped></style>
