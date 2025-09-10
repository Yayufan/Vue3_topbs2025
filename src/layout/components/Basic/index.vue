<template>
  <main class="main-content">
    <el-card class="main-card">
      <div class="title-box">
        <h1 class="title">{{ title }}</h1>
      </div>

      <article class="top-section">
        <div class="data-count">
          <p v-if="totalCount" class="total-count">總數量 :{{ totalCount }}</p>
          <!-- <p v-if="currentCount" class="current-count">當前查詢數量 :{{ currentCount }}</p> -->
          <slot name="search-box" />
        </div>
        <slot name="option-box" />
      </article>

      <article class="main-section">
        <slot name="main-section" />
      </article>

      <article class="data-section">
        <slot name="data-table" />
        <div class="pagination-box">
          <slot name="pagination-box" />
        </div>
      </article>
    </el-card>
  </main>
</template>
<script lang="ts" setup>
const props = defineProps<{
  title: string;
  totalCount?: string; // 總數量
  currentCount?: string; // 當前查詢數量
}>();

const { title, totalCount, currentCount } = toRefs(props);
</script>
<style lang="scss" scoped>
.main-card {
  border-radius: 8px;
  overflow: hidden;
  min-height: 90vh;
  margin: 1rem;
}

.title-box {
  display: flex;
  justify-content: center;

  .title {
    font-size: 2rem;
    font-weight: bold;
    padding: 16px;
  }
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-section {
  margin-top: 16px;
}

.pagination-box {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>