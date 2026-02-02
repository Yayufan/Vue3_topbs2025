<template>
  <QuestionHeader :label="props.field.label" :fieldType="props.field.fieldType" @update:label="handleLabelInput"
    @update:fieldType="handleTypeSelected" @blur="commitLabel"></QuestionHeader>

  <div class="textarea-box">
    <el-input v-model="textarea" :disabled="true" :rows="3" type="textarea" placeholder="詳答文字" />
  </div>


  <QuestionFooter :index="props.index" :total="props.total" :is-required="props.field.isRequired"
    @update:isRequired="handleRequiredChange" @delete="handleFieldDelete" @copy="handleFieldCopy"
    @move-up="handleMoveUp" @move-down="handleMoveDown">
  </QuestionFooter>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { QuestionEditorBaseEmits, FormField, FieldType, NumericBoolean } from "@/api/formField/types";
import { useQuestionEditorBase } from "@/components/FormField/FormFieldType/composables/useQuestionEditorBase";
import QuestionHeader from "@/components/FormField/FormFieldCommon/QuestionHeader.vue";
import QuestionFooter from "@/components/FormField/FormFieldCommon/QuestionFooter.vue";

let textarea = ref("");

// 誰能進來 父 -> 子
const props = defineProps<{
  field: FormField,
  index: number;
  total: number;
}>();
// 誰能出去 子 -> 父
const emit = defineEmits<QuestionEditorBaseEmits>();

// 通用功能bar的方法,QuestionHeader 和 QuestionFooter 的function
const {
  handleLabelInput,
  commitLabel,
  handleTypeSelected,
  handleRequiredChange,
  handleFieldDelete,
  handleFieldCopy,
  handleMoveUp,
  handleMoveDown,
} = useQuestionEditorBase(props, emit);

</script>

<style lang="scss" scoped>
.textarea-box {
  margin-bottom: 5%;
}
</style>
