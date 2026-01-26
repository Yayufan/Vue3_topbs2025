<template>
  <div class="question-header-box">
    <el-input class="label" :model-value="props.label" @update:model-value="handleLabelInput" @blur="emit('blur')"
      type="textarea" autosize placeholder="問題" />

    <el-select class="type" :model-value="props.fieldType" @update:model-value="handleTypeSelected">
      <!-- select 展示答案 -->
      <template #label="{ label, value }">
        <div class="show-selected">
          <img :src="typeIconMap[value as FieldType]" />
          <span>{{ label }}</span>
        </div>
      </template>

      <!-- optoin 展示選項 -->
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        <div class="show-option-item">
          <img :src="typeIconMap[item.value as FieldType]" />
          <span>{{ item.label }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FieldType } from "@/api/formField/types";

import shortAnswer from "@/assets/icons/short-answer.svg";
import detailedAnswer from "@/assets/icons/detailed-answer.svg";
import radioCheckedSvg from "@/assets/icons/radio-checked.svg";
import checkboxCheckedSvg from "@/assets/icons/checkbox-checked.svg";
import selectSvg from "@/assets/icons/select.svg";
import starSvg from "@/assets/icons/star.svg";

// 選項及icon映射表
const typeIconMap: Partial<Record<FieldType, string>> = {
  [FieldType.TEXT]: shortAnswer,
  [FieldType.TEXTAREA]: detailedAnswer,
  [FieldType.RADIO]: radioCheckedSvg,
  [FieldType.CHECKBOX]: checkboxCheckedSvg,
  [FieldType.SELECT]: selectSvg,
  [FieldType.RATE]: starSvg,
};

// 題型選項
const options = [
  {
    value: FieldType.TEXT,
    label: "簡答",
  },
  {
    value: FieldType.TEXTAREA,
    label: "詳答",
  },
  {
    value: FieldType.RADIO,
    label: "選擇題",
  },
  {
    value: FieldType.CHECKBOX,
    label: "核取方塊",
  },
  {
    value: FieldType.SELECT,
    label: "下拉式選單",
  },
  {
    value: FieldType.RATE,
    label: "評分",
  },
];

// 誰能進來 父 -> 子
const props = defineProps<{
  label: string;
  fieldType: FieldType;
}>();

// 誰能出去 子 -> 父
const emit = defineEmits<{
  (e: "update:label", value: string): void;
  (e: "update:fieldType", value: FieldType): void;
  (e: "blur"): void;
}>();

// 延伸操作：可以在使用者輸入時執行的callback
const handleLabelInput = (value: string) => {
  emit("update:label", value);
};

const handleTypeSelected = (value: FieldType) => {
  emit("update:fieldType", value);
};
</script>

<style lang="scss" scoped>
.question-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2% 0;

  // 問題(題目)
  .label {
    max-width: 400px;
    margin-right: 1rem;
    font-size: 16px;
  }

  // 題目類型
  .type {
    max-width: 200px;
    margin-right: 1rem;
    font-size: 16px;
  }

  .show-selected {
    display: flex;
    align-items: center;

    img {
      width: 20px;
    }
  }
}

.show-option-item {
  display: flex;
  align-items: center;

  img {
    width: 20px;
    margin-right: 3px;
  }
}
</style>
