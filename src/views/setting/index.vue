<!--  -->
<template>
  <section class="setting-section">

    <el-card>
      <h1>系統設定</h1>

      <!-- 同步設定盒子 -->
      <div class="async-setting-box" v-for="(setting, index) in settingData" :key="setting.settingId">
        <el-popover placement="top-start" title="說明" :width="280" trigger="hover" :content="setting.remark">
          <template #reference>
            <label class="article-setting-label">{{ setting.functionIntroduction }}</label>
          </template>
        </el-popover>
        <el-switch v-model="setting.status" active-value="1" inactive-value="0" inline-prompt active-text="是"
          inactive-text="否" />
      </div>

      <!-- 保存設定功能盒子 -->
      <div class="submit-box">
        <el-button type="primary" @click="saveSetting">保存</el-button>
      </div>

    </el-card>

  </section>
</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue'
import { getAllSettingApi, updateSettingApi } from '@/api/setting'

let settingData = reactive([
  {
    settingId: 1,
    functionIntroduction: '手術衛教 同步 最新消息',
    remark: '手術衛教文章，同步至最新消息',
    status: 0
  }, {
    settingId: 2,
    functionIntroduction: '手術衛教 同步 醫療新知',
    remark: '手術衛教文章，同步至醫療新知',
    status: 0
  }, {
    settingId: 3,
    functionIntroduction: '專業醫療 同步 最新消息',
    remark: '專業醫療文章，同步至最新消息',
    status: 0
  }, {
    settingId: 4,
    functionIntroduction: '專業醫療 同步 醫療新知',
    remark: '專業醫療 同步 醫療新知',
    status: 0
  }
])

//獲取所有設定
const getAllSetting = async () => {
  try {
    settingData.length = 0
    let res = await getAllSettingApi()
    console.log(res)
    Object.assign(settingData, res.data)
  } catch (err: any) {
    console.log(err)
  }
}


//更新設定,更新完成重新載入設定
const saveSetting = async () => {
  console.log('當前資料', settingData)
  try {
    await updateSettingApi(settingData)
    ElMessage.success('保存成功')
  } catch (err: any) {
    console.log(err)
  }
  getAllSetting()

}


//頁面掛載完畢時執行
onMounted(() => {
  getAllSetting()
})

</script>

<style scoped lang='scss'>
.setting-section {
  width: 95%;
  margin: 2% auto;

  .async-setting-box {
    margin: 1% 0;
  }

  .article-setting-label {
    margin-right: 1%;
  }

  .submit-box {
    text-align: right;
  }

}
</style>
