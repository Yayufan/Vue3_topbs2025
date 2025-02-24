<template>
  <div class="dashboard-container">
    <el-card shadow="never">
      <el-row justify="space-between">
        <el-col :span="18" :xs="24">
          <div class="flex h-full items-center">
            <img class="w-20 h-20 mr-5 rounded-full" src="/public/bunny.gif" />
            <div>
              <p>{{ greetings }}</p>
              <p class="text-sm text-gray">
                今日天氣晴朗
              </p>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="24">
          <div class="flex h-full items-center justify-around">
            <!-- <el-statistic v-for="item in statisticData" :key="item.key" :value="item.value">
              <template #title>
                <div class="flex items-center">
                  <svg-icon :icon-class="item.iconClass" size="20px" />
                  <span class="text-[16px] ml-1">{{ item.title }}</span>
                </div>
              </template>
<template v-if="item.suffix" #suffix>/100</template>
</el-statistic> -->
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 數据卡片- 總瀏覽人次及會員人數 -->
    <!-- <el-row :gutter="20" class="mt-3">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>文章總瀏覽人次： </div>
          <div>{{ totalViews }}次</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>器捐同意書總數： </div>
          <div>{{ organDonationConsentCount }} 人</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>已審核器捐同意書： </div>
          <div>{{ organDonationConsentApprovedCount }} 人</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>未審核器捐同意書： </div>
          <div>{{ organDonationConsentPendingCount }} 人</div>
        </el-card>
      </el-col>

    </el-row> -->

    <!-- 數据卡片- 最新消息及文章篇數 -->
    <!-- <el-row :gutter="20" class="mt-3">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>最新消息： </div>
          <div>{{ newsCount }} 則</div>

        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>活動花絮文章： </div>
          <div>{{ eventHighlightsCount }} 篇</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>器捐學堂文章： </div>
          <div>{{ organDonationCount }} 篇</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>捐贈者家屬故事文章： </div>
          <div>{{ storyDonorFamilyCount }} 篇</div>
        </el-card>
      </el-col>


    </el-row>


    <el-row :gutter="20" class="mt-3">

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>受贈者故事文章： </div>
          <div>{{ storyRecipientCount }} 篇</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>影音專區文章： </div>
          <div>{{ videoAreaCount }} 篇</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>白袍心聲文章： </div>
          <div>{{ doctorVoiceCount }} 篇</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>協助資源文章： </div>
          <div>{{ assistanceResourcesCount }} 篇</div>
        </el-card>
      </el-col>


    </el-row>

    <el-row :gutter="20" class="mt-3">


      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>好書推薦文章： </div>
          <div>{{ bookRecommendationsCount }} 篇</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div>社工專欄文章： </div>
          <div>{{ socialWorkColumnCount }} 篇</div>
        </el-card>
      </el-col>

    </el-row> -->


    <!-- Echarts 图表 -->
    <!-- <el-row :gutter="10" class="mt-3">
      <el-col :xs="24" :sm="12" :lg="8" class="mb-2" v-for="item in chartData" :key="item">
        <component :is="chartComponent(item)" :id="item" height="400px" width="100%"
          class="bg-[var(--el-bg-color-overlay)]" />
      </el-col>
    </el-row> -->
  </div>
</template>

<script setup lang="ts">
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import { useUserStore } from "@/store/modules/user";
import { useTransition, TransitionPresets } from "@vueuse/core";
import { getOrganDonationConsentCountApi, getOrganDonationConsentCountByStatusApi } from "@/api/organDonationConsent";

import { getArticleViewsCountApi, getArticleCountByGroupApi, getArticleViewsCountByGroupApi } from "@/api/article"



let totalViews = ref(0)


let organDonationConsentCount = ref(0)
let organDonationConsentApprovedCount = ref(0)
let organDonationConsentPendingCount = ref(0)

let newsCount = ref(0)
let eventHighlightsCount = ref(0)
let organDonationCount = ref(0)
let storyDonorFamilyCount = ref(0)

let storyRecipientCount = ref(0)
let videoAreaCount = ref(0)
let doctorVoiceCount = ref(0)
let assistanceResourcesCount = ref(0)

let bookRecommendationsCount = ref(0)
let socialWorkColumnCount = ref(0)


