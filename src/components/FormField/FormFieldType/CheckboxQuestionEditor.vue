<template>
  <QuestionHeader :label="props.field.label" :fieldType="props.field.fieldType" @update:label="updateLabel"
    @update:fieldType="updateType"></QuestionHeader>

  <QuestionFooter></QuestionFooter>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormField } from "@/api/formField/types";
import QuestionHeader from "@/components/FormField/FormFieldCommon/QuestionHeader.vue";
import QuestionFooter from "@/components/FormField/FormFieldCommon/QuestionFooter.vue";

// 誰能進來 父 -> 子
const props = defineProps<{ field: FormField }>();
// 誰能出去 子 -> 父
const emit = defineEmits<{
  (e: "update-field-data", patch: Partial<FormField>): void;
}>();

// 延伸操作：把細碎的事件組合起來往上丟
const updateLabel = (newLabel: string) => {
  emit("update-field-data", { label: newLabel });
};

const updateType = (newType: any) => {
  emit("update-field-data", { fieldType: newType });
};
</script>

<style lang="scss" scoped></style>
