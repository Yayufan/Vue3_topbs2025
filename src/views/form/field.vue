<template>
  <section class="field-section" ref="sectionRef">
    <h1>表單欄位編輯</h1>
    <transition-group name="move" tag="div">
      <el-card :ref="el => setFieldCardRef(el, index)" @click="focusedIndex = index" class="field-card"
        v-for="(formField, index) in formFieldList" :key="formField.formFieldId"
        :class="{ 'focused': focusedIndex === index }">
        <QuestionControl :field="formField" :index="index" :total="formFieldList.length"
          @update-local="patch => updateLocalField(index, patch)" @commit="fieldId => commitField(fieldId)"
          @delete="fieldId => handleDeleteField(fieldId)" @copy="fieldId => handleCopyField(index)"
          @move-up="handleMoveUp(index)" @move-down="handleMoveDown(index)">
        </QuestionControl>
      </el-card>
    </transition-group>

    <div class="floating-bar" :style="{ top: floatingTop + 'px' }">
      <el-tooltip content="新增問題" placement="right">
        <div class="floating-item" @click="handleAddFieldBelow(focusedIndex)">
          <img :src="addEllipseSvg">
        </div>
      </el-tooltip>
      <el-tooltip content="新增標題與說明" placement="right">
        <div class="floating-item">
          <img :src="textSizeSvg">
        </div>
      </el-tooltip>
      <el-tooltip content="新增圖片" placement="right">
        <div class="floating-item">
          <img :src="imageSvg">
        </div>
      </el-tooltip>

    </div>
  </section>
</template>

<script setup lang="ts">
import QuestionControl from "@/components/FormField/FormFieldType/QuestionControl.vue";
import { ref, reactive, computed, watch } from "vue";
import {
  type FormInstance,
  type FormRules,
  type UploadRawFile,
  type UploadProps,
  ElMessageBox,
  ElMessage,
  UploadUserFile,
} from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { getFormFieldApi, copyFormFieldApi, updateFormFieldApi, deleteFormFieldApi, batchUpdateFieldOrderApi } from "@/api/formField";
import { FieldType, type FormField } from "@/api/formField/types";
import addEllipseSvg from "@/assets/icons/add-ellipse.svg"
import imageSvg from "@/assets/icons/image.svg"
import textSizeSvg from "@/assets/icons/text-size.svg"


const envAPI = import.meta.env.VITE_APP_BASE_API;
//獲取路由
const route = useRoute();
//獲取路由器
const router = useRouter();
//formLabel 寬度
const formLabelWidth = "140px";

// 配置排序常量

const CONFIG = {
  /**
   * 重排時的間隔
   */
  DEFAULT_INTERVAL: 100,
  /**
   * 最小可插入間隙
   */
  MIN_GAP_FOR_INSERT: 2,
};

/**----------------- 滾動懸浮bar -------------------------------*/
const floatingTop = ref(0);
const sectionRef = ref<HTMLElement | null>(null);
const fieldCardRefs = ref<HTMLElement[]>([]);
const BASE_OFFSET = 160;

// 收集 Card DOM
const setFieldCardRef = (el: any, index: number) => {
  if (el) {
    fieldCardRefs.value[index] = el.$el || el;
  }
};

/** 核心定位邏輯：處理點擊焦點、上下移動時的定位 */
const updateFloatingBarPosition = async () => {
  await nextTick();

  // 1. 取得當前焦點索引
  const index = focusedIndex.value;

  // 2. 如果沒焦點，維持原本的滾動跟隨邏輯
  if (index < 0) {
    handleScroll();
    return;
  }

  // 3. 獲取對應的 Card DOM
  // 重要：移動後 fieldCardRefs 可能因為 Vue 的節點複用導致順序對不上
  // 這裡建議直接從 sectionRef 內抓取當前物理順序的第 index 個 .field-card
  const cards = sectionRef.value?.querySelectorAll('.field-card');
  const cardEl = cards?.[index] as HTMLElement;
  const section = sectionRef.value;

  if (!cardEl || !section) return;

  const scrollY = window.scrollY;
  const cardRect = cardEl.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();

  // 計算目標 Top
  const targetTop = (cardRect.top + scrollY) - (sectionRect.top + scrollY);

  // 設定邊界
  const maxTop = section.offsetHeight - 100;
  floatingTop.value = Math.min(Math.max(targetTop, 0), maxTop);
};