//獲取總會員人數 及 已審核、未審核人數
const getOrganDonationConsentCount = async () => {
  let res = await getOrganDonationConsentCountApi()
  organDonationConsentCount.value = res.data

  let approvedRes = await getOrganDonationConsentCountByStatusApi("1")
  organDonationConsentApprovedCount.value = approvedRes.data

  let pendingRes = await getOrganDonationConsentCountByStatusApi("0")
  organDonationConsentPendingCount.value = pendingRes.data

}

//獲取總文章瀏覽量總數 以及 各類別文章數量
// const getCounteData = async () => {
//   totalViews.value = (await getArticleViewsCountApi()).data
//   newsCount.value = (await getArticleCountByGroupApi("news")).data
//   eventHighlightsCount.value = (await getArticleCountByGroupApi("eventHighlights")).data
//   organDonationCount.value = (await getArticleCountByGroupApi("organDonation")).data
//   storyDonorFamilyCount.value = (await getArticleCountByGroupApi("storyDonorFamily")).data
//   storyRecipientCount.value = (await getArticleCountByGroupApi("storyRecipient")).data
//   videoAreaCount.value = (await getArticleCountByGroupApi("videoArea")).data
//   doctorVoiceCount.value = (await getArticleCountByGroupApi("doctorVoice")).data
//   assistanceResourcesCount.value = (await getArticleCountByGroupApi("assistanceResources")).data
//   bookRecommendationsCount.value = (await getArticleCountByGroupApi("bookRecommendations")).data
//   socialWorkColumnCount.value = (await getArticleCountByGroupApi("socialWorkColumn")).data

// }




//掛載時獲取首頁Dashboard數據
onMounted(() => {
  //獲取同意書審核數量

  // getCounteData()

})



const userStore = useUserStore();
const date: Date = new Date();

const greetings = computed(() => {
  const hours = date.getHours();
  if (hours >= 6 && hours < 8) {
    return "晨起披衣出草堂，軒窗已自喜微涼🌅！";
  } else if (hours >= 8 && hours < 12) {
    return "上午好，" + userStore.user.nickName + "！";
  } else if (hours >= 12 && hours < 18) {
    return "下午好，" + userStore.user.nickName + "！";
  } else if (hours >= 18 && hours < 24) {
    return "晚上好，" + userStore.user.nickName + "！";
  } else {
    return "偷偷向銀河要了一把碎星，只等你閉上眼睛撒入你的夢中，晚安🌛！";
  }
});

const duration = 5000;

// 銷售額
const amount = ref(0);
const amountOutput = useTransition(amount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
amount.value = 2000;

// 访客數
const visitCount = ref(0);
const visitCountOutput = useTransition(visitCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
visitCount.value = 2000;

// IP數
const dauCount = ref(0);
const dauCountOutput = useTransition(dauCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
dauCount.value = 2000;

// 訂單量
const orderCount = ref(0);
const orderCountOutput = useTransition(orderCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
orderCount.value = 2000;

// 右上角數量
const statisticData = ref([
  {
    value: 99,
    iconClass: "message",
    title: "消息",
    key: "message",
  },
  {
    value: 50,
    iconClass: "todolist",
    title: "待辦",
    suffix: "/100",
    key: "upcoming",
  },
  {
    value: 10,
    iconClass: "project",
    title: "項目",
    key: "project",
  },
]);

interface CardProp {
  title: string;
  tagType: EpPropMergeType<
    StringConstructor,
    "primary" | "success" | "info" | "warning" | "danger",
    unknown
  >;
  tagText: string;
  count: any;
  dataDesc: string;
  iconClass: string;
}
// 卡片數量
const cardData = ref<CardProp[]>([
  {
    title: "訪客數",
    tagType: "success",
    tagText: "日",
    count: visitCountOutput,
    dataDesc: "總訪客數",
    iconClass: "visit",
  },
  {
    title: "IP數",
    tagType: "success",
    tagText: "日",
    count: dauCountOutput,
    dataDesc: "總IP數",
    iconClass: "ip",
  },
  {
    title: "銷售額",
    tagType: "primary",
    tagText: "月",
    count: amountOutput,
    dataDesc: "總IP數",
    iconClass: "money",
  },
  {
    title: "訂單量",
    tagType: "danger",
    tagText: "季",
    count: orderCountOutput,
    dataDesc: "總訂單量",
    iconClass: "order",
  },
]);
// 图表數据
const chartData = ref(["BarChart", "PieChart", "RadarChart"]);
const chartComponent = (item: string) => {
  return defineAsyncComponent(() => import(`./components/${item}.vue`));
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .svg-icon {
    fill: currentcolor !important;
  }
}
</style>
