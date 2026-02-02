<template>
  <QuestionHeader :label="props.field.label" :fieldType="props.field.fieldType" @update:label="handleLabelInput"
    @update:fieldType="handleTypeSelected" @blur="commitLabel"></QuestionHeader>

  <div class="rate-box">
    <div class="rate-function-bar">
      <el-select :model-value="props.field.validationRules?.max" @update:model-value="handleNumberSelected"
        placeholder="Select" style="width: 60px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <el-rate class="rate-component" v-model="defaultValue" :max="props.field.validationRules?.max" :disabled="true" />
  </div>


  <QuestionFooter :index="props.index" :total="props.total" :is-required="props.field.isRequired"
    @update:isRequired="handleRequiredChange" @delete="handleFieldDelete" @copy="handleFieldCopy"
    @move-up="handleMoveUp" @move-down="handleMoveDown">
  </QuestionFooter>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { QuestionEditorBaseEmits, FormField, FieldType, NumericBoolean, ValidationRule } from "@/api/formField/types";
import { useQuestionEditorBase } from "@/components/FormField/FormFieldType/composables/useQuestionEditorBase";
import QuestionHeader from "@/components/FormField/FormFieldCommon/QuestionHeader.vue";
import QuestionFooter from "@/components/FormField/FormFieldCommon/QuestionFooter.vue";
import { max } from "lodash";


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

/**---------------------- Rate相關 ----------------------------- */

const defaultValue = ref(0)
const options = [
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
]


/**
 * 核心工具：獲取當前 validationRule 的副本或預設值
 */
const getUpdatedValidationRule = (): ValidationRule => {
  return props.field.validationRules
    ? {
      ...props.field.validationRules,
      showIf: props.field.validationRules.showIf,
    }
    : { max: 5, min: 1, showIf: null };
};

const handleNumberSelected = (maxSize: number) => {
  console.log("被選擇的數字: ", maxSize)
  const validationRules = getUpdatedValidationRule()
  console.log("當前field副本: ", validationRules)
  validationRules.max = maxSize
  console.log("修改過的field副本: ", validationRules)
  emit("update-local", { validationRules });
  emit("commit")
}

</script>

<style lang="scss" scoped>
.rate-box {
  margin-bottom: 5%;

  .rate-function-bar {
    margin: 3% 0;
  }

  .rate-component {
    width: 100%;

    :deep(.el-icon) {
      svg {
        filter:
          drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black);
      }
    }
  }

  :deep(.el-rate) {
    justify-content: space-evenly;
    --el-rate-icon-size: 32px;
  }



}
</style>
