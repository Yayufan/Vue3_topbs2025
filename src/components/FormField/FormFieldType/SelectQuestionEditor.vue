<template>
  <QuestionHeader :label="props.field.label" :fieldType="props.field.fieldType" @update:label="handleLabelInput"
    @update:fieldType="handleTypeSelected" @blur="commitLabel"></QuestionHeader>

  <div class="select-box">

    <transition-group name="move" tag="div">
      <div class="radio-item" v-for="(choice, index) in props.field.options?.choices" :key="choice.id">
        <div class="option-item">
          <span class="prefix-number">{{ index + 1 }} ：</span>
          <el-input :model-value="choice.label" @update:model-value="val => updateChoice(choice.id, val)"
            placeholder="選項內容" @blur="emit('commit')"></el-input>
        </div>
        <div class="option-item-function-bar">

          <div v-if="getUpdatedOptions().choices.length > 1" class="function-item" @click="optionMoveUp(choice.id)">
            <img :src="arrowUpSng">
          </div>
          <div v-if="getUpdatedOptions().choices.length > 1" class="function-item" @click="optionMoveDown(choice.id)">
            <img :src="arrowDownSng">
          </div>

          <div v-if="getUpdatedOptions().choices.length > 1" @click="removeChoice(choice.id)" class="function-item">
            <img :src="deleteSvg">
          </div>
        </div>

      </div>

    </transition-group>

    <div class="add-item">
      <span class="prefix-number">{{ props.field.options?.choices.length! + 1 }} ：</span>
      <div>
        <a @click="addChoice" class="addNewLink">新增選項</a>
      </div>
    </div>
  </div>


  <QuestionFooter :index="props.index" :total="props.total" :is-required="props.field.isRequired"
    @update:isRequired="handleRequiredChange" @delete="handleFieldDelete" @copy="handleFieldCopy"
    @move-up="handleMoveUp" @move-down="handleMoveDown">
  </QuestionFooter>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { QuestionEditorBaseEmits, FormField, FieldType, Option, Choice, NumericBoolean } from "@/api/formField/types";
import { useQuestionEditorBase } from "@/components/FormField/FormFieldType/composables/useQuestionEditorBase"
import QuestionHeader from "@/components/FormField/FormFieldCommon/QuestionHeader.vue";
import QuestionFooter from "@/components/FormField/FormFieldCommon/QuestionFooter.vue";
import selectUnCheckedSvg from "@/assets/icons/checkbox-unchecked.svg"
import deleteSvg from "@/assets/icons/delete.svg";
import arrowDownSng from "@/assets/icons/arrow-down.svg"
import arrowUpSng from "@/assets/icons/arrow-up.svg"

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


/** --------------------------------------------- */

/**
 * 核心工具：獲取當前 options 的副本或預設值
 */
const getUpdatedOptions = (): Option => {
  return props.field.options
    ? {
      ...props.field.options,
      choices: [...(props.field.options.choices || [])],
    }
    : { choices: [], allowCustom: false };
};



/** 更新單個選項 */
const updateChoice = (choiceId: string, newLabel: string) => {
  const options = getUpdatedOptions();
  const target = options.choices.find(c => c.id === choiceId);
  if (!target) return;
  target.label = newLabel;
  emit("update-local", { options });
};


/** 新增選項 */
const addChoice = () => {
  const options = getUpdatedOptions();
  options.choices.push({
    id: crypto.randomUUID(),
    label: `選項 ${options.choices.length + 1}`,
    imgUrl: "",
  });
  emit("update-local", { options });
  emit("commit");
};

/** 移除選項 */
const removeChoice = (choiceId: string) => {
  const options = getUpdatedOptions();
  if (options.choices.length <= 1) return;
  options.choices = options.choices.filter(c => c.id !== choiceId);
  emit("update-local", { options });
  emit("commit");
};

/**
 * 往上移動該選項
 * @param choiceId 
 */
const optionMoveUp = (choiceId: string) => {
  const options = getUpdatedOptions();
  const index = options.choices.findIndex(c => c.id === choiceId);
  if (index > 0) {
    [options.choices[index - 1], options.choices[index]] = [options.choices[index], options.choices[index - 1]];
    emit("update-local", { options });
    emit("commit");
  }
};


/**
 * 往下移動該選項
 * @param choiceId 
 */
const optionMoveDown = (choiceId: string) => {
  const options = getUpdatedOptions();
  const index = options.choices.findIndex(c => c.id === choiceId);
  if (index < options.choices.length - 1) {
    [options.choices[index + 1], options.choices[index]] = [options.choices[index], options.choices[index + 1]];
    emit("update-local", { options });
    emit("commit");
  }
};

/**----------------- ------------------ */

</script>

<style lang="scss" scoped>
/* transition-group 前綴 name="move" */
.move-enter-active,
.move-leave-active,
.move-move {
  transition: all 0.3s ease;
  /* 控制動畫時間與緩動 */
}

/* 進入動畫 */
.move-enter-from {
  opacity: 0;
  transform: translateY(-20px);
  /* 從上方滑入 */
}

.move-enter-to {
  opacity: 1;
  transform: translateY(0);
  /* 到最終位置 */
}

/* 離開動畫 */
.move-leave-from {
  opacity: 1;
  transform: translateY(0);
  /* 從原位置開始 */
}

.move-leave-to {
  opacity: 0;
  transform: translateY(20px);
  /* 向下滑出消失 */
}

/* 元素位置變動動畫 */
.move-move {
  transition: all 0.3s ease;
  /* 位置改變時平滑過渡 */
}



/**------------ 下拉式問題樣式 ------------------ */

.prefix-number {
  text-wrap-mode: nowrap;
}

.select-box {
  margin-bottom: 5%;

  .radio-item {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 2% 0;

    img {
      width: 26px;
      margin-right: 5px;
    }

    .option-item {
      display: flex;
      align-items: center;
      width: 100%;



    }

    .option-item-function-bar {
      display: flex;
      align-items: center;

      .function-item {
        display: flex;
        border-radius: 50%;
        margin: 0 2px;
        padding: 5px;

        &:hover {
          cursor: pointer;
          background-color: rgba(128, 127, 127, 0.1);
        }

        img {
          margin-right: 0;
        }

      }
    }

    .other-item {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      padding: 0 11px;
      width: 100%;

      .other-input {
        width: 85%;
        border-bottom: 1px solid rgb(96, 98, 102);
      }

    }


  }

  /** 新增選項樣式 */
  .add-item {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 2% 0;

    img {
      width: 26px;
      margin-right: 5px;
    }

    .addNewLink {
      padding: 4px;
      color: rgb(140, 140, 140);

      &:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
    }

    .addCustomLink {
      padding: 4px;
      color: rgb(99 154 248);

      &:hover {
        background-color: rgba(99, 154, 248, 0.08);
      }
    }

  }


}
</style>
