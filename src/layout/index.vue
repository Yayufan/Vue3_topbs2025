<template>
  <div class="wh-full" :class="classObj">
    <!-- 遮罩层 -->
    <div v-if="isMobile && isOpenSidebar" class="wh-full fixed-lt z-999 bg-black bg-opacity-30"
      @click="handleOutsideClick"></div>

    <!-- 公用側邊欄 -->
    <Sidebar class="sidebar-container" />

    <!-- 混合布局 -->
    <div v-if="layout === LayoutEnum.MIX" class="mix-container">
      <div class="mix-container__left">
        <SidebarMenu :menu-list="mixLeftMenus" :base-path="activeTopMenuPath" />
        <div class="sidebar-toggle">
          <hamburger :is-active="appStore.sidebar.opened" @toggle-click="toggleSidebar" />
        </div>
      </div>

      <div :class="{ hasTagsView: showTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <TagsView v-if="showTagsView" />
        </div>
        <AppMain />
        <Settings v-if="defaultSettings.showSettings" />
      </div>
    </div>

    <!-- 左侧和顶部布局 -->
    <div v-else :class="{ hasTagsView: showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <NavBar v-if="layout === 'left'" />
        <TagsView v-if="showTagsView" />
      </div>
      <AppMain />
      <Settings v-if="defaultSettings.showSettings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useSettingsStore, usePermissionStore } from "@/store";
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { LayoutEnum } from "@/enums/LayoutEnum";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const width = useWindowSize().width;

const WIDTH_DESKTOP = 992; // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）
const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);
const isOpenSidebar = computed(() => appStore.sidebar.opened);
const fixedHeader = computed(() => settingsStore.fixedHeader); // 是否固定header
const showTagsView = computed(() => settingsStore.tagsView); // 是否显示tagsView
const layout = computed(() => settingsStore.layout); // 布局模式 left top mix
const activeTopMenuPath = computed(() => appStore.activeTopMenuPath); // 顶部菜单激活path
const mixLeftMenus = computed(() => permissionStore.mixLeftMenus); // 混合布局左侧菜单





watch(
  () => activeTopMenuPath.value,
  (newVal) => {
    permissionStore.setMixLeftMenus(newVal);
  },
  {
    deep: true,
    immediate: true,
  }
);

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  mobile: appStore.device === DeviceEnum.MOBILE,
  [`layout-${settingsStore.layout}`]: true,
}));

watchEffect(() => {
  appStore.toggleDevice(
    width.value < WIDTH_DESKTOP ? DeviceEnum.MOBILE : DeviceEnum.DESKTOP
  );
  if (width.value >= WIDTH_DESKTOP) {
    appStore.openSideBar();
  } else {
    appStore.closeSideBar();
  }
});

function handleOutsideClick() {
  appStore.closeSideBar();
}

function toggleSidebar() {
  appStore.toggleSidebar();
}

const route = useRoute();
watch(route, () => {
  if (isMobile.value && isOpenSidebar.value) {
    appStore.closeSideBar();
  }
});
</script>

<style lang="scss" scoped>
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - $sidebar-width);
  transition: width 0.28s;
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  height: 100%;
  overflow: hidden;
  background-color: $menu-background;
  transition: width 0.28s;

  :deep(.el-menu) {
    border: none;
  }
}

.main-container {
  position: relative;
  min-height: 100%;
  margin-left: $sidebar-width;
  transition: margin-left 0.28s;
}

.layout-top {
  .fixed-header {
    top: $navbar-height;
    width: 100%;
  }

  .sidebar-container {
    z-index: 999;
    display: flex;
    width: 100% !important;
    height: $navbar-height;

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--collapse) {
      width: 100%;
    }
  }

  .main-container {
    min-height: calc(100vh - $navbar-height);
    padding-top: $navbar-height;
    margin-left: 0;
  }
}

.layout-mix {
  .sidebar-container {
    width: 100% !important;
    height: $navbar-height;

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--horizontal.el-menu) {
      border: none;
    }
  }

  .mix-container {
    display: flex;
    height: 100%;
    padding-top: $navbar-height;

    .mix-container__left {
      position: relative;
      width: $sidebar-width;
      height: 100%;

      :deep(.el-menu) {
        height: 100%;
        border: none;
      }

      .sidebar-toggle {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0 0 6px -2px var(--el-color-primary);

        div:hover {
          background-color: var(--menu-background);
        }

        :deep(svg) {
          color: var(--el-color-primary) !important;
        }
      }
    }

    .main-container {
      flex: 1;
      min-width: 0;
      margin-left: 0;

      .fixed-header {
        top: $navbar-height;
      }
    }
  }
}

.hideSidebar {
  .fixed-header {
    left: $sidebar-width-collapsed;
    width: calc(100% - $sidebar-width-collapsed);
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.layout-top {
    .fixed-header {
      left: 0;
      width: 100%;
    }

    .main-container {
      margin-left: 0;
    }
  }

  &.layout-mix {
    .fixed-header {
      left: $sidebar-width-collapsed;
      width: calc(100% - $sidebar-width-collapsed);
    }

    .sidebar-container {
      width: 100% !important;
    }

    .mix-container {
      .mix-container__left {
        width: $sidebar-width-collapsed;
      }
    }
  }
}

.layout-left.hideSidebar {
  .sidebar-container {
    width: $sidebar-width-collapsed !important;
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.mobile {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-210px, 0, 0);
    }

    .main-container {
      margin-left: 0;
    }
  }
}

.mobile {
  .fixed-header {
    left: 0;
    width: 100%;
  }

  .main-container {
    margin-left: 0;
  }

  &.layout-top {
    .sidebar-container {
      z-index: 999;
      display: flex;
      width: 100% !important;
      height: $navbar-height;

      :deep(.el-scrollbar) {
        flex: 1;
        min-width: 0;
        height: $navbar-height;
      }
    }

    .main-container {
      padding-top: $navbar-height;
      margin-left: 0;
      overflow: hidden;
    }

    // 顶部模式全局变量修改
    --el-menu-item-height: $navbar-height;
  }
}
</style>
