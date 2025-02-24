<template>
  <!-- 顶部導航栏 -->
  <div class="navbar-container">
    <!-- 導航栏左侧 -->
    <NavbarLeft />
    <!-- 導航栏右侧 -->
    <NavbarRight />
  </div>
</template>

<style lang="scss" scoped>
.navbar-container {
  @apply flex-x-between;

  height: $navbar-height;
  background: var(--el-bg-color);
}
</style>
