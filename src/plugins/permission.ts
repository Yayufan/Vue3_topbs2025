import router from "@/router";
import { useUserStore, usePermissionStore } from "@/store";
import NProgress from "@/utils/nprogress";
import { tryCatch } from "@/utils/tryCatch";
import { RouteRecordRaw } from "vue-router";

let hasAddDynamicRoutes = false;
let isAddingRoutes = false;
export async function setupPermission() {
  // 白名单路由
  const whiteList = ["/login", "/reviewer-login"];
  await initializeRoutes();



  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const isAdminLogin = localStorage.getItem("Authorization") ? true : false;
    const isReviewerLogin = localStorage.getItem("Authorization-paper-reviewer") ? true : false;
    const hasToken = isAdminLogin || isReviewerLogin;

    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    if (!hasToken) {
      if (whiteList.includes(to.path)) {
        next();
      } else {
        // 不在白名單且沒有token
        if (localStorage.getItem("paper-reviewer-logout") === "true") {
          next(`/reviewer-login?redirect=${to.path}`);
          localStorage.removeItem("paper-reviewer-logout");
        } else {
          next(`/login?redirect=${to.path}`);
        }
      }


      NProgress.done();
      return;
    }

    if (to.path === "/login" || to.path === "/reviewer-login") {
      NProgress.done();
      next({ path: "/" });
      return;
    }



    // 如果正在添加路由，等待完成
    if (isAddingRoutes) {
      // 等待一小段時間後重新嘗試
      setTimeout(() => {
        next({ ...to, replace: true });
      }, 100);
      NProgress.done();
      return;
    }
    const needInit = !userStore.user.roleList || userStore.user.roleList.length === 0 || !hasAddDynamicRoutes;

    if (needInit) {
      try {

        await initializeRoutes();
        const resolvedRoute = router.resolve(to.fullPath);

        if (resolvedRoute.matched.length === 0 && to.path !== '/404') {
          // 如果仍然沒有匹配到路由，且目標不是 404 頁面本身，則跳轉到 404
          next({ path: "/404", replace: true });
        } else {
          // 路由可能已經成功添加，重新導航以匹配新路由
          next({ ...to, replace: true });
        }
        // return next({ ...to, replace: true });
      } catch (error) {

      }
      NProgress.done();
      return;
    }


    next();
    NProgress.done();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

async function initializeRoutes() {
  if (hasAddDynamicRoutes) return;

  isAddingRoutes = true;

  try {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    const isAdminLogin = localStorage.getItem("Authorization") ? true : false;
    const isReviewerLogin = localStorage.getItem("Authorization-paper-reviewer") ? true : false;

    // 获取用户信息
    if (!userStore.user.roleList || userStore.user.roleList.length === 0) {
      if (isReviewerLogin) {
        await userStore.getReviewerInfo();
      } else if (isAdminLogin) {
        await userStore.getUserInfo();
      }
    }

    // 生成并添加动态路由
    if (userStore.user.roleList && userStore.user.roleList.length > 0) {
      const accessedRoutes = await permissionStore.generateRoutes(userStore.user.roleList);

      accessedRoutes.forEach((route: RouteRecordRaw) => {
        if (route.name && !router.hasRoute(route.name)) {
          router.addRoute(route);
        } else {
        }
      });

      hasAddDynamicRoutes = true;
    }
  } finally {
    isAddingRoutes = false;
  }
}
