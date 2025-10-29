<template>
  <div>
    <BasicComponent title="E-Mail任務管理" :total-count="fetchRes.total + '個'">
      <template #search-box>
        <el-select v-model="fetchDataCondition.recipientCategory" placeholder="收件者分類" clearable
          @change="fetchScheduleEmailTaskList">
          <el-option label="會員" value="member" />
          <el-option label="投稿者" value="paper" />
          <el-option label="審稿委員" value="paperReviewer" />
          <el-option label="與會者" value="attendees" />
        </el-select>

        <el-select v-model="fetchDataCondition.status" placeholder="狀態" clearable @change="fetchScheduleEmailTaskList">
          <el-option label="待寄送" value="0" />
          <el-option label="執行中" value="1" />
          <el-option label="已完成" value="2" />
          <el-option label="失敗" value="3" />
          <el-option label="取消" value="4" />
        </el-select>
      </template>

      <template #data-table>
        <el-table :data="fetchRes.records" style="width: 100%" empty-text="No Data">
          <el-table-column prop="subject" label="信件主旨" />
          <el-table-column prop="recipientCategory" label="收件者分類" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.recipientCategory === 'paper'" type="info">投稿者</el-tag>
              <el-tag v-if="scope.row.recipientCategory === 'paperReviewer'" type="warning">審稿委員</el-tag>
              <el-tag v-if="scope.row.recipientCategory === 'member'" type="primary">會員</el-tag>
              <el-tag v-if="scope.row.recipientCategory === 'attendees'" type="success">與會者</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="任務描述" width="200" :show-overflow-tooltip="true" />
          <el-table-column prop="status" label="狀態" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 0" type="info">待寄送</el-tag>
              <el-tag v-if="scope.row.status === 1" type="primary">執行中</el-tag>
              <el-tag v-if="scope.row.status === 2" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.status === 3" type="danger">失敗</el-tag>
              <el-tag v-if="scope.row.status === 4" type="danger">取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="預定寄送時間" width="180" />
          <el-table-column prop="expectedEmailVolume" label="預期寄送量" width="100" />
          <el-table-column width="180">
            <template #default="{ row }">
              <el-button type="danger" link @click="cancelSchedule(row.scheduleEmailTaskId)">取消</el-button>
            </template>
          </el-table-column>

        </el-table>
      </template>

      <template #pagination-box>
        <el-pagination layout="prev, pager, next" :page-size="Number(fetchRes.size)"
          :current-page="fetchDataCondition.currentPage" :total="Number(fetchRes.total)"
          @current-change="handlePageChange" />
      </template>
    </BasicComponent>
  </div>
</template>
<script lang="ts" setup>
import { cancelScheduleEmailTaskApi, fetchScheduleEmailTaskPageApi } from '@/api/scheduleEmail';
import { ScheduleEmailTask, ScheduleEmailTaskQueryCondition, ScheduleEmailTaskRes } from '@/api/scheduleEmail/type';
import BasicComponent from '@/layout/components/Basic/index.vue'
import { tryCatch } from '@/utils/tryCatch';

const useFetchDataManagement = () => {
  const fetchDataCondition = ref<ScheduleEmailTaskQueryCondition>({
    currentPage: 1,
    pageSize: 10,
    recipientCategory: '',
    status: '',
  })

  const fetchRes = ref<ScheduleEmailTaskRes>({
    current: 1,
    pages: 1,
    records: [] as ScheduleEmailTask[],
    size: 10,
    total: 0,
  })

  const fetchScheduleEmailTaskList = async () => {
    let recipientCategory = fetchDataCondition.value.recipientCategory || undefined;
    let status = fetchDataCondition.value.status ? Number(fetchDataCondition.value.status) : undefined;
    const { res, error }: any = await tryCatch(fetchScheduleEmailTaskPageApi(fetchDataCondition.value.currentPage, fetchDataCondition.value.pageSize, { recipientCategory, status }));
    if (error || res.code !== 200) {
      ElMessage.error('獲取E-Mail任務列表失敗', error || res.message);
      return;
    }
    fetchRes.value = res.data
  }

  const handlePageChange = (newPage: number) => {
    fetchDataCondition.value.currentPage = newPage
    fetchScheduleEmailTaskList()
  }

  watch(() => fetchDataCondition.value.recipientCategory, () => {
    fetchDataCondition.value.currentPage = 1
    fetchScheduleEmailTaskList()
  })

  watch(() => fetchDataCondition.value.status, () => {
    fetchDataCondition.value.currentPage = 1
    fetchScheduleEmailTaskList()
  })

  return {
    fetchDataCondition,
    fetchRes,
    fetchScheduleEmailTaskList,
    handlePageChange
  }
}

const { fetchDataCondition, fetchRes, fetchScheduleEmailTaskList, handlePageChange } = useFetchDataManagement()

const useCancelManagement = () => {
  const cancelSchedule = async (scheduleEmailTaskId: string) => {
    ElMessageBox.confirm('確定取消該E-Mail任務？', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 執行刪除操作
      const { res, error }: any = await tryCatch(cancelScheduleEmailTaskApi(scheduleEmailTaskId));

      if (error || res.code !== 200) {
        ElMessage.error('取消E-Mail任務失敗: ' + (error?.message || res.message));
        return;
      }
      fetchScheduleEmailTaskList();
    }).catch(() => {
    });
  }

  return {
    cancelSchedule
  }
}

const { cancelSchedule } = useCancelManagement()

onMounted(() => {
  fetchScheduleEmailTaskList()
})
</script>
<style lang="scss" scoped>
.el-select {
  width: 200px;
}
</style>