/** 滾動處理：當沒焦點或滾動時的基本跟隨 */
const handleScroll = () => {
  // 如果目前有選中某個題目，滾動時 Bar 應該釘在那個題目旁邊，而不是隨畫面亂滾
  if (focusedIndex.value >= 0) {
    updateFloatingBarPosition();
    return;
  }

  if (!sectionRef.value) return;
  const rect = sectionRef.value.getBoundingClientRect();
  const scrollY = window.scrollY;
  const sectionTopInPage = rect.top + scrollY;

  const nextTop = scrollY - sectionTopInPage + BASE_OFFSET;
  const maxTop = sectionRef.value.offsetHeight - 100;

  floatingTop.value = Math.min(Math.max(nextTop, 0), maxTop);
};


/**----------------- 焦點追蹤 -------------------------------- */
const focusedIndex = ref<number>(-1);

// 監聽焦點變化
watch(focusedIndex, () => {
  updateFloatingBarPosition();
});

/** ---------------- 從路由中取出 formId 參數 --------------------------*/
const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
});

/**----------------- formField相關 -------------------------------- */

// 預設問題
let createDefaultField = () => {
  return <FormField>{
    fieldType: FieldType.TEXT,
    label: "問題",
    description: "說明(選填)",
    placeholder: "簡答文字",
    imageUrl: "",
    imageCaption: "",
    isRequired: 0,
    fieldOrder: 0,
    options: null,
    validationRules: null,
  };
};

let formFieldList = reactive<FormField[]>([]);

const getFormFieldList = async (formId: string) => {
  let res = await getFormFieldApi(props.formId);
  // 清理過去資料
  formFieldList.length = 0;
  // 重新賦值資料
  Object.assign(formFieldList, res.data);
  // 如果裡面沒有元素則要內建一個元素給它
  if (formFieldList.length < 1) {
    // 這邊最後要直接呼叫新增API , 然後重新呼叫一次
    formFieldList.push(createDefaultField());
    focusedIndex.value = 0;
  }

  console.log(formFieldList);
};

/**------------------------------------------------------------------- */

/**
 * 在本地更新表單欄位
 * @param index 
 * @param patch 
 */
const updateLocalField = (index: number, patch: Partial<FormField>) => {
  Object.assign(formFieldList[index], patch);
  // 修改後的資料
  console.log("本地更新: ", formFieldList[index]);
};

/**
 * 送出當前localData的表單欄位至Server更新
 * @param fieldId 
 */
const commitField = async (fieldId: string) => {
  const formData = new FormData();
  let targetField = formFieldList.find(field => field.formFieldId === fieldId);

  formData.append(
    "data",
    JSON.stringify(targetField)
  );

  await updateFormFieldApi(formData);
  // 修改後的資料
  console.log("更新至Server: ", targetField);

};

/**
 * 複製問題 - 在當前問題的下一題位置創建
 * @param index 當前問題的索引
 */
const handleCopyField = async (index: number) => {
  console.log("複製問題，索引:", index);

  // 要複製的目標
  const targetField = formFieldList[index];
  console.log("複製問題:", targetField);

  // 計算複製問題的 fieldOrder
  let newOrder: number;

  //複製到的位置 只有可能是最後一題 或 兩題中間 
  if (index >= formFieldList.length - 1) {
    // 當前是最後一題，直接加在後面
    newOrder = targetField.fieldOrder + 100;
  } else {
    // 插入到當前題和下一題之間
    const currentOrder = targetField.fieldOrder;
    const nextOrder = formFieldList[index + 1].fieldOrder;
    const gap = nextOrder - currentOrder;

    if (gap > CONFIG.MIN_GAP_FOR_INSERT) {
      // 有空間可插入排序值
      newOrder = currentOrder + Math.floor(gap / CONFIG.MIN_GAP_FOR_INSERT);
    } else {
      // 空間不足，先重新排序
      await reorderAllFields();
      const newCurrentOrder = formFieldList[index].fieldOrder;
      const newNextOrder = formFieldList[index + 1].fieldOrder;
      newOrder = newCurrentOrder + Math.floor((newNextOrder - newCurrentOrder) / CONFIG.MIN_GAP_FOR_INSERT);
    }
  }

  // 創建複製的問題（包含 fieldOrder）
  const copiedField = {
    ...targetField,
    formFieldId: undefined, // 移除 ID，讓後端生成新 ID
    fieldOrder: newOrder,
  };

  // 調用複製 API
  await copyFormFieldApi(copiedField);

  // 重新獲取列表
  await getFormFieldList(props.formId);

  // 焦點移到複製後的新問題
  focusedIndex.value = index + 1;

  // 滾動到新問題
  await nextTick();
  scrollToField(index + 1);

  ElMessage.success("問題已複製");
};

