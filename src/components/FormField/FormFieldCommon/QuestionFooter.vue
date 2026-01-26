<template>
  <div class="question-footer-box">

    <div class="function-box left-function-box">

      <div class="function-item">
        <el-tooltip content="複製" placement="bottom">
          <img @click="handleFieldCopy" :src="copySvg">
        </el-tooltip>
      </div>

      <div class="function-item">
        <el-tooltip content="刪除" placement="bottom">
          <img @click="handleFieldDelete" :src="deleteTrashCanSvg">
        </el-tooltip>
      </div>
    </div>

    <div class="function-box">
      <div class=" required-item">
        <span>必填：</span>
        <el-switch :model-value="props.isRequired" :active-value="1" :inactive-value="0"
          @update:model-value="handleRequiredChange" />
      </div>

      <!-- <div class="function-item">
        <el-dropdown type="info" trigger="click">
          <template #default>
            <img :src="moreSvg">
          </template>

<template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>新增說明</el-dropdown-item>
              <el-dropdown-item >根據前面題目及答案，進行顯示</el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</div> -->

    </div>


  </div>
</template>

<script setup lang="ts">

import { ref, reactive } from "vue";
import copySvg from "@/assets/icons/copy.svg";
import deleteTrashCanSvg from "@/assets/icons/delete-trash-can.svg";
import moreSvg from "@/assets/icons/more-vertical.svg";
import { NumericBoolean } from "@/api/formField/types"

const value = ref(false)

// 誰能進來 父 -> 子
const props = defineProps<{
  isRequired: NumericBoolean;
}>();

// 誰能出去 子 -> 父
const emit = defineEmits<{
  (e: "update:isRequired", value: NumericBoolean): void;
  (e: 'delete'): void; // 定義刪除事件
  (e: 'copy'): void; // 定義複製事件
}>();

const handleRequiredChange = (value: any) => {
  emit("update:isRequired", value as NumericBoolean)
}

const handleFieldDelete = () => {
  emit("delete");
}

const handleFieldCopy = () => {
  emit("copy");
}

</script>

<style lang="scss" scoped>
.question-footer-box {
  border-top: 1px solid rgb(169, 169, 169);
  display: flex;
  justify-content: right;

  .function-box {
    margin: 5px 0;
    padding: 3px 10px;
    display: flex;
    align-items: center;
  }

  .left-function-box {
    border-right: 1px solid rgb(169, 169, 169);
  }

  .required-item {
    display: flex;
    align-items: center;
    margin: 0 5px;
    padding: 5px;
  }

  .function-item {
    display: flex;
    align-items: center;
    border-radius: 50%;
    margin: 0 5px;
    padding: 5px;

    &:hover {
      cursor: pointer;
      background-color: rgba(128, 127, 127, 0.1);
    }

    img {
      margin-right: 0;
      width: 26px;
    }

  }
}
</style>
