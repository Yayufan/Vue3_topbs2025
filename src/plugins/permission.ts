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
        console.log("未登录，访问白名单页面", to.path);
        console.log("白名单页面，直接访问", to.path);
        next();
      } else {
        // 不在白名單且沒有token
        console.log("未登录，访问非白名单页面", to.path);
        if (localStorage.getItem("paper-reviewer-logout") === "true") {
          next(`/reviewer-login?redirect=${to.path}`);
          localStorage.removeItem("paper-reviewer-logout");
        } else {
          console.log("未登录，访问非白名单页面，跳转到审稿人登录", to.path);
          next(`/login?redirect=${to.path}`);
        }
      }


      NProgress.done();
      return;
    }
    // else {
    //   // 未登录可以访问白名单页面
    //   if (whiteList.indexOf(to.path) !== -1) {
    //     next();
    //   } else {
    //     console.log("已登录，访问非白名单页面", to.path);
    //     if (isReviewerLogin) {
    //       next(`/reviewer-login?redirect=${to.path}`);
    //     } else {
    //       next(`/login?redirect=${to.path}`);
    //     }
    //     NProgress.done();
    //   }
    // }

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
        // if (!userStore.user.roleList || userStore.user.roleList.length === 0) {
        //   if (isReviewerLogin) {
        //     await userStore.getReviewerInfo();
        //   } else if (isAdminLogin) {
        //     await userStore.getUserInfo();
        //   }
        // }

        // if (!hasAddDynamicRoutes && userStore.user.roleList.length > 0) {
        //   const accessedRoutes = await permissionStore.generateRoutes(userStore.user.roleList);
        //   accessedRoutes.forEach((route: RouteRecordRaw) => {
        //     if (route.name && !router.hasRoute(route.name)) { // 使用 name 或 path 作為識別
        //       router.addRoute(route); // 將路由添加到 Vue Router 實例
        //     } else {
        //       console.warn("路由已存在，跳過添加:", route.path);
        //     }
        //   })
        //   console.log("目前所有路由：", router.getRoutes().map(r => r.path));
        //   console.log("目前導航目標：", to.path);
        //   hasAddDynamicRoutes = true;
        // }
        // const resolved = router.resolve(to.fullPath);
        // if (resolved.matched.length === 0) {
        //   console.warn("導航路徑不存在於已註冊路由中，跳轉到 404");
        //   return next({ path: "/404", replace: true });
        // }
        await initializeRoutes();
        const resolvedRoute = router.resolve(to.fullPath);

        if (resolvedRoute.matched.length === 0 && to.path !== '/404') {
          // 如果仍然沒有匹配到路由，且目標不是 404 頁面本身，則跳轉到 404
          console.warn(`[Permission] 动态路由添加后，路径 '${to.path}' 仍未匹配，重定向到 /404`);
          next({ path: "/404", replace: true });
        } else {
          // 路由可能已經成功添加，重新導航以匹配新路由
          next({ ...to, replace: true });
        }
        return next({ ...to, replace: true });
      } catch (error) {
        // console.error("獲取用戶信息失敗", error);
        // if (isReviewerLogin) {
        //   next(`/reviewer-login?redirect=${to.path}`);
        // } else {
        //   next(`/login?redirect=${to.path}`);
        // }
        // NProgress.done();
        // return;
      }
      NProgress.done();
      return;
    }


    // if (!userStore.user.roleList || userStore.user.roleList.length === 0 || !hasAddDynamicRoutes) {
    //   let userRoles: string[] = [];

    //   if (!userStore.user.roleList || userStore.user.roleList.length === 0) {
    //     if (isReviewerLogin) {
    //       const { res: reviewerRes, error: reviewerError } = await tryCatch(userStore.getReviewerInfo());
    //       if (reviewerError) {
    //         console.error("獲取審稿人信息失敗", reviewerError);
    //         next(`/reviewer-login?redirect=${to.path}`);
    //         NProgress.done();
    //         return;
    //       }
    //       userRoles = userStore.user.roleList || [];
    //     } else if (isAdminLogin) {
    //       const { res, error } = await tryCatch(userStore.getUserInfo());
    //       if (error) {
    //         console.error("獲取用戶信息失敗", error);
    //         next(`/login?redirect=${to.path}`);
    //         NProgress.done();
    //         return;
    //       }
    //       userRoles = userStore.user.roleList || [];
    //     }
    //   } else {
    //     userRoles = userStore.user.roleList || [];
    //   }

    //   if (!hasAddDynamicRoutes && userRoles.length > 0) {
    //     // 獲取菜單權限路由
    //     const accessRoutes = await permissionStore.generateRoutes(userStore.user.roleList);
    //     // console.log('在permission裡生成的動態路由', accessRoutes)
    //     // console.log('路由器', router)

    //     // 遍歷動態路由,真正由路由器進行添加
    //     accessRoutes.forEach((route: RouteRecordRaw) => {
    //       if (!router.hasRoute(route.name || route.path)) { // 使用 name 或 path 作為識別
    //         router.addRoute(route); // 將路由添加到 Vue Router 實例
    //       } else {
    //         console.warn("路由已存在，跳過添加:", route.path);
    //       }
    //     });
    //     hasAddDynamicRoutes = true;
    //     console.log(router.getRoutes());

    //     // 未匹配到任何路由，跳转404
    //     // console.log(to)
    //     // const resolvedRoute = router.resolve(to.fullPath);
    //     // console.log(resolvedRoute);
    //     // if (to.matched.length === 0) {
    //     //   console.log("動態路由還沒添加,所以沒有匹配到路由,跳轉404");
    //     //   NProgress.done();
    //     //   return next({ path: to.fullPath, replace: true });
    //     // }

    //     console.log("動態路由添加完成", router.getRoutes());

    //     // 重新導航到目標路由，讓路由重新解析
    //     const targetRoute = router.resolve(to.fullPath);
    //     if (targetRoute.matched.length === 0) {
    //       // 路由不存在，跳轉到 404 或首頁
    //       console.error("未匹配到任何路由，跳转到 404 页面");
    //       next({ path: "/404", replace: true });
    //     } else {
    //       console.log(to)
    //       // 重新導航到目標路由
    //       next({ ...to, replace: true });
    //     }
    //   }
    //   isAddingRoutes = false; // 重置添加路由狀態
    //   console.log("to", to);
    //   NProgress.done();
    //   return;

    // }
    next();
    NProgress.done();






































    // const hasToken = localStorage.getItem("Authorization") || localStorage.getItem("Authorization-paper-reviewer");
    // if (hasToken) {
    //   if (to.path === "/login") {
    //     // 如果已登录，跳转首頁
    //     next({ path: "/" });
    //     NProgress.done();
    //   } else {
    //     const userStore = useUserStore();

    //     //查看現在userStore有沒有內容
    //     if (userStore.user.roleList) {
    //       console.log("原本的 userStore user", userStore.user);
    //     } else {
    //       if (localStorage.getItem("Authorization-paper-reviewer")) {
    //         const { res: reviewerRes, error: reviewerError } = await tryCatch(userStore.getReviewerInfo());
    //         console.log("reviewerRes", reviewerRes);
    //         if (reviewerError) {
    //           console.log("獲取審稿人信息失敗", reviewerError);
    //           next(`/reviewer-login?redirect=${to.path}`);
    //           NProgress.done();
    //           return;
    //         }
    //       }
    //       if (localStorage.getItem("Authorization")) {
    //         const { res, error } = await tryCatch(userStore.getUserInfo());
    //         if (error) {
    //           console.log("獲取用戶信息失敗", error);
    //           next(`/login?redirect=${to.path}`);
    //           NProgress.done();
    //           return;
    //         }
    //       }

    //     }
    //     if (!hasAddDynamicRoutes) {



    //       //獲取菜單權限路由
    //       const permissionStore = usePermissionStore();
    //       //每次都拿這個這個角色在去生成一次他的動態路由
    //       const accessRoutes = await permissionStore.generateRoutes(
    //         userStore.user.roleList
    //       );


    //       // console.log('在permission裡生成的動態路由', accessRoutes)
    //       // console.log('路由器', router)

    //       //遍歷動態路由,真正由路由器進行添加
    //       //再只使用靜態路由時,這個遍歷添加其實無效,但是也沒關係,不影響運作
    //       permissionStore.routes.forEach((route: RouteRecordRaw) => {
    //         router.addRoute(route);
    //       });
    //       hasAddDynamicRoutes = true;

    //       // 未匹配到任何路由，跳转404
    //       if (to.matched.length === 0) {
    //         // from.name ? next({ name: from.name }) : next("/404");
    //         console.log("動態路由還沒添加,所以沒有匹配到路由,跳轉404");
    //         NProgress.done();
    //         return next({ path: to.fullPath, replace: true });
    //       } else {
    //         next();
    //       }
    //     }

    //     // next()
    //   }
    // } else {
    //   // 未登录可以访问白名单页面
    //   if (whiteList.indexOf(to.path) !== -1) {
    //     next();
    //   } else {
    //     if (localStorage.getItem("paper-reviewer-logout") === "true") {
    //       next(`/reviewer-login?redirect=${to.path}`);
    //       localStorage.removeItem("paper-reviewer-logout");
    //     } else {
    //       next(`/login?redirect=${to.path}`);
    //     }
    //     NProgress.done();
    //   }
    // }
    /**------------------------------------------------------------------------------------------ */
    // next()
    /** 

    if (hasToken) {
      if (to.path === "/login") {
        // 如果已登录，跳转首頁
        next({ path: "/" });
        NProgress.done();
      } else {
        const userStore = useUserStore();
        console.log('userStore目前有', userStore)
        const hasRoles =
          userStore.user.roles && userStore.user.roles.length > 0;
        console.log(userStore.user.roles)
        console.log(userStore.user.roles.length)
        console.log(hasRoles)

        if (hasRoles) {
          // 未匹配到任何路由，跳转404
          if (to.matched.length === 0) {
            from.name ? next({ name: from.name }) : next("/404");
          } else {
            next();
          }
        } else {
          const permissionStore = usePermissionStore();
          try {
            const { roles } = await userStore.getUserInfo();
            //當前角色
            console.log('當前角色', roles)

            //每次都拿這個這個角色在去生成一次他的動態路由
            const accessRoutes = await permissionStore.generateRoutes(roles);

            console.log('在permission裡生成的動態路由', accessRoutes)
            console.log('路由器', router)

            //遍歷動態路由,真正由路由器進行添加
            //再只使用靜態路由時,這個遍歷添加其實無效,但是也沒關係,不影響運作
            accessRoutes.forEach((route: RouteRecordRaw) => {
              router.addRoute(route);
            });


            next({ ...to, replace: true });
          } catch (error) {
            // 移除 token 并跳转登录页
            await userStore.resetToken();
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        }
      }
    } else {
      // 未登录可以访问白名单页面
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }

    */
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
          console.log("添加路由:", route.path);
        } else {
          console.warn("路由已存在，跳過添加:", route.path);
        }
      });

      hasAddDynamicRoutes = true;
      console.log("动态路由添加完成，当前所有路由：", router.getRoutes().map(r => r.path));
    }
  } finally {
    isAddingRoutes = false;
  }
}