/**
 * 刪除表單欄位
 * @param fieldId 
 */
const handleDeleteField = async (fieldId: string) => {
  console.log("fieldId: ", fieldId, "觸發Server刪除")
  const targetIndex = formFieldList.findIndex(field => field.formFieldId === fieldId);

  // 刪除表單欄位
  await deleteFormFieldApi(fieldId)
  ElMessage.success("刪除成功")

  // 重新獲取表單所有欄位
  await getFormFieldList(props.formId);

  if (focusedIndex.value === targetIndex) {
    focusedIndex.value = Math.max(0, targetIndex - 1);
  } else if (focusedIndex.value > targetIndex) {
    focusedIndex.value--;
  }
}


/**----------------- 新增問題相關 -------------------------------- */

const handleAddFieldBelow = async (afterIndex: number) => {
  const newField = createDefaultField();

  if (formFieldList.length === 0) {
    newField.fieldOrder = 100;
  } else if (afterIndex === -1 || afterIndex >= formFieldList.length - 1) {
    const lastOrder = formFieldList[formFieldList.length - 1]?.fieldOrder ?? 0;
    newField.fieldOrder = lastOrder + 100;
  } else {
    const prevOrder = formFieldList[afterIndex].fieldOrder;
    const nextOrder = formFieldList[afterIndex + 1].fieldOrder;
    const gap = nextOrder - prevOrder;

    if (gap > CONFIG.MIN_GAP_FOR_INSERT) {
      newField.fieldOrder = prevOrder + Math.floor(gap / 2);
    } else {
      await reorderAllFieldsBeforeInsert(afterIndex + 1);
      const newPrevOrder = formFieldList[afterIndex].fieldOrder;
      const newNextOrder = formFieldList[afterIndex + 1].fieldOrder;
      newField.fieldOrder = newPrevOrder + Math.floor((newNextOrder - newPrevOrder) / 2);
    }
  }

  // 呼叫新增API
  // const res = await createFormFieldApi({
  //   formId: props.formId,
  //   ...newField,
  // });

  await getFormFieldList(props.formId);

  focusedIndex.value = afterIndex + 1;

  await nextTick();
  scrollToField(afterIndex + 1);

  ElMessage.success("問題已新增");
};

const reorderAllFieldsBeforeInsert = async (insertPosition: number) => {
  formFieldList.forEach((field, index) => {
    field.fieldOrder = (index + 1) * CONFIG.DEFAULT_INTERVAL;
  });

  await batchUpdateFieldOrder();
};

const scrollToField = (index: number) => {
  const cards = document.querySelectorAll('.field-card');
  if (cards[index]) {
    cards[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
};



/**----------------- 排序相關功能 -------------------------------- */

/**
 * 向上移動問題
 */
const handleMoveUp = async (index: number) => {
  if (index <= 0) return;
  await moveField(index, index - 1);
  focusedIndex.value = index - 1;

  // 3. 重點：因為有動畫 (0.3s)，我們在動畫開始跟結束都校準一次
  updateFloatingBarPosition(); // 啟動移動
  setTimeout(updateFloatingBarPosition, 310); // 動畫結束校準

};

/**
 * 向下移動問題
 */
const handleMoveDown = async (index: number) => {
  if (index >= formFieldList.length - 1) return;
  await moveField(index, index + 1);
  focusedIndex.value = index + 1;

  // 3. 重點：因為有動畫 (0.3s)，我們在動畫開始跟結束都校準一次
  updateFloatingBarPosition(); // 啟動移動
  setTimeout(updateFloatingBarPosition, 310); // 動畫結束校準

};

/**
 * 移動問題到新位置
 */
const moveField = async (fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return;

  // splice(位置,刪除個數),splice(位置,刪除個數,插入元素)
  // 把陣列中 index 為 fromIndex 的元素取出並從原陣列刪掉。
  const [movedItem] = formFieldList.splice(fromIndex, 1);
  // 把剛剛拿出的元素插入到新的位置 toIndex。
  formFieldList.splice(toIndex, 0, movedItem);

  const movedField = formFieldList[toIndex];
  let newOrder: number;

  // 計算新的 order
  if (toIndex === 0) {
    // 移到最前面，保證比下一個元素小 100（但至少 1）
    const nextOrder = formFieldList[1]?.fieldOrder ?? CONFIG.DEFAULT_INTERVAL;
    newOrder = Math.max(1, nextOrder - CONFIG.DEFAULT_INTERVAL);

  } else if (toIndex === formFieldList.length - 1) {
    // 移到最後面，保證比前一個元素大 100
    const prevOrder = formFieldList[toIndex - 1].fieldOrder;
    newOrder = prevOrder + CONFIG.DEFAULT_INTERVAL;

  } else {
    // 插入中間
    const prevOrder = formFieldList[toIndex - 1].fieldOrder;
    const nextOrder = formFieldList[toIndex + 1].fieldOrder;
    const gap = nextOrder - prevOrder;

    if (gap > CONFIG.MIN_GAP_FOR_INSERT) {
      // 有空間,取中間值, Math.floor 無條件捨去
      newOrder = prevOrder + Math.floor(gap / CONFIG.MIN_GAP_FOR_INSERT);
    } else {
      // 空間不足,重新計算全部
      console.log("空間不足,重新計算所有 order");
      await reorderAllFields();
      return;
    }
  }

  // 更新 order 值
  movedField.fieldOrder = newOrder;

  // 只更新這一個問題
  await commitField(movedField.formFieldId!);

  console.log(`問題移動: ${fromIndex} -> ${toIndex}, 新 order: ${newOrder}`);
};

/**
 * 重新計算所有 order (當空間不足時)
 */
const reorderAllFields = async () => {
  formFieldList.forEach((field, index) => {
    field.fieldOrder = (index + 1) * CONFIG.DEFAULT_INTERVAL;
  });

  await batchUpdateFieldOrder();
  ElMessage.info("已重新整理排序");
};

/**
 * 批量更新所有問題的 order
 */
const batchUpdateFieldOrder = async () => {

  const updates = formFieldList.map(field => ({
    formFieldId: field.formFieldId!,
    fieldOrder: field.fieldOrder
  }));

  await batchUpdateFieldOrderApi(updates);

};


/**-------------------------初始化---------------------------------- */

// 掛載時讀取
onMounted(async () => {

  window.addEventListener("scroll", updateFloatingBarPosition, { passive: true });

  // 獲取表單欄位列表
  await getFormFieldList(props.formId);

  handleScroll();

});

onUnmounted(() => {
  window.removeEventListener("scroll", updateFloatingBarPosition);
});

</script>

<style scoped lang="scss">
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

.field-section {
  position: relative;
  width: 95%;
  margin: 0 auto;

  .floating-bar {
    position: absolute;
    right: 11%;
    z-index: 1000;
    background: #fff;
    border-radius: 5px;
    /* 加入這行，讓 top 變化時有動畫效果 */
    transition: top 0.3s ease-in-out;

    .floating-item {

      margin: 8px 2px;


      img {
        width: 100%;
        width: 35px;
        padding: 5px;
      }

      &:hover {
        img {
          cursor: pointer;
          background-color: rgba(128, 127, 127, 0.1);
          border-radius: 50%;

        }

      }
    }

  }

  .field-card {
    max-width: 768px;
    margin: 1% auto;

    &.focused {
      box-shadow: 0 0 0 2px #409eff;
    }
  }

  h1 {
    text-align: left;
    font-size: 2rem;
    margin: 1% 0;
  }
}
</style>